import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setAuth(JSON.parse(storedUser));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setAuth(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        setAuth(null);
    };

    const updateProfile = (updatedData) => {
        const { profile, ...rest } = updatedData;
        const updatedUser = {
            ...auth,
            ...rest,
        };

        localStorage.setItem('user', JSON.stringify(updatedUser));
        setAuth(updatedUser);
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
