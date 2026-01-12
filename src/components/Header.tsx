"use client";

import { useAuth } from "@/contexts/AuthContext";

export function Header() {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-2xl text-xl font-bold text-gray-800">
                </div>

                <div className="flex items-center gap-4 ml-6">
                    {/* <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                        <Plus className="w-4 h-4" />
                        Create Exam
                    </button> */}


                    <div className="flex items-center gap-3 pl-4 ">
                        <div className="flex-1 min-w-0 text-right">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {user?.fullName || "Admin User"}
                            </p>

                        </div>
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {user?.avatar ? (
                                <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" />
                            ) : (
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

