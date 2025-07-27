// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const mainContainer = document.getElementById('main-container');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            mainContainer.classList.remove('hidden');
            startAnimations();
        }, 500);
    }, 2000);
});

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const targetSection = link.getAttribute('data-section');
        
        // Update active nav link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Show target section
        showSection(targetSection);
    });
});

function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
        scrollToTop();
    }
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Smooth scrolling for CTA buttons
function scrollToSection(sectionId) {
    showSection(sectionId);
}

// Animations
function startAnimations() {
    // Add entrance animations to elements
    const animatedElements = document.querySelectorAll('.timeline-item, .wish-card, .gallery-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
}

// Floating elements animation
function createFloatingElements() {
    const floatingContainer = document.querySelector('.floating-elements');
    if (!floatingContainer) return;
    
    const emojis = ['🎀', '💖', '⭐', '🌸', '💕', '🌟', '🎀', '💖'];
    
    emojis.forEach((emoji, index) => {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = emoji;
        element.style.cssText = `
            position: absolute;
            font-size: 24px;
            animation: float ${6 + index}s ease-in-out infinite;
            animation-delay: ${index * 0.5}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        floatingContainer.appendChild(element);
    });
}

// Gallery functionality
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Debug: Log the number of gallery items found
    console.log(`Found ${galleryItems.length} gallery items`);
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const placeholder = item.querySelector('.placeholder-photo');
        const caption = item.getAttribute('data-caption') || `Photo ${index + 1}`;
        
        // Debug: Log each item
        console.log(`Gallery item ${index + 1}: ${caption} - ${img ? 'Has image' : 'Placeholder'}`);
        
        if (img) {
            // Add error handling for images
            img.addEventListener('error', function() {
                console.error(`Failed to load image: ${this.src}`);
                this.style.display = 'none';
                item.innerHTML = `
                    <div class="placeholder-photo">
                        <i class="fas fa-image"></i>
                        <small>Click to add your photo</small>
                    </div>
                `;
                // Make the new placeholder clickable
                const newPlaceholder = item.querySelector('.placeholder-photo');
                if (newPlaceholder) {
                    newPlaceholder.addEventListener('click', () => {
                        document.getElementById('photo-upload').click();
                    });
                }
            });
            
            // Add load success handler
            img.addEventListener('load', function() {
                console.log(`Successfully loaded image: ${this.src}`);
            });
            
            // Add click to enlarge for images
            item.addEventListener('click', () => {
                if (img && img.src) {
                    showImageModal(caption, img.src);
                }
            });
        }
        
        if (placeholder) {
            // Make placeholder clickable to trigger file upload
            placeholder.addEventListener('click', () => {
                document.getElementById('photo-upload').click();
            });
        }
    });
    
    // Verify all images are present
    setTimeout(() => {
        const loadedImages = document.querySelectorAll('.gallery-item img');
        const placeholders = document.querySelectorAll('.gallery-item .placeholder-photo');
        console.log(`Total loaded images: ${loadedImages.length}`);
        console.log(`Total placeholders: ${placeholders.length}`);
        
        loadedImages.forEach((img, index) => {
            if (img.complete && img.naturalHeight !== 0) {
                console.log(`Image ${index + 1} loaded successfully: ${img.src}`);
            } else {
                console.warn(`Image ${index + 1} may not have loaded: ${img.src}`);
            }
        });
    }, 1000);
}

function showImageModal(caption, imageSrc) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${caption}</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <img src="${imageSrc}" alt="${caption}" style="max-width: 100%; height: auto; border-radius: 10px;">
            </div>
        </div>
    `;
    
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(5px);
    `;
    
    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 20px;
        max-width: 90%;
        max-height: 90%;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    `;
    
    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #eee;
    `;
    
    const modalBody = modal.querySelector('.modal-body');
    modalBody.style.cssText = `
        padding: 20px;
        text-align: center;
    `;
    
    const closeBtn = modal.querySelector('.close-btn');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        padding: 5px;
    `;
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    document.body.appendChild(modal);
}

// Special effects
function addSpecialEffects() {
    // Add confetti effect on page load
    setTimeout(() => {
        createConfetti();
    }, 3000);
    
    // Add heart effect on click
    document.addEventListener('click', (e) => {
        if (e.target.closest('.cta-btn') || e.target.closest('.wish-card')) {
            createHeart(e.clientX, e.clientY);
        }
    });
}

function createConfetti() {
    const colors = ['#ff6b9d', '#ffd93d', '#667eea', '#764ba2'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            top: -10px;
            z-index: 9999;
            animation: confettiFall ${3 + Math.random() * 2}s linear forwards;
        `;
        
        document.body.appendChild(confetti);
        
        setTimeout(() => {
            if (confetti.parentNode) {
                document.body.removeChild(confetti);
            }
        }, 5000);
    }
}

function createHeart(x, y) {
    const heart = document.createElement('div');
    heart.innerHTML = '💖';
    heart.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        font-size: 20px;
        pointer-events: none;
        z-index: 9999;
        animation: heartFloat 2s ease-out forwards;
    `;
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        if (heart.parentNode) {
            document.body.removeChild(heart);
        }
    }, 2000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        to {
            transform: translateY(100vh) rotate(360deg);
        }
    }
    
    @keyframes heartFloat {
        0% {
            transform: translateY(0) scale(1);
            opacity: 1;
        }
        100% {
            transform: translateY(-100px) scale(1.5);
            opacity: 0;
        }
    }
    
    .image-modal .modal-content {
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 20px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .image-modal .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        color: white;
    }
    
    .image-modal .close-btn {
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 5px;
    }
    
    .image-modal .modal-body {
        text-align: center;
    }
    
    .floating-element {
        position: absolute;
        font-size: 24px;
        animation: float 6s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
`;

document.head.appendChild(style);

// Photo Upload Functionality - API-based implementation
async function initializePhotoUpload() {
    const uploadInput = document.getElementById('photo-upload');
    const galleryContainer = document.querySelector('.gallery-container');
    
    if (!uploadInput || !galleryContainer) {
        console.error('Upload elements not found');
        return;
    }
    
    console.log('Initializing API-based photo upload...');
    
    uploadInput.addEventListener('change', async function(e) {
        const files = Array.from(e.target.files);
        
        if (files.length === 0) {
            console.log('No files selected');
            return;
        }
        
        console.log(`Uploading ${files.length} files to server...`);
        
        try {
            // Show loading indicator
            showUploadLoading();
            
            // Upload files to server
            const uploadedPhotos = await window.photoAPI.uploadPhotos(files);
            console.log('Photos uploaded successfully:', uploadedPhotos);
            
            // Add uploaded photos to gallery
            uploadedPhotos.forEach(photo => {
                addPhotoToGallery(photo);
            });
            
            // Show success message
            showUploadSuccess();
            
        } catch (error) {
            console.error('Upload failed:', error);
            showUploadError(error.message);
        } finally {
            // Clear the input
            uploadInput.value = '';
            hideUploadLoading();
        }
    });
}

// Add photo to gallery display
function addPhotoToGallery(photo) {
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;
    
    // Find first available placeholder or create new item
    let galleryItem = document.querySelector('.gallery-item .placeholder-photo')?.closest('.gallery-item');
    
    if (!galleryItem) {
        // Create new gallery item if no placeholders available
        galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryContainer.appendChild(galleryItem);
    }
    
    galleryItem.setAttribute('data-caption', photo.originalName);
    galleryItem.setAttribute('data-photo-id', photo.id);
    galleryItem.style.position = 'relative';
    
    // Create image element
    const img = document.createElement('img');
    img.src = photo.url;
    img.alt = photo.originalName;
    img.style.cssText = `
        width: 100%;
        height: 250px;
        object-fit: cover;
        border-radius: 15px;
        cursor: pointer;
        transition: transform 0.3s ease;
    `;
    
    // Add hover effect
    img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.05)';
    });
    
    img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
    });
    
    // Add click handler for modal
    img.addEventListener('click', () => {
        showImageModal(photo.originalName, photo.url);
    });
    
    // Clear existing content and add image
    galleryItem.innerHTML = '';
    galleryItem.appendChild(img);
    
    // Add delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '×';
    deleteBtn.className = 'delete-photo-btn';
    deleteBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: rgba(255, 0, 0, 0.8);
        color: white;
        border: none;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        cursor: pointer;
        font-size: 18px;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    deleteBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        await deletePhotoFromServer(photo.id, galleryItem);
    });
    
    galleryItem.appendChild(deleteBtn);
    
    // Show delete button on hover
    galleryItem.addEventListener('mouseenter', () => {
        deleteBtn.style.opacity = '1';
    });
    
    galleryItem.addEventListener('mouseleave', () => {
        deleteBtn.style.opacity = '0';
    });
}

// Delete photo from server
async function deletePhotoFromServer(photoId, galleryItem) {
    try {
        await window.photoAPI.deletePhoto(photoId);
        
        // Replace with placeholder
        galleryItem.innerHTML = `
            <div class="placeholder-photo">
                <i class="fas fa-image"></i>
                <small>Click to add your photo</small>
            </div>
        `;
        galleryItem.removeAttribute('data-photo-id');
        galleryItem.style.position = '';
        
        showDeleteSuccess();
        
    } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete photo: ' + error.message);
    }
}

// Load existing photos from server
async function loadPhotosFromServer() {
    try {
        const photos = await window.photoAPI.getPhotos();
        console.log('Loaded photos from server:', photos);
        
        photos.forEach(photo => {
            addPhotoToGallery(photo);
        });
        
    } catch (error) {
        console.error('Failed to load photos:', error);
    }
}

// Show upload loading indicator
function showUploadLoading() {
    const uploadSection = document.querySelector('.upload-section');
    if (uploadSection) {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'upload-loading';
        loadingDiv.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas fa-spinner fa-spin" style="font-size: 24px; color: #667eea;"></i>
                <p style="margin-top: 10px; color: #667eea;">Uploading photos...</p>
            </div>
        `;
        uploadSection.appendChild(loadingDiv);
    }
}

// Hide upload loading indicator
function hideUploadLoading() {
    const loadingDiv = document.getElementById('upload-loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
}

// Show upload error
function showUploadError(message) {
    const uploadSection = document.querySelector('.upload-section');
    if (uploadSection) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            background: rgba(255, 0, 0, 0.1);
            border: 1px solid rgba(255, 0, 0, 0.3);
            color: #d32f2f;
            padding: 15px;
            border-radius: 10px;
            margin-top: 15px;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            <strong>Upload Failed:</strong> ${message}
        `;
        
        uploadSection.appendChild(errorDiv);
        
        // Remove after 5 seconds
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
                                
                                // Create delete button
                                const deleteBtn = document.createElement('button');
                                deleteBtn.className = 'delete-photo-btn';
                                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                                deleteBtn.title = 'Delete this photo';
                                
}

// Show upload success message
function showUploadSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'upload-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-check-circle"></i>
            <p>Photo added successfully!</p>
        </div>
    `;
    
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #4CAF50, #45a049);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(successMessage);
    
    // Animate in
    setTimeout(() => {
        successMessage.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMessage.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (successMessage.parentNode) {
                document.body.removeChild(successMessage);
            }
        }, 300);
    }, 3000);
}

// Save uploaded photos to localStorage
function saveUploadedPhotos() {
    const galleryItems = document.querySelectorAll('#photo-gallery .gallery-item');
    const uploadedPhotos = [];
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img && img.src.startsWith('data:')) {
            uploadedPhotos.push({
                src: img.src,
                alt: img.alt,
                index: index
            });
        }
    });
    
    localStorage.setItem('uploadedPhotos', JSON.stringify(uploadedPhotos));
}

