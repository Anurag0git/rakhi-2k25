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

// Gallery functionality - Simplified for static photos
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('.gallery-photo');
        const caption = item.getAttribute('data-caption') || `Memory ${index + 1}`;
        
        if (img) {
            // Add error handling for images
            img.addEventListener('error', function() {
                console.error(`Failed to load image: ${this.src}`);
                this.style.display = 'none';
                item.innerHTML = `
                    <div class="placeholder-photo">
                        <i class="fas fa-image"></i>
                        <small>Image not found</small>
                    </div>
                `;
            });
            
            // Add click handler for image modal
            img.addEventListener('click', () => {
                showImageModal(caption, img.src);
            });
        }
        
        // Add hover effects
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'scale(1)';
        });
    });
    
    // Create modal for image viewing
    createImageModal();
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

function createImageModal() {
    // Check if modal already exists
    if (document.getElementById('image-modal')) return;
    
    const modal = document.createElement('div');
    modal.id = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        backdrop-filter: blur(10px);
    `;
    
    modal.innerHTML = `
        <div style="position: relative; max-width: 90%; max-height: 90%; text-align: center;">
            <img id="modal-image" style="max-width: 100%; max-height: 100%; border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);">
            <h3 id="modal-caption" style="color: white; margin-top: 20px; font-family: 'Dancing Script', cursive; font-size: 24px;"></h3>
            <button id="close-modal" style="position: absolute; top: -40px; right: -40px; background: rgba(255, 255, 255, 0.2); border: none; color: white; font-size: 24px; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; backdrop-filter: blur(10px);">×</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal handlers
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    document.getElementById('close-modal').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // ESC key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            modal.style.display = 'none';
        }
    });
}







// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    createFloatingElements();
    initializeGallery();
    addSpecialEffects();
    
    // Initialize message observer
    const messageSection = document.getElementById('message');
    if (messageSection) {
        messageObserver.observe(messageSection);
    }
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