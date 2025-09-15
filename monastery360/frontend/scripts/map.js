// Interactive Map functionality for Monastery360
class MonasteryMap {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.monasteries = [];
        this.currentPopup = null;
        this.init();
    }

    init() {
        this.loadMonasteryData();
        this.renderMap();
        this.setupEventListeners();
    }

    loadMonasteryData() {
        // Sample data - in a real app, this would come from an API
        this.monasteries = [
            {
                id: 1,
                name: "Rumtek Monastery",
                lat: 27.2860,
                lng: 88.5762,
                type: "major",
                century: "16th",
                rating: 4.8,
                description: "One of the most significant monasteries in Sikkim, serving as the seat of the Karma Kagyu lineage.",
                image: "assets/images/rumtek.jpg",
                virtualTour: true,
                events: ["Mask Dance Festival", "Annual Prayers"]
            },
            {
                id: 2,
                name: "Pemayangtse Monastery",
                lat: 27.3065,
                lng: 88.2206,
                type: "major",
                century: "17th",
                rating: 4.7,
                description: "One of the oldest monasteries in Sikkim, known for its ancient architecture and sacred artifacts.",
                image: "assets/images/pemayangtse.jpg",
                virtualTour: true,
                events: ["Pang Lhabsol", "New Year Celebrations"]
            },
            {
                id: 3,
                name: "Tashiding Monastery",
                lat: 27.3167,
                lng: 88.2667,
                type: "medium",
                century: "17th",
                rating: 4.6,
                description: "A sacred monastery known for its spiritual significance and beautiful location.",
                image: "assets/images/tashiding.jpg",
                virtualTour: false,
                events: ["Bhumchu Festival", "Special Prayers"]
            },
            {
                id: 4,
                name: "Enchey Monastery",
                lat: 27.3389,
                lng: 88.6167,
                type: "medium",
                century: "19th",
                rating: 4.5,
                description: "A beautiful monastery near Gangtok, known for its peaceful atmosphere.",
                image: "assets/images/enchey.jpg",
                virtualTour: true,
                events: ["Chaam Dance", "Lama Dance"]
            },
            {
                id: 5,
                name: "Phodong Monastery",
                lat: 27.3833,
                lng: 88.5667,
                type: "medium",
                century: "18th",
                rating: 4.4,
                description: "An important monastery of the Kagyupa sect, known for its ancient murals.",
                image: "assets/images/phodong.jpg",
                virtualTour: false,
                events: ["Annual Festival", "Special Pujas"]
            },
            {
                id: 6,
                name: "Ralang Monastery",
                lat: 27.2833,
                lng: 88.4167,
                type: "medium",
                century: "18th",
                rating: 4.3,
                description: "A beautiful monastery known for its architecture and religious significance.",
                image: "assets/images/ralang.jpg",
                virtualTour: true,
                events: ["Sacred Music Festival", "Cultural Events"]
            }
        ];
    }

    renderMap() {
        // Create SVG element for the map
        this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        this.svg.setAttribute("viewBox", "0 0 800 600");
        this.svg.setAttribute("class", "svg-map");
        this.container.appendChild(this.svg);

        // Draw Sikkim outline
        this.drawSikkimOutline();

        // Add district labels
        this.addDistrictLabels();

        // Add monastery markers
        this.addMonasteryMarkers();

        // Add zoom controls
        this.addZoomControls();
    }

    drawSikkimOutline() {
        const sikkimPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
        sikkimPath.setAttribute("d", "M400,100 L500,150 L550,250 L500,350 L400,400 L300,350 L250,250 L300,150 Z");
        sikkimPath.setAttribute("fill", "#e9ecef");
        sikkimPath.setAttribute("stroke", "#adb5bd");
        sikkimPath.setAttribute("stroke-width", "2");
        sikkimPath.setAttribute("class", "sikkim-outline");
        this.svg.appendChild(sikkimPath);
    }

    addDistrictLabels() {
        const districts = [
            { name: "North Sikkim", cx: 450, cy: 200, fontSize: 14 },
            { name: "South Sikkim", cx: 400, cy: 350, fontSize: 14 },
            { name: "East Sikkim", cx: 500, cy: 300, fontSize: 14 },
            { name: "West Sikkim", cx: 300, cy: 250, fontSize: 14 }
        ];

        districts.forEach(district => {
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", district.cx);
            text.setAttribute("y", district.cy);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "#6c757d");
            text.setAttribute("font-size", district.fontSize);
            text.setAttribute("class", "district-label");
            text.textContent = district.name;
            this.svg.appendChild(text);
        });
    }

    addMonasteryMarkers() {
        this.monasteries.forEach(monastery => {
            const marker = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            marker.setAttribute("cx", monastery.lat * 10 + 200); // Simplified positioning
            marker.setAttribute("cy", monastery.lng * 5 + 100);  // Simplified positioning
            marker.setAttribute("r", monastery.type === "major" ? "8" : "5");
            marker.setAttribute("fill", monastery.type === "major" ? "#8e7dbe" : "#d4af37");
            marker.setAttribute("stroke", "#fff");
            marker.setAttribute("stroke-width", "2");
            marker.setAttribute("class", "monastery-marker");
            marker.setAttribute("data-id", monastery.id);
            
            // Add hover effects
            marker.addEventListener('mouseover', () => this.showTooltip(monastery));
            marker.addEventListener('mouseout', () => this.hideTooltip());
            marker.addEventListener('click', () => this.showMonasteryDetails(monastery));
            
            this.svg.appendChild(marker);
        });
    }

    addZoomControls() {
        const zoomControls = document.createElement('div');
        zoomControls.className = 'map-zoom-controls';
        zoomControls.innerHTML = `
            <button class="zoom-in"><i class="fas fa-plus"></i></button>
            <button class="zoom-out"><i class="fas fa-minus"></i></button>
        `;
        this.container.appendChild(zoomControls);

        // Add event listeners for zoom buttons
        zoomControls.querySelector('.zoom-in').addEventListener('click', () => this.zoom(1.2));
        zoomControls.querySelector('.zoom-out').addEventListener('click', () => this.zoom(0.8));
    }

    showTooltip(monastery) {
        this.hideTooltip();
        
        this.currentPopup = document.createElement('div');
        this.currentPopup.className = 'map-tooltip';
        this.currentPopup.innerHTML = `
            <h4>${monastery.name}</h4>
            <p>${monastery.century} Century • ${monastery.rating} ★</p>
        `;
        
        // Position the tooltip near the marker
        const marker = this.svg.querySelector(`[data-id="${monastery.id}"]`);
        const rect = this.container.getBoundingClientRect();
        const markerX = parseFloat(marker.getAttribute('cx'));
        const markerY = parseFloat(marker.getAttribute('cy'));
        
        this.currentPopup.style.position = 'absolute';
        this.currentPopup.style.left = `${markerX + rect.left}px`;
        this.currentPopup.style.top = `${markerY + rect.top - 50}px`;
        this.currentPopup.style.transform = 'translateX(-50%)';
        
        document.body.appendChild(this.currentPopup);
    }

    hideTooltip() {
        if (this.currentPopup) {
            this.currentPopup.remove();
            this.currentPopup = null;
        }
    }

    showMonasteryDetails(monastery) {
        // Create a modal with monastery details
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${monastery.name}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="monastery-details">
                        <div class="monastery-image">
                            <img src="${monastery.image}" alt="${monastery.name}">
                        </div>
                        <div class="monastery-info">
                            <p><strong>Century:</strong> ${monastery.century}</p>
                            <p><strong>Rating:</strong> ${monastery.rating} ★</p>
                            <p><strong>Virtual Tour:</strong> ${monastery.virtualTour ? 'Available' : 'Coming Soon'}</p>
                            <p>${monastery.description}</p>
                            <div class="monastery-events">
                                <h4>Events & Festivals</h4>
                                <ul>
                                    ${monastery.events.map(event => `<li>${event}</li>`).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn-primary">View Virtual Tour</button>
                    <button class="btn-secondary">Get Directions</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        
        // Close modal when clicking close button or outside
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.classList.remove('show');
            setTimeout(() => modal.remove(), 300);
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
                setTimeout(() => modal.remove(), 300);
            }
        });
    }

    zoom(factor) {
        const currentScale = parseFloat(this.svg.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1;
        const newScale = Math.max(0.5, Math.min(3, currentScale * factor));
        
        this.svg.style.transform = `scale(${newScale})`;
        this.svg.style.transformOrigin = 'center';
    }

    setupEventListeners() {
        // Enable panning on the map
        let isDragging = false;
        let startX, startY;
        let translateX = 0, translateY = 0;
        
        this.svg.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX - translateX;
            startY = e.clientY - translateY;
            this.svg.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.svg.style.cursor = 'grab';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            translateX = e.clientX - startX;
            translateY = e.clientY - startY;
            
            this.svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${parseFloat(this.svg.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1})`;
        });
        
        // Touch events for mobile
        this.svg.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX - translateX;
            startY = e.touches[0].clientY - translateY;
            e.preventDefault();
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            translateX = e.touches[0].clientX - startX;
            translateY = e.touches[0].clientY - startY;
            
            this.svg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${parseFloat(this.svg.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1})`;
            
            e.preventDefault();
        });
        
        // Filter functionality
        const filterCheckboxes = document.querySelectorAll('.filter-options input');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });
        
        // Search functionality
        const searchInput = document.querySelector('.search-box input');
        const searchButton = document.querySelector('.search-box button');
        
        searchButton.addEventListener('click', () => this.performSearch(searchInput.value));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch(searchInput.value);
        });
    }

    applyFilters() {
        const selectedFilters = {
            century17: document.querySelector('input[value="17th"]').checked,
            century18: document.querySelector('input[value="18th"]').checked,
            openToVisitors: document.querySelector('input[value="open"]').checked,
            virtualTour: document.querySelector('input[value="virtual"]').checked
        };
        
        // Show/hide markers based on filters
        this.monasteries.forEach(monastery => {
            const marker = this.svg.querySelector(`[data-id="${monastery.id}"]`);
            if (!marker) return;
            
            let shouldShow = true;
            
            // Century filter
            if (selectedFilters.century17 && monastery.century !== "17th") {
                shouldShow = false;
            }
            
            if (selectedFilters.century18 && monastery.century !== "18th") {
                shouldShow = false;
            }
            
            // Virtual tour filter
            if (selectedFilters.virtualTour && !monastery.virtualTour) {
                shouldShow = false;
            }
            
            marker.style.display = shouldShow ? 'block' : 'none';
        });
    }

    performSearch(query) {
        if (!query.trim()) {
            // Reset all markers if search is empty
            this.svg.querySelectorAll('.monastery-marker').forEach(marker => {
                marker.style.display = 'block';
            });
            return;
        }
        
        const searchTerm = query.toLowerCase();
        
        // Filter monasteries based on search term
        this.monasteries.forEach(monastery => {
            const marker = this.svg.querySelector(`[data-id="${monastery.id}"]`);
            if (!marker) return;
            
            const matches = monastery.name.toLowerCase().includes(searchTerm) ||
                           monastery.description.toLowerCase().includes(searchTerm) ||
                           monastery.century.toLowerCase().includes(searchTerm) ||
                           monastery.events.some(event => event.toLowerCase().includes(searchTerm));
            
            marker.style.display = matches ? 'block' : 'none';
        });
    }
}

// Initialize the map when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const monasteryMap = new MonasteryMap('interactive-map');
});