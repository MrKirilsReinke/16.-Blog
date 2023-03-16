import React from 'react';
import style from './AddBlogButton.module.scss';

interface ButtonProps {
    children: string;
    onClick: () => void;
    disabled: boolean;
}

const AddBlogButton = ({ children, onClick, disabled }: ButtonProps) => {

    return (
        <button 
            className={style.addPostBtn}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default AddBlogButton;