import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { getValidationSchemas } from '../../../Auth/Validation/validationSchemas';

import useFormSubmit from '../../../Auth/hooks/useFormSubmit';
import AuthContext from '../../../../contexts/AuthContext';
import { ToastMessage } from '../../../../common/Toast';
import SocialForm from './SocialForm';

const Social = () => {
    const { auth } = useContext(AuthContext);
    const { i18n, t } = useTranslation();
    const [socialLinks, setSocialLinks] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isFetched = useRef(false);

    const validationSchema = useMemo(
        () => getValidationSchemas(t).SocialValidationSchema, [t],
    );
    
    const { handleSubmit: fetchSocial, error: fetchError } = useFormSubmit(
        `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/account/social-links/`,
        (data) => {
            setSocialLinks(data);
            setIsLoading(false);
        },
        'GET',
        { Authorization: `Bearer ${auth.access}` }
    );

    const { handleSubmit: updateSocialLinks, error: updateError, success: updateSuccess } = useFormSubmit(
        `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/account/social-links/`,
        (data) => {
            setSocialLinks(data);  
        },
        'PATCH',  
        { Authorization: `Bearer ${auth.access}` }
    );

    useEffect(() => {
        if (auth?.username && !isFetched.current) {
            setIsLoading(true);
            fetchSocial({}, { 
                setSubmitting: () => {},
                onError: () => setIsLoading(false)
            });
            isFetched.current = true;
        }
    }, [auth?.username, fetchSocial]);

    return (
        <>
            <div className="mb-4">
                <h2>{t('add_link_account')}</h2>
            </div>
            <Card className="border-secondary shadow-sm mb-5">
                <div className="card-header">
                    <h4 className="mb-1">{t('add_social_account')}</h4>
                    <p className="mb-0 fs-6">{t('add_your_social_media')}</p>
                </div>
                <Card.Body className="p-lg-5">
                    {fetchError && <ToastMessage message={fetchError} variant="danger" />}
                    {updateError && <ToastMessage message={updateError} variant="danger" />}
                    {updateSuccess && <ToastMessage message={updateSuccess} variant="success" />}
                    
                    <SocialForm 
                        handleSubmit={updateSocialLinks}
                        validationSchema={validationSchema}
                        initialValues={socialLinks}
                        isLoading={isLoading}
                    />
                </Card.Body>
            </Card>
        </>
    );
};

export default Social;