// Load uploaded photos from localStorage
function loadUploadedPhotos() {
    const savedPhotos = localStorage.getItem('uploadedPhotos');
    const photoGallery = document.getElementById('photo-gallery');
    
    if (savedPhotos && photoGallery) {
        const uploadedPhotos = JSON.parse(savedPhotos);
        
        uploadedPhotos.forEach(photoData => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.setAttribute('data-caption', photoData.alt);
            
            const img = document.createElement('img');
            img.src = photoData.src;
            img.alt = photoData.alt;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            
            galleryItem.appendChild(img);
            photoGallery.appendChild(galleryItem);
            
            // Add hover effect
            galleryItem.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.03)';
            });
            
            galleryItem.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // Add click to enlarge
            galleryItem.addEventListener('click', function() {
                showImageModal(photoData.alt, photoData.src);
            });
        });
    }
}

// Delete photo function
function deletePhoto(galleryItem) {
    // Show confirmation
    if (confirm('Are you sure you want to delete this photo?')) {
        // Animate out
        galleryItem.style.transition = 'all 0.3s ease';
        galleryItem.style.opacity = '0';
        galleryItem.style.transform = 'scale(0.8)';
        
        // Remove after animation and restore placeholder
        setTimeout(() => {
            if (galleryItem.parentNode) {
                // Get the index of the deleted item
                const photoGallery = document.getElementById('photo-gallery');
                const items = Array.from(photoGallery.children);
                const deletedIndex = items.indexOf(galleryItem);
                
                // Remove the uploaded photo
                galleryItem.parentNode.removeChild(galleryItem);
                
                // Restore placeholder at the same position
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder-photo';
                placeholder.innerHTML = `
                    <i class="fas fa-image"></i>
                    <small>Click to add your photo</small>
                `;
                
                // Make placeholder clickable
                placeholder.addEventListener('click', () => {
                    document.getElementById('photo-upload').click();
                });
                
                // Create new gallery item with placeholder
                const newGalleryItem = document.createElement('div');
                newGalleryItem.className = 'gallery-item';
                newGalleryItem.setAttribute('data-caption', `Photo ${deletedIndex + 1}`);
                newGalleryItem.appendChild(placeholder);
                
                // Insert at the same position
                if (deletedIndex < items.length) {
                    photoGallery.insertBefore(newGalleryItem, items[deletedIndex]);
                } else {
                    photoGallery.appendChild(newGalleryItem);
                }
                
                // Animate in the new placeholder
                newGalleryItem.style.opacity = '0';
                newGalleryItem.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    newGalleryItem.style.transition = 'all 0.5s ease';
                    newGalleryItem.style.opacity = '1';
                    newGalleryItem.style.transform = 'scale(1)';
                }, 100);
                
                saveUploadedPhotos(); // Update localStorage
                showDeleteSuccess();
            }
        }, 300);
    }
}

