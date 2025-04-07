import React from "react";
import { Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';

import {
    TelegramSvgIcon,
    GitHubSvgIcon,
    GoogleSvgIcon,
} from "../assets/Icons";

const socialLinks = [
    { href: "https://t.me/TraVVe1/", icon: <TelegramSvgIcon width={36} height={36}/> },
    { href: "https://www.google.com/", icon: <GoogleSvgIcon width={36} height={36}/> },
    { href: "https://github.com/TraVVeL", icon: <GitHubSvgIcon width={36} height={36}/> },
];

const usefulLinksLeft = [
    { href: "https://master--redis-doc.netlify.app/docs/", text: "Redis" },
    { href: "https://www.docker.com/", text: "Docker" },
    { href: "https://cloudpub.ru/", text: "Cloudpub" },
    { href: "https://github.com/", text: "GitHub" },
];

const usefulLinksRight = [
    { href: "https://www.django-rest-framework.org/", text: "Django DRF" },
    { href: "https://www.djangoproject.com/", text: "Django" },
    { href: "https://react.dev/", text: "React" },
    { href: "https://www.mysql.com/", text: "MySQL" },
];
const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="text-muted" style={{ background: "var(--bs-dark-bg-subtle)" }}>
            <div className="mb-3 py-3 w-100 border-bottom">
                <div className="cover-container mx-auto d-flex flex-column flex-sm-row justify-content-between align-items-center text-center gap-3">
                    <span className="fw-bold">{t("footer_social_text")}</span>
                    <div className="d-flex gap-3">
                        {socialLinks.map((link, index) => (
                            <a key={index} href={link.href}  target="_blank" rel="noreferrer" className="text-reset item-grow item-grow-md">
                                {link.icon}
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <section>
                <div className="cover-container text-center text-md-start mt-5 mx-auto">
                    <Row className="mt-3 d-flex justify-content-between w-100 mx-auto">
                        <Col md={8} className="mb-3 ps-0">
                            <h6 className="text-uppercase fw-bold border-bottom pb-2">
                                {t("footer_about_title")}
                            </h6>
                            <p>
                                <p>{t("footer_about_text")}</p>
                            </p>
                        </Col>
                        <Col md={4} className="mb-3 pe-0">
                            <h6 className="text-uppercase fw-bold border-bottom pb-2">
                                {t("footer_useful_links")}
                            </h6>
                            <div className="row">
                                <Col xs={6} className="border-end">
                                    {usefulLinksLeft.map((link, index) => (
                                        <p key={index}>
                                            <a href={link.href} target="_blank" rel="noreferrer" className="text-reset">
                                                {link.text}
                                            </a>
                                        </p>
                                    ))}
                                </Col>
                                <Col xs={6} className="text-center text-md-end">
                                    {usefulLinksRight.map((link, index) => (
                                        <p key={index}>
                                            <a href={link.href} target="_blank" rel="noreferrer"className="text-reset">
                                                {link.text}
                                            </a>
                                        </p>
                                    ))}
                                </Col>
                            </div>
                        </Col>
                    </Row>
                </div>
            </section>

            <div className="text-center p-4" style={{ backgroundColor: "rgba(0, 0, 0, 0.15)" }}>
                © {new Date().getFullYear()} {t("footer_copyright")}:&nbsp;
                <a className="text-reset fw-bold" href="https://omnisphere.cloudpub.ru/">
                    OmniSphere
                </a>
            </div>
        </footer>
    );
};

export default Footer;
