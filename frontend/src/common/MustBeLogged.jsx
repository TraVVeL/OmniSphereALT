import React, { useState, useContext, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from 'react-bootstrap';

import ThemeContext from '../contexts/ThemeContext';

const AuthModal = React.lazy(() => import('../components/Auth/AuthModal'));


function MustBeLogged() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const handleAuthModalClose = () => setShowAuthModal(false);
    const handleAuthModalShow = () => setShowAuthModal(true);

    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);

    return (
        <div className="d-flex col align-items-center justify-content-center flex-column text-center vh-50">
            <h1>{t('login_required')}</h1>
            <p className="lead">{t('login_prompt')}</p>
            <p>
                <Button
                    variant={`outline-${theme === 'dark' ? 'light' : 'dark'}`}
                    className="fw-bold ms-2"
                    onClick={handleAuthModalShow}
                >
                    {t('login')}
                </Button>
            </p>
            <Suspense>
                <AuthModal show={showAuthModal} onHide={handleAuthModalClose} />
            </Suspense>
        </div>

    );
}

export default MustBeLogged;
