import React, { useState } from 'react';
import style from './Comments.module.scss';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const getCommentsByPostId = async (postId: number) => {
    const { data } = await axios.get<Comments[]>('http://localhost:3004/comments', {
        params: {
            postId,
        },
    });
    return data;
};


interface Comments {
    id: number,
    postId: number,
    userName: string,
    userId: number,
    body: string,
    dateCreated: string
}

interface postIdProps {
    postId: number
}

const CommentsDependingOnPostId = ({ postId }: postIdProps) => {
    
    const { data, isLoading } = useQuery<Comments[]>(
        ['commentsByPostId', postId],
        () => getCommentsByPostId(postId),
    );
  
    if (isLoading) {
        return <h1>Loading...</h1>;
    }
  
    if (!data) {
        throw Error('Something went wrong');
    }

    console.log(data);
    

    return(
        <div className={style.comments__container}>
            {data.map((comment) => (
                <div key={comment.id} className={style.comment}>
                    <div className={style.comment__image__container}>
                        <img src="/user-icon.png" alt="userImage"/>
                    </div>
                    <div className={style.comment__right__part}>
                        <div className={style.comment__content}>
                            <div className={style.comment__author}>{comment.userName}</div>
                            <div>{comment.dateCreated}</div>
                        </div>
                        <div className={style.comment__text}>{comment.body}</div>
                    </div>
                </div>
            ))}
        </div>

    );
};

export default CommentsDependingOnPostId;