import React, { Children, useState } from 'react';
import style from'./App.module.scss';
import Nav from './components/Nav/Nav';
import AddBlogButton from './components/Buttons/AddBlogButton/AddBlogButton';
import MainRoutes from './MainRoutes/MainRoutes';
import axios from 'axios';
import { QueryClientProvider, useQueryClient } from '@tanstack/react-query';

function App() {
    const [showBlogForm, setShowBlogForm] = useState(false);

    const [blogImage, setBlogImage] = useState('');
    const [blogTitle, setBlogTitle] = useState('');
    const [blogDescription, setBlogDescription] = useState('');

    const [blogs, setBlogs] = useState<{blogImage: string, blogTitle: string, blogDescription: string}[]>([]);

    const queryClient = useQueryClient();

    const addNewBlogForm = () => {
        setShowBlogForm(true);
    };

    const postNewBlog = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newBlog ={
            blogImage,
            blogTitle,
            blogDescription
        };
        axios.post('http://localhost:3004/blogs', newBlog)
            .then(response => {
                console.log(response.data);
                setShowBlogForm(false);
                setBlogs([...blogs, response.data]);
                queryClient.invalidateQueries(['AllBlogs']);
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div>
            <header>
                <Nav />
                <AddBlogButton
                    onClick={addNewBlogForm}
                    disabled={showBlogForm}
                >
                    Add Blog
                </AddBlogButton>
            </header>
            <div>
                <MainRoutes />


                {showBlogForm && (
                    <form className={style.showBlogForm__container} onSubmit={postNewBlog}>
                        <div className={style.showBlogForm__item}>
                            <label htmlFor="blog_img">
                                Add blog image:
                            </label>
                            <br />
                            <input 
                                type="text"
                                className={style.showBlogForm__inputField}
                                id="blog_img"
                                placeholder="url"
                                value={blogImage}
                                onChange={e => setBlogImage(e.target.value)}
                            />

                            <label htmlFor="blog_title">
                               Add blog title:
                            </label>
                            <br />
                            <input 
                                type="text"
                                className={style.showBlogForm__inputField}
                                id="blog_title"
                                placeholder="write..."
                                value={blogTitle}
                                onChange={e => setBlogTitle(e.target.value)}
                            />
                            <label htmlFor="blog_description">
                                Add description:

                            </label>
                            <br />
                            <input 
                                type="text"
                                className={style.showBlogForm__inputField}
                                id="blog_description"
                                placeholder="write..."
                                value={blogDescription}
                                onChange={e => setBlogDescription(e.target.value)}
                            />
                            <div className={style.showBlogForm__buttons}>
                                <button 
                                    type="submit"
                                    className={style.showBlogForm__addButton}
                                >
                                    Add blog
                                </button>

                                <button 
                                    type="button"
                                    className={style.showBlogForm__addButton}
                                    onClick={() => setShowBlogForm(false)}
                                >
                                    Cancel
                                </button>
                            </div>

                        </div>

                    </form>
                )}
            </div>
        </div>
    );
}

export default App;
