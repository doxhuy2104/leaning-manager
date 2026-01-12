// Exam API

import { Course, Exam, ExamHistory, Question, UserAnswer } from '@/types/models';
import { apiClient } from './client';

export const examApi = {
    getExams: async (subjectId: number): Promise<Exam[]> => {
        const response = await apiClient.get<{ data: Exam[] } | Exam[]>(
            `/course/subject/${subjectId}`,
            { isExam: 'true' }
        );
        // Handle both wrapped and direct array responses
        if (Array.isArray(response)) {
            return response;
        }
        return response.data || [];
    },

    getCourses: async (subjectId: number): Promise<Course[]> => {
        const response = await apiClient.get<{ data: Course[] } | Course[]>(
            `/course/subject/${subjectId}`,
            { isExam: 'true' }
        );
        // Handle both wrapped and direct array responses
        if (Array.isArray(response)) {
            return response;
        }
        return response.data || [];
    },

    getExamQuestions: async (
        examId: number,
        page: number = 1,
        limit: number = 100
    ): Promise<Question[]> => {
        const response = await apiClient.get<{ data: Question[] } | Question[]>(
            `/question/subject/${examId}`,
            { page, limit }
        );
        // Handle both wrapped and direct array responses
        if (Array.isArray(response)) {
            return response;
        }
        return response.data || [];
    },

    submitExam: async (data: {
        examId: number;
        timeSpent: number;
        subjectId: number;
        userAnswers: UserAnswer[];
    }): Promise<ExamHistory> => {
        const response = await apiClient.post<ExamHistory>('/history/submit', data);
        return response;
    },

    getHistories: async (): Promise<ExamHistory[]> => {
        const response = await apiClient.get<{ data: ExamHistory[] } | ExamHistory[]>('/history');
        // Handle both wrapped and direct array responses
        if (Array.isArray(response)) {
            return response;
        }
        return response.data || [];
    },

    getHistoryAnswers: async (
        historyId: number,
        examId: number
    ): Promise<any> => {
        const response = await apiClient.get('/history/answers', {
            historyId,
            examId,
        });
        return response;
    },
};
