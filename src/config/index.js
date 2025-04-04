// Configuration for the Face Analyzer application
const config = {
    // API configuration
        api: {
            key: "AIzaSyBapSJbkMr9XQeAJq7b7DRPFZJEwZjJLg4",
            url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
        },
    
        // Image processing configuration
        imageProcessing: {
            maxSizeInBytes: 20 * 1024 * 1024, // 20MB
            acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/webp'],
            compressionQuality: 0.8,
        },
    
        // Application settings
        appSettings: {
            appName: import.meta.env.REACT_APP_NAME || "Face Insights AI",
            appVersion: import.meta.env.REACT_APP_VERSION || "1.2.3",
            companyName: import.meta.env.REACT_APP_COMPANY || "camnh",
            copyrightYear: import.meta.env.REACT_APP_COPYRIGHT_YEAR || "2025"
        }
};

export default config;