// Show delete success message
function showDeleteSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'delete-success';
    successMessage.innerHTML = `
        <div class="success-content">
            <i class="fas fa-trash-alt"></i>
            <p>Photo deleted successfully!</p>
        </div>
    `;
    
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(45deg, #ff6b6b, #ee5a52);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(successMessage);
    
    // Animate in
    setTimeout(() => {
        successMessage.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        successMessage.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (successMessage.parentNode) {
                document.body.removeChild(successMessage);
            }
        }, 300);
    }, 3000);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    createFloatingElements();
    initializeGallery();
    addSpecialEffects();
    initializePhotoUpload();
    loadPhotosFromServer();
    
    // Initialize message observer
    const messageSection = document.getElementById('message');
    if (messageSection) {
        messageObserver.observe(messageSection);
    }
    
    // Verify all images are loaded after a delay
    setTimeout(() => {
        verifyAllImagesLoaded();
    }, 2000);
    
    // Save photos when page is about to unload
    window.addEventListener('beforeunload', saveUploadedPhotos);
});

// Verify all images are loaded
function verifyAllImagesLoaded() {
    const galleryItems = document.querySelectorAll('#photo-gallery .gallery-item');
    console.log(`Verifying ${galleryItems.length} gallery items...`);
    
    let loadedCount = 0;
    let errorCount = 0;
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        if (img) {
            if (img.complete && img.naturalHeight !== 0) {
                loadedCount++;
                console.log(`✅ Image ${index + 1} loaded successfully: ${img.src}`);
            } else {
                errorCount++;
                console.error(`❌ Image ${index + 1} failed to load: ${img.src}`);
                
                // Create fallback
                item.innerHTML = `
                    <div class="placeholder-photo">
                        <i class="fas fa-image"></i>
                        <p>Photo ${index + 1}</p>
                        <small>Click to add your photo</small>
                    </div>
                `;
                
                // Make it clickable to add photo
                item.addEventListener('click', () => {
                    document.getElementById('photo-upload').click();
                });
            }
        }
    });
    
    console.log(`📊 Image loading summary: ${loadedCount} loaded, ${errorCount} failed`);
    
    if (errorCount > 0) {
        console.warn(`⚠️ ${errorCount} images failed to load. Check file paths and ensure all images are in the repository.`);
    }
}

