import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ServiceConnectionCard from './ServiceConnectionCard';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {
    GitHubSvgIcon,
    GoogleSvgIcon,
    TelegramSvgIcon,
} from '../../../../assets/Icons';

import { ToastMessage } from '../../../../common/Toast';

const Integration = () => {
    const { t } = useTranslation();
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleError = (message) => {
        setError(message);
    };

    const handleSuccess = (message) => {
        setSuccess(message);
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <div className="mb-4">
                <h2>{t('service_connection')}</h2>
            </div>
            <Card className="border-secondary shadow-sm mb-5">
                <div className="card-header">
                    <h4 className="mb-1">{t('service_connection')}</h4>
                    <p className="mb-0 fs-6">
                        {t('add_or_remove_an_oauth_service')}
                    </p>
                </div>
                <Card.Body className="p-lg-5">
                    {success && <ToastMessage message={success} variant="success" />}
                    {error && <ToastMessage message={error} variant="danger" />}

                    <ServiceConnectionCard
                        serviceName="Google"
                        serviceIcon={<GoogleSvgIcon />}
                        onError={handleError}
                        onSuccess={handleSuccess}
                    />
                    <ServiceConnectionCard
                        serviceName="Telegram"
                        serviceIcon={<TelegramSvgIcon />}
                        onError={handleError}
                        onSuccess={handleSuccess}
                    />
                    <ServiceConnectionCard
                        serviceName="GitHub"
                        serviceIcon={<GitHubSvgIcon />}
                        onError={handleError}
                        onSuccess={handleSuccess}
                    />
                </Card.Body>
            </Card>
        </GoogleOAuthProvider>
    );
};

export default Integration;
