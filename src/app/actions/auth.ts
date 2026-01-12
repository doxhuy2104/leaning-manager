"use server";

import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;

export async function loginAction(idToken: string) {
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            console.error("Login failed:", errorData || res.statusText);
            return { error: "Login failed via Backend" };
        }

        const data = await res.json();
        const accessToken = data.token; // Changed from data.accessToken to data.token based on auth.service.ts response

        if (!accessToken) {
            return { error: "No access token returned" };
        }


        return { token: accessToken, success: true };

    } catch (error) {
        console.error("Login Action Error:", error);
        return { error: "Internal Server Error" };
    }
}

export async function logoutAction() {
    redirect("/sign-in");
}
