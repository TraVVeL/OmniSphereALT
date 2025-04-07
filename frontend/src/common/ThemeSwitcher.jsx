import React, { useContext } from 'react';
import { Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

import ThemeContext from '../contexts/ThemeContext';

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <Button variant='outline' className='border-0' onClick={toggleTheme}>
            {theme === 'dark' ?  <i className="bi bi-moon-stars"></i>: <i className="bi bi-sun"></i>}
        </Button>
    );
};

export default ThemeSwitcher;