// Parallax effect for floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Initialize typing effect when message section is shown
const messageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const messageContent = entry.target.querySelector('.message-content');
            if (messageContent && !messageContent.classList.contains('typed')) {
                messageContent.classList.add('typed');
                
                // Store original texts
                const paragraphs = messageContent.querySelectorAll('p');
                const originalTexts = Array.from(paragraphs).map(p => p.textContent);
                
                // Clear all paragraphs first and ensure no cursor styling
                paragraphs.forEach(p => {
                    p.textContent = '';
                    p.style.borderRight = 'none';
                    p.style.animation = 'none';
                    p.classList.remove('typing-complete');
                });
                
                // Type each paragraph sequentially
                let currentIndex = 0;
                
                function typeNextParagraph() {
                    if (currentIndex < paragraphs.length) {
                        const isMobile = window.innerWidth <= 768;
                        const typingSpeed = isMobile ? 50 : 40;
                        
                        typeWriter(paragraphs[currentIndex], originalTexts[currentIndex], typingSpeed)
                            .then(() => {
                                currentIndex++;
                                setTimeout(typeNextParagraph, 800); // Wait 800ms between paragraphs
                            });
                    }
                }
                
                typeNextParagraph();
            }
        }
    });
}, { 
    threshold: 0.2, // Lower threshold for better triggering
    rootMargin: '0px 0px -100px 0px' // Trigger earlier
});

