import React, { useState, lazy } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

import GithubAuthButton from './ThirdPartyLogin/github/GithubAuthButton';
import TelegramAuthButton from './ThirdPartyLogin/TelegramAuthButton';
import GoogleAuthButton from './ThirdPartyLogin/GoogleAuthButton';
import ResetPasswordForm from './forms/ResetPasswordForm';
import RegisterForm from './forms/RegisterForm';
import LoginForm from './forms/LoginForm';

import 'bootstrap-icons/font/bootstrap-icons.css';
import '../../assets/styles/animation.css'

const SwitchModal = lazy(() => import('./SwitchForm'));

function AuthModal({ show, onHide }) {
    const [isLogin, setIsLogin] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [resetPasswordMode, setResetPasswordMode] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const toggleResetPassword = () => setResetPasswordMode((prev) => !prev);
    const { t } = useTranslation();

    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <Modal show={show} onHide={onHide} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {resetPasswordMode
                            ? t('reset_password')
                            : isLogin
                            ? t('login')
                            : t('register')}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {!resetPasswordMode && (
                        <SwitchModal
                            isLogin={isLogin}
                            setIsLogin={setIsLogin}
                        />
                    )}
                    {resetPasswordMode ? (
                        <ResetPasswordForm
                            handleClose={onHide}
                            toggleResetPassword={toggleResetPassword}
                            isVisible={isVisible}
                            toggleVisibility={toggleVisibility}
                        />
                    ) : isLogin ? (
                        <LoginForm
                            handleClose={onHide}
                            isVisible={isVisible}
                            toggleVisibility={toggleVisibility}
                        />
                    ) : (
                        <RegisterForm
                            handleClose={onHide}
                            isVisible={isVisible}
                            toggleVisibility={toggleVisibility}
                        />
                    )}
                    {!resetPasswordMode && (
                        <>
                            <div className="d-flex align-items-center mt-3 mb-3">
                                <hr className="flex-grow-1"></hr>
                                <span className="mx-3">{t('or')}</span>
                                <hr className="flex-grow-1"></hr>
                            </div>

                            <div className="d-flex flex-column align-items-center">
                                <GoogleAuthButton handleClose={onHide} />
                                <TelegramAuthButton handleClose={onHide} />
                                <GithubAuthButton handleClose={onHide} />
                            </div>

                            <div className="d-flex justify-content-center align-items-center mt-2">
                                <span className="align-middle fw-bold">
                                    {t('forgot_password')}
                                </span>
                                <Button
                                    variant="link"
                                    onClick={toggleResetPassword}
                                    className="align-middle p-0 ps-1 fw-bold"
                                >
                                    {t('change_password')}
                                </Button>
                            </div>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </GoogleOAuthProvider>
    );
}

export default AuthModal;
