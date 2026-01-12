
const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL || 'http://localhost:5000';

class ApiClient {
    private baseUrl: string;
    private token: string | null = null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        if (typeof window !== 'undefined') {
            this.token = localStorage.getItem('accessToken');
        }
    }

    setToken(token: string | null) {
        this.token = token;
        if (typeof window !== 'undefined') {
            if (token) {
                localStorage.setItem('accessToken', token);
            } else {
                localStorage.removeItem('accessToken');
            }
        }
    }

    private publicEndpoints = ['/auth/login', '/auth/register'];

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`;
        const isPublicEndpoint = this.publicEndpoints.some(pe => endpoint.startsWith(pe));

        let token = this.token;
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('accessToken');
            if (storedToken) {
                this.token = storedToken;
                token = storedToken;
            }
        }

        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string> || {}),
        };

        if (token) {
            headers['Authorization'] = token;
        } else if (!isPublicEndpoint) {
            console.error('Missing token for request to:', endpoint);
            throw new Error('Missing token. Please login again.');
        }

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            if (response.status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('accessToken');
                    this.token = null;
                }
                const error = await response.json().catch(() => ({ message: 'Invalid or expired token' }));
                throw new Error(error.message || 'Invalid or expired token');
            }
            const error = await response.json().catch(() => ({ message: 'An error occurred' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    }

    async get<T>(endpoint: string, params?: Record<string, any>, options?: RequestInit): Promise<T> {
        const queryString = params
            ? '?' + new URLSearchParams(params).toString()
            : '';
        return this.request<T>(endpoint + queryString, { method: 'GET', ...options });
    }

    async post<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async patch<T>(endpoint: string, data?: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
