'use client';

import { useAuth } from '@/contexts/AuthContext';
import { adminApi } from '@/lib/api/admin';
import {
    FileText,
    History,
    Users
} from "lucide-react";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/sign-in');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            loadData();
        }
    }, [user]);

    const loadData = async () => {
        try {

            const [dashboardData,] = await Promise.all([
                adminApi.getDashboardData(),
            ]);
            setData(dashboardData);
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || (loading && !data)) {
        return <div className="p-8 text-center">Loading dashboard...</div>;
    }

    if (!data) {
        return (
            <div className="p-8 text-center text-red-500">
                <h2 className="text-2xl font-bold">Connection Error</h2>
                <p>Could not load dashboard data.</p>
                <button onClick={() => loadData()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Retry</button>
            </div>
        );
    }

    const { totals, analytics } = data;

    const stats = [
        {
            title: "Total Users",
            value: totals.users,
            icon: Users,
        },
        {
            title: "Exams",
            value: totals.exams,
            icon: FileText,
        },
        {
            title: "Total Attempts",
            value: totals.examHistories,
            icon: History,
        },
    ];

    return (
        <div className="p-8 space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        {stat.title}
                                    </p>
                                    <h3 className="text-3xl font-bold text-gray-900 mt-2">
                                        {stat.value}
                                    </h3>
                                </div>
                                <div className={`p-3 rounded-lg`}>
                                    <Icon className={`w-12 h-12 text-blue-500`} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900">
                        Recent Exam Activity
                    </h3>

                    {recentActivity.length > 0 ? (
                        <div className="overflow-hidden">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Exam</th>
                                        <th className="px-4 py-3">Score</th>
                                        <th className="px-4 py-3">Time Spent</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {recentActivity.map((history: any) => (
                                        <tr key={history.id} className="bg-white hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium text-gray-900">
                                                {history.exam?.title || "Unknown Exam"}
                                            </td>
                                            <td className="px-4 py-3">
                                                {history.score !== null ? (
                                                    <span className={`font-semibold ${history.score >= 5 ? 'text-green-600' : 'text-blue-600'}`}>
                                                        {history.score}
                                                    </span>
                                                ) : "N/A"}
                                            </td>
                                            <td className="px-4 py-3 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {history.timeSpent ? `${Math.floor(history.timeSpent / 60)}m` : "N/A"}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            <div className="flex items-center justify-between mt-4 px-4 py-3 border-t border-gray-100">
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
                    ) : (
                        <p className="text-gray-500 italic">No recent activity logs available.</p>
                    )}
                </div>

            </div> */}
        </div>
    );
}
