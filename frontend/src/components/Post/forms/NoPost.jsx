import React from "react";
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NoPost() {
    const { t } = useTranslation();
    return (
        <div className="d-flex col align-items-center justify-content-center flex-column text-center" style={{ height: '50vh'}}>
            <h1>{t('create_your_article')}</h1>
            <p className="lead">{t('no_post_yet')}</p>
            <p className="lead">
                <NavLink as="button" className="btn btn-lg fw-bold btn-light-theme item-grow" to="/create-post">{t('write_an_article')}</NavLink>
            </p>
        </div>
    )
}

export default NoPost;
