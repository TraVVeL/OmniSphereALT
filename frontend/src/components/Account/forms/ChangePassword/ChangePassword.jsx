import React, { useContext } from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import useFormSubmit from '../../../Auth/hooks/useFormSubmit';
import AuthContext from '../../../../contexts/AuthContext';
import { ToastMessage } from '../../../../common/Toast';
import ChangePasswordForm from './ChangePasswordForm';


const ChangePassword = () => {
    const { auth } = useContext(AuthContext);
    const { i18n, t } = useTranslation();

    const { handleSubmit, error, success } = useFormSubmit(
        `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/account/change-password/`,
        (data) => {
            console.log(data);
        },
        'PATCH',
        { Authorization: `Bearer ${auth.access}` }
    );

    return (
        <>
            <div className="mb-4">
                <h2>{t('change_password')}</h2>
            </div>
            <Card className="border-secondary shadow-sm mb-5">
                <div className="card-header">
                    <h4 className="mb-1">{t('security')}</h4>
                    <p className="mb-0 fs-6">
                        {t('change_your_account_password.')}
                    </p>
                </div>
                <Card.Body className="p-lg-5">

                    {success && <ToastMessage message={success} variant="success" />}
                    {error && <ToastMessage message={error} variant="danger" />}

                    <ChangePasswordForm
                        handleSubmit={handleSubmit}
                    />
                </Card.Body>
            </Card>
        </>
    );
};

export default ChangePassword;
