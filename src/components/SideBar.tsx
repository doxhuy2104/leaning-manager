"use client";

import { useAuth } from "@/contexts/AuthContext";
import {
    ClipboardCheck,
    GraduationCap,
    History,
    LayoutDashboard,
    LogOut,
    Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: "/", active: true },
    { title: "Exams", icon: ClipboardCheck, href: "/exams" },
    { title: "History", icon: History, href: "/histories" },
    // { title: "Courses", icon: Book, href: "/courses" },
    { title: "Users", icon: Users, href: "/users" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { signOut } = useAuth();

    return (
        <aside className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
            <div className="flex flex-col px-6 pt-6 pb-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">ExamManager</span>
                </div>

            </div>

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

            <div className="px-4 py-4 border-t border-gray-200">
                <button
                    onClick={async () => {
                        try {
                            await signOut();
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside >
    );
}

