import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

import ThemeContext from '../contexts/ThemeContext';

const PageNotFound = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="d-flex col align-items-center justify-content-center flex-column text-center vh-50">
            <h1 className="display-1">404</h1>
            <p className="lead">{t('page_not_found')}</p>
            <p>{t('sorry_the_requested_page_does_not_exist')}</p>

            <Button
                variant={`outline-${theme === 'dark' ? 'light' : 'dark'}`}
                className="fw-bold ms-2"
                onClick={handleGoBack}
            >
                {t('back')}
            </Button>
        </div>
    );
};

export default PageNotFound;
