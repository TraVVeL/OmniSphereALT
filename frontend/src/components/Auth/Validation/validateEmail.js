import { useCallback } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

export const useValidateEmail = (currentUserEmail = '') => {
    const { i18n, t } = useTranslation();

    return useCallback(
        async (value, checkExists = true, allowOwnEmail = false) => {
            if (!value) return;

            try {
                const { data } = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/auth/check-email/`,
                    { email: value },
                );

                if (
                    allowOwnEmail &&
                    data.exists &&
                    value === currentUserEmail
                ) {
                    return false;
                }

                if (checkExists && !data.exists) {
                    return t('email_not_exists');
                }
                if (!checkExists && data.exists) {
                    return t('email_already_in_use');
                }
            } catch (err) {
                if (err.response) {
                    return t('server_error_validate_email');
                } else if (err.request) {
                    return t('network_error_validate_email');
                } else {
                    return t('unexpected_error_validate_email');
                }
            }
        },
        [i18n, t, currentUserEmail],
    );
};
