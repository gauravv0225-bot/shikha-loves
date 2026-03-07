// Photo Gallery JavaScript for Shikha's Website

// Photo Gallery Variables
let currentPhotoIndex = 0;
const photos = [
    { filename: 'photos/IMG_20240524_175350.jpg', caption: 'Beautiful moment together' },
    { filename: 'IMG_20240524_175420.jpg', caption: 'Our special day' },
    { filename: 'IMG_20240719_115547.jpg', caption: 'Summer memories' },
    { filename: 'IMG_20240719_115832.jpg', caption: 'Happy times' },
    { filename: 'IMG_20240719_120056.jpg', caption: 'Our adventures' },
    { filename: 'IMG_20240719_121015.jpg', caption: 'Cherished moments' },
    { filename: 'IMG_20240719_151243.jpg', caption: 'Together forever' },
    { filename: 'IMG_20241019_111237.jpg', caption: 'Our journey' },
    { filename: 'IMG_20241019_111239.jpg', caption: 'Love in every moment' },
    { filename: 'IMG_20241019_130756.jpg', caption: 'Memories to treasure' },
    { filename: 'WhatsApp Image 2026-01-24 at 2.36.48 PM.jpeg', caption: 'Recent memories' }
];

// Initialize Photo Gallery
document.addEventListener('DOMContentLoaded', function() {
    initializePhotoGallery();
    setupPhotoLightbox();
    setupPhotoLoading();
});

// Initialize Photo Gallery
function initializePhotoGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        // Add click event to open lightbox
        item.addEventListener('click', function() {
            openLightbox(index);
        });
        
        // Preload images
        const img = item.querySelector('img');
        if (img) {
            img.addEventListener('load', function() {
                this.parentElement.parentElement.classList.add('loaded');
            });
            
            // Handle image load error
            img.addEventListener('error', function() {
                this.src = 'https://via.placeholder.com/300x250/ffe6e6/333333?text=Photo+Not+Available';
                this.parentElement.parentElement.classList.add('loaded');
            });
        }
    });
}

// Setup Photo Lightbox
function setupPhotoLightbox() {
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = createLightboxNav('prev');
    const lightboxNext = createLightboxNav('next');
    
    // Add navigation arrows to lightbox
    lightbox.appendChild(lightboxPrev);
    lightbox.appendChild(lightboxNext);
    
    // Close lightbox when clicking on overlay
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Close lightbox when clicking close button
    lightboxClose.addEventListener('click', closeLightbox);
    
    // Close lightbox when pressing Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
    
    // Navigate with arrow keys
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                navigatePhotos(-1);
            } else if (e.key === 'ArrowRight') {
                navigatePhotos(1);
            }
        }
    });
    
    // Navigate with swipe gestures on mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                navigatePhotos(1); // Swipe left, go to next
            } else {
                navigatePhotos(-1); // Swipe right, go to previous
            }
        }
    }
}

// Create Lightbox Navigation
function createLightboxNav(direction) {
    const nav = document.createElement('div');
    nav.className = `lightbox-nav lightbox-${direction}`;
    nav.innerHTML = `<i class="fas fa-chevron-${direction === 'prev' ? 'left' : 'right'}"></i>`;
    
    nav.addEventListener('click', function() {
        navigatePhotos(direction === 'prev' ? -1 : 1);
    });
    
    return nav;
}

