'use client';

import { logoutAction } from '@/app/actions/auth';
import { authApi } from '@/lib/api/auth';
import { apiClient } from '@/lib/api/client';
import { auth } from '@/lib/firebase/config';
import { User } from '@/types/models';
import {
    User as FirebaseUser,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('accessToken');

            if (storedUser && storedToken) {
                try {
                    setUser(JSON.parse(storedUser));
                    apiClient.setToken(storedToken);
                } catch (error) {
                    console.error('Failed to parse stored user:', error);
                }
            }
            setLoading(false);
        }

        if (!auth) return;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
            if (firebaseUser) {
                const storedToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;

                if (storedToken && storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                        apiClient.setToken(storedToken);
                        setLoading(false);
                        return;
                    } catch (error) {
                        console.error('Failed to parse stored user:', error);
                    }
                }

                try {
                    const idToken = await firebaseUser.getIdToken();
                    const result = await authApi.signInWithIdToken({
                        idToken,
                        type: firebaseUser.providerData[0]?.providerId === 'google.com' ? 'GOOGLE' : 'email',
                    });
                    setUser(result.user);
                    apiClient.setToken(result.token);
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('user', JSON.stringify(result.user));
                        localStorage.setItem('accessToken', result.token);
                    }
                } catch (error) {
                    console.error('Failed to sync with backend:', error);
                    if (typeof window !== 'undefined') {
                        const storedUser = localStorage.getItem('user');
                        if (storedUser) {
                            setUser(JSON.parse(storedUser));
                        }
                    }
                }
            } else {
                setUser(null);
                apiClient.setToken(null);
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('user');
                    localStorage.removeItem('accessToken');
                }
            }
            if (typeof window !== 'undefined') {
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        try {
            const firebaseUserCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await firebaseUserCredential.user.getIdToken();

            const result = await authApi.signInWithIdToken({
                idToken,
                type: 'email',
            });

            setUser(result.user);
            apiClient.setToken(result.token);
            if (typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('accessToken', result.token);
            }
        } catch (error: any) {
            if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                throw new Error('Email hoặc mật khẩu không đúng');
            }
            if (error.code === 'auth/network-request-failed') {
                throw new Error('Lỗi kết nối mạng. Vui lòng thử lại');
            }
            if (error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
                throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra lại cấu hình API_URL trong file .env');
            }
            throw new Error(error.message || 'Đăng nhập thất bại');
        }
    };

    const signOut = async () => {
        try {
            setUser(null);
            apiClient.setToken(null);

            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
            }

            if (auth) {
                try {
                    await firebaseSignOut(auth);
                } catch (firebaseError) {
                    console.error('Firebase sign out error:', firebaseError);
                }
            }

            try {
                await authApi.signOut();
            } catch (apiError) {
                console.error('API sign out error:', apiError);
            }

            console.log('Sign out successfully');

            try {
                await logoutAction();
            } catch (error) {
                console.error('Server logout action failed, using client redirect:', error);
                if (typeof window !== 'undefined') {
                    window.location.href = '/sign-in';
                }
            }
        } catch (error) {
            console.error('Sign out error:', error);
            setUser(null);
            apiClient.setToken(null);
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');

                try {
                    await logoutAction();
                } catch {
                    window.location.href = '/sign-in';
                }
            }
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
