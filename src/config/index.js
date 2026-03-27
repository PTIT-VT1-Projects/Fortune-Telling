// Configuration for the Face Analyzer application
const config = {
    // API configuration
        vendor: import.meta.env.VITE_AI_VENDOR || 'gemini',
        ai: {
            gemini: {
                api: {
                    key: import.meta.env.VITE_GEMINI_API_KEY,
                    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent'
                },
            },
            deepseek: {
                api: {
                    key: import.meta.env.VITE_DEEPSEEK_API_KEY,
                    url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"
                },
            }
        },
        // Image processing configuration
        imageProcessing: {
            maxSizeInBytes: 20 * 1024 * 1024, // 20MB
            acceptedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/webp'],
            compressionQuality: 0.8,
        },
    
        // Application settings
        appSettings: {
            appName: import.meta.env.VITE_APP_NAME || "Face Insights AI",
            appVersion: import.meta.env.VITE_APP_VERSION || "1.2.3",
            companyName: import.meta.env.VITE_APP_COMPANY || "camnh",
            copyrightYear: import.meta.env.VITE_APP_COPYRIGHT_YEAR || "2025"
        }
};

const createAppRequest = async (bodyData, timeout) => {
    switch(config.vendor) {
        case 'gemini': {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout); // 30 second timeout
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${config.ai.gemini.api.key}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: bodyData,
                signal: controller.signal
            });
            clearTimeout(timeoutId)
            return response;
        }
        case 'deepseek': {
            return 'https://api.deepseek.com/chat/completions'
        }
    }
}

export {config, createAppRequest};