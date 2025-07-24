import multer from 'multer';

// Configure multer for memory storage (files will be processed in memory)
const storage = multer.memoryStorage();

// File filter function
const fileFilter = (req, file, cb) => {
    // Check file type
    if (file.fieldname === 'avatar') {
        // For avatars, only allow images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for avatars'), false);
        }
    } else {
        // For other uploads, allow images, videos, and documents
        const allowedTypes = [
            'image/',
            'video/',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        
        const isAllowed = allowedTypes.some(type => file.mimetype.startsWith(type));
        
        if (isAllowed) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'), false);
        }
    }
};

// Configure multer
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // Default 10MB
        files: parseInt(process.env.MAX_FILES_PER_SUBMISSION) || 5 // Default 5 files
    }
});

// Export different upload configurations
export const uploadSingle = (fieldname = 'file') => upload.single(fieldname);
export const uploadMultiple = (fieldname = 'files', maxCount = parseInt(process.env.MAX_FILES_PER_SUBMISSION) || 5) => upload.array(fieldname, maxCount);
export const uploadAvatar = upload.single('avatar');
export const uploadSubmission = upload.array('files', parseInt(process.env.MAX_FILES_PER_SUBMISSION) || 5);


// Error handling middleware for multer
export const handleUploadError = (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum 5 files allowed.'
            });
        }
        if (error.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                message: 'Unexpected file field.'
            });
        }
    }
    
    if (error.message.includes('File type not allowed')) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    
    next(error);
};

export default upload;
