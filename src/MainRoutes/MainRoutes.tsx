import React from 'react';
import Home from '../pages/Home/Home';
import Blogs from '../pages/Blogs/Blogs';
import PostsDependingOnBlogId from '../pages/Posts/Posts';
import { Routes, Route } from 'react-router-dom';


const MainRoutes = () => {
    return (
        <>
            <Routes>
                <Route path="/" index element={<Home />} />
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blogs/:id" element={<PostsDependingOnBlogId />} />

                
                <Route path="*" element={<h1>404 not found</h1>} />
            </Routes>
        </>
    );
};

export default MainRoutes;