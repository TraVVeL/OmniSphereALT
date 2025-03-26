import React, { useContext } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field } from 'formik';

import { getValidationSchemas } from '../Validation/validationSchemas';
import { useValidateEmail } from '../Validation/validateEmail';
import AuthContext from '../../../contexts/AuthContext';
import { ToastMessage } from '../../../common/Toast';
import useFormSubmit from '../hooks/useFormSubmit';
import { useTranslation } from 'react-i18next';
import FormInputGroup from '../FormInputGroup';

const RegisterForm = ({ handleClose, isVisible, toggleVisibility }) => {
    const { login } = useContext(AuthContext);
    const { i18n, t } = useTranslation();
    const validateEmail = useValidateEmail();

    const { handleSubmit, error } = useFormSubmit(
        `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/auth/register/`,
        (data) => {
            login(data);
            handleClose();
        },
    );

    return (
        <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={getValidationSchemas(t).authValidationSchema}
            onSubmit={handleSubmit}
        >
            {({ isSubmitting }) => (
                <FormikForm>
                    <Field
                        name="email"
                        type="email"
                        placeholder={t('email_enter')}
                        autoComplete="email"
                        label={t('email_address')}
                        iconClass="bi-envelope"
                        component={FormInputGroup}
                        validate={(value) => validateEmail(value, false)}
                    />
                    <Field
                        name="password"
                        type="password"
                        placeholder={t('password')}
                        autoComplete="new-password"
                        label={t('password')}
                        isVisible={isVisible}
                        toggleVisibility={toggleVisibility}
                        iconClass="bi-person-lock"
                        component={FormInputGroup}
                    />
                    {error && <ToastMessage message={error} variant="danger" />}

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
                                {t('loading')}...
                            </>
                        ) : (
                            t('register')
                        )}
                    </Button>
                </FormikForm>
            )}
        </Formik>
    );
};

export default React.memo(RegisterForm);
