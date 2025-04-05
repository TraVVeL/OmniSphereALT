import React, { useContext, useState, Suspense, useMemo } from 'react';
import { Button, Dropdown, Offcanvas, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AuthContext from '../contexts/AuthContext';
import LanguageSwitcher from '../components/Localization/LanguageSwitcher';
import ThemeSwitcher from './ThemeSwitcher';
import ThemeContext from '../contexts/ThemeContext';
import UserAvatar from './UserAvatar';

import '../assets/styles/callout.scss'

const AuthModal = React.lazy(() => import('../components/Auth/AuthModal'));

function Header() {
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const { auth, logout } = useContext(AuthContext);
    const { t } = useTranslation();
    const { theme } = useContext(ThemeContext);


    const handleAuthModalClose = () => setShowAuthModal(false);
    const handleAuthModalShow = () => setShowAuthModal(true);

    const navLinks = useMemo(
        () => auth
            ? [
                { to: `/profile/${auth.username}`, icon: 'bi-person', label: t('profile') },
                { to: '/account', icon: 'bi-lock', label: t('account') },
                { to: '/', icon: 'bi-plug', label: t('all_articles') },
                { to: '/create-post', icon: 'bi-people', label: t('create') },
                { to: '/my-posts', icon: 'bi-clock', label: t('my_articles') },
            ]
            : [
                { to: '/', icon: 'bi-plug', label: t('all_articles') },
                { to: '/create-post', icon: 'bi-people', label: t('create') },
                { to: '/my-posts', icon: 'bi-clock', label: t('my_articles') },
            ],
        [auth, t],
    );
    

    const MemoizedNavLink = React.memo(({ to, label, visibilityClasses }) => (
        <NavLink className={`nav-link fw-bold py-1 px-0 ${visibilityClasses}`} to={to}>
            {label}
        </NavLink>
    ));

    return (
        <header className="mb-3 py-3 w-100 sticky-top border-bottom bg-body">
            <div className='cover-container mx-auto d-flex justify-content-between align-items-center'>
                <nav className="nav nav-masthead justify-content-center">
                    <MemoizedNavLink to="/" label={t('all_articles')} />
                    <MemoizedNavLink to="/create-post" label={t('create')} visibilityClasses="d-none d-sm-block d-md-block" />
                    <MemoizedNavLink to="/my-posts" label={t('my_articles')} visibilityClasses="d-none d-sm-block d-md-block" />
                </nav>
                <Button 
                    variant={`outline-${theme === 'dark' ? 'light' : 'dark'}`} 
                    className="d-md-none" 
                    onClick={() => setShowMenu(true)}
                >
                    ☰
                </Button>

                <nav className="d-none d-md-flex align-items-center">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                    {auth ? (
                        <Dropdown className="ms-3" align="end">
                            <Dropdown.Toggle 
                                variant="link" id="dropdown-basic" 
                                className="d-flex align-items-center link-body-emphasis text-decoration-none p-0 border-0"
                            >
                                <span className="d-none d-md-inline fw-bold pe-2">{auth.username}</span>
                                
                            <UserAvatar 
                                src={auth.profile_picture} 
                                size={32} 
                            />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item as={NavLink} to={`/profile/${auth.username}`}>
                                    {t('profile')}
                                </Dropdown.Item>
                                <Dropdown.Item as={NavLink} to="/account">{t('account')}</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item onClick={logout}>{t('sign_out')}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    ) : (
                        <Button 
                            variant={`outline-${theme === 'dark' ? 'light' : 'dark'}`} 
                            className='fw-bold ms-2' 
                            onClick={handleAuthModalShow}
                        >
                            {t('login')}
                        </Button>
                    )}
                </nav>
            </div>

            <Offcanvas show={showMenu} onHide={() => setShowMenu(false)} placement="end">
                <Offcanvas.Header className='border-bottom' closeButton>
                    <Offcanvas.Title>OmniSphere</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className='d-flex flex-column'>
                    <nav className="nav flex-column flex-grow-1">
                        {auth ? (
                            <>
                                <div className='d-flex flex-column align-items-center mb-3'>
                                    <UserAvatar 
                                        src={auth.profile_picture} 
                                        size={64} 
                                    />
                                    <h5 className="mb-2"><strong>{auth.username}</strong></h5>
                                </div>

                                <div className="border-top pt-3 mb-3">
                                    
                                {navLinks.map(({ to, icon, label }) => (
                                    <Nav.Link
                                        key={to}
                                        as={NavLink}
                                        to={to}
                                        className="d-flex align-items-center callout me-3"
                                    >
                                        <span className={`bi ${icon} me-2`}></span> {label}
                                    </Nav.Link>
                                ))}
                                </div>
                    
                                <div className="mt-auto mb-3">
                                    <Button variant="outline-danger" className="w-100" onClick={logout}>
                                        {t('sign_out')}
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                            {navLinks.map(({ to, icon, label }) => (
                                <Nav.Link
                                    key={to}
                                    as={NavLink}
                                    to={to}
                                    className="d-flex align-items-center callout me-3"
                                >
                                    <span className={`bi ${icon} me-2`}></span> {label}
                                </Nav.Link>
                            ))}
                            <div className="mt-auto mb-3">
                                <Button 
                                    variant={`outline-${theme === 'dark' ? 'light' : 'dark'}`} 
                                    className="w-100 fw-bold" 
                                    onClick={() => {
                                        setShowMenu(false);
                                        handleAuthModalShow();
                                    }}
                                >
                                    {t('login')}
                                </Button>
                            </div>
                            </>
                        )}
                        <div className="border-top pt-3 mb-3">
                            <div className="d-flex justify-content-around align-items-center">
                                <div className="text-center">
                                    <div className="small mt-1">{t('theme')}</div>
                                    <ThemeSwitcher />
                                </div>
                                <div className="vr d-flex mx-3"></div>
                                <div className="text-center">
                                    <div className="small mt-1">{t('language')}</div>
                                    <LanguageSwitcher />
                                </div>
                            </div>
                        </div>
                    </nav>
                </Offcanvas.Body>
            </Offcanvas>

            <Suspense>
                <AuthModal show={showAuthModal} onHide={handleAuthModalClose} />
            </Suspense>
        </header>
    );
}

export default Header;
