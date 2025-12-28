"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardCheck,
    Users,
    BookOpen,

    GraduationCap,
    Book
} from "lucide-react";

const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/", active: true },
    { title: "Exams", icon: ClipboardCheck, href: "/exams" },
    { title: "Courses", icon: Book, href: "/courses" },
    { title: "Students", icon: Users, href: "/students" },
    { title: "Question Bank", icon: BookOpen, href: "/question-bank" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
            {/* Logo Section */}
            <div className="flex flex-col px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">ExamManager</span>
                </div>

            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-4 py-4 space-y-1">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href === "/" && pathname === "/");

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                ? "bg-blue-600 text-white"
                                : "text-gray-700 hover:bg-gray-100"
                                }`}
                        >
                            <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-600"}`} />
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
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
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                            Admin User
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            admin@exams.edu
                        </p>
                    </div>
                </div>
            </div>
        </aside >
    );
}

