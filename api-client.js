// API Client for photo management
class PhotoAPI {
    constructor() {
        this.baseURL = window.location.origin;
    }

    // Test API connectivity
    async testConnection() {
        try {
            const response = await fetch(`${this.baseURL}/api/test`);
            console.log('Test response status:', response.status);
            console.log('Test response headers:', [...response.headers.entries()]);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Test response data:', data);
            return data;
        } catch (error) {
            console.error('API test failed:', error);
            throw error;
        }
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

            // Check if response is ok
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Check if response has content
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Non-JSON response received:', {
                    status: response.status,
                    statusText: response.statusText,
                    contentType: contentType,
                    responseText: text
                });
                throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
            }

            const data = await response.json();
            
            if (data.success) {
                return data.photos;
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            if (error.message.includes('Unexpected end of JSON input')) {
                throw new Error('Server error: Empty response received. Please check server logs.');
            }
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
