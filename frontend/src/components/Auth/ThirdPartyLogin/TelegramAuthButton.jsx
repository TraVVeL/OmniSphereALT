import React, { useEffect, useRef, useContext } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import AuthContext from '../../../contexts/AuthContext';
import { TelegramSvgIcon } from '../../../assets/Icons'
import OAuthButton from './OAuthButton';


function TelegramAuthButton({ handleClose }) {
    const { login } = useContext(AuthContext);
    const containerRef = useRef(null);
    const { i18n, t } = useTranslation();

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        script.setAttribute(
            'data-telegram-login',
            process.env.REACT_APP_TELEGRAM_BOT_NAME,
        );
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-request-access', 'write');

        const currentContainer = containerRef.current;
        if (currentContainer) {
            currentContainer.appendChild(script);
        }

        return () => {
            if (currentContainer) {
                currentContainer.removeChild(script);
            }
        };
    }, []);

    const onLoginWithTelegram = () => {
        window.Telegram.Login.auth(
            { bot_id: process.env.REACT_APP_TELEGRAM_BOT_ID },
            (user) => {
                if (!user) {
                    console.error('Error logging in with Telegram');
                    return;
                }
                handleTelegramLogin(user);
            },
        );
    };

    const handleTelegramLogin = async (user) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/auth/telegram/`,
                {
                    auth_data: user,
                },
            );
            login(response.data);
            handleClose();
        } catch (error) {
            console.error('Telegram login failed', error);
        }
    };

    return (
        <OAuthButton
            onClick={onLoginWithTelegram}
            icon={
                <TelegramSvgIcon />
            }
            text={t('continue_with') + ' Telegram'}
        />
    );
}

export default TelegramAuthButton;
