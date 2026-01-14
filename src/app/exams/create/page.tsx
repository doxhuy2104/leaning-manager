'use client';

import { adminApi } from '@/lib/api/admin';
import { ArrowLeft, FileText, Loader2, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function CreateExamPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const subjectIdFromUrl = searchParams.get('subjectId');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [subjects, setSubjects] = useState<any[]>([]);
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjectIdFromUrl || '');
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [loadingSubjects, setLoadingSubjects] = useState(true);

    useEffect(() => {
        loadSubjects();
    }, []);

    // Update selectedSubjectId when URL param changes
    useEffect(() => {
        if (subjectIdFromUrl) {
            setSelectedSubjectId(subjectIdFromUrl);
        }
    }, [subjectIdFromUrl]);

    const loadSubjects = async () => {
        try {
            setLoadingSubjects(true);
            const data = await adminApi.getSubjects();
            setSubjects(data.data || []);
        } catch (error) {
            console.error('Failed to load subjects:', error);
            setError('Không thể tải danh sách môn học');
        } finally {
            setLoadingSubjects(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.type !== 'application/pdf') {
                setError('Chỉ chấp nhận file PDF');
                return;
            }
            if (selectedFile.size > 50 * 1024 * 1024) { // 50MB limit
                setError('File không được vượt quá 50MB');
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            if (droppedFile.type !== 'application/pdf') {
                setError('Chỉ chấp nhận file PDF');
                return;
            }
            if (droppedFile.size > 50 * 1024 * 1024) {
                setError('File không được vượt quá 50MB');
                return;
            }
            setFile(droppedFile);
            setError(null);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!selectedSubjectId) {
            setError('Vui lòng chọn môn học');
            return;
        }

        if (!file) {
            setError('Vui lòng chọn file PDF');
            return;
        }

        try {
            setUploading(true);
            const response = await adminApi.uploadExamPdf(parseInt(selectedSubjectId), file);
            setSuccess(true);

            // Redirect to edit page if we have an ID, otherwise fall back to exams list
            console.log('Upload response:', response);
            const ocrData = response?.ocrResponse;
            const examId = ocrData?.examId || ocrData?.id || ocrData?.data?.id || ocrData?.data?.exam?.id;
            console.log('Extracted examId:', examId);

            setTimeout(() => {
                if (examId) {
                    router.push(`/exams/${examId}/edit`);
                } else {
                    router.push('/exams');
                }
            }, 15000);
        } catch (error: any) {
            console.error('Upload failed:', error);
            setError(error.message || 'Upload thất bại. Vui lòng thử lại.');
        } finally {
            // setUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Get subject name for display
    const selectedSubject = subjects.find(s => s.id.toString() === selectedSubjectId);

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/exams"
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add Exam</h1>

                </div>
            </div>

            {/* {success ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-lg font-semibold text-green-800 mb-2">Successfully uploaded!</h2>
                    <p className="text-green-600">Redirecting to exams list...</p>
                </div>
            ) : ( */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {/* Subject Selection */}
                {/* <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Môn học <span className="text-red-500">*</span>
                        </label>
                        {loadingSubjects ? (
                            <div className="flex items-center gap-2 text-gray-500">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Đang tải danh sách môn học...
                            </div>
                        ) : (
                            <select
                                value={selectedSubjectId}
                                onChange={(e) => setSelectedSubjectId(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                disabled={uploading}
                            >
                                <option value="">-- Chọn môn học --</option>
                                {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                        {subject.title}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div> */}

                {/* File Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Exam File (PDF)
                    </label>
                    <div
                        onClick={() => !uploading && fileInputRef.current?.click()}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                                ${file ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'}
                                ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            className="hidden"
                            disabled={uploading}
                        />

                        {file ? (
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">{file.name}</p>
                                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 mb-2">
                                    Drag and drop PDF file here or <span className="text-blue-600 font-medium">select file</span>
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                    {/* <Link
                            href="/exams"
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium text-center hover:bg-gray-50 transition-colors"
                        >
                            Hủy
                        </Link> */}
                    <button
                        type="submit"
                        disabled={uploading || !file || !selectedSubjectId}
                        className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Upload Exam
                            </>
                        )}
                    </button>
                </div>
            </form>
            {/* )} */}
        </div>
    );
}
