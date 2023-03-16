import React, { useEffect, useMemo, useState } from 'react';
import style from './Posts.module.scss';
import { useParams } from 'react-router-dom';
import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import CommentsDependingOnPostId from '../../components/Post/Comments';
import PostForm from '../../components/PostForm/PostForm';

export const getPostsByBlogId = async (blogId: number) => {
    const { data } = await axios.get<Posts[]>('http://localhost:3004/posts', {
        params: {
            blogId,
        },
    });
    return data;
};

interface Posts {
    id: number,
    blogId: number,
    userName: string,
    userId: number,
    body: string,
    dateCreated: string
}

const PostsDependingOnBlogId = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading } = useQuery<Posts[]>(
        ['postsByBlogId', id],
        () => getPostsByBlogId(Number(id)),
    );
    const queryClient = useQueryClient();
    const [editedPost, setEditedPost] = useState<Posts | null>(null);
    const [isEditFormVisible, setIsEditFormVisible] = useState(false);

    //

    const [isReplyFormVisible, setIsReplyFormVisible] = useState(false);
    const [replyToPost, setReplyToPost] = useState<Posts | null>(null);

    //


    const sortedPosts = useMemo(() => {
        if (!data) {
            return null;
        }
        return data.sort((a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime());
    }, [data]);
  
    if (isLoading) {
        return <h1>Loading...</h1>;
    }
  
    if (!sortedPosts) {
        throw Error('Something went wrong');
    }


    const addComment = async (body: string) => {
        const newPost = {
            blogId: Number(id),
            userName: 'Peter',
            userId: 4,
            body,
            dateCreated: new Date().toISOString().replace('T', ' ').substr(0, 19),
        };
        await axios.post('http://localhost:3004/posts', newPost);
        queryClient.invalidateQueries(['postsByBlogId', id]);
    };

    //

    const handleCurrentPostReply = (post: Posts) => {
        setReplyToPost(post);
        setIsReplyFormVisible(true);
    };

    const handleReplyPost = async (body: string) => {
        if (!replyToPost) return;
        const newComment = {
            blogId: replyToPost.blogId,
            userName: 'Peter',
            userId: 4,
            body,
            dateCreated: new Date().toISOString().replace('T', ' ').substr(0, 19),
            postId: replyToPost.id,
        };
        await axios.post('http://localhost:3004/comments', newComment);
        queryClient.invalidateQueries(['commentsByPostId', replyToPost.id]);
        setReplyToPost(null);
        setIsReplyFormVisible(false);
    };

    //

    const handleCurrentPostEdit = (post: Posts) => {
        setEditedPost(post);
        setIsEditFormVisible(true);
    };

    const handleEditPost = async (editedBody: string) => {
        if (!editedPost) return;
        const updatedPost = {
            ...editedPost,
            body: editedBody,
            dateCreated: new Date().toISOString().replace('T', ' ').substr(0, 19)
        };
        await axios.put(`http://localhost:3004/posts/${updatedPost.id}`, updatedPost);
        queryClient.invalidateQueries(['postsByBlogId', id]);
        setEditedPost(null);
        setIsEditFormVisible(false);
    };

    const handleCurrentPostDelete = async (postId: number) => {
        await axios.delete<Posts[]>(`http://localhost:3004/posts/${postId}`);
        queryClient.invalidateQueries(['postsByBlogId', id]);
    };
  
    return (
        <div className={style.blog__container}>
            <div className={style.blog__comments}>
                <h3 className={style.blog__comments__title}>Comments</h3>
                <div className="comment-form-title">Write comment</div>
                <PostForm
                    submitLabel="Write"
                    handleSubmit={addComment}
                />
                <div className={style.blog__comments__container}>
                    {data?.map((post) => (
                        <div key={post.id}>
                            <div className={style.post}>
                                <div className={style.post__image__container}>
                                    <img src="/user-icon.png" alt="userImage"/>
                                </div>
                                <div className={style.post__right__part}>
                                    <div className={style.post__content}>
                                        <div className={style.post__author}>{post.userName}</div>
                                        <div>{post.dateCreated}</div>
                                    </div>
                                    <div className={style.post__text}>{post.body}</div>
                                    <div className={style.post__actions}>
                                        <div 
                                            className={style.post__action}
                                            onClick={() => handleCurrentPostReply(post)}
                                        >
                                            Reply
                                        </div>
                                        <div 
                                            className={style.post__action}
                                            onClick={() => handleCurrentPostEdit(post)}
                                        >
                                            Edit
                                        </div>
                                        <div 
                                            className={style.post__action}
                                            onClick={() => handleCurrentPostDelete(post.id)}
                                        >
                                            Delete
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <CommentsDependingOnPostId
                                postId={post.id}
                            />
                        </div>
                    ))}
                    {isEditFormVisible && editedPost && (
                        <PostForm
                            submitLabel="Save"
                            initialValue={editedPost.body}
                            handleSubmit={handleEditPost}
                        />
                    )}
                    {isReplyFormVisible && (
                        <div>
                            <PostForm
                                submitLabel="Reply"
                                handleSubmit={handleReplyPost}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
  
export default PostsDependingOnBlogId;