import React, { useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import AuthContext from '../../../contexts/AuthContext';
import OAuthButton from './OAuthButton';
import { useTranslation } from 'react-i18next';

import { GoogleSvgIcon } from '../../../assets/Icons';

const GoogleAuthButton = ({ handleClose }) => {
    const { login } = useContext(AuthContext);
    const { i18n, t } = useTranslation();

    const handleGoogleLoginSuccess = async (tokenResponse) => {
        try {
            const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/auth/google/`,
                {
                    access_token: tokenResponse.access_token,
                },
            );
            login(response.data);
            handleClose();
        } catch (error) {
            console.error('Google login failed', error);
        }
    };

    const loginWithGoogle = useGoogleLogin({
        onSuccess: handleGoogleLoginSuccess,
        onError: () => console.error('Login Failed'),
    });

    return (
        <OAuthButton
            onClick={loginWithGoogle}
            icon={<GoogleSvgIcon />}
            text={t('continue_with') + ' Google'}
        />
    );
};

export default GoogleAuthButton;