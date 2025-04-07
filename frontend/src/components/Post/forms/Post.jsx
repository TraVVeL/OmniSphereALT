import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NoPost from './NoPost';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './postViewerStyle.css'


function Post() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(10);
    const { i18n, t } = useTranslation();

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_BACKEND_URL}/${i18n.language}/api/posts/`,
                );
                setPosts(response.data);
            } catch (error) {
                setError('Error fetching posts');
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, [i18n]);

    const loadMorePosts = () => {
        setPage((prevPage) => prevPage + 1);
    };

    const handlePostsPerPageChange = (event) => {
        setPostsPerPage(Number(event.target.value));
        setPage(1);
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center">
                <div className="text-center">
                    <div className="mt-5 mb-5 fs-3">{t("Loading...")}</div>
                    <div
                        className="spinner-border spinner-border-lg"
                        style={{ width: '7rem', height: '7rem' }}
                        role="status"
                    ></div>
                </div>
            </div>
        );
    }

    if (error && posts.length < 1) {
        return (
            <div className="cover-container d-flex w-100 h-100 mx-auto flex-column">
                <h1>Упс... Ошибочка :(</h1>
                <p className="lead">
                    Произошла ошибка на стороне сервера с выводом постов на
                    странице
                </p>
                <p className="lead">Попробуйте перезагрузить страницу</p>
            </div>
        );
    }

    if (!loading && posts.length < 1) {
        return <NoPost />;
    }

    const displayedPosts = posts.slice(0, page * postsPerPage);

    return (
        <>
            <div className="mb-3">
                <label htmlFor="postsPerPage" className="form-label">
                    Постов на странице:
                </label>
                <select
                    id="postsPerPage"
                    className="form-select"
                    value={postsPerPage}
                    onChange={handlePostsPerPageChange}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>
            {displayedPosts.length > 0 ? (
                <article className="blog-post">
                    <div>
                        {displayedPosts.map((post) => (
                            <div
                                key={post.id}
                                className="p-3 mb-3 post-container"
                            >
                                <h2 className="display-5 link-body-emphasis mb-1">
                                    {post.title}
                                </h2>
                                <div className="post-content">
                                    <div className="editor-style-container">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </article>
            ) : null}
            {displayedPosts.length < posts.length && (
                <div className="d-flex justify-content-center">
                    <button
                        className="btn btn-secondary"
                        onClick={loadMorePosts}
                    >
                        Показать еще
                    </button>
                </div>
            )}
        </>
    );
}

export default Post;
