import React from 'react';
import { InputGroup, Form } from 'react-bootstrap';

const FormInputGroup = React.memo(({ field, form, type, placeholder, autoComplete, label, isVisible, toggleVisibility, iconClass, iconComponent: IconComponent, options, className }) => {
    const { name, value, onChange, onBlur } = field;
    const { errors, touched } = form;
    const showError = touched[name] && errors[name];
    const showValid = touched[name] && !errors[name];

    return (
        <InputGroup className={`mb-3 ${className || ''}`}>
            <InputGroup.Text className="p-3">
                {IconComponent ? <IconComponent className="custom-icon" /> : <i className={`bi ${iconClass}`}></i>}
            </InputGroup.Text>
            <Form.Floating> 
                {type === 'select' ? (
                    <Form.Select
                        name={name}
                        value={value || ''}
                        onChange={onChange}
                        onBlur={onBlur}
                        isInvalid={!!showError}
                        isValid={!!showValid}
                    >
                        {options && options.map((option, idx) => (
                            <option key={idx} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Form.Select>
                ) : type === 'textarea' ? (
                    <Form.Control as="textarea"
                        style={{ minHeight: '150px' }} 
                        placeholder={placeholder}
                        value={value || ''}
                        onChange={onChange}
                        onBlur={onBlur}
                        name={name}
                        isInvalid={!!showError}
                        isValid={!!showValid}
                    />
                ) : (
                    <Form.Control
                        type={isVisible ? 'text' : type}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        value={value || ''}
                        onChange={onChange}
                        onBlur={onBlur}
                        name={name}
                        isInvalid={!!showError}
                        isValid={!!showValid}
                    />
                )}
                <Form.Label className={showError ? 'text-danger' : ''}>
                    {showError ? showError : label}
                </Form.Label>
            </Form.Floating>
            {type === 'password' && (
                <button type='button' className="p-3 input-group-text" onClick={toggleVisibility}>
                    <i className={isVisible ? 'bi bi-eye' : 'bi bi-eye-slash'}></i>
                </button>
            )}
        </InputGroup>
    );
});


export default FormInputGroup;
