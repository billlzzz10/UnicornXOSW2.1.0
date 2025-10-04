import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import WriterSuite from "./src/components/WriterSuite";
import LoginView from "./src/components/views/LoginView";
import OAuthCallbackView from "./src/components/views/OAuthCallbackView";
import Header from "./src/components/Header";

const isAuthenticated = () => {
    return localStorage.getItem("isAuthenticated") === "true";
};

const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
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