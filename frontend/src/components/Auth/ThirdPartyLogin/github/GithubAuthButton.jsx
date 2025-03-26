import React, { useContext } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import AuthContext from '../../../../contexts/AuthContext';
import { GitHubSvgIcon } from '../../../../assets/Icons'
import OAuthButton from '../OAuthButton';
import PopupWindow from './PopupWindow';
import { toQuery } from './utils';


const GithubAuthButton = ({ handleClose }) => {
    const { login } = useContext(AuthContext);
    const { t } = useTranslation();

    const handleGithubLogin = async (responseToken) => {
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_BACKEND_URL}/api/auth/github/?code=${responseToken.code}`,
                {
                    access_token: responseToken,
                },
            );
            login(response.data);
            handleClose();
        } catch (error) {
            console.error('GitHub login failed', error);
        }
    };

    const onBtnClick = async () => {
        const search = toQuery({ client_id: process.env.REACT_APP_GITHUB_CLIENT_ID });
        const width = 600;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const newPopup = PopupWindow.open(
            'github-oauth-authorize',
            `https://github.com/login/oauth/authorize?${search}`,
            { height, width, left, top },
        );

        try {
            const data = await newPopup;
            if (!data.code) {
                throw new Error("'code' not found");
            }
            handleGithubLogin(data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <OAuthButton
            onClick={onBtnClick}
            icon={<GitHubSvgIcon />}
            text={t('continue_with') + ' Github'}
        />
    );
};

export default GithubAuthButton;
