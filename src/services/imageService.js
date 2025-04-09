import AiService from './aiService';

/**
 * Service for handling image processing operations
 */
class ImageService {
    /**
     * Validates an image file
     * @param {File} file - The image file to validate
     * @returns {Object} - Validation result with status and error message if any
     */
    static async validateImage(file) {
    // 1. Perform basic validation
    const basicValidation = this.validateBasic(file);
        if (!basicValidation.isValid) {
            return basicValidation;
        }

        // 2. Convert to base64 for AI validation
        const base64Image = await AiService.fileToBase64(file);

        // 3. Validate with AI
        const aiResult = await AiService.validatePortrait(base64Image, file.type);

        if (!aiResult.isValidPortrait) {
        return {
            isValid: false,
            error: aiResult.validationError || 'Ảnh chân dung không hợp lệ'
        };
        }

        return { isValid: true };
    }

    /**
     * Converts an image file to base64
     * @param {File} file - The image file to convert
     * @returns {Promise<string>} - Base64 encoded image data
     */
    static convertToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
        try {
            // Get the base64 string without the data URL prefix
            const base64String = reader.result.split(',')[1];

            // Verify we have valid base64 data
            if (!base64String || base64String.trim() === '') {
            reject(new Error('Dữ liệu hình ảnh không hợp lệ'));
            return;
            }

            resolve(base64String);
        } catch (error) {
            reject(new Error('Không thể xử lý dữ liệu hình ảnh'));
        }
        };

        reader.onerror = (error) => {
        reject(new Error('Không thể đọc dữ liệu hình ảnh'));
        };

        reader.readAsDataURL(file);
    });
    }

    /**
     * Creates a preview URL for an image file
     * @param {File} file - The image file
     * @returns {Promise<string>} - URL for image preview
     */
    static createPreviewUrl(file) {
    return new Promise((resolve, reject) => {
        try {
        // Use createObjectURL for better performance
        const url = URL.createObjectURL(file);
        resolve(url);
        } catch (error) {
        // Fallback to FileReader if URL.createObjectURL fails
        const reader = new FileReader();
        reader.onload = () => {
            resolve(reader.result);
        };
        reader.onerror = (error) => {
            reject(new Error('Lỗi khi đọc tệp hình ảnh'));
        };
        reader.readAsDataURL(file);
        }
    });
    }

    /**
     * Revokes a previously created object URL to free up memory
     * @param {string} url - The URL to revoke
     */
    static revokePreviewUrl(url) {
    if (url && url.startsWith('blob:')) {
        try {
        URL.revokeObjectURL(url);
        } catch (error) {
            return error;
        }
    }
    }

    /**
     * Preloads an image to ensure it's fully loaded before displaying
     * @param {string} src - The image source URL
     * @returns {Promise<HTMLImageElement>} - The loaded image element
     */
    static preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
            resolve(img);
            };
            img.onerror = (error) => {
                reject(new Error('Không thể tải hình ảnh'));
            };
            img.src = src;
        });
    }

    /**
     * Estimates the API response time based on image size and complexity
     * @param {File} imageFile - The image file being processed
     * @returns {number} - Estimated response time in milliseconds
     */
    static estimateApiResponseTime(imageFile) {
    // Base time for API processing (in milliseconds)
    const baseTime = 5000;

    // Additional time based on file size (larger files take longer)
    // Calculate size factor: 1MB file adds about 2 seconds
    const sizeFactor = (imageFile.size / (1024 * 1024)) * 2000;

    // Add some randomness to make it feel more natural (±20%)
    const randomFactor = 0.8 + (Math.random() * 0.4);

    // Calculate total estimated time
    const estimatedTime = (baseTime + sizeFactor) * randomFactor;

    // Cap the maximum time at 30 seconds
    return Math.min(estimatedTime, 30000);
    }

    /**
     * Creates a realistic loading progress simulation based on estimated API response time
     * @param {Function} setLoadingProgress - Function to update loading progress
     * @param {boolean} loading - Current loading state
     * @param {File} imageFile - The image file being processed
     * @returns {Object} - Timer IDs for cleanup
     */
    static simulateLoadingProgress(setLoadingProgress, loading, imageFile) {
    // Clear any existing timers
    if (this.progressTimers) {
        this.progressTimers.forEach(timer => clearTimeout(timer));
    }

    // Initialize timers array
    this.progressTimers = [];

    // Estimate total API response time
    const estimatedResponseTime = this.estimateApiResponseTime(imageFile);

    // Define progress phases with their relative durations
    const progressPhases = [
        { progress: 10, portion: 0.05 }, // Initial processing - 5% of total time
        { progress: 20, portion: 0.10 }, // Image preparation - 10% of total time
        { progress: 30, portion: 0.10 }, // Sending to API - 10% of total time
        { progress: 40, portion: 0.05 }, // API received - 5% of total time
        { progress: 50, portion: 0.10 }, // API processing - 10% of total time
        { progress: 60, portion: 0.15 }, // Analysis in progress - 15% of total time
        { progress: 70, portion: 0.15 }, // Detailed analysis - 15% of total time
        { progress: 80, portion: 0.15 }, // Generating results - 15% of total time
        { progress: 90, portion: 0.15 }  // Finalizing - 15% of total time
    ];

    // Calculate actual time for each phase
    let accumulatedTime = 0;
    progressPhases.forEach(phase => {
        const phaseTime = estimatedResponseTime * phase.portion;
        accumulatedTime += phaseTime;

        // Set timeout for this phase
        const timerId = setTimeout(() => {
        if (loading) {
            setLoadingProgress(phase.progress);
        }
        }, accumulatedTime);

        this.progressTimers.push(timerId);
    });

    return {
        timers: this.progressTimers,
        estimatedTime: estimatedResponseTime
    };
    }

    /**
     * Scales an image to optimize it for analysis
     * @param {File} file - The image file to scale
     * @param {number} maxWidth - Maximum width for the scaled image
     * @param {number} maxHeight - Maximum height for the scaled image
     * @param {number} quality - JPEG quality (0-1)
     * @returns {Promise<Blob>} - Scaled image as Blob
     */
    static scaleImageForAnalysis(file, maxWidth = 800, maxHeight = 800, quality = 0.9) {
    return new Promise((resolve, reject) => {
        try {
        // Create an image element to load the file
        const img = new Image();
        img.onload = () => {
            // Create a canvas element
            const canvas = document.createElement('canvas');

            // Calculate new dimensions while maintaining aspect ratio
            let width = img.width;
            let height = img.height;

            // Scale down if image exceeds maximum dimensions
            if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.floor(width * ratio);
            height = Math.floor(height * ratio);
            }

            // Set canvas dimensions
            canvas.width = width;
            canvas.height = height;

            // Draw the image on the canvas
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            // Convert canvas to blob
            canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
            } else {
                reject(new Error('Failed to convert canvas to blob'));
            }
            }, 'image/jpeg', quality);
        };

        img.onerror = () => {
            reject(new Error('Failed to load image for scaling'));
        };

        // Load the image from the file
        img.src = URL.createObjectURL(file);
        } catch (error) {
        reject(error);
        }
    });
    }

    /**
     * Prepares an image for analysis by scaling and converting to base64
     * @param {File} file - The image file to prepare
     * @returns {Promise<string>} - Base64 encoded scaled image
     */
    static async prepareImageForAnalysis(file) {
    // eslint-disable-next-line no-useless-catch
    try {
        // Scale the image
        const scaledBlob = await this.scaleImageForAnalysis(file);

        // Convert scaled image to base64
        return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            try {
            // Get the base64 string without the data URL prefix
            const base64String = reader.result.split(',')[1];

            // Verify we have valid base64 data
            if (!base64String || base64String.trim() === '') {
                reject(new Error('Dữ liệu hình ảnh không hợp lệ'));
                return;
            }

            resolve(base64String);
            } catch (error) {
                reject(new Error('Không thể xử lý dữ liệu hình ảnh'));
            }
        };

        reader.onerror = () => {
            reject(new Error('Không thể đọc dữ liệu hình ảnh'));
        };

        reader.readAsDataURL(scaledBlob);
        });
    } catch (error) {
        throw error;
    }
    }

    // Basic validation that doesn't require AI
    static validateBasic(file) {
    // Check if file exists
    if (!file) {
        return {
        isValid: false,
        error: 'Vui lòng chọn file ảnh'
        };
    }

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
        return {
        isValid: false,
        error: 'File đã chọn không phải là ảnh'
        };
    }

    // Check if file format is accepted
    const acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/bmp', 'image/heic', 'image/heif'];
    if (!acceptedTypes.includes(file.type)) {
        return {
        isValid: false,
        error: 'Định dạng ảnh không được hỗ trợ. Vui lòng sử dụng JPEG/JPG, PNG, BMP, HEIC, HEIF hoặc WEBP'
        };
    }

    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
        return {
        isValid: false,
        error: 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh dưới 10MB'
        };
    }

    return { isValid: true };
    }

    // Analysis function
    static async analyzePortrait(file) {
        // 1. Validate the image
        const validationResult = await this.validateImage(file);
        if (!validationResult.isValid) {
            throw new Error(validationResult.error);
        }

        // 2. Convert to base64 for analysis
        const base64Image = await AiService.fileToBase64(file);

        // 3. Perform the analysis
        const analysisResult = await AiService.analyzeFace(base64Image, file.type);

        return analysisResult;
    }

    /**
     * Base64 to file
     * @param {*} base64 
     * @returns 
     */
    static base64ToImageFile(base64) {
        const byteString = atob(base64.split(',')[1]); // Bỏ phần "data:image/png;base64,"
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        const filename = Date.now()
        return new File([ab], filename, { type: 'image/png' });
    }
}

// Static property to store progress timers
ImageService.progressTimers = [];

export default ImageService;
