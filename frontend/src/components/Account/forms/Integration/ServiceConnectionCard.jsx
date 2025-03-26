import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button, Spinner, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import AuthContext from '../../../../contexts/AuthContext';
import useFormSubmit from '../../../Auth/hooks/useFormSubmit';
import { useGoogleLogin } from '@react-oauth/google';
import PopupWindow from '../../../Auth/ThirdPartyLogin/github/PopupWindow';
import { toQuery } from '../../../Auth/ThirdPartyLogin/github/utils';

const ServiceConnectionCard = ({ 
    serviceName, 
    serviceIcon,
    onError,
    onSuccess
}) => {
    const { t, i18n } = useTranslation();
    const { auth } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    
    const serviceKey = serviceName.toLowerCase();
    const apiBaseUrl = `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/account`;
    const authHeader = { Authorization: `Bearer ${auth.access}` };
    
    const handleError = useCallback((errorMessage) => {
        onError && onError(errorMessage);
        setLoading(false);
    }, [onError]);

    const handleSuccess = useCallback((message, connected) => {
        onSuccess && onSuccess(message);
        setIsConnected(connected);
        setLoading(false);
    }, [onSuccess]);

    const { handleSubmit: checkConnectionStatus } = useFormSubmit(
        `${apiBaseUrl}/linked-account/`,
        (responseData) => {
            if (responseData.status === 'success' && responseData.data) {
                const serviceStatusKey = `${serviceKey}_id`;
                setIsConnected(responseData.data[serviceStatusKey] === true);
            }
            setLoading(false);
        },
        'GET',
        authHeader
    );

    const { handleSubmit: submitLinkAccount } = useFormSubmit(
        `${apiBaseUrl}/link-account/`,
        (data) => {
            handleSuccess(data.message || t('account_successfully_connected'), true);
        },
        'POST',
        authHeader
    );

    const { handleSubmit: submitUnlinkAccount } = useFormSubmit(
        `${apiBaseUrl}/unlink-account/`,
        (data) => {
            console.log(data)
            handleSuccess(data.message || t('account_successfully_disconnected'), false);
        },
        'POST',
        authHeader
    );

    const linkAccount = useCallback(async (service, data) => {
        setLoading(true);
        await submitLinkAccount(
            { service, ...data },
            { setSubmitting: () => {} }
        );
    }, [submitLinkAccount]);

    const unlinkAccount = useCallback(async () => {
        setLoading(true);
        await submitUnlinkAccount(
            { service: serviceKey },
            { setSubmitting: () => {} }
        );
    }, [submitUnlinkAccount, serviceKey]);

    const handleGoogleConnect = useGoogleLogin({
        onSuccess: (tokenResponse) => {
            linkAccount('google', { access_token: tokenResponse.access_token });
        },
        onError: () => handleError(t('google_connection_failed'))
    });
    
    const handleGithubConnect = useCallback(async () => {
        const search = toQuery({ client_id: process.env.REACT_APP_GITHUB_CLIENT_ID });
        const width = 600, height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        try {
            const newPopup = PopupWindow.open(
                'github-oauth-authorize',
                `https://github.com/login/oauth/authorize?${search}`,
                { height, width, left, top },
            );
            
            const data = await newPopup;
            if (!data.code) {
                throw new Error("'code' not found");
            }
            
            linkAccount('github', { code: data.code });
        } catch (error) {
            handleError(t('gitHub_connection_failed'));
        }
    }, [t, linkAccount, handleError]);
    
    const handleTelegramConnect = useCallback(() => {
        window.Telegram?.Login?.auth(
            { bot_id: process.env.REACT_APP_TELEGRAM_BOT_ID },
            (userData) => {
                if (!userData) {
                    handleError(t('telegram_connection_failed'));
                    return;
                }
                linkAccount('telegram', { auth_data: userData });
            },
        );
    }, [t, linkAccount, handleError]);

    const handleConnect = useCallback(() => {
        switch (serviceKey) {
            case 'google':
                handleGoogleConnect();
                break;
            case 'github':
                handleGithubConnect();
                break;
            case 'telegram':
                handleTelegramConnect();
                break;
            default:
                console.warn(`Unsupported service: ${serviceKey}`);
        }
    }, [serviceKey, handleGoogleConnect, handleGithubConnect, handleTelegramConnect]);

    useEffect(() => {
        if (auth?.access) {
            setLoading(true);
            checkConnectionStatus({}, { setSubmitting: () => {} });
        } else {
            setIsConnected(false);
            setLoading(false);
        }
    }, [auth?.access, serviceKey]);
    
    useEffect(() => {
        const refreshConnectionStatus = () => {
            if (auth?.access) {
                checkConnectionStatus({}, { setSubmitting: () => {} });
            }
        };
        
        const events = ['auth-updated', 'token-refreshed', 'services-connection-updated'];
        
        events.forEach(event => {
            window.addEventListener(event, refreshConnectionStatus);
        });
        
        return () => {
            events.forEach(event => {
                window.removeEventListener(event, refreshConnectionStatus);
            });
        };
    }, [auth?.access]);
    
    return (
        <Card className="mb-3 shadow-sm">
            <Card.Body>
                <Row className='d-flex justify-content-center align-items-center'>
                    <Col className="d-flex align-items-center">
                        {serviceIcon && (
                            <span className="me-3">{serviceIcon}</span>
                        )}
                        <div>
                            <div className="d-flex align-items-center">
                                <strong>{serviceName}</strong>
                                {isConnected && (
                                    <Badge bg="success" className="ms-2">{t('connected')}</Badge>
                                )}
                            </div>
                            <small className="text-muted">
                                {isConnected 
                                    ? t('your_account_is_connected_with') + ` ${serviceName}`
                                    : t('connect_your_account_with') + ` ${serviceName}`
                                }
                            </small>
                        </div>
                    </Col>
                    <Col xs="auto">
                        {loading ? (
                            <Button variant="outline-primary" disabled>
                                <Spinner animation="border" size="sm" className="me-2" />
                                {t('processing...')}
                            </Button>
                        ) : isConnected ? (
                            <Button
                                variant="outline-danger"
                                onClick={unlinkAccount}
                            >
                                {t('disconnect')}
                            </Button>
                        ) : (
                            <Button
                                variant="outline-primary"
                                onClick={handleConnect}
                            >
                                {t('connect')}
                            </Button>
                        )}
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export const notifyConnectionStatusChange = () => {
    window.dispatchEvent(new Event('services-connection-updated'));
};

export default ServiceConnectionCard;