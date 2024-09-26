import React from 'react';
import commentorIcon from "../../../assets/commentor.png";
import { formatDate } from '../../../utils/formatDate';
import PostAComment from './PostAComment';
import { useSelector } from 'react-redux';

function CommentCard({ comments }) {
    const user = useSelector((state) => state.auth.user);

    return (
        <div className='my-6 bg-white p-8'>
            <div>
                {comments?.length > 0 ? (
                    <div>
                        <h3 className='text-lg font-medium'>All comments</h3>
                        <div>
                            {comments.map((comment, index) => (
                                <div key={index} className='mt-4'>
                                    <div className='flex items-center gap-4'>
                                        <img src={commentorIcon} alt="Commentor Icon" className='h-14 mr-4' />
                                        <div>
                                            <p className='text-lg font-medium underline capitalize underline-offset-4 text-blue-400'>
                                                {comment?.user?.username}
                                            </p>
                                            <p className='text-[12px] italic'>{formatDate(comment.createdAt)}</p>
                                        </div>
                                    </div>
                                    {/* Comment details */}
                                    <div className='text-gray-600 mt-5 border p-8'>
                                        <p className='md:w-4/5'>{comment?.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className='text-lg font-medium'>No comments found</div>
                )}
            </div>
            {/* Comment input field */}
            <PostAComment />
        </div>
    );
}

export default CommentCard;
