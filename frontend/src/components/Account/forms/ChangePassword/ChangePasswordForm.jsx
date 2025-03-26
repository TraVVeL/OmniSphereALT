import React, { useState } from 'react';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import FormInputGroup from '../../../Auth/FormInputGroup';
import { getValidationSchemas } from '../../../Auth/Validation/validationSchemas';

const ChangePasswordForm = ({ handleSubmit }) => {
    const { t } = useTranslation();

    const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] = useState(false);
    const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

    const toggleCurrentPasswordVisibility = () => setIsCurrentPasswordVisible(!isCurrentPasswordVisible);
    const toggleNewPasswordVisibility = () => setIsNewPasswordVisible(!isNewPasswordVisible);

    return (
        <Formik
            initialValues={{
                current_password: '', 
                new_password: '',
            }}
            validationSchema={getValidationSchemas(t).ChangePasswordValidationSchema}
            onSubmit={(values, actions) => {
                handleSubmit(values, actions);
            }}
        >
            {({ isSubmitting }) => (
                <FormikForm>
                    <Field
                        name="current_password" 
                        type="password"
                        placeholder={t('current_password')}
                        autoComplete="new_password"
                        label={t('current_password')}
                        isVisible={isCurrentPasswordVisible}
                        toggleVisibility={toggleCurrentPasswordVisibility}
                        iconClass="bi-person-lock"
                        component={FormInputGroup}
                    />
                    <Field
                        name="new_password" 
                        type="password"
                        placeholder={t('new_password')}
                        autoComplete="new-password"
                        label={t('new_password')}
                        isVisible={isNewPasswordVisible}
                        toggleVisibility={toggleNewPasswordVisibility}
                        iconClass="bi-person-lock"
                        component={FormInputGroup}
                    />
                    <div className='d-flex justify-content-end'>
                        <Button
                            className="btn"
                            variant="primary"
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {t('save_changes')}
                        </Button>
                    </div>
                </FormikForm>
            )}
        </Formik>
    );
};

export default ChangePasswordForm;