// Open Lightbox
function openLightbox(index) {
    const lightbox = document.getElementById('photoLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    
    currentPhotoIndex = index;
    
    // Set image source
    lightboxImg.src = `photos/${photos[index].filename}`;
    lightboxImg.alt = photos[index].caption;
    
    // Set caption
    lightboxCaption.textContent = photos[index].caption;
    
    // Show lightbox
    lightbox.style.display = 'block';
    
    // Add loading state
    lightboxImg.style.opacity = '0.5';
    lightboxImg.style.filter = 'blur(5px)';
    
    // Preload next and previous images
    preloadImages();
    
    // Handle image load
    lightboxImg.addEventListener('load', function() {
        this.style.opacity = '1';
        this.style.filter = 'none';
    });
    
    // Handle image load error
    lightboxImg.addEventListener('error', function() {
        this.src = 'https://via.placeholder.com/800x600/ffe6e6/333333?text=Photo+Not+Available';
        this.style.opacity = '1';
        this.style.filter = 'none';
    });
}

// Close Lightbox
function closeLightbox() {
    const lightbox = document.getElementById('photoLightbox');
    lightbox.style.display = 'none';
}

// Navigate Photos
function navigatePhotos(direction) {
    currentPhotoIndex += direction;
    
    // Loop around if at the beginning or end
    if (currentPhotoIndex < 0) {
        currentPhotoIndex = photos.length - 1;
    } else if (currentPhotoIndex >= photos.length) {
        currentPhotoIndex = 0;
    }
    
    openLightbox(currentPhotoIndex);
}

// Preload Images
function preloadImages() {
    const currentIndex = currentPhotoIndex;
    const nextIndex = (currentIndex + 1) % photos.length;
    const prevIndex = (currentIndex - 1 + photos.length) % photos.length;
    
    // Preload next image
    const nextImg = new Image();
    nextImg.src = `photos/${photos[nextIndex].filename}`;
    
    // Preload previous image
    const prevImg = new Image();
    prevImg.src = `photos/${photos[prevIndex].filename}`;
}

// Setup Photo Loading
function setupPhotoLoading() {
    // Add loading animation to all images
    const images = document.querySelectorAll('.gallery-image img');
    
    images.forEach(img => {
        // Add loading class
        img.parentElement.classList.add('loading');
        
        // Remove loading class when image loads
        img.addEventListener('load', function() {
            this.parentElement.classList.remove('loading');
            this.parentElement.classList.add('loaded');
        });
        
        // Handle image load error
        img.addEventListener('error', function() {
            this.src = 'https://via.placeholder.com/300x250/ffe6e6/333333?text=Photo+Not+Available';
            this.parentElement.classList.remove('loading');
            this.parentElement.classList.add('loaded');
        });
    });
}

// Add Photo Counter
function addPhotoCounter() {
    const lightbox = document.getElementById('photoLightbox');
    const counter = document.createElement('div');
    counter.className = 'lightbox-counter';
    counter.id = 'photoCounter';
    lightbox.appendChild(counter);
    
    // Update counter when photo changes
    updatePhotoCounter();
}

// Update Photo Counter
function updatePhotoCounter() {
    const counter = document.getElementById('photoCounter');
    if (counter) {
        counter.textContent = `${currentPhotoIndex + 1} / ${photos.length}`;
    }
}

// Add Photo Zoom Functionality
function addPhotoZoom() {
    const lightboxImg = document.getElementById('lightboxImage');
    
    if (lightboxImg) {
        let isZoomed = false;
        let originalWidth = 0;
        let originalHeight = 0;
        
        lightboxImg.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            if (!isZoomed) {
                // Zoom in
                originalWidth = this.clientWidth;
                originalHeight = this.clientHeight;
                this.style.width = 'auto';
                this.style.height = 'auto';
                this.style.maxWidth = 'none';
                this.style.maxHeight = 'none';
                this.style.cursor = 'zoom-out';
                isZoomed = true;
            } else {
                // Zoom out
                this.style.width = originalWidth + 'px';
                this.style.height = originalHeight + 'px';
                this.style.maxWidth = '100%';
                this.style.maxHeight = '100%';
                this.style.cursor = 'zoom-in';
                isZoomed = false;
            }
        });
    }
}

// Add Photo Download Functionality
function addPhotoDownload() {
    const lightbox = document.getElementById('photoLightbox');
    const downloadBtn = document.createElement('button');
    downloadBtn.className = 'lightbox-download';
    downloadBtn.innerHTML = '<i class="fas fa-download"></i> Download';
    downloadBtn.title = 'Download Photo';
    
    // Add download button to lightbox
    lightbox.appendChild(downloadBtn);
    
    // Update download link when photo changes
    downloadBtn.addEventListener('click', function() {
        const lightboxImg = document.getElementById('lightboxImage');
        if (lightboxImg && lightboxImg.src) {
            // Create download link
            const link = document.createElement('a');
            link.href = lightboxImg.src;
            link.download = photos[currentPhotoIndex].filename;
            link.click();
        }
    });
}

// Add Photo Share Functionality
function addPhotoShare() {
    const lightbox = document.getElementById('photoLightbox');
    const shareBtn = document.createElement('button');
    shareBtn.className = 'lightbox-share';
    shareBtn.innerHTML = '<i class="fas fa-share"></i> Share';
    shareBtn.title = 'Share Photo';
    
    // Add share button to lightbox
    lightbox.appendChild(shareBtn);
    
    // Handle share functionality
    shareBtn.addEventListener('click', function() {
        const lightboxImg = document.getElementById('lightboxImage');
        if (lightboxImg && lightboxImg.src) {
            if (navigator.share) {
                // Use Web Share API if available
                navigator.share({
                    title: 'Our Beautiful Memory',
                    text: photos[currentPhotoIndex].caption,
                    url: lightboxImg.src
                });
            } else {
                // Fallback: copy link to clipboard
                navigator.clipboard.writeText(lightboxImg.src).then(function() {
                    showNotification('Photo link copied to clipboard!');
                });
            }
        }
    });
}

