// Main JavaScript for Monastery360

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize the application
function initializeApp() {
    // Initialize navigation
    initNavigation();
    
    // Initialize virtual tour
    initVirtualTour();
    
    // Initialize interactive map
    initInteractiveMap();
    
    // Initialize cultural calendar
    initCulturalCalendar();
    
    // Initialize scroll animations
    initScrollAnimations();
    
    // Initialize newsletter form
    initNewsletterForm();
}

// Navigation initialization
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.padding = '0.5rem 0';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Virtual Tour initialization
function initVirtualTour() {
    const tourViewer = document.getElementById('tour-viewer');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const fullscreenBtn = document.getElementById('fullscreen');
    const audioGuideBtn = document.getElementById('audio-guide');
    
    // Simulate loading a 360 tour
    simulateTourLoading(tourViewer);
    
    // Add event listeners to control buttons
    zoomInBtn.addEventListener('click', function() {
        zoomTour(1.2);
        showNotification('Zooming in', 'success');
    });
    
    zoomOutBtn.addEventListener('click', function() {
        zoomTour(0.8);
        showNotification('Zooming out', 'success');
    });
    
    fullscreenBtn.addEventListener('click', function() {
        toggleFullscreen(tourViewer);
    });
    
    audioGuideBtn.addEventListener('click', function() {
        toggleAudioGuide();
    });
    
    // Add hotspot functionality
    createTourHotspots(tourViewer);
}

// Simulate tour loading
function simulateTourLoading(container) {
    // Show loading spinner
    const spinner = container.querySelector('.loading-spinner');
    
    // Simulate loading time
    setTimeout(() => {
        // Remove spinner
        spinner.style.display = 'none';
        
        // Create a simulated 360 viewer
        const tourContent = document.createElement('div');
        tourContent.className = 'tour-content';
        tourContent.innerHTML = `
            <img src="assets/360-images/rumket-preview.jpg" alt="Rumket Monastery 360 View" class="tour-image">
            <div class="hotspot" style="top: 45%; left: 30%" data-info="Main Prayer Hall">
                <div class="hotspot-marker"></div>
                <div class="hotspot-tooltip">Main Prayer Hall</div>
            </div>
            <div class="hotspot" style="top: 60%; left: 70%" data-info="Golden Stupa">
                <div class="hotspot-marker"></div>
                <div class="hotspot-tooltip">Golden Stupa</div>
            </div>
        `;
        
        container.appendChild(tourContent);
        
        // Initialize tour interaction
        initTourInteraction(tourContent);
        
    }, 2000);
}

// Initialize tour interaction
function initTourInteraction(tourContent) {
    const image = tourContent.querySelector('.tour-image');
    let isDragging = false;
    let startX, startY;
    let currentX = 0;
    
    // Mouse events for dragging
    image.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        image.style.cursor = 'grabbing';
    });
    
    document.addEventListener('mouseup', function() {
        isDragging = false;
        image.style.cursor = 'grab';
    });
    
    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        
        const deltaX = e.clientX - startX;
        currentX += deltaX * 0.5;
        
        // Apply rotation to image
        image.style.transform = `rotateY(${currentX}deg)`;
        
        startX = e.clientX;
        startY = e.clientY;
    });
    
    // Touch events for mobile
    image.addEventListener('touchstart', function(e) {
        isDragging = true;
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        e.preventDefault();
    });
    
    document.addEventListener('touchend', function() {
        isDragging = false;
    });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        
        const deltaX = e.touches[0].clientX - startX;
        currentX += deltaX * 0.5;
        
        // Apply rotation to image
        image.style.transform = `rotateY(${currentX}deg)`;
        
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        
        e.preventDefault();
    });
}

// Create tour hotspots
function createTourHotspots(container) {
    // Hotspots are created in the simulateTourLoading function
    // This function would handle more complex hotspot logic in a real implementation
}