// Improved typewriter function - NO CURSOR
function typeWriter(element, text, speed = 50) {
    return new Promise((resolve) => {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.classList.add('typing-complete');
                resolve();
            }
        }
        
        type();
    });
}

// Add cursor blink animation
const cursorStyle = document.createElement('style');
cursorStyle.textContent = `
    @keyframes blink {
        0%, 50% { border-right-color: #ffd93d; }
        51%, 100% { border-right-color: transparent; }
    }
    
    .message-content.typed p {
        border-right: 2px solid #ffd93d;
        animation: blink 1s infinite;
    }
    
    .message-content.typed p.typing-complete {
        border-right: none;
        animation: none;
    }
`;
document.head.appendChild(cursorStyle);

// Add celebration effect on special interactions
function celebrate() {
    // Create celebration animation
    const celebration = document.createElement('div');
    celebration.innerHTML = '🎉🎊🎈';
    celebration.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 48px;
        z-index: 10000;
        animation: celebration 3s ease-out forwards;
        pointer-events: none;
    }
`;

document.body.appendChild(celebration);

setTimeout(() => {
    if (celebration.parentNode) {
        document.body.removeChild(celebration);
    }
}, 3000);
}

// Add celebration CSS
const celebrationStyle = document.createElement('style');
celebrationStyle.textContent = `
    @keyframes celebration {
        0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 0;
        }
        50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0;
        }
    }
`;

document.head.appendChild(celebrationStyle);

// Trigger celebration on special moments
document.addEventListener('DOMContentLoaded', () => {
    // Celebrate when reaching the final message
    const wishesSection = document.getElementById('wishes');
    if (wishesSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(celebrate, 1000);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(wishesSection);
    }
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowRight':
            navigateNext();
            break;
        case 'ArrowLeft':
            navigatePrev();
            break;
    }
});

function navigateNext() {
    const currentActive = document.querySelector('.nav-link.active');
    const currentIndex = Array.from(navLinks).indexOf(currentActive);
    const nextIndex = (currentIndex + 1) % navLinks.length;
    navLinks[nextIndex].click();
}

function navigatePrev() {
    const currentActive = document.querySelector('.nav-link.active');
    const currentIndex = Array.from(navLinks).indexOf(currentActive);
    const prevIndex = currentIndex === 0 ? navLinks.length - 1 : currentIndex - 1;
    navLinks[prevIndex].click();
}

// Add smooth scroll behavior for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Add loading progress indicator
function updateLoadingProgress(progress) {
    const loadingText = document.querySelector('#loading-screen h2');
    if (loadingText) {
        loadingText.textContent = `Loading Your Special Surprise... ${Math.round(progress)}%`;
    }
}

// Simulate loading progress
let progress = 0;
const progressInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
    }
    updateLoadingProgress(progress);
}, 200);