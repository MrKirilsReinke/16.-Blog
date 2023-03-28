import React from 'react';
import style from './Nav.module.scss';
import { NavLink } from 'react-router-dom';

const Nav = () => {

    return (
        <>  
            <nav className={style.nav}>
                <NavLink to="/" className={style.nav__item}>Home</NavLink>
                <NavLink to="/blogs" className={style.nav__item}>Blogs</NavLink>
            </nav>
        </>
    );
};

export default Nav;