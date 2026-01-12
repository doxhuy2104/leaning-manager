import { apiClient } from './client';

export const adminApi = {
    getDashboardData: async (headers?: any) => {
        return apiClient.get<any>('/admin', undefined, { headers });
    },
    getRecentHistories: async (page = 1, limit = 5, headers?: any) => {
        return apiClient.get<any>(`/admin/histories?page=${page}&limit=${limit}`, undefined, { headers });
    },
    getHistories: async (page = 1, limit = 10, headers?: any) => {
        return apiClient.get<any>(`/admin/histories?page=${page}&limit=${limit}`, undefined, { headers });
    },
    getUsers: async (page = 1, limit = 10, headers?: any) => {
        return apiClient.get<any>(`/admin/users?page=${page}&limit=${limit}`, undefined, { headers });
    },
    getExams: async (page = 1, limit = 10, headers?: any) => {
        return apiClient.get<any>(`/admin/exams?page=${page}&limit=${limit}`, undefined, { headers });
    },
    getCourses: async (page = 1, limit = 10, headers?: any) => {
        return apiClient.get<any>(`/admin/courses?page=${page}&limit=${limit}`, undefined, { headers });
    },
    getSubjects: async (page = 1, limit = 100, headers?: any) => {
        return apiClient.get<any>(`/admin/subjects?page=${page}&limit=${limit}`, undefined, { headers });
    },
    getExamsBySubject: async (subjectId: number, page = 1, limit = 10, headers?: any) => {
        return apiClient.get<any>(`/admin/exams/subject/${subjectId}?page=${page}&limit=${limit}`, undefined, { headers });
    },
    getQuestionsByExamId: async (examId: number, headers?: any) => {
        return apiClient.get<any>(`/admin/questions/exam/${examId}`, undefined, { headers });
    },

    uploadExamPdf: async (subjectId: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('subjectId', subjectId.toString());

        // Get token from localStorage
        let token = '';
        if (typeof window !== 'undefined') {
            token = localStorage.getItem('accessToken') || '';
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/admin/upload`, {
            method: 'POST',
            headers: {
                'Authorization': token,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(error.message || `Upload failed: ${response.status}`);
        }

        return response.json();
    },

    updateQuestion: async (questionId: number, data: { explanation?: string }, headers?: any) => {
        return apiClient.patch<any>(`/question/${questionId}`, data);
    },

    updateAnswer: async (answerId: number, data: { content?: string; isCorrect?: boolean }, headers?: any) => {
        return apiClient.patch<any>(`/answer/${answerId}`, data);
    },
};
