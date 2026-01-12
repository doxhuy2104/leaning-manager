"use client";

import { loginAction } from "@/app/actions/auth";
import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AlertCircle, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function SignInPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!auth) {
                throw new Error("Firebase not initialized");
            }

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            const result = await loginAction(idToken);

            if (result?.error) {
                setError(result.error);
            } else if (result?.token) {
                if (typeof window !== 'undefined') {
                    localStorage.setItem('accessToken', result.token);
                    const { apiClient } = await import('@/lib/api/client');
                    apiClient.setToken(result.token);
                    window.location.href = '/';
                }
            }
        } catch (err: any) {
            if (err.message === "NEXT_REDIRECT") {
                return;
            }
            console.error(err);
            if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found") {
                setError("Invalid email or password.");
            } else if (err.code === "auth/api-key-not-valid-please-pass-a-valid-api-key") {
                setError("System Error: Firebase Configuration Missing. Please contact admin.");
            } else {
                setError(err.message || "Failed to login.");
            }
        } finally {
            if (!error) setLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-white">
            <div className="w-full max-w-md p-8 relative z-10 mx-4">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2 text-blue-600 font-bold text-2xl">
                        <span>THPTQG Manager</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <div className="relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="admin@example.com"
                                required
                                className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                className="w-full px-4 py-3 pl-11 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                            <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`group w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                        {/* {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />} */}
                    </button>
                </form>
            </div>
        </div>
    );
}
