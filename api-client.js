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
            // Validate files first
            if (!files || files.length === 0) {
                throw new Error('No files selected for upload');
            }
            
            // Check file sizes
            for (let file of files) {
                if (file.size > 10 * 1024 * 1024) { // 10MB
                    throw new Error(`File ${file.name} is too large. Maximum size is 10MB.`);
                }
            }
            
            const formData = new FormData();
            
            // Add all files to FormData
            Array.from(files).forEach(file => {
                formData.append('photos', file);
            });

            console.log('Uploading files:', files.length);
            
            const response = await fetch(`${this.baseURL}/api/photos/upload`, {
                method: 'POST',
                body: formData
            });

            console.log('Upload response:', {
                status: response.status,
                statusText: response.statusText,
                headers: [...response.headers.entries()]
            });

            // Check if response is ok
            if (!response.ok) {
                // Try to get error message from response
                let errorMessage = `HTTP error! status: ${response.status}`;
                try {
                    const errorText = await response.text();
                    errorMessage = `Server error (${response.status}): ${errorText.substring(0, 200)}`;
                } catch (e) {
                    // Ignore if we can't read the error
                }
                throw new Error(errorMessage);
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
                
                // If it's HTML, it might be an error page
                if (contentType && contentType.includes('text/html')) {
                    throw new Error(`Server configuration error. Please check server logs. Received HTML instead of JSON.`);
                }
                
                throw new Error(`Server returned non-JSON response (${response.status}): ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
            }

            const data = await response.json();
            console.log('Upload response data:', data);
            
            if (data.success) {
                return data.photos;
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading photos:', error);
            if (error.message.includes('Unexpected end of JSON input')) {
                throw new Error('Server connection error. Please try again or check server logs.');
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
