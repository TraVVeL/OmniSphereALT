import React, { useMemo, useRef } from 'react';
import { Button, Col, Row, Card, Spinner } from 'react-bootstrap';
import { Formik, Form as FormikForm, Field } from 'formik';
import { useTranslation } from 'react-i18next';
import { useDropzone } from 'react-dropzone';
import PhoneInput from 'react-phone-input-2';

import { useValidateUsername } from '../../../Auth/Validation/validateUsername';
import { useValidateEmail } from '../../../Auth/Validation/validateEmail';
import FormInputGroup from '../../../Auth/FormInputGroup';
import ImageUploader from './ImageUploader';

import 'react-phone-input-2/lib/bootstrap.css';
import '../../../../assets/styles/phoneNumber.css';

const ProfileForm = ({
    auth,
    validationSchema,
    handleSubmit,
    preview,
    setPreview,
    isLoading,
}) => {
    const { t } = useTranslation();
    const validateEmail = useValidateEmail(auth.email);
    const validateUsername = useValidateUsername(auth.username);
    const userProfile = auth.profile || {};
    const setFieldValueRef = useRef(null);
    const initialValues = useMemo(
        () => ({
            username: auth.username || '',
            email: auth.email || '',
            first_name: auth.first_name || '',
            last_name: auth.last_name || '',
            profile_picture: null,
            bio: userProfile.bio || '',
            specialty: userProfile.specialty || '',
            gender: userProfile.gender || '',
            age: userProfile.age || '',
            phone_number: userProfile.phone_number || '',
            country: userProfile.country || '',
            region: userProfile.region || '',
            city: userProfile.city || '',
        }),
        [auth, userProfile],
    );

    const dropzoneConfig = useMemo(
        () => ({
            accept: {
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': ['.png'],
                'image/gif': ['.gif'],
            },
            maxSize: 4 * 1024 * 1024,
        }),
        [],
    );
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        ...dropzoneConfig,
        onDrop: (files) => {
            if (setFieldValueRef.current && files.length > 0) {
                const file = files[0];
                setPreview(URL.createObjectURL(file));
                setFieldValueRef.current('profile_picture', file);
            }
        },
    });


    const createFormData = (values) => {
        const formData = new FormData();

        Object.entries(values).forEach(([key, value]) => {
            if (key !== 'profile' && value) {
                formData.append(key, value);
            }
        });

        if (values.profile) {
            Object.entries(values.profile).forEach(([key, value]) => {
                if (value) {
                    formData.append(`profile.${key}`, value);
                }
            });
        }

        return formData;
    };

    const genderOptions = useMemo(
        () => [
            { value: '', label: t('select_gender') },
            { value: 'M', label: t('male') },
            { value: 'F', label: t('female') },
            { value: 'N', label: t('none') },
        ],
        [t],
    );

    return (
        <Formik
            enableReinitialize
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, actions) => {
                const formData = createFormData(values);
                handleSubmit(formData, actions);
            }}
        >
            {({ isSubmitting, setFieldValue, resetForm, dirty }) => {
                setFieldValueRef.current = setFieldValue;
                const handleReset = (e) => {
                    e.preventDefault();
                    resetForm();
                    setPreview(auth.profile_picture ? auth.profile_picture : null); 
                };
                return (
                    <FormikForm>
                        <Card className="border-secondary shadow-sm mb-4">
                            <div className="card-header">
                                <h4 className="mb-1">
                                    {t('basic_information')}
                                </h4>
                            </div>
                            <Card.Body className="p-lg-4">
                                <ImageUploader
                                    preview={preview}
                                    getRootProps={getRootProps}
                                    getInputProps={getInputProps}
                                    isDragActive={isDragActive}
                                    setFieldValue={setFieldValue}
                                    t={t}
                                />

                                <Field
                                    name="username"
                                    type="text"
                                    label={t('username')}
                                    placeholder={t('enter_username')}
                                    iconClass="bi-person"
                                    component={FormInputGroup}
                                    validate={(value) =>
                                        validateUsername(value, false, true)
                                    }
                                />

                                <Field
                                    name="email"
                                    type="email"
                                    label={t('email_address')}
                                    placeholder={t('enter_email')}
                                    iconClass="bi-envelope"
                                    component={FormInputGroup}
                                    validate={(value) =>
                                        validateEmail(value, false, true)
                                    }
                                />

                                <Row className="gx-3">
                                    <Col md={6}>
                                        <Field
                                            name="first_name"
                                            type="text"
                                            label={t('first_name')}
                                            placeholder={t('enter_first_name')}
                                            iconClass="bi-person"
                                            component={FormInputGroup}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Field
                                            name="last_name"
                                            type="text"
                                            label={t('last_name')}
                                            placeholder={t('enter_last_name')}
                                            iconClass="bi-person"
                                            component={FormInputGroup}
                                        />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="border-secondary shadow-sm mb-4">
                            <div className="card-header">
                                <h4 className="mb-1">
                                    {t('additional_information')}
                                </h4>
                            </div>
                            <Card.Body className="p-lg-4">
                                <Field
                                    name="bio"
                                    type="textarea"
                                    label={t('bio')}
                                    placeholder={t('tell_us_about_yourself')}
                                    iconClass="bi-file-text"
                                    className="mb-lg-4 mb-4"
                                    component={FormInputGroup}
                                />

                                <Row className="gx-3">
                                    <Col md={6}>
                                        <Field
                                            name="gender"
                                            type="select"
                                            label={t('gender')}
                                            iconClass="bi-gender-ambiguous"
                                            component={FormInputGroup}
                                            options={genderOptions}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Field
                                            name="age"
                                            type="number"
                                            label={t('age')}
                                            placeholder={t('enter_your_age')}
                                            iconClass="bi-calendar"
                                            component={FormInputGroup}
                                        />
                                    </Col>
                                </Row>

                                <Row className="gx-3">
                                    <Col md={6}>
                                        <Field
                                            name="specialty"
                                            type="text"
                                            label={t('specialty')}
                                            placeholder={t(
                                                'enter_your_specialty',
                                            )}
                                            iconClass="bi-briefcase"
                                            component={FormInputGroup}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <PhoneInput
                                            country={'ru'}
                                            value={
                                                userProfile.phone_number || ''
                                            }
                                            onChange={(phone) =>
                                                setFieldValue(
                                                    'phone_number',
                                                    phone,
                                                )
                                            }
                                            inputProps={{
                                                name: 'phone_number',
                                                required: true,
                                                className:
                                                    'form-control w-100 h-100',
                                            }}
                                            preferredCountries={['ru', 'us']}
                                        />
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>

                        <Card className="border-secondary shadow-sm mb-4">
                            <div className="card-header">
                                <h4 className="mb-1">{t('your_residence')}</h4>
                            </div>
                            <Card.Body className="p-lg-4">
                                <Field
                                    name="country"
                                    type="text"
                                    label={t('country')}
                                    placeholder={t('enter_country')}
                                    iconClass="bi-globe"
                                    component={FormInputGroup}
                                />
                                <Field
                                    name="region"
                                    type="text"
                                    label={t('region')}
                                    placeholder={t('enter_region')}
                                    iconClass="bi-map"
                                    component={FormInputGroup}
                                />
                                <Field
                                    name="city"
                                    type="text"
                                    label={t('city')}
                                    placeholder={t('enter_city')}
                                    iconClass="bi-building"
                                    component={FormInputGroup}
                                />
                            </Card.Body>
                        </Card>

                        <div className="d-flex justify-content-end mt-4">
                                    <Button
                                        className="btn me-2"
                                        variant="secondary"
                                        type="button"
                                        disabled={isSubmitting || isLoading || !dirty}
                                        onClick={handleReset}
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
                                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                                {t('saving')}...
                                            </>
                                        ) : (
                                            t('save_changes')
                                        )}
                                    </Button>
                            </div>
                    </FormikForm>
                );
            }}
        </Formik>
    );
};

export default ProfileForm;
