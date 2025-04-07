import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';
import SvgRussiaFlag from './SvgRussianFlag';
import SvgUsaFlag from './SvgUsaFlag';

const LanguageSwitcher = React.memo(() => {
    const { i18n } = useTranslation();
    
    const toggleLanguage = () => {
        const newLang = i18n.language === 'en' ? 'ru' : 'en';
        i18n.changeLanguage(newLang);
        localStorage.setItem('language', newLang);
    };

    return (
        <Button
            variant="link"
            onClick={toggleLanguage}
            className="d-flex align-items-center"
        >
            {i18n.language === 'en' ? <SvgUsaFlag /> : <SvgRussiaFlag />}
        </Button>
    );
});

export default LanguageSwitcher;
