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
        fileSize: 10 * 1024 * 1024 // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// API Routes

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
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, error: 'No files uploaded' });
        }

        const data = readPhotos();
        const newPhotos = req.files.map(file => ({
            id: Date.now() + '-' + Math.random().toString(36).substr(2, 9),
            filename: file.filename,
            originalName: file.originalname,
            url: `/uploads/${file.filename}`,
            uploadDate: new Date().toISOString(),
            size: file.size
        }));

        data.photos.push(...newPhotos);
        
        if (writePhotos(data)) {
            res.json({ 
                success: true, 
                message: `${newPhotos.length} photo(s) uploaded successfully`,
                photos: newPhotos 
            });
        } else {
            res.status(500).json({ success: false, error: 'Failed to save photo data' });
        }
    } catch (error) {
        console.error('Error uploading photos:', error);
        res.status(500).json({ success: false, error: 'Upload failed' });
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

// Start server
app.listen(PORT, () => {
    console.log(`🎀 Rakhi 2025 server running on port ${PORT}`);
    console.log(`📸 Photo uploads will be saved to: ${uploadsDir}`);
    console.log(`🗄️ Database file: ${dbPath}`);
});
