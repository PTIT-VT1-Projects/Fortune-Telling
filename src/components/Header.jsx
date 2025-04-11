import './Header.css';

import { Link, useNavigate } from 'react-router-dom';

import React from 'react';

function Header({ onResetApp }) {
    const navigate = useNavigate();

    const handleLogoClick = (e) => {
    e.preventDefault(); // Always prevent default to handle navigation ourselves

    // First navigate to home page
    navigate('/');

    // Then reset the app state
    if (onResetApp) {
        setTimeout(() => {
        onResetApp();
        }, 10);
    }
    };

    return (
    <header className="header">
        <div className="container">
            <div className='d-flex justify-content-between'>
                <Link to="/" className="logo-link" onClick={handleLogoClick}>
                    <div className="logo-container">
                    <svg
                        className="logo-icon"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="8" r="6"></circle>
                        <path d="M15.5 8a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"></path>
                        <path d="M17.566 17.8a2 2 0 0 1-1.84 1.2H8.274a2 2 0 0 1-1.84-1.2L5 14.5h14l-1.434 3.3Z"></path>
                        <path d="M7 14.5v-2.05" stroke="#fff"></path>
                        <path d="M17 14.5v-2.05" stroke="#fff"></path>
                    </svg>
                    <h1 className="app-title">Face Insights <span className="version-tag">AI</span></h1>
                    </div>
                </Link>

                <div className="nav-links">
                    <Link to="/features" className="nav-link">Tính năng</Link>
                </div>
            </div>
        </div>
    </header>
    );
}

export default Header;
