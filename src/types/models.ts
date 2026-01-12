
export interface User {
    id?: number;
    avatar?: string;
    fullName?: string;
    accessToken?: string;
    email?: string;
    loginType?: string;
    group?: Group;
}

export interface Group {
    id?: number;
    name?: string;
    subjects?: Subject[];
}

export interface Subject {
    id?: number;
    title?: string;
    image?: string;
}

export interface Exam {
    id?: number;
    lessonId?: number;
    subjectId?: number;
    courseId?: number;
    title?: string;
    url?: string;
    orderIndex?: number;
    duration?: number; // in minutes
}

export interface Question {
    id?: number;
    examId?: number;
    paragraphId?: number;
    type?: 'choice' | 'true_false' | 'short_answer';
    content?: string;
    dataType?: string;
    answers?: Answer[];
    explanation?: string;
    orderIndex?: number;
    shortAnswer?: string;
}

export interface Answer {
    id?: number;
    questionId?: number;
    orderIndex?: number;
    isCorrect?: boolean;
    content?: string;
}

export interface UserAnswer {
    examId: number;
    questionOrderIndex: number;
    answerOrderIndex?: number | null;
    shortAnswer?: string | null;
    trueFalseAnswer?: string | null;
    isCorrect?: boolean | null;
}

export interface ExamHistory {
    id?: number;
    examId?: number;
    exam?: Exam;
    score?: number;
    timeSpent?: number; // in seconds
    createdAt?: string;
}

export interface Course {
    id?: number;
    title?: string;
    url?: string;
    isExam?: boolean;
    lessons?: Lesson[];
}

export interface Lesson {
    id?: number;
    courseId?: number;
    subjectId?: number;
    title?: string;
    url?: string;
    orderIndex?: number;
    exams?: Exam[];
}
