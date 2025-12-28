"use client";

import { Search, Bell, Plus } from "lucide-react";

export function Header() {
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Search Bar */}
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search exams, students, or questions..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-4 ml-6">
                    {/* Notification Bell */}
                    <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
                    </button>

                    {/* Create Exam Button */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                        <Plus className="w-4 h-4" />
                        Create Exam
                    </button>
                </div>
            </div>
        </header>
    );
}

