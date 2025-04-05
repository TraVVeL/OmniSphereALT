import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { getValidationSchemas } from '../../../Auth/Validation/validationSchemas';
import useFormSubmit from '../../../Auth/hooks/useFormSubmit';
import AuthContext from '../../../../contexts/AuthContext';
import { ToastMessage } from '../../../../common/Toast';
import ProfileForm from './ProfileForm';

const Profile = () => {
    const { auth, updateProfile } = useContext(AuthContext);
    const { i18n, t } = useTranslation();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isLoaded = useRef(false);
    const [preview, setPreview] = useState(auth.profile_picture);

    const validationSchema = useMemo(
        () => getValidationSchemas(t).updateUserProfileValidationSchema, [t],
    );


    const { handleSubmit: handleSubmitProfile, error: submitErrorProfile } = useFormSubmit(
        `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/account/profile/user/${auth?.username}/`,
        (data) => {
            console.log('get', data);
            setProfileData(data);
            setIsLoading(false);
        },
        'GET',
        { Authorization: `Bearer ${auth.access}` },
    );

    const { handleSubmit, error: submitError, success } = useFormSubmit(
        `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/account/profile/`,
        (data) => {
            console.log(data);
            updateProfile(data.user);
            setProfileData(data.user);
        },
        'PATCH',
        { Authorization: `Bearer ${auth.access}` },
    );

    useEffect(() => {
        if (auth?.username && !isLoaded.current) {
            setIsLoading(true);
            handleSubmitProfile({}, { 
                setSubmitting: () => {} 
            });
            isLoaded.current = true;
        }
    }, [auth?.username, handleSubmitProfile]);

    return (
        <>
            <div className="mb-4">
                <h2>{t('edit_profile')}</h2>
            </div>

            <ProfileForm
                auth={profileData ? { ...auth, ...profileData } : auth}
                validationSchema={validationSchema}
                handleSubmit={handleSubmit}
                preview={preview}
                setPreview={setPreview}
                isLoading={isLoading}
            />

            {success && <ToastMessage message={success} variant="success" />}
            {submitError && <ToastMessage message={submitError} variant="info" />}
            {submitErrorProfile && <ToastMessage message={submitErrorProfile} variant="info" />}
        </>
    );
};

export default Profile;
