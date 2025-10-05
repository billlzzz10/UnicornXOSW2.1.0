import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WriterSuite from "./src/components/WriterSuite";
import LoginView from "./src/components/views/LoginView";
import OAuthCallbackView from "./src/components/views/OAuthCallbackView";
import Header from "./src/components/Header";

const isAuthenticated = (): boolean => {
    try {
        if (typeof window === "undefined") return false;
        // Prefer an auth token when available; fall back to legacy boolean flag.
        const token = localStorage.getItem("authToken");
        if (token && token.trim() !== "") return true;
        return localStorage.getItem("isAuthenticated") === "true";
    } catch (e) {
        // localStorage can throw in some environments (e.g. private mode or SSR), treat as unauthenticated.
        return false;
    }
};

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return (
        <div>
            <Header />
            <main className="p-6 max-w-5xl mx-auto">
                {children}
            </main>
        </div>
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginView />} />
                <Route path="/auth/callback" element={<OAuthCallbackView />} />
                <Route
                    path="/"
                    element={
                        <ProtectedLayout>
                            <WriterSuite />
                        </ProtectedLayout>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}