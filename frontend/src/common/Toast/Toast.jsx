import { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import {
    SuccessSvgIcon,
    InfoSvgIcon,
    WarningSvgIcon,
    DangerSvgIcon,
} from '../../assets/Icons';

import '../../assets/styles/toast.css'

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

const ToastProvider = ({ children }) => {
    const { t } = useTranslation();
    const [toasts, setToasts] = useState([]);

    const showToast = (type = 'warning', message, duration = 10000) => {
        const newToast = {
            id: Date.now(),
            type,
            message,
            duration,
            show: true,
        };
        setToasts((prevToasts) => [...prevToasts, newToast]);

        setTimeout(() => {
            setToasts(
                (prevToasts) =>
                    prevToasts.filter((toast) => toast.id !== newToast.id),
            );
        }, duration);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <SuccessSvgIcon />;
            case 'info':
                return <InfoSvgIcon />;
            case 'warning':
                return <WarningSvgIcon />;
            case 'danger':
                return <DangerSvgIcon />;
            default:
                return <WarningSvgIcon />;
        }
    };

    const getWarningType = (type) => {
        switch (type) {
            case 'success':
                return t('success');
            case 'info':
                return t('info');
            case 'warning':
                return t('warning');
            case 'danger':
                return t('error');
            default:
                return t('warning');
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer position="top-end" className="p-3">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        className={`active border-0 toast-${toast.type}`}
                        show={toast.show}
                        bg={toast.variant}
                        onClose={() =>
                            setToasts((prevToasts) =>
                                prevToasts.filter((t) => t.id !== toast.id),
                            )
                        }
                    >
                        <div className="custom-toast">
                            <Toast.Header>
                                <div className="me-auto d-flex align-items-center">
                                    {getIcon(toast.type)}
                                    <strong className="ms-2">
                                        {getWarningType(toast.type)}
                                    </strong>
                                </div>
                            </Toast.Header>
                            <Toast.Body>{toast.message}</Toast.Body>
                            <div
                                className={`toast-progress ${
                                    toast.show ? 'active' : ''
                                }`}
                                style={{
                                    animationDuration: `${toast.duration}ms`,
                                }}
                            ></div>
                        </div>
                    </Toast>
                ))}
            </ToastContainer>
        </ToastContext.Provider>
    );
};

export default ToastProvider;