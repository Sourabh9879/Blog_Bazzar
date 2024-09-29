import React, { useEffect, useState, } from 'react';
import { useSelector } from 'react-redux';
import { formatDate } from '../../../utils/formatDate';
import EditorJSHTML from "editorjs-html";
import { htmlToText } from 'html-to-text';
import { useDislikeBlogMutation, useLikeBlogMutation, useSendEmailMutation } from '../../../redux/features/blogs/blogsApi';
import { FaThumbsUp, FaThumbsDown, FaPlay, FaPause, FaFacebook, FaTwitter, FaLinkedin, FaWhatsapp } from 'react-icons/fa'; // Added social icons
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'react-share'; // Share buttons

const editorJSHTML = EditorJSHTML();

function SingleBlogCard({ blog }) {
    const { title, description, content, coverImg, category, rating, author, createdAt, likes: initialLikes, dislikes: initialDislikes } = blog || {};
    const [htmlContent, setHtmlContent] = useState('');
    const [speech, setSpeech] = useState(null);
    const [sendEmail] = useSendEmailMutation();
    const [likes, setLikes] = useState(initialLikes?.length || 0);
    const [dislikes, setDislikes] = useState(initialDislikes?.length || 0);

    const [hasLiked, setHasLiked] = useState(initialLikes?.includes(/*userId*/) || false);
    const [hasDisliked, setHasDisliked] = useState(initialDislikes?.includes(/*userId*/) || false);

    const [likeBlog] = useLikeBlogMutation();
    const [dislikeBlog] = useDislikeBlogMutation();
    const {user} = useSelector((state) => state.auth);
    const [email, setEmail] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentCharIndex, setCurrentCharIndex] = useState(0); // Track current character index

    const shareUrl = window.location.href; // URL to be shared

    const handleLike = async () => {

        if (user.role === 'admin') {
            alert("Admins cannot like posts.");
            return;
        }
        try {
            if (hasLiked) {
                await likeBlog(blog._id);
                setLikes((prev) => prev - 1);
                setHasLiked(false);
            } else {
                if (hasDisliked) {
                    await dislikeBlog(blog._id);
                    setDislikes((prev) => prev - 1);
                    setHasDisliked(false);
                }
                await likeBlog(blog._id);
                setLikes((prev) => prev + 1);
                setHasLiked(true);
            }
        } catch (error) {
            console.error('Error liking the blog', error);
        }
    };

    const handleDislike = async () => {

        if (user.role === 'admin') {
            alert("Admins cannot dislike posts.");
            return;
        }
        try {
            if (hasDisliked) {
                await dislikeBlog(blog._id);
                setDislikes((prev) => prev - 1);
                setHasDisliked(false);
            } else {
                if (hasLiked) {
                    await likeBlog(blog._id);
                    setLikes((prev) => prev - 1);
                    setHasLiked(false);
                }
                await dislikeBlog(blog._id);
                setDislikes((prev) => prev + 1);
                setHasDisliked(true);
            }
        } catch (error) {
            console.error('Error disliking the blog', error);
        }
    };

    useEffect(() => {
        if (content && typeof content === 'object' && Array.isArray(content.blocks)) {
            const parsedContent = editorJSHTML.parse(content);
            setHtmlContent(parsedContent.join(''));
        } else {
            console.error("Unexpected content structure:", content);
            setHtmlContent('<p>Unexpected content structure</p>');
        }
    }, [content]);

    const handleTextToSpeech = () => {
        if (!window.speechSynthesis) {
            alert('Speech synthesis is not supported by your browser.');
            return;
        }

        const textContent = htmlToText(htmlContent);
        const newSpeech = new SpeechSynthesisUtterance(textContent);
        newSpeech.lang = 'en-US';

        // If there's an ongoing speech, stop it and continue from the last position
        if (speech) {
            window.speechSynthesis.cancel();
            // Save the current character index from the progress
            const newIndex = Math.floor((progress / 100) * textContent.length);
            setCurrentCharIndex(newIndex);
        }

        newSpeech.text = textContent.substring(currentCharIndex); // Set new text to continue from last index

        newSpeech.onboundary = (event) => {
            if (event.charIndex < currentCharIndex) {
                return; // Prevent progress from going backwards
            }
            const progressValue = (event.charIndex / textContent.length) * 100;
            setProgress(progressValue);
        };

        newSpeech.onend = () => {
            setSpeech(null);
            setIsPlaying(false);
            setProgress(0);
            setCurrentCharIndex(0); // Reset index when speech ends
        };

        window.speechSynthesis.speak(newSpeech);
        setSpeech(newSpeech);
        setIsPlaying(true);
    };

    const handleStopSpeech = () => {
        if (speech) {
            window.speechSynthesis.cancel();
            const textContent = htmlToText(htmlContent);
            // Save the current character index from the progress
            const newIndex = Math.floor((progress / 100) * textContent.length);
            setCurrentCharIndex(newIndex);
            setSpeech(null);
        }
        setIsPlaying(false);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            handleStopSpeech();
        } else {
            handleTextToSpeech();
        }
    };

    const handleEmailSubmit = async () => {
        try {
            const data = await sendEmail({ email, title, htmlContent }).unwrap();
            console.log(data);
            alert('Subscription successful!');
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    return (
        <div className='bg-white p-8'>
            {/* Blog header */}
            <div className='flex justify-between items-center'>
                <h1 className='md:text-4xl text-3xl font-medium mb-4'>{title}</h1>
            </div>

            {/* Date, Play/Pause Button and Progress Bar */}
            <div className="flex items-center space-x-4 mb-6">
                <p>{formatDate(createdAt)} by <span className='text-blue-400 cursor-pointer'>Admin</span></p>
                
                {/* Play/Pause button */}
                <button 
                    onClick={handlePlayPause}
                    className={`bg-blue-500 text-white py-2 px-4 rounded-md flex items-center space-x-2`}>
                    {isPlaying ? <FaPause /> : <FaPlay />}
                    <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-lg overflow-hidden ml-4">
                    <div
                        className="h-full bg-blue-500"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div>
                <img src={coverImg} alt="cover img" className='w-full md:h-[520px] bg-cover' />
            </div>

            {/* Blog details */}
            <div className='mt-8 space-y-4'>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} className='space-y-3 editorjsdiv' />

                {/* Like/Dislike buttons */}
                <div className="flex space-x-4 mt-4">
                    <button 
                        onClick={handleLike} 
                        className='bg-transparent flex items-center space-x-2'>
                        <FaThumbsUp className={hasLiked ? 'text-blue-600' : 'text-gray-400'} />
                        <span>{likes}</span>
                    </button>
                    <button 
                        onClick={handleDislike} 
                        className='bg-transparent flex items-center space-x-2'>
                        <FaThumbsDown className={hasDisliked ? 'text-red-600' : 'text-gray-400'} />
                        <span>{dislikes}</span>
                    </button>
                </div>

                {/* Social Media Share Buttons */}
                <div className='mt-4'>
                    <h3>Share this blog:</h3>
                    <div className="flex space-x-4 mt-2">
                        <FacebookShareButton url={shareUrl} quote={title}>
                            <FaFacebook size={30} className="text-blue-600" />
                        </FacebookShareButton>

                        <TwitterShareButton url={shareUrl} title={title}>
                            <FaTwitter size={30} className="text-blue-400" />
                        </TwitterShareButton>

                        <LinkedinShareButton url={shareUrl} title={title} summary={description}>
                            <FaLinkedin size={30} className="text-blue-700" />
                        </LinkedinShareButton>

                        <WhatsappShareButton url={shareUrl} title={title}>
                            <FaWhatsapp size={30} className="text-green-500" />
                        </WhatsappShareButton>
                    </div>
                </div>

                {/* Rating */}
                <div>
                    <span className='text-lg font-medium'>Rating: </span>
                    <span>{rating} (based on 2,370 reviews)</span>
                </div>
                
                {/* Email input section (renamed to Subscribe) */}
                <div className="mt-4">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="border rounded-md p-2 w-full"
                        required
                    />
                    <button
                        onClick={handleEmailSubmit}
                        className="bg-blue-500 text-white py-2 px-4 rounded-md mt-2"
                    >
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SingleBlogCard;
