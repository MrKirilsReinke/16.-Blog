import React, { useState } from 'react';
import style from './PostForm.module.scss';

const PostForm = ({handleSubmit, submitLabel}: any) => {
    const [text, setText] = useState('');
    const isTextareaDisabled = text.length === 0;
    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        handleSubmit(text);
        setText('');
    };

    return (
        <form
            onSubmit={onSubmit}
        >
            <textarea
                className={style.comment__form__textarea}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            <button 
                className={style.comment__form__button}
                disabled={isTextareaDisabled}
            >
                {submitLabel}
            </button>
        </form>
    );
};

export default PostForm;