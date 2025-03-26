import React, { useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import AuthContext from '../../../contexts/AuthContext';
import OAuthButton from './OAuthButton';
import { useTranslation } from 'react-i18next';

import { GoogleSvgIcon } from '../../../assets/Icons'

 
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
            icon={
                <GoogleSvgIcon />
            }
            text={t('continue_with') + ' Google'}
        />
    );
};

export default GoogleAuthButton;

// import React, { useContext } from 'react';
// import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
// import AuthContext from '../AuthContext';
// import axios from 'axios';

// const GoogleAuthButton = ({ handleClose }) => {
//     const { login } = useContext(AuthContext);

//     const handleGoogleLogin = async (response) => {
//         try {
//             const res = await axios.post('http://localhost:8000/api/auth/google/', {
//                 access_token: response.credential,
//             });
//             login({
//                 access: res.data.access_token,
//                 refresh: res.data.refresh_token,
//                 username: res.data.username,
//                 profilePicture: res.data.profile_picture,
//             });
//             handleClose();
//         } catch (error) {
//             console.error('Google login failed', error);
//         }
//     };

//     return (
//         <GoogleOAuthProvider clientId="">
//             <div style={{
//                 colorScheme: 'light',
//                 border: '1px solid rgb(255 255 255 / 20%)',
//                 borderRadius: '25px',
//                 paddingBottom: '2px',
//                 display: 'inline-block'
//                 }}>
//                 <GoogleLogin
//                     onSuccess={handleGoogleLogin}
//                     onError={() => console.error('Login Failed')}
//                     theme="filled_black"
//                     shape="pill"
//                     width="200"
//                 />
//             </div>
//         </GoogleOAuthProvider>
//     );
// };

//export default GoogleAuthButton;
