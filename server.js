const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('.'));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// Simple JSON file database for photos
const dbPath = path.join(__dirname, 'photos.json');

// Initialize database file if it doesn't exist
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ photos: [] }, null, 2));
}

// Helper functions for database operations
function readPhotos() {
    try {
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading photos:', error);
        return { photos: [] };
    }
}

function writePhotos(data) {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing photos:', error);
        return false;
    }
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
        files: 10 // Maximum 10 files
    },
    fileFilter: (req, file, cb) => {
        // Check file type
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// Middleware to ensure all API responses are JSON
app.use('/api', (req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

// Handle multer errors
app.use('/api/photos/upload', (error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        console.error('Multer error:', error);
        return res.status(400).json({
            success: false,
            error: `Upload error: ${error.message}`
        });
    } else if (error) {
        console.error('Upload error:', error);
        return res.status(400).json({
            success: false,
            error: error.message || 'Upload failed'
        });
    }
    next();
});

// API Routes

// Test endpoint to verify API is working
app.get('/api/test', (req, res) => {
    console.log('Test endpoint called');
    res.json({ 
        success: true, 
        message: 'API is working', 
        timestamp: new Date().toISOString() 
    });
});

// Get all photos
app.get('/api/photos', (req, res) => {
    try {
        const data = readPhotos();
        res.json({ success: true, photos: data.photos });
    } catch (error) {
        console.error('Error fetching photos:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch photos' });
    }
});

// Upload photos
app.post('/api/photos/upload', upload.array('photos', 10), (req, res) => {
    // Set proper headers
    res.setHeader('Content-Type', 'application/json');
    
    try {
        console.log('Upload request received:', {
            filesCount: req.files ? req.files.length : 0,
            body: req.body
        });

        if (!req.files || req.files.length === 0) {
            console.log('No files uploaded');
            return res.status(400).json({ success: false, error: 'No files uploaded' });
        }

        const data = readPhotos();
        const newPhotos = req.files.map(file => {
            const photo = {
                id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
                filename: file.filename,
                originalName: file.originalname,
                url: `/uploads/${file.filename}`,
                uploadDate: new Date().toISOString(),
                size: file.size
            };
            console.log('Created photo object:', photo);
            return photo;
        });

        data.photos.push(...newPhotos);
        
        if (writePhotos(data)) {
            const response = { 
                success: true, 
                message: `${newPhotos.length} photo(s) uploaded successfully`,
                photos: newPhotos 
            };
            console.log('Upload successful, sending response:', response);
            res.json(response);
        } else {
            console.log('Failed to save photo data');
            res.status(500).json({ success: false, error: 'Failed to save photo data' });
        }
    } catch (error) {
        console.error('Error uploading photos:', error);
        res.status(500).json({ success: false, error: 'Upload failed: ' + error.message });
    }
});

// Delete a photo
app.delete('/api/photos/:id', (req, res) => {
    try {
        const photoId = req.params.id;
        const data = readPhotos();
        
        const photoIndex = data.photos.findIndex(photo => photo.id === photoId);
        if (photoIndex === -1) {
            return res.status(404).json({ success: false, error: 'Photo not found' });
        }

        const photo = data.photos[photoIndex];
        const filePath = path.join(uploadsDir, photo.filename);
        
        // Remove from database
        data.photos.splice(photoIndex, 1);
        
        // Delete file from disk
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        
        if (writePhotos(data)) {
            res.json({ success: true, message: 'Photo deleted successfully' });
        } else {
            res.status(500).json({ success: false, error: 'Failed to update database' });
        }
    } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).json({ success: false, error: 'Delete failed' });
    }
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error handling middleware
app.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, error: 'File too large' });
        }
    }
    res.status(500).json({ success: false, error: error.message });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    if (!res.headersSent) {
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error: ' + error.message 
        });
    }
});

// Handle 404 for API routes
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        error: 'API endpoint not found' 
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the app at: http://localhost:${PORT}`);
});
