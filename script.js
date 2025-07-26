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
    
    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const caption = item.getAttribute('data-caption');
            showImageModal(caption);
        });
    });
}

function showImageModal(caption) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${caption}</h3>
                <button class="close-btn">&times;</button>
            </div>
            <div class="modal-body">
                <div class="placeholder-photo">
                    <i class="fas fa-image"></i>
                    <p>Add your photo here</p>
                </div>
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
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(modal);
    
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('close-btn')) {
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
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

// Photo Upload Functionality
function initializePhotoUpload() {
    const photoUpload = document.getElementById('photo-upload');
    const photoGallery = document.getElementById('photo-gallery');
    
    if (photoUpload && photoGallery) {
        photoUpload.addEventListener('change', function(event) {
            const files = event.target.files;
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Check if file is an image
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    
                    reader.onload = function(e) {
                        // Create new gallery item
                        const galleryItem = document.createElement('div');
                        galleryItem.className = 'gallery-item uploaded-photo';
                        galleryItem.setAttribute('data-caption', 'Your Memory');
                        
                        // Create image element
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = 'Your Memory';
                        img.style.width = '100%';
                        img.style.height = '100%';
                        img.style.objectFit = 'cover';
                        
                        // Create delete button
                        const deleteBtn = document.createElement('button');
                        deleteBtn.className = 'delete-photo-btn';
                        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                        deleteBtn.title = 'Delete this photo';
                        
                        // Add delete functionality
                        deleteBtn.addEventListener('click', function(e) {
                            e.stopPropagation(); // Prevent image modal from opening
                            deletePhoto(galleryItem);
                        });
                        
                        // Add image to gallery item
                        galleryItem.appendChild(img);
                        galleryItem.appendChild(deleteBtn);
                        
                        // Add to gallery with animation
                        galleryItem.style.opacity = '0';
                        galleryItem.style.transform = 'scale(0.8)';
                        photoGallery.appendChild(galleryItem);
                        
                        // Animate in
                        setTimeout(() => {
                            galleryItem.style.transition = 'all 0.5s ease';
                            galleryItem.style.opacity = '1';
                            galleryItem.style.transform = 'scale(1)';
                        }, 100);
                        
                        // Add hover effect
                        galleryItem.addEventListener('mouseenter', function() {
                            this.style.transform = 'scale(1.03)';
                            deleteBtn.style.opacity = '1';
                        });
                        
                        galleryItem.addEventListener('mouseleave', function() {
                            this.style.transform = 'scale(1)';
                            deleteBtn.style.opacity = '0';
                        });
                        
                        // Add click to enlarge
                        galleryItem.addEventListener('click', function() {
                            showImageModal('Your Memory', e.target.result);
                        });
                        
                        // Show success message
                        showUploadSuccess();
                    };
                    
                    reader.readAsDataURL(file);
                }
            }
            
            // Clear the input
            photoUpload.value = '';
        });
    }
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
        
        // Remove after animation
        setTimeout(() => {
            if (galleryItem.parentNode) {
                galleryItem.parentNode.removeChild(galleryItem);
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
    loadUploadedPhotos();
    
    // Save photos when page is about to unload
    window.addEventListener('beforeunload', saveUploadedPhotos);
});

// Parallax effect for floating elements
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floatingElements = document.querySelectorAll('.floating-element');
    
    floatingElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add typing effect to message
function typeWriter(element, text, speed = 50) {
    return new Promise((resolve) => {
        let i = 0;
        const originalText = element.textContent;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                resolve();
            }
        }
        
        type();
    });
}

// Initialize typing effect when message section is shown
const messageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const messageContent = entry.target.querySelector('.message-content');
            if (messageContent && !messageContent.classList.contains('typed')) {
                messageContent.classList.add('typed');
                
                // Store original text and clear content
                const paragraphs = messageContent.querySelectorAll('p');
                const originalTexts = Array.from(paragraphs).map(p => p.textContent);
                
                // Clear all paragraphs first
                paragraphs.forEach(p => {
                    p.textContent = '';
                });
                
                // Type each paragraph sequentially
                let currentIndex = 0;
                
                function typeNextParagraph() {
                    if (currentIndex < paragraphs.length) {
                        typeWriter(paragraphs[currentIndex], originalTexts[currentIndex], 30)
                            .then(() => {
                                currentIndex++;
                                setTimeout(typeNextParagraph, 500); // Wait 500ms between paragraphs
                            });
                    }
                }
                
                typeNextParagraph();
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const messageSection = document.getElementById('message');
    if (messageSection) {
        messageObserver.observe(messageSection);
    }
});

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