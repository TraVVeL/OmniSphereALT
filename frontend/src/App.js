import React from 'react';
import { Route, Navigate, Routes, BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';

import { Header, Footer, PageNotFound } from './common';


import Post from './components/Post/forms/Post';
import { CreatePost}  from './components/Post/forms/CreatePost';
import { Account, Profile, ChangePassword, Integration, PublicProfile, Social } from './components/Account';
import { AuthProvider, ThemeProvider } from './contexts';
import { MilkdownProvider } from "@milkdown/react";


import { ToastProvider } from './common/Toast';

function App() {
    
    return (
        <ToastProvider>
            <MilkdownProvider>
            <Router>
                <AuthProvider secureMethods={true}>
                    <ThemeProvider secureMethods={true}>
                        <Header />
                        <main className='cover-container w-100 mx-auto flex-1 mb-5'>
                            <Routes>
                                <Route path="/" element={<Post />} />
                                <Route path="/create-post" element={<CreatePost />} />
                                <Route path="/my-posts" element={<Post />} />
                                <Route path="/profile/:username" element={<PublicProfile />} />
                                <Route path="/account" element={<Account />}>
                                    <Route index element={<Navigate to="profile" replace />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route path="change-password" element={<ChangePassword />} />
                                    <Route path="integration" element={<Integration />} />
                                    <Route path="social" element={<Social />} />
                                </Route>
                                <Route path="*" element={<PageNotFound />} />
                            </Routes>
                        </main>
                        <Footer />
                    </ThemeProvider>
                </AuthProvider>
            </Router>
            </MilkdownProvider>
        </ToastProvider>
    );
}

export default App;
