import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { usePostCommentMutation } from '../../../redux/features/comments/commentApi';
import { useFetchBlogsByIdQuery } from '../../../redux/features/blogs/blogsApi';

function PostAComment() {
    const { id } = useParams();
    const [comments, setComments] = useState(''); // Initialize as an empty string
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const [postComment] = usePostCommentMutation();
    const { refetch } = useFetchBlogsByIdQuery(id, { skip: !id });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to comment on this post');
            navigate("/login");
            return;
        }
        const newComment = {
            comment: comments,
            user: user?._id,
            postId: id
        };
        try {
            const response = await postComment(newComment).unwrap();
            console.log(response);
            alert("Comment posted successfully");
            setComments('');
            refetch();
        } catch (error) {
            alert("An error occurred while posting the comment");
        }
    };

    return (
        <div className='mt-8'>
            <h3 className='text-lg font-medium mb-8'>Leave a comment</h3>
            <form onSubmit={handleSubmit}>
                <textarea
                    name="text"
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    cols="30"
                    rows="10"
                    placeholder='Comment'
                    className='w-full bg-bgPrimary focus:outline-none p-5'
                />
                <button
                    type='submit'
                    className='w-full bg-primary hover:bg-indigo-500 text-white font-medium py-3 rounded-md'
                >
                    Submit
                </button>
            </form>
        </div>
    );
}

export default PostAComment;
