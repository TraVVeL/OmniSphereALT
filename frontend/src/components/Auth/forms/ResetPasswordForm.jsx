import React, { useState, useContext } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field } from 'formik';

import { getValidationSchemas } from '../Validation/validationSchemas';
import { useValidateEmail } from '../Validation/validateEmail';
import AuthContext from '../../../contexts/AuthContext';
import { ToastMessage } from '../../../common/Toast';
import useFormSubmit from '../hooks/useFormSubmit';
import FormInputGroup from '../FormInputGroup';
import { useTranslation } from 'react-i18next';

function ResetPasswordForm({
    handleClose,
    toggleResetPassword,
    isVisible,
    toggleVisibility,
}) {
    const [codeSent, setCodeSent] = useState(false);
    const { login } = useContext(AuthContext);
    const validateEmail = useValidateEmail();
    const { i18n, t } = useTranslation();

    const onEmailSuccess = () => {
        setCodeSent(true);
    };

    const onCodeSuccess = (data) => {
        login(data);
        handleClose();
    };

    const {
        handleSubmit: handleEmailSubmit,
        error: emailError,
        success: codeGetSuccess,
    } = useFormSubmit(
        `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/auth/get-code/`,
        onEmailSuccess,
    );

    const {
        handleSubmit: handleCodeSubmit,
        error: codeError,
        success: codeResetSuccess,
    } = useFormSubmit(
        `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/auth/reset-confirm/`,
        onCodeSuccess,
    );

    const error = codeSent ? codeError : emailError;

    return (
        <Formik
            initialValues={
                codeSent ? { code: '', password: '' } : { email: '' }
            }
            validationSchema={
                codeSent
                    ? getValidationSchemas(t).resetPasswordCodeValidationSchema
                    : getValidationSchemas(t).resetPasswordEmailValidationSchema
            }
            onSubmit={(values, actions) => {
                if (!codeSent) {
                    handleEmailSubmit(values, actions)
                        .then(() => {
                            setCodeSent(true);
                        })
                        .catch(() => {});
                } else {
                    handleCodeSubmit(values, actions);
                }
            }}
        >
            {({ isSubmitting }) => (
                <FormikForm>
                    {!codeSent ? (
                        <Field
                            name="email"
                            type="email"
                            placeholder={t('email_enter')}
                            autoComplete="email"
                            label={t('email_address')}
                            iconClass="bi-envelope"
                            component={FormInputGroup}
                            validate={(value) => validateEmail(value, true)}
                        />
                    ) : (
                        <>
                            <Field
                                name="code"
                                type="text"
                                placeholder={t('enter_code')}
                                label={t('code_confirmation')}
                                iconClass="bi-send-check"
                                component={FormInputGroup}
                            />
                            <Field
                                name="password"
                                type="password"
                                placeholder={t('new_password')}
                                autoComplete="new-password"
                                label={t('new_password')}
                                isVisible={isVisible}
                                toggleVisibility={toggleVisibility}
                                iconClass="bi-person-lock"
                                component={FormInputGroup}
                            />
                        </>
                    )}

                    {error && <ToastMessage message={error} variant="danger" />}
                    {codeGetSuccess && (
                        <ToastMessage
                            message={codeGetSuccess}
                            variant="success"
                        />
                    )}
                    {codeResetSuccess && (
                        <ToastMessage
                            message={codeResetSuccess}
                            variant="success"
                        />
                    )}

                    <Button
                        className="w-100 btn-lg"
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    className="me-2"
                                />
                                <span> 
                                    {codeSent ? t('confirming') : t('sending')}...
                                </span>
                            </>
                        ) : codeSent ? (
                            t('confirm')
                        ) : (
                            t('get_code')
                        )}
                    </Button>

                    <Button
                        variant="link"
                        onClick={() => {
                            if (codeSent) {
                                setCodeSent(false);
                            } else {
                                toggleResetPassword();
                            }
                        }}
                        className="align-middle ps-1 fw-bold mt-2"
                    >
                        {t('back')}
                    </Button>
                </FormikForm>
            )}
        </Formik>
    );
}

export default React.memo(ResetPasswordForm);