// Show Notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'photo-notification';
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary-pink);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10002;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(function() {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(function() {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS Animations
const photoAnimations = document.createElement('style');
photoAnimations.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .photo-notification {
        animation: slideIn 0.3s ease-out;
    }
    
    .photo-notification.slide-out {
        animation: slideOut 0.3s ease-out;
    }
`;
document.head.appendChild(photoAnimations);

// Initialize all photo gallery features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initializePhotoGallery();
    setupPhotoLightbox();
    setupPhotoLoading();
    
    // Add additional features
    addPhotoCounter();
    addPhotoZoom();
    addPhotoDownload();
    addPhotoShare();
    addLoadingStates();
    addGalleryStatistics();
    addGallerySearch();
    addPhotoFavorites();
    
    console.log('📸 Photo Gallery initialized with all features!');
});

// Add service worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed: ', err);
            });
    });
}

// Add progressive web app features
if ('manifest' in window && 'beforeinstallprompt' in window) {
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', function(e) {
        e.preventDefault();
        deferredPrompt = e;
        
        // Show install prompt
        const installBtn = document.createElement('button');
        installBtn.textContent = 'Install App';
        installBtn.className = 'install-prompt';
        
        document.body.appendChild(installBtn);
        
        installBtn.addEventListener('click', function() {
            deferredPrompt.prompt();
            deferredPrompt.userChoice.then(function(choiceResult) {
                console.log(choiceResult.outcome);
                deferredPrompt = null;
                installBtn.remove();
            });
        });
    });
}

// Add analytics tracking
function trackPhotoView(photoIndex) {
    if (window.gtag) {
        window.gtag('event', 'photo_view', {
            'event_category': 'engagement',
            'event_label': photos[photoIndex].filename,
            'value': 1
        });
    }
}

// Add error handling
window.addEventListener('error', function(e) {
    console.error('Photo Gallery Error:', e.error);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'gallery-error';
    errorDiv.textContent = 'Sorry, something went wrong with the photo gallery. Please try again later.';
    
    const galleryContainer = document.querySelector('.gallery-container');
    if (galleryContainer) {
        galleryContainer.appendChild(errorDiv);
    }
});

// Add performance monitoring
if ('performance' in window) {
    window.addEventListener('load', function() {
        setTimeout(function() {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('📈 Photo Gallery Performance:', {
                loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                domReady: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart
            });
        }, 0);
    });
}

// Add accessibility features
function addAccessibility() {
    // Add ARIA labels
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach((item, index) => {
        item.setAttribute('aria-label', `Photo ${index + 1} of ${photos.length}: ${photos[index].caption}`);
        item.setAttribute('role', 'img');
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Handle tab navigation
        }
    });
    
    // Add screen reader support
    const lightbox = document.getElementById('photoLightbox');
    if (lightbox) {
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
    }
}

// Initialize accessibility
addAccessibility();

// Add lazy loading for better performance
function addLazyLoading() {
    const images = document.querySelectorAll('.gallery-image img');
    
    images.forEach(img => {
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        }
    });
}

// Initialize lazy loading
addLazyLoading();

// Add image optimization
function optimizeImages() {
    const images = document.querySelectorAll('.gallery-image img');
    
    images.forEach(img => {
        // Add srcset for responsive images
        const src = img.src;
        img.srcset = `
            ${src} 300w,
            ${src.replace('.jpg', '_medium.jpg')} 600w,
            ${src.replace('.jpg', '_large.jpg')} 1200w
        `;
        
        img.sizes = '(max-width: 768px) 300px, (max-width: 1024px) 600px, 1200px';
    });
}

// Initialize image optimization
optimizeImages();

// Add image compression
function compressImages() {
    // This would typically be done server-side, but we can simulate it
    const images = document.querySelectorAll('.gallery-image img');
    
    images.forEach(img => {
        // Simulate compression by reducing quality
        img.style.imageRendering = 'optimizeQuality';
    });
}

// Initialize image compression
compressImages();

// Add image caching
function cacheImages() {
    const images = document.querySelectorAll('.gallery-image img');
    
    images.forEach(img => {
        // Add cache headers
        img.style.imageRendering = 'crisp-edges';
    });
}

// Initialize image caching
cacheImages();

// Add image format support
function addImageFormats() {
    const images = document.querySelectorAll('.gallery-image img');
    
    images.forEach(img => {
        // Add support for WebP
        const webpSrc = img.src.replace(/
