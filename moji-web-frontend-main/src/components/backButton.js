import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <button

            onClick={goBack}
            className="fixed top-[6%] left-5 m-4 p-2  text-gray-700 underline"
            aria-label="Go back"
        >
            <span className='text-xl font-thin'>&lt;</span> Về trang trước
        </button>
    );
};

export default BackButton;
