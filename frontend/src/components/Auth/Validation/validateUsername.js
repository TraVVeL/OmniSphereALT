import { useCallback, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import debounce from 'lodash.debounce';

export const useValidateUsername = (currentUserUsername = '') => {
    const { i18n, t } = useTranslation();
    const [isValidating, setIsValidating] = useState(false);

    const validateUsername = useCallback(
        async (value, checkExists = true, allowOwnUsername = false) => {
            if (!value || isValidating) return;

            const trimmedValue = value.trim();

            try {
                setIsValidating(true);
                const { data } = await axios.post(
                    `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/auth/check-username/`,
                    { username: trimmedValue }
                );
                if (
                    allowOwnUsername &&
                    data.exists &&
                    trimmedValue === currentUserUsername
                ) {
                    return false;
                }

                if (checkExists && !data.exists) {
                    return t('username_not_exists');
                }
                if (!checkExists && data.exists) {
                    return t('username_already_in_use');
                }
            } catch (err) {
                if (err.response) {
                    return t('server_error_validate_username');
                } else if (err.request) {
                    return t('network_error_validate_username');
                } else {
                    return t('unexpected_error_validate_username');
                }
            } finally {
                setIsValidating(false);
            }
        },
        [i18n, t, currentUserUsername, isValidating]
    );

    const debouncedValidate = useMemo(() => debounce(validateUsername, 500), [
        validateUsername,
    ]);

    useEffect(() => {
        return () => debouncedValidate.cancel();
    }, [debouncedValidate]);

    return debouncedValidate;
};
