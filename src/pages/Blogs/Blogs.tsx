import React, { useEffect, useState } from 'react';
import style from './Blogs.module.scss';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';

const getAllBlogs = async () => {
    const { data } = await axios.get('http://localhost:3004/blogs');
    return data;
};

export type Blogs = {
    id: number;
    blogImage: string;
    blogTitle: string;
    blogDescription: string;
    comments: Comments[];
}

export type Comments = {
    id: number;
    body: string;
    userName: string;
    userId: number;
    parentId: null;
    dateCreated: string;
}

const Blogs = () => {
    const { data, isLoading, refetch } = useQuery<Blogs[]>(['AllBlogs'], getAllBlogs);
    const [blogs, setBlogs] = useState<Blogs[]>([]);

    const handleAddBlog = (newBlog: Blogs) => {
        setBlogs([...blogs, newBlog]);
        refetch();
    };

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (!data) {
        throw Error('Something went wrong');
    }

    console.log(data);

    return (
        <div className={style.blogs__container}>
            {data.map(({id, blogImage, blogTitle, blogDescription}) => (
                <Link to={`/blogs/${id}`} key={id} className={style.blogs__item}>
                    <img src={blogImage} alt={blogTitle} className={style.blogs__image}/>
                    <h1>{blogTitle}</h1>
                    <p>{blogDescription}</p>
                </Link> 
            ))}
        </div>
    );
};

export default Blogs;