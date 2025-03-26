import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Row, Col, Nav } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

import AuthContext from '../../contexts/AuthContext';
import { MustBeLogged } from '../../common';
import { UserAvatar } from '../../common';

import '../../assets/styles/callout.scss';

const Account = () => {
    const { auth, logout } = useContext(AuthContext);
    const { t } = useTranslation();
    const location = useLocation();

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);
    const navLinks = useMemo(
        () => [
            { to: '/account/profile', icon: 'bi-person', label: t('edit_profile'), },
            { to: '/account/change-password', icon: 'bi-lock', label: t('change_password') },
            { to: '/account/integration', icon: 'bi-plug', label: t('integration'), },
            { to: '/account/social', icon: 'bi-people', label: t('social') },
            { to: '/account/session', icon: 'bi-clock', label: `${t('session')} [not implemented yet]` },
            { to: '/account/appearance', icon: 'bi-palette', label: `${t('appearance')} [not implemented yet]` },
        ],
        [t],
    );

    if (!auth) {
        return <MustBeLogged />;
    }

    return (
        <Row>
            <Col
                lg={3}
                md={3}
                sm={12}
                className={`${
                    windowWidth < 768 ? 'block' : 'sticky-top h-100 z-0'
                }`}
                style={{ top: '85px' }}
            >
                <div className="d-flex align-items-center mb-3">
                    <UserAvatar
                        src={`${process.env.REACT_APP_BACKEND_URL}${auth.profile_picture}`}
                        size={56}
                    />

                    <div className="ms-2 col-lg-8 text-truncate">
                        <h6 className="mb-0 text-truncate w-100">
                            {auth.first_name ? auth.first_name : t('no_name')}
                        </h6>
                        <h6 className="mb-0 text-truncate w-100">
                            {auth.last_name
                                ? auth.last_name
                                : t('no_last_name')}
                        </h6>
                        <small className="text-muted text-truncate w-100">{auth.username}</small>
                    </div>
                </div>

                <hr className="border-top" />

                <Nav
                    className={`d-flex ${
                        windowWidth < 768 ? 'flex-nowrap overflow-auto' : ''
                    }`}
                >
                    {navLinks.map(({ to, icon, label }) => (
                        <Nav.Link
                            key={to}
                            as={NavLink}
                            to={to}
                            className="d-flex align-items-center callout me-3"
                            style={windowWidth < 768 ? { flexShrink: 0 } : {}}
                        >
                            <span className={`bi ${icon} me-2`}></span> {label}
                        </Nav.Link>
                    ))}
                    <hr className="border-top" />
                    <Nav.Link
                        as={NavLink}
                        to="/"
                        onClick={logout}
                        className="text-danger d-flex align-items-center callout"
                    >
                        <span className="bi bi-box-arrow-right me-2"></span>
                        {t('sign_out')}
                    </Nav.Link>
                </Nav>
            </Col>

            <Col lg={9} md={9} sm={12}>
                <Outlet />
            </Col>
        </Row>
    );
};

export default Account;
