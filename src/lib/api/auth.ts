// Authentication API

import { User } from '@/types/models';
import { apiClient } from './client';

export interface SignInRequest {
    idToken: string;
    type: 'email' | 'GOOGLE';
}

export interface SignUpRequest {
    idToken: string;
    fullName: string;
}

export interface EmailSignInRequest {
    email: string;
    password: string;
}

export const authApi = {
    signInWithIdToken: async (data: SignInRequest): Promise<{ user: User; token: string }> => {
        const response = await apiClient.post<{ user: User; token: string }>( // Fixed naming 'token' per backend response
            '/auth/login',
            { idToken: data.idToken, type: data.type }
        );

        const token = (response as any).token || (response as any).accessToken;

        apiClient.setToken(token);
        return { user: response.user, token: token };
    },

    signInWithEmail: async (data: EmailSignInRequest): Promise<{ user: User; token: string }> => {
        try {
            // Try direct email/password endpoint first
            const response = await apiClient.post<{ user: User; token: string }>(
                '/auth/login',
                { email: data.email, password: data.password }
            );
            const token = (response as any).token || (response as any).accessToken;

            apiClient.setToken(token);
            return { user: response.user, token: token };
        } catch (error: any) {
            // If direct login fails, might need Firebase Auth first
            throw new Error(error.message || 'Đăng nhập thất bại');
        }
    },

    signUp: async (data: SignUpRequest): Promise<{ user: User; token: string }> => {
        const response = await apiClient.post<{ user: User; token: string }>(
            '/auth/register',
            { idToken: data.idToken, fullName: data.fullName }
        );
        const token = (response as any).token || (response as any).accessToken;
        apiClient.setToken(token);
        return { user: response.user, token: token };
    },

    signOut: async (): Promise<void> => {
        apiClient.setToken(null);
    },
};
