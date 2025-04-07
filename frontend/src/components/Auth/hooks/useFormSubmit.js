import { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import api from './clientApi';

const useFormSubmit = (url, onSuccess, method = 'POST', headers = {}) => {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { t } = useTranslation();

    const handleSubmit = useCallback(
        async (values, { setSubmitting }) => {
            setError('');
            setSuccess('');
            console.log(values);
            try {
                const { data } = await api({
                    url,
                    method: method.toLowerCase(),
                    data: values,
                    headers: {
                        'Content-Type':
                            values instanceof FormData
                                ? 'multipart/form-data'
                                : 'application/json',
                        ...headers,
                    },
                });

                setSuccess(data.message || t('operation_successful'));
                onSuccess(data);
                console.log(data);
            } catch (err) {
                if (err.response?.data?.errors) {
                    const errors = err.response.data.errors;
                    let errorMessage = '';
                    
                    const extractErrorMessages = (obj) => {
                        for (const [value] of Object.entries(obj)) {
                            if (Array.isArray(value)) {
                                errorMessage += `${value.join(', ')}\n`;
                            } else if (typeof value === 'object') {
                                extractErrorMessages(value);
                            } else {
                                errorMessage += `${value}\n`;
                            }
                        }
                    };

                    extractErrorMessages(errors);

                    setError(errorMessage.trim());
                } else {
                    const errorMessage = err.response?.data?.error || t('error_sending_data');

                    if (Array.isArray(errorMessage) && errorMessage.length > 0) {
                        setError(errorMessage[0]);
                    } else if (typeof errorMessage === 'object' && errorMessage !== null) {
                        setError(JSON.stringify(errorMessage));
                    } else {
                        setError(errorMessage);
                    }
                }
            } finally {
                setSubmitting(false);
            }
        },
        [url, onSuccess, method, headers, t],
    );

    return { handleSubmit, error, success };
};

export default useFormSubmit;
