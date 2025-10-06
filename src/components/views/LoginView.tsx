import React from 'react';
import Icon from '../Icon';

const LoginView: React.FC = () => {
    // In a real app, these URLs would be fetched from your authentication server
    // or constructed with client_id and redirect_uri from .env files.
    const googleLoginUrl = import.meta.env.VITE_GOOGLE_LOGIN_URL || '#';
    const githubLoginUrl = import.meta.env.VITE_GITHUB_LOGIN_URL || '#';

    const btnBaseClasses = "w-full flex items-center justify-center px-6 py-3 border rounded-lg shadow-sm text-sm font-medium transition-colors duration-200 ease-in-out";
    const btnGoogleClasses = "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700";
    const btnGithubClasses = "bg-gray-900 text-white hover:bg-gray-700 border-transparent dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300";


    return (
        <div className="min-h-screen bg-bg-subtle flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto bg-surface rounded-2xl shadow-lg p-8 space-y-8">
                <div className="text-center">
                     <h1 className="text-3xl font-bold font-heading text-text-primary flex items-center justify-center">
                        <Icon name="notebook" className="w-8 h-8 text-primary mr-3" />
                        <span>UnicornXOSW</span>
                    </h1>
                    <p className="mt-2 text-text-secondary">
                        เข้าสู่ระบบเพื่อเริ่มต้นการสร้างสรรค์ผลงานของคุณ
                    </p>
                </div>

                <div className="space-y-4">
                    <a
                        href={googleLoginUrl}
                        className={`${btnBaseClasses} ${btnGoogleClasses}`}
                    >
                        <Icon name="google" className="w-5 h-5 mr-3" />
                        เข้าสู่ระบบด้วย Google
                    </a>
                    <a
                        href={githubLoginUrl}
                        className={`${btnBaseClasses} ${btnGithubClasses}`}
                    >
                        <Icon name="github" className="w-5 h-5 mr-3" />
                        เข้าสู่ระบบด้วย GitHub
                    </a>
                </div>

                 <div className="text-center text-xs text-text-disabled">
                    <p>
                        โดยการเข้าสู่ระบบ, คุณยอมรับข้อตกลงการใช้งานและนโยบายความเป็นส่วนตัวของเรา
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginView;