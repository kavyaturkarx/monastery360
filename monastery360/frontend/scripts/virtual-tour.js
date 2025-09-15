// Virtual Tour functionality for Monastery360
class VirtualTour {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.currentScene = null;
        this.isFullscreen = false;
        this.audioGuide = null;
        this.isAudioPlaying = false;
        this.hotspots = [];
        this.init();
    }

    init() {
        this.loadTourData();
        this.setupEventListeners();
        this.loadScene('rumtek-main');
    }

    loadTourData() {
        // Sample tour data - in a real app, this would come from an API
        this.tourData = {
            scenes: {
                'rumtek-main': {
                    title: 'Rumtek Monastery - Main Prayer Hall',
                    image: 'assets/360-images/rumtek-main.jpg',
                    hotspots: [
                        {
                            pitch: 0,
                            yaw: 0,
                            type: 'info',
                            text: 'Main Altar - This is the central altar where the main ceremonies take place.',
                            title: 'Main Altar'
                        },
                        {
                            pitch: 10,
                            yaw: 90,
                            type: 'info',
                            text: 'Ancient Thangka - This 300-year-old thangka depicts the life of Buddha.',
                            title: 'Ancient Thangka'
                        },
                        {
                            pitch: -20,
                            yaw: 180,
                            type: 'scene',
                            text: 'Move to Courtyard',
                            sceneId: 'rumtek-courtyard',
                            title: 'Courtyard'
                        }
                    ]
                },
                'rumtek-courtyard': {
                    title: 'Rumtek Monastery - Courtyard',
                    image: 'assets/360-images/rumtek-courtyard.jpg',
                    hotspots: [
                        {
                            pitch: 0,
                            yaw: 0,
                            type: 'info',
                            text: 'Prayer Wheels - Devotees spin these wheels to send prayers to heaven.',
                            title: 'Prayer Wheels'
                        },
                        {
                            pitch: 10,
                            yaw: -90,
                            type: 'scene',
                            text: 'Move to Main Hall',
                            sceneId: 'rumtek-main',
                            title: 'Main Hall'
                        },
                        {
                            pitch: -30,
                            yaw: 180,
                            type: 'info',
                            text: 'Stupa - This golden stupa contains relics of important Buddhist masters.',
                            title: 'Golden Stupa'
                        }
                    ]
                }
            },
            audioGuide: {
                'rumtek-main': [
                    { time: 0, text: 'Welcome to the main prayer hall of Rumtek Monastery.' },
                    { time: 5, text: 'This hall was constructed in the 16th century and has been meticulously preserved.' },
                    { time: 10, text: 'The intricate murals on the walls depict scenes from the life of Buddha and important Buddhist teachings.' },
                    { time: 20, text: 'The central statue is of Shakyamuni Buddha, flanked by his two main disciples.' }
                ],
                'rumtek-courtyard': [
                    { time: 0, text: 'You are now in the courtyard of Rumtek Monastery.' },
                    { time: 5, text: 'The courtyard is used for ceremonial dances and gatherings during festivals.' },
                    { time: 10, text: 'The prayer wheels along the walls contain millions of mantras. Spinning them is believed to bring merit and purify negative karma.' },
                    { time: 20, text: 'The golden stupa in the corner contains relics of important Buddhist masters and is a focal point for devotion.' }
                ]
            }
        };
    }

    loadScene(sceneId) {
        const scene = this.tourData.scenes[sceneId];
        if (!scene) return;

        this.currentScene = sceneId;
        
        // Update tour viewer
        this.container.innerHTML = `
            <div class="tour-scene">
                <img src="${scene.image}" alt="${scene.title}" class="tour-image">
                <div class="loading-spinner"></div>
            </div>
            <div class="scene-title">${scene.title}</div>
        `;
        
        const tourImage = this.container.querySelector('.tour-image');
        const spinner = this.container.querySelector('.loading-spinner');
        
        // Simulate image loading
        tourImage.onload = () => {
            setTimeout(() => {
                spinner.style.display = 'none';
                this.createHotspots(scene.hotspots);
                this.startAudioGuide();
            }, 1000);
        };
        
        // If image fails to load, still remove spinner after a while
        setTimeout(() => {
            spinner.style.display = 'none';
        }, 3000);
        
        // Update scene info
        this.updateSceneInfo(sceneId);
    }

    createHotspots(hotspots) {
        // Clear existing hotspots
        this.hotspots.forEach(hotspot => hotspot.remove());
        this.hotspots = [];
        
        // Create new hotspots
        hotspots.forEach(hotspotData => {
            const hotspot = document.createElement('div');
            hotspot.className = `hotspot hotspot-${hotspotData.type}`;
            hotspot.innerHTML = `
                <div class="hotspot-marker"></div>
                <div class="hotspot-tooltip">${hotspotData.title}</div>
            `;
            
            // Position the hotspot (simplified positioning)
            const pitch = hotspotData.pitch || 0;
            const yaw = hotspotData.yaw || 0;
            
            hotspot.style.top = `${50 - pitch * 0.5}%`;
            hotspot.style.left = `${50 + yaw * 0.3}%`;
            
            // Add click event
            hotspot.addEventListener('click', () => {
                if (hotspotData.type === 'info') {
                    this.showInfoPopup(hotspotData);
                } else if (hotspotData.type === 'scene') {
                    this.loadScene(hotspotData.sceneId);
                }
            });
            
            this.container.querySelector('.tour-scene').appendChild(hotspot);
            this.hotspots.push(hotspot);
        });
    }

    showInfoPopup(hotspotData) {
        const popup = document.createElement('div');
        popup.className = 'hotspot-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h3>${hotspotData.title}</h3>
                <p>${hotspotData.text}</p>
                <button class="popup-close">&times;</button>
            </div>
        `;
        
        document.body.appendChild(popup);
        
        // Close popup when clicking close button or outside
        popup.querySelector('.popup-close').addEventListener('click', () => popup.remove());
        popup.addEventListener('click', (e) => {
            if (e.target === popup) popup.remove();
        });
    }

    startAudioGuide() {
        // Stop current audio if playing
        this.stopAudioGuide();
        
        const audioData = this.tourData.audioGuide[this.currentScene];
        if (!audioData) return;
        
        // Create audio guide UI
        const audioGuide = document.createElement('div');
        audioGuide.className = 'audio-guide';
        audioGuide.innerHTML = `
            <div class="audio-title">Audio Guide</div>
            <div class="audio-controls">
                <button class="audio-play"><i class="fas fa-play"></i></button>
                <button class="audio-pause" style="display: none;"><i class="fas fa-pause"></i></button>
                <div class="audio-progress">
                    <div class="progress-bar"></div>
                </div>
                <div class="audio-time">0:00</div>
            </div>
            <div class="audio-transcript"></div>
        `;
        
        this.container.appendChild(audioGuide);
        this.audioGuide = audioGuide;
        
        // Populate transcript
        const transcript = audioGuide.querySelector('.audio-transcript');
        audioData.forEach(segment => {
            const p = document.createElement('p');
            p.textContent = segment.text;
            p.setAttribute('data-time', segment.time);
            transcript.appendChild(p);
        });
        
        // Set up event listeners for audio controls
        this.setupAudioControls();
    }

    stopAudioGuide() {
        if (this.audioGuide) {
            this.audioGuide.remove();
            this.audioGuide = null;
        }
        this.isAudioPlaying = false;
    }

    setupAudioControls() {
        const playButton = this.audioGuide.querySelector('.audio-play');
        const pauseButton = this.audioGuide.querySelector('.audio-pause');
        const progressBar = this.audioGuide.querySelector('.progress-bar');
        
        playButton.addEventListener('click', () => {
            this.playAudioGuide();
            playButton.style.display = 'none';
            pauseButton.style.display = 'block';
        });
        
        pauseButton.addEventListener('click', () => {
            this.pauseAudioGuide();
            pauseButton.style.display = 'none';
            playButton.style.display = 'display';
        });
        
        // Simulate audio progress (in a real app, this would use actual audio)
        this.audioProgressInterval = setInterval(() => {
            if (this.isAudioPlaying) {
                const currentTime = parseInt(progressBar.style.width || '0') + 1;
                if (currentTime <= 100) {
                    progressBar.style.width = `${currentTime}%`;
                    
                    // Update time display
                    const minutes = Math.floor(currentTime * 30 / 100);
                    const seconds = Math.floor((currentTime * 30 / 100 - minutes) * 60);
                    this.audioGuide.querySelector('.audio-time').textContent = 
                        `${minutes}:${seconds.toString().padStart(2, '0')}`;
                    
                    // Highlight current transcript segment
                    this.highlightTranscript(currentTime * 30 / 100);
                } else {
                    this.pauseAudioGuide();
                    pauseButton.style.display = 'none';
                    playButton.style.display = 'block';
                    progressBar.style.width = '0%';
                }
            }
        }, 100);
    }

    playAudioGuide() {
        this.isAudioPlaying = true;
        // In a real app, this would play actual audio
    }

    pauseAudioGuide() {
        this.isAudioPlaying = false;
        // In a real app, this would pause actual audio
    }

    highlightTranscript(currentTime) {
        const segments = this.audioGuide.querySelectorAll('.audio-transcript p');
        segments.forEach(segment => {
            const segmentTime = parseInt(segment.getAttribute('data-time'));
            if (currentTime >= segmentTime && currentTime < segmentTime + 5) {
                segment.classList.add('active');
            } else {
                segment.classList.remove('active');
            }
        });
    }

    updateSceneInfo(sceneId) {
        const scene = this.tourData.scenes[sceneId];
        if (!scene) return;
        
        const infoContainer = document.querySelector('.tour-info');
        if (infoContainer) {
            infoContainer.querySelector('h3').textContent = scene.title;
            
            // Update hotspot list
            const hotspotList = infoContainer.querySelector('.hotspot-list');
            if (hotspotList) {
                hotspotList.innerHTML = scene.hotspots.map(hotspot => 
                    `<li>${hotspot.title}: ${hotspot.text}</li>`
                ).join('');
            }
        }
    }

    setupEventListeners() {
        // Zoom controls
        document.getElementById('zoom-in').addEventListener('click', () => this.zoom(1.2));
        document.getElementById('zoom-out').addEventListener('click', () => this.zoom(0.8));
        
        // Fullscreen toggle
        document.getElementById('fullscreen').addEventListener('click', () => this.toggleFullscreen());
        
        // Audio guide toggle
        document.getElementById('audio-guide').addEventListener('click', () => this.toggleAudioGuide());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isFullscreen) {
                this.toggleFullscreen();
            } else if (e.key === ' ') {
                this.toggleAudioGuide();
            } else if (e.key === '+') {
                this.zoom(1.2);
            } else if (e.key === '-') {
                this.zoom(0.8);
            }
        });
        
        // Handle image dragging for 360 effect
        this.setupDragToLook();
    }

    zoom(factor) {
        const tourImage = this.container.querySelector('.tour-image');
        if (!tourImage) return;
        
        let currentScale = parseFloat(tourImage.style.transform?.match(/scale\(([^)]+)\)/)?.[1]) || 1;
        currentScale = Math.max(0.5, Math.min(3, currentScale * factor));
        
        tourImage.style.transform = `scale(${currentScale})`;
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            if (this.container.requestFullscreen) {
                this.container.requestFullscreen();
            } else if (this.container.webkitRequestFullscreen) {
                this.container.webkitRequestFullscreen();
            } else if (this.container.msRequestFullscreen) {
                this.container.msRequestFullscreen();
            }
            this.isFullscreen = true;
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            this.isFullscreen = false;
        }
    }

    toggleAudioGuide() {
        if (this.audioGuide) {
            this.stopAudioGuide();
        } else {
            this.startAudioGuide();
        }
    }

    setupDragToLook() {
        let isDragging = false;
        let startX, startY;
        let rotationX = 0;
        let rotationY = 0;
        
        this.container.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            this.container.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.container.style.cursor = 'grab';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            rotationY += deltaX * 0.5;
            rotationX += deltaY * 0.5;
            
            // Limit vertical rotation to avoid flipping
            rotationX = Math.max(-90, Math.min(90, rotationX));
            
            const tourImage = this.container.querySelector('.tour-image');
            if (tourImage) {
                tourImage.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
            }
            
            startX = e.clientX;
            startY = e.clientY;
        });
        
        // Touch events for mobile
        this.container.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            e.preventDefault();
        });
        
        document.addEventListener('touchend', () => {
            isDragging = false;
        });
        
        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const deltaY = e.touches[0].clientY - startY;
            
            rotationY += deltaX * 0.5;
            rotationX += deltaY * 0.5;
            
            // Limit vertical rotation to avoid flipping
            rotationX = Math.max(-90, Math.min(90, rotationX));
            
            const tourImage = this.container.querySelector('.tour-image');
            if (tourImage) {
                tourImage.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
            }
            
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            
            e.preventDefault();
        });
    }
}

// Initialize the virtual tour when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const virtualTour = new VirtualTour('tour-viewer');
});