import React, { useEffect } from 'react';
import Icon from '../Icon';

const OAuthCallbackView: React.FC = () => {

    useEffect(() => {
        // In a real application, you would exchange the code from the URL query params
        // with your backend server to get a JWT.
        // For this mock, we'll just simulate a delay and then set the auth flag.
        console.log("Callback view mounted. Simulating auth process...");
        const timer = setTimeout(() => {
            // 1. Set the flag in localStorage to mock authentication
            localStorage.setItem("isAuthenticated", "true");

            // 2. Redirect to the main app page
            window.location.href = '/';
        }, 1500); // 1.5-second delay to simulate network request

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-bg-subtle flex flex-col justify-center items-center p-4 text-text-primary">
            <div className="text-center">
                <Icon name="loader-circle" className="animate-spin h-12 w-12 text-primary mx-auto" />
                <h1 className="text-2xl font-bold font-heading mt-6">
                    กำลังยืนยันตัวตน...
                </h1>
                <p className="mt-2 text-text-secondary">
                    กรุณารอสักครู่ ระบบกำลังนำคุณเข้าสู่ระบบ
                </p>
            </div>
        </div>
    );
};

export default OAuthCallbackView;