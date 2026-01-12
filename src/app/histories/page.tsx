'use client';

import { adminApi } from '@/lib/api/admin';
import { ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import { useEffect, useState } from 'react';

export default function HistoriesPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10;

    useEffect(() => {
        loadHistories();
    }, [page]);

    const loadHistories = async () => {
        try {
            if (page === 1) setLoading(true);
            const historyData = await adminApi.getHistories(page, limit);
            setData(historyData);
            setTotalPages(historyData.totalPages || 1);
        } catch (error) {
            console.error("Failed to load histories", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) {
        return <div className="p-8 text-center">Loading histories...</div>;
    }

    if (!data) {
        return <div className="p-8 text-center text-red-500">Failed to load histories.</div>;
    }

    const histories = data.data;

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Exam History</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Exam</th>
                                <th className="px-6 py-4 font-semibold">Score</th>
                                <th className="px-6 py-4 font-semibold">Time spent</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {histories.map((history: any) => (
                                <tr key={history.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 overflow-hidden">
                                                {history.user?.avatar ? (
                                                    <img src={history.user.avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User className="w-4 h-4" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{history.user?.fullName || "Unknown User"}</div>
                                                <div className="text-xs text-gray-500">{history.user?.email || "No email"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-gray-900">{history.exam?.title || "Unknown Exam"}</span>
                                        </div>

                                    </td>
                                    <td className="px-6 py-4">
                                        {history.score !== null ? (
                                            <span className={`font-semibold text-blue-800`}>
                                                {history.score}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 italic">Not graded</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" />
                                            {history.timeSpent ? (
                                                (() => {
                                                    const m = Math.floor(history.timeSpent / 60);
                                                    const s = history.timeSpent % 60;
                                                    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
                                                })()
                                            ) : "N/A"}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {histories.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                        No history records found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <div className="text-sm text-gray-500">
                        Page {page} of {totalPages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>
                        <button
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
