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
        const { url, key } = await apiClient.post<{ url: string; key: string }>('/upload/presigned-url', {
            fileName: file.name,
            fileType: 'pdf',
        });

        const uploadResponse = await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (!uploadResponse.ok) {
            throw new Error(`S3 Upload failed: ${uploadResponse.status}`);
        }

        const ocrResponse = await apiClient.post<any>('/admin/ocr', {
            fileName: file.name,
            subjectId: subjectId,
        });


        return { ocrResponse };
    },

    updateQuestion: async (questionId: number, data: { explanation?: string; shortAnswer?: string; content?: string }, headers?: any) => {
        return apiClient.patch<any>(`/question/${questionId}`, data);
    },

    updateAnswer: async (answerId: number, data: { content?: string; isCorrect?: boolean }, headers?: any) => {
        return apiClient.patch<any>(`/answer/${answerId}`, data);
    },

    getImagesByExamId: async (examId: number, headers?: any) => {
        return apiClient.get<any>(`/admin/images/exam/${examId}`, undefined, { headers });
    },

    deleteExam: async (id: number, headers?: any) => {
        return apiClient.delete<any>(`/admin/exams/${id}`, { headers });
    },

    updateExam: async (id: number, data: any, headers?: any) => {
        return apiClient.patch<any>(`/admin/exams/${id}`, data);
    },
};
