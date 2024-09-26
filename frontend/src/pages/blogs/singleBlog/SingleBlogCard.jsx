import React, { useEffect, useState } from 'react';
import { formatDate } from '../../../utils/formatDate';
import EditorJSHTML from "editorjs-html";
import { htmlToText } from 'html-to-text';
import { useDislikeBlogMutation, useLikeBlogMutation, useSendEmailMutation } from '../../../redux/features/blogs/blogsApi';
import { useDispatch } from 'react-redux';
const editorJSHTML = EditorJSHTML();

function SingleBlogCard({ blog }) {
    const { title, description, content, coverImg, category, rating, author, createdAt, likes: initialLikes, dislikes: initialDislikes } = blog || {};
    const [htmlContent, setHtmlContent] = useState('');
    const [speech, setSpeech] = useState(null);
    const [sendEmail] = useSendEmailMutation();
    const [likes, setLikes] = useState(initialLikes?.length || 0);
    const [dislikes, setDislikes] = useState(initialDislikes?.length || 0);
    console.log(rating)
    // Track if the user has liked or disliked the blog
    const [hasLiked, setHasLiked] = useState(initialLikes?.includes(/*userId*/) || false);
    const [hasDisliked, setHasDisliked] = useState(initialDislikes?.includes(/*userId*/) || false);
    
    const [likeBlog] = useLikeBlogMutation();
    const [dislikeBlog] = useDislikeBlogMutation();
    
    // Email state
    const [email, setEmail] = useState('');

    const handleLike = async () => {
        try {
            if (hasLiked) {
                await likeBlog(blog._id);  // Assuming it removes like when the user already liked it
                setLikes((prev) => prev - 1);  // Decrement likes count locally
                setHasLiked(false);
            } else {
                if (hasDisliked) {
                    await dislikeBlog(blog._id);  // Remove dislike if the user disliked it
                    setDislikes((prev) => prev - 1);
                    setHasDisliked(false);
                }
                await likeBlog(blog._id);
                setLikes((prev) => prev + 1);  // Increment likes count locally
                setHasLiked(true);
            }
        } catch (error) {
            console.error('Error liking the blog', error);
        }
    };

    const handleDislike = async () => {
        try {
            if (hasDisliked) {
                await dislikeBlog(blog._id);  // Assuming it removes dislike when the user already disliked it
                setDislikes((prev) => prev - 1);  // Decrement dislikes count locally
                setHasDisliked(false);
            } else {
                if (hasLiked) {
                    await likeBlog(blog._id);  // Remove like if the user liked it
                    setLikes((prev) => prev - 1);
                    setHasLiked(false);
                }
                await dislikeBlog(blog._id);
                setDislikes((prev) => prev + 1);  // Increment dislikes count locally
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

        // Stop any ongoing speech
        if (speech) {
            window.speechSynthesis.cancel();
        }

        window.speechSynthesis.speak(newSpeech);
        setSpeech(newSpeech);
    };

    const handleStopSpeech = () => {
        if (speech) {
            window.speechSynthesis.cancel();
            setSpeech(null);
        }
    };

    const handleEmailSubmit = async () => {
        try {
            const data = await sendEmail({ email, title, htmlContent }).unwrap();
            console.log(data);
            alert('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            alert('Failed to send email.');
        }
    };

    return (
        <div className='bg-white p-8'>
            {/* blog header */}
            <div>
                <h1 className='md:text-4xl text-3xl font-medium mb-4'>{title}</h1>
                <p className='mb-6'>{formatDate(createdAt)} by <span className='text-blue-400 cursor-pointer'>Admin</span></p>
            </div>
            <div>
                <img src={coverImg} alt="cover img" className='w-full md:h-[520px] bg-cover' />
            </div>
            {/* blog details */}
            <div className='mt-8 space-y-4'>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} className='space-y-3 editorjsdiv' />
                <button 
                    onClick={handleTextToSpeech}
                    className='bg-blue-500 text-white py-2 px-4 rounded-md'>
                    Listen to this Blog
                </button>
                <button 
                    onClick={handleStopSpeech}
                    className='bg-red-500 text-white py-2 px-4 rounded-md ml-4'>
                    Stop
                </button>
                {/* Like/Dislike buttons */}
                <div className="flex space-x-4 mt-4">
                    <button 
                        onClick={handleLike} 
                        className='bg-green-500 text-white py-2 px-4 rounded-md'>
                        Like ({likes})
                    </button>
                    <button 
                        onClick={handleDislike} 
                        className='bg-red-500 text-white py-2 px-4 rounded-md'>
                        Dislike ({dislikes})
                    </button>
                </div>
                <div>
                    <span className='text-lg font-medium'>Rating: </span>
                    <span>{rating} (based on 2,370 reviews)</span>
                </div>
                
                {/* Email input section */}
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
                        Send Blog to Email
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SingleBlogCard;