// Zoom tour function
function zoomTour(factor) {
    const tourContent = document.querySelector('.tour-content');
    if (!tourContent) return;
    
    const image = tourContent.querySelector('.tour-image');
    if (!image) return;
    
    let currentScale = parseFloat(image.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1;
    currentScale *= factor;
    
    // Limit zoom range
    currentScale = Math.max(0.5, Math.min(3, currentScale));
    
    image.style.transform = `${image.style.transform.replace(/scale\([^)]+\)/, '')} scale(${currentScale})`;
}

// Toggle fullscreen
function toggleFullscreen(element) {
    if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

// Toggle audio guide
function toggleAudioGuide() {
    const audioGuideBtn = document.getElementById('audio-guide');
    const isActive = audioGuideBtn.classList.contains('active');
    
    if (isActive) {
        // Stop audio guide
        audioGuideBtn.classList.remove('active');
        audioGuideBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        showNotification('Audio guide stopped', 'info');
    } else {
        // Start audio guide
        audioGuideBtn.classList.add('active');
        audioGuideBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        showNotification('Audio guide started', 'success');
        
        // Simulate audio playback
        simulateAudioPlayback();
    }
}

// Simulate audio playback
function simulateAudioPlayback() {
    // In a real implementation, this would play actual audio
    console.log('Audio guide simulation started');
}

// Interactive Map initialization
function initInteractiveMap() {
    // This is a simplified implementation
    // In a real project, you would use a library like Leaflet or Mapbox
    
    const mapContainer = document.getElementById('interactive-map');
    
    // Create a simple SVG map representation
    const svgMap = createSikkimMap();
    mapContainer.appendChild(svgMap);
    
    // Add monastery markers
    addMonasteryMarkers(svgMap);
    
    // Add search functionality
    initMapSearch();
    
    // Add filter functionality
    initMapFilters();
}

// Create SVG map of Sikkim
function createSikkimMap() {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 800 600");
    svg.setAttribute("class", "svg-map");
    
    // Create Sikkim outline
    const sikkimPath = document.createElementNS(svgNS, "path");
    sikkimPath.setAttribute("d", "M400,100 L500,150 L550,250 L500,350 L400,400 L300,350 L250,250 L300,150 Z");
    sikkimPath.setAttribute("fill", "#e9ecef");
    sikkimPath.setAttribute("stroke", "#adb5bd");
    sikkimPath.setAttribute("stroke-width", "2");
    svg.appendChild(sikkimPath);
    
    // Add district labels
    const districts = [
        { name: "North Sikkim", cx: 450, cy: 200 },
        { name: "South Sikkim", cx: 400, cy: 350 },
        { name: "East Sikkim", cx: 500, cy: 300 },
        { name: "West Sikkim", cx: 300, cy: 250 }
    ];
    
    districts.forEach(district => {
        const text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", district.cx);
        text.setAttribute("y", district.cy);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("fill", "#6c757d");
        text.setAttribute("font-size", "14");
        text.textContent = district.name;
        svg.appendChild(text);
    });
    
    return svg;
}

// Add monastery markers to the map
function addMonasteryMarkers(svg) {
    const svgNS = "http://www.w3.org/2000/svg";
    
    // Sample monastery data
    const monasteries = [
        { name: "Rumtek Monastery", cx: 500, cy: 280, type: "major" },
        { name: "Pemayangtse Monastery", cx: 300, cy: 280, type: "major" },
        { name: "Tashiding Monastery", cx: 280, cy: 220, type: "medium" },
        { name: "Enchey Monastery", cx: 480, cy: 250, type: "medium" },
        { name: "Phodong Monastery", cx: 450, cy: 180, type: "medium" },
        { name: "Ralang Monastery", cx: 320, cy: 320, type: "medium" }
    ];
    
    monasteries.forEach(monastery => {
        // Create marker
        const marker = document.createElementNS(svgNS, "circle");
        marker.setAttribute("cx", monastery.cx);
        marker.setAttribute("cy", monastery.cy);
        marker.setAttribute("r", monastery.type === "major" ? "8" : "5");
        marker.setAttribute("fill", monastery.type === "major" ? "#8e7dbe" : "#d4af37");
        marker.setAttribute("stroke", "#fff");
        marker.setAttribute("stroke-width", "2");
        marker.setAttribute("class", "monastery-marker");
        marker.setAttribute("data-name", monastery.name);
        
        // Add hover effect
        marker.addEventListener('mouseover', function() {
            showMapTooltip(monastery.name, monastery.cx, monastery.cy);
            marker.setAttribute("r", monastery.type === "major" ? "10" : "7");
        });
        
        marker.addEventListener('mouseout', function() {
            hideMapTooltip();
            marker.setAttribute("r", monastery.type === "major" ? "8" : "5");
        });
        
        // Add click event
        marker.addEventListener('click', function() {
            showMonasteryDetails(monastery.name);
        });
        
        svg.appendChild(marker);
    });
}

// Show map tooltip
function showMapTooltip(name, x, y) {
    // Remove existing tooltip if any
    hideMapTooltip();
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'map-tooltip';
    tooltip.textContent = name;
    tooltip.style.position = 'absolute';
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y - 30}px`;
    tooltip.style.transform = 'translateX(-50%)';
    
    document.getElementById('interactive-map').appendChild(tooltip);
}

// Hide map tooltip
function hideMapTooltip() {
    const existingTooltip = document.querySelector('.map-tooltip');
    if (existingTooltip) {
        existingTooltip.remove();
    }
}

// Show monastery details
function showMonasteryDetails(name) {
    showNotification(`Showing details for ${name}`, 'info');
    
    // In a real implementation, this would show a modal or sidebar with details
}

// Initialize map search
function initMapSearch() {
    const searchBox = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    searchButton.addEventListener('click', function() {
        performMapSearch(searchBox.value);
    });
    
    searchBox.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performMapSearch(searchBox.value);
        }
    });
}

// Perform map search
function performMapSearch(query) {
    if (!query.trim()) {
        showNotification('Please enter a search term', 'warning');
        return;
    }
    
    showNotification(`Searching for "${query}"`, 'info');
    
    // In a real implementation, this would filter monasteries
}

// Initialize map filters
function initMapFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-options input');
    
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            applyMapFilters();
        });
    });
}

// Apply map filters
function applyMapFilters() {
    const selectedFilters = Array.from(document.querySelectorAll('.filter-options input:checked'))
        .map(checkbox => checkbox.parentElement.textContent.trim());
    
    showNotification(`Applying filters: ${selectedFilters.join(', ')}`, 'info');
    
    // In a real implementation, this would filter the monasteries
}

// Cultural Calendar initialization
function initCulturalCalendar() {
    generateCalendarDays();
    initCalendarNavigation();
}

// Generate calendar days
function generateCalendarDays() {
    const calendarDays = document.querySelector('.calendar-days');
    calendarDays.innerHTML = '';
    
    // Sample implementation for September 2023
    // First day of September 2023 is Friday (0=Sun, 1=Mon, ..., 5=Fri, 6=Sat)
    const firstDay = 5;
    const daysInMonth = 30;
    
    // Add empty days for dates before the first day of the month
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        // Mark current day
        if (day === new Date().getDate() && new Date().getMonth() === 8) {
            dayElement.classList.add('current');
        }
        
        // Mark days with events
        if ([15, 22, 27].includes(day)) {
            dayElement.classList.add('event');
            
            // Add click event to show event details
            dayElement.addEventListener('click', function() {
                showEventDetails(day);
            });
        }
        
        calendarDays.appendChild(dayElement);
    }
}

// Initialize calendar navigation
function initCalendarNavigation() {
    const prevButton = document.querySelector('.calendar-header .nav-button:first-child');
    const nextButton = document.querySelector('.calendar-header .nav-button:last-child');
    const monthYearElement = document.querySelector('.calendar-header h3');
    
    let currentDate = new Date(2023, 8, 1); // September 2023
    
    prevButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        updateCalendar(currentDate);
    });
    
    nextButton.addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        updateCalendar(currentDate);
    });
}

// Update calendar
function updateCalendar(date) {
    const monthYearElement = document.querySelector('.calendar-header h3');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
    
    monthYearElement.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    
    // Regenerate calendar days for the new month
    generateCalendarDays();
}

// Show event details
function showEventDetails(day) {
    const events = {
        15: {
            title: 'Pang Lhabsol Festival',
            location: 'Tsuklakhang Monastery • Gangtok',
            description: 'Pang Lhabsol is a unique festival of Sikkim where the Mount Kangchenjunga is worshipped. This festival was introduced by the third Chogyal of Sikkim, Chakdor Namgyal.'
        },
        22: {
            title: 'Mask Dance Performance',
            location: 'Rumtek Monastery • East Sikkim',
            description: 'Traditional Cham mask dance performed by the monks of Rumtek Monastery. The dance is a form of meditation and an offering to the deities.'
        },
        27: {
            title: 'Prayer Flag Hoisting Ceremony',
            location: 'Tashiding Monastery • West Sikkim',
            description: 'Special ceremony for hoisting prayer flags to spread peace and compassion to all beings. Participants can write prayers on the flags before they are hoisted.'
        }
    };
    
    const event = events[day];
    if (event) {
        showNotification(`Event on September ${day}: ${event.title}`, 'info');
        
        // In a real implementation, this would show a modal with event details
    }
}

// Initialize scroll animations
function initScrollAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.feature-card, .section-title, .tour-container, .map-container, .calendar-container');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize newsletter form
function initNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address', 'warning');
            return;
        }
        
        // Simulate form submission
        simulateNewsletterSignup(email);
        
        // Clear input
        emailInput.value = '';
    });
}

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Simulate newsletter signup
function simulateNewsletterSignup(email) {
    // Show loading state
    const button = document.querySelector('.newsletter-form button');
    const originalText = button.textContent;
    button.textContent = 'Subscribing...';
    button.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        button.textContent = 'Subscribed!';
        button.style.backgroundColor = '#28a745';
        
        showNotification('Thank you for subscribing to our newsletter!', 'success');
        
        // Reset button after delay
        setTimeout(() => {
            button.textContent = originalText;
            button.style.backgroundColor = '';
            button.disabled = false;
        }, 2000);
    }, 1500);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: var(--border-radius);
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
        box-shadow: var(--shadow-lg);
    }
    
    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-info {
        background-color: var(--primary-color);
    }
    
    .notification-success {
        background-color: var(--success-color);
    }
    
    .notification-warning {
        background-color: var(--warning-color);
        color: #333;
    }
    
    .notification-error {
        background-color: var(--danger-color);
    }
`;
document.head.appendChild(notificationStyles);

// Add CSS for animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .feature-card, .section-title, .tour-container, .map-container, .calendar-container {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .feature-card {
        transition-delay: 0.1s;
    }
    
    .feature-card:nth-child(2) {
        transition-delay: 0.2s;
    }
    
    .feature-card:nth-child(3) {
        transition-delay: 0.3s;
    }
    
    .feature-card:nth-child(4) {
        transition-delay: 0.4s;
    }
`;
document.head.appendChild(animationStyles);