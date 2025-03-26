import React, { useRef } from 'react';
import { Formik, Form as FormikForm, Field } from 'formik';
import { Button, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import FormInputGroup from '../../../Auth/FormInputGroup';

import {
    GoogleSvgIcon,
    TelegramSvgIcon,
    GitHubSvgIcon,
    HabrSvgIcon,
    HeadHunterSvgIcon,
} from '../../../../assets/Icons';

const socialNetworks = [
    { name: 'google_link', label: 'Google', icon: GoogleSvgIcon },
    { name: 'github_link', label: 'GitHub', icon: GitHubSvgIcon },
    { name: 'telegram_link', label: 'Telegram', icon: TelegramSvgIcon },
    { name: 'habr_link', label: 'Habr', icon: HabrSvgIcon },
    { name: 'head_hunter_link', label: 'HeadHunter', icon: HeadHunterSvgIcon },
];

const LoadingFormInputGroup = ({ isLoading, ...props }) => {
    return (
        <div className="position-relative">
            <FormInputGroup {...props} />
            {isLoading && (
                <div className="position-absolute top-50 end-0 translate-middle-y me-3">
                    <Spinner className='me-2 text-muted' animation="border" size="sm" />
                </div>
            )}
        </div>
    );
};

const SocialForm = ({ handleSubmit, validationSchema, initialValues, isLoading }) => {
    const { t } = useTranslation();
    const account = t('account').toLowerCase();
    const formikRef = useRef(null);

    const handleRevertChanges = () => {
        if (formikRef.current) {
            formikRef.current.resetForm();
        }
    };

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues || {}}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
                handleSubmit(values, actions);
            }}
            innerRef={formikRef}
        >
            {({ isSubmitting, dirty }) => (
                <FormikForm>
                    {isLoading ? (
                        socialNetworks.map(({ name, label, icon: IconComponent }) => (
                            <Field
                                key={name}
                                name={name}
                                type="text"
                                placeholder={`${t('loading')}...`}
                                label={`${label} ${account}`}
                                component={LoadingFormInputGroup}
                                iconComponent={IconComponent}
                                disabled={true}
                                isLoading={true}
                            />
                        ))
                    ) : (
                        socialNetworks.map(({ name, label, icon: IconComponent }) => (
                            <Field
                                key={name}
                                name={name}
                                type="text"
                                placeholder={`${label} ${account}`}
                                label={`${label} ${account}`}
                                component={FormInputGroup}
                                iconComponent={IconComponent}
                            />
                        ))
                    )}
                    <div className="d-flex justify-content-end">
                        <Button 
                            className="btn me-2" 
                            variant="secondary" 
                            type="button" 
                            disabled={isSubmitting || isLoading || !dirty}
                            onClick={handleRevertChanges}
                        >
                            {t('revert_changes')}
                        </Button>
                        <Button 
                            className="btn" 
                            variant="primary" 
                            type="submit" 
                            disabled={isSubmitting || isLoading || !dirty}
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="text-muted me-2" />
                                    {t('saving')}...
                                </>
                            ) : (
                                t('save_changes')
                            )}
                        </Button>
                    </div>
                </FormikForm>
            )}
        </Formik>
    );
};

export default SocialForm;