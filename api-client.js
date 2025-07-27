// API Client for photo management
class PhotoAPI {
    constructor() {
        this.baseURL = window.location.origin;
    }

    // Get all photos from server
    async getPhotos() {
        try {
            const response = await fetch(`${this.baseURL}/api/photos`);
            const data = await response.json();
            
            if (data.success) {
                return data.photos;
            } else {
                throw new Error(data.error || 'Failed to fetch photos');
            }
        } catch (error) {
            console.error('Error fetching photos:', error);
            throw error;
        }
    }

    // Upload photos to server
    async uploadPhotos(files) {
        try {
            const formData = new FormData();
            
            // Add all files to FormData
            Array.from(files).forEach(file => {
                formData.append('photos', file);
            });

            const response = await fetch(`${this.baseURL}/api/photos/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            if (data.success) {
                return data.photos;
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            throw error;
        }
    }

    // Delete a photo
    async deletePhoto(photoId) {
        try {
            const response = await fetch(`${this.baseURL}/api/photos/${photoId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            
            if (data.success) {
                return true;
            } else {
                throw new Error(data.error || 'Delete failed');
            }
        } catch (error) {
            console.error('Error deleting photo:', error);
            throw error;
        }
    }
}

// Create global instance
window.photoAPI = new PhotoAPI();
