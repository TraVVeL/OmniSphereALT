import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Spinner, Col, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import useFetchData from '../Auth/hooks/UseFetchData';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastMessage } from '../../common/Toast';
import '../../assets/styles/mediaProfile.css';

import {
    GoogleSvgIcon,
    TelegramSvgIcon,
    GitHubSvgIcon,
    HabrSvgIcon,
    HeadHunterSvgIcon,
} from '../../assets/Icons';

// 
// TODO: REFACTOR THIS PART AND MAKE IT BETTER
// 

const SocialLink = ({ name, icon, link, t }) => (
    <div className="d-flex align-items-center mb-2">
        <a href={link} target="_blank" rel="noopener noreferrer" className="text-reset item-grow item-grow-md">
            {icon}
        </a>
        <div className="flex-1 position-relative ps-3">
            <h6 className="fs-9 mb-0">{name}</h6>
            <p className="mb-1">
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <span>{t('open_in_new_window')}</span>
                    <i className="bi bi-box-arrow-up-right ms-2"></i>
                </a>
            </p>
        </div>
    </div>
);

const ProfileField = ({ label, value }) => (
    <div className="d-flex flex-column mb-2">
        <p className="m-0 text-muted fst-italic fw-light fs-6">{label}</p>
        <h6>{value}</h6>
    </div>
);

const PublicProfile = () => {
    const { username } = useParams();
    const { t, i18n } = useTranslation();
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate(); 

    const { data, loading, error } = useFetchData(
        `${backendUrl}/${i18n.language}/api/account/profile/public/${username}`,
    );
    
    if (loading) 
        return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    if (error) return <ToastMessage variant="danger" className="text-center mt-5" message={error} />;
    if (!data) {
        navigate('/404');
        return <ToastMessage variant="warning" className="text-center mt-5" message={t('profile_not_found')} />
    }

    const {
        username: profileUsername,
        first_name = `${t('first_name')} ${t('is_not_provided')}`,
        last_name = `${t('last_name')} ${t('is_not_provided')}`,
        profile_picture,
    } = data;
    
    const { 
        age = null,
        gender = null,
        google_link = null,
        telegram_link = null,
        github_link = null,
        head_hunter_link = null,
        habr_link = null,
        bio: rawBio = null,
        specialty: rawSpecialty = null,
        country: rawCountry = null,
        region: rawRegion = null,
        city: rawCity = null,
    } = data.profile || {};

    const formatField = (value) => (!value || value.toLowerCase() === "none") ? t('is_not_provided') : value;
    
    const bio = formatField(rawBio);
    const specialty = formatField(rawSpecialty);
    const country = formatField(rawCountry);
    const region = formatField(rawRegion);
    const city = formatField(rawCity);

    const fullName = [first_name, last_name].filter(Boolean).join(' ') || t('name_and_surname_not_specified');

    const genderText = gender === 'M' ? t('male') : gender === 'F' ? t('female') : `${t('gender')} ${t('not_set').toLowerCase()}`;

    const socialLinks = [
        { name: 'Google', icon: <GoogleSvgIcon width={36} height={36} />, link: google_link },
        { name: 'GitHub', icon: <GitHubSvgIcon width={36} height={36} />, link: github_link },
        { name: 'Telegram', icon: <TelegramSvgIcon width={36} height={36} />, link: telegram_link },
        { name: 'Habr', icon: <HabrSvgIcon width={36} height={36} />, link: habr_link },
        { name: 'HeadHunter', icon: <HeadHunterSvgIcon width={36} height={36} />, link: head_hunter_link },
    ].filter(item => item.link);

    const profilePicturePath = profile_picture || '/media/profile_pictures/default_profile_picture.png';

    return (
        <>
            <Card className="mx-auto mt-3 mb-3 shadow border-0">
                <div
                    className="rounded-top position-relative bg-cover"
                >
                    <div
                        className="img-thumbnail position-absolute translate-middle-y rounded-circle overflow-hidden ms-0 ms-sm-3 top-100 border-0 p-2"
                    >
                        <img
                            src={`${backendUrl}${profilePicturePath}`}
                            alt="Profile"
                            className="img-fluid rounded-circle"
                            style={{width : '120px', height : '120px', objectFit : 'cover'}}
                        />
                    </div>
                </div>

                <Card.Body>
                    <Row>
                        <Col md={8}>
                            <div className="d-flex align-items-center border-bottom mb-2 pb-2">
                                <h4 className="mb-1">{fullName}</h4>
                                {gender && <span className="ms-2 badge bg-secondary">{genderText}</span>}
                                {age && <span className="ms-2 badge bg-secondary">{age}</span>}
                            </div>
                            
                            <ProfileField label={t('username')} value={profileUsername} />
                            <ProfileField label={t('specialty')} value={specialty} />
                        </Col>

                        <div className="vr d-none d-md-flex mx-3 p-0"></div>

                        <Col className="ps-2 ps-md-3">
                            <ProfileField label={t('country')} value={country} />
                            <ProfileField label={t('region')} value={region} />
                            <ProfileField label={t('city')} value={city} />
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            
            <Row className="g-0">
                <Col className="col-12 col-sm-8 pe-0 pe-sm-1 pe-md-2">
                    <Card className="mb-3">
                        <Card.Header>
                            <h5 className="mb-0">{t('about_myself')}</h5>
                        </Card.Header>

                        <Card.Body className="text-justify">
                            <p className="text-1000 mb-0">{bio}</p>
                        </Card.Body>
                    </Card>
                </Col>

                <Col className="col-12 col-sm-4 ps-0 ps-sm-1 ps-md-2">
                    <Card className="mb-3">
                        <Card.Header>
                            <h5 className="mb-0">{t('social_media')}</h5>
                        </Card.Header>
                        <Card.Body>
                            {socialLinks.length > 0 ? (
                                socialLinks.map(({ name, icon, link }) => (
                                    <SocialLink key={name} name={name} icon={icon} link={link} t={t} />
                                ))
                            ) : (
                                <p className="text-muted">{t('no_social_links')}</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default React.memo(PublicProfile);