"use client";

import { Header } from "@/components/Header";
import { Sidebar } from "@/components/SideBar";
import { usePathname } from "next/navigation";

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith("/sign-in") || pathname?.startsWith("/sign-in");

    if (isAuthPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col bg-gray-50">
                <Header />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
