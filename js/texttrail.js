class TextTrail {
    constructor(options = {}) {
        this.text = options.text || '';
        this.fontFamily = options.fontFamily || 'Raleway';
        this.fontWeight = options.fontWeight || '900';
        this.noiseFactor = options.noiseFactor || 1.2;
        this.noiseScale = options.noiseScale || 0.001;
        this.rgbPersistFactor = options.rgbPersistFactor || 0.95;
        this.alphaPersistFactor = options.alphaPersistFactor || 0.92;
        this.animateColor = options.animateColor !== undefined ? options.animateColor : true;
        this.startColor = options.startColor || '#ff6b6b';
        this.textColor = options.textColor || '#4ecdc4';
        this.backgroundColor = options.backgroundColor || 'transparent';
        this.colorCycleInterval = options.colorCycleInterval || 2000;
        this.supersample = options.supersample || 2;
        
        this.canvas = null;
        this.ctx = null;
        this.imageData = null;
        this.trailBuffer = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.time = 0;
        this.colorPhase = 0;
        this.animationId = null;
        
        this.init();
    }
    
    init() {
        console.log('TextTrail init called');
        try {
            this.setupCanvas();
            this.setupEventListeners();
            this.animate();
            console.log('TextTrail init completed successfully');
        } catch (error) {
            console.error('TextTrail init error:', error);
            throw error;
        }
    }
    
    setupCanvas() {
        console.log('Setting up canvas...');
        this.canvas = document.createElement('canvas');
        this.canvas.style.display = 'block';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '120px';
        this.canvas.style.maxWidth = '800px';
        this.canvas.style.margin = '0 auto';
        
        this.ctx = this.canvas.getContext('2d');
        console.log('Canvas context obtained');
        
        // Set fixed dimensions first
        this.canvas.width = 800;
        this.canvas.height = 120;
        
        // Initialize trail buffer
        this.imageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
        this.trailBuffer = new Uint8ClampedArray(this.imageData.data.length);
        console.log('Canvas setup completed, size:', this.canvas.width, 'x', this.canvas.height);
    }
    
    resize() {
        // Set canvas size based on text
        this.ctx.font = `${this.fontWeight} 4rem ${this.fontFamily}`;
        const metrics = this.ctx.measureText(this.text);
        const textWidth = metrics.width + 100; // padding
        const textHeight = 100; // approximate height
        
        this.canvas.style.width = `${Math.min(textWidth, 800)}px`;
        this.canvas.style.height = `${textHeight}px`;
        
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    setupEventListeners() {
        const updateMouse = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
            this.mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
        };
        
        this.canvas.addEventListener('mousemove', updateMouse);
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            if (e.touches.length > 0) {
                updateMouse(e.touches[0]);
            }
        });
        
        // Set initial mouse position to center
        this.mouseX = this.canvas.width / 2;
        this.mouseY = this.canvas.height / 2;
    }
    
    noise(x, y, time) {
        // Simple noise function
        const seed = Math.sin(x * this.noiseScale + time) * Math.cos(y * this.noiseScale + time);
        return (Math.sin(seed * 12.9898) * 43758.5453) % 1;
    }
    
    getCurrentColor() {
        if (!this.animateColor) return this.textColor;
        
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b'];
        const index = Math.floor(this.colorPhase / (this.colorCycleInterval / colors.length)) % colors.length;
        const nextIndex = (index + 1) % colors.length;
        const progress = (this.colorPhase % (this.colorCycleInterval / colors.length)) / (this.colorCycleInterval / colors.length);
        
        return this.interpolateColor(colors[index], colors[nextIndex], progress);
    }
    
    interpolateColor(color1, color2, factor) {
        const hex1 = color1.replace('#', '');
        const hex2 = color2.replace('#', '');
        
        const r1 = parseInt(hex1.substr(0, 2), 16);
        const g1 = parseInt(hex1.substr(2, 2), 16);
        const b1 = parseInt(hex1.substr(4, 2), 16);
        
        const r2 = parseInt(hex2.substr(0, 2), 16);
        const g2 = parseInt(hex2.substr(2, 2), 16);
        const b2 = parseInt(hex2.substr(4, 2), 16);
        
        const r = Math.round(r1 + factor * (r2 - r1));
        const g = Math.round(g1 + factor * (g2 - g1));
        const b = Math.round(b1 + factor * (b2 - b1));
        
        return `rgb(${r}, ${g}, ${b})`;
    }
    
    drawText() {
        // Clear canvas
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set font properties
        this.ctx.font = `${this.fontWeight} 4rem ${this.fontFamily}`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        
        // Create noise-based distortion
        const chars = this.text.split('');
        let xOffset = -this.ctx.measureText(this.text).width / 2;
        
        chars.forEach((char, i) => {
            const charWidth = this.ctx.measureText(char).width;
            const charX = centerX + xOffset + charWidth / 2;
            const charY = centerY;
            
            // Apply noise-based offset
            const noiseX = this.noise(charX, charY, this.time) * this.noiseFactor * 10;
            const noiseY = this.noise(charY, charX, this.time) * this.noiseFactor * 10;
            
            // Add mouse interaction
            const distToMouse = Math.sqrt((charX - this.mouseX) ** 2 + (charY - this.mouseY) ** 2);
            const influence = Math.max(0, 1 - distToMouse / 100);
            const attractX = (this.mouseX - charX) * influence * 0.1;
            const attractY = (this.mouseY - charY) * influence * 0.1;
            
            this.ctx.fillStyle = this.getCurrentColor();
            this.ctx.fillText(char, charX + noiseX + attractX, charY + noiseY + attractY);
            
            xOffset += charWidth;
        });
        
        // Create trail effect
        this.createTrailEffect();
    }
    
    createTrailEffect() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        // Apply persistence to create trail
        for (let i = 0; i < data.length; i += 4) {
            // RGB channels
            this.trailBuffer[i] = this.trailBuffer[i] * this.rgbPersistFactor + data[i] * (1 - this.rgbPersistFactor);
            this.trailBuffer[i + 1] = this.trailBuffer[i + 1] * this.rgbPersistFactor + data[i + 1] * (1 - this.rgbPersistFactor);
            this.trailBuffer[i + 2] = this.trailBuffer[i + 2] * this.rgbPersistFactor + data[i + 2] * (1 - this.rgbPersistFactor);
            
            // Alpha channel
            this.trailBuffer[i + 3] = Math.max(
                this.trailBuffer[i + 3] * this.alphaPersistFactor,
                data[i + 3]
            );
            
            // Apply trail buffer back to image data
            data[i] = this.trailBuffer[i];
            data[i + 1] = this.trailBuffer[i + 1];
            data[i + 2] = this.trailBuffer[i + 2];
            data[i + 3] = this.trailBuffer[i + 3];
        }
        
        this.ctx.putImageData(imageData, 0, 0);
    }
    
    animate() {
        this.time += 0.016; // ~60fps
        this.colorPhase = (this.colorPhase + 16) % this.colorCycleInterval;
        
        this.drawText();
        
        requestAnimationFrame(() => this.animate());
    }
    
    appendTo(element) {
        element.appendChild(this.canvas);
    }
    
    setText(newText) {
        this.text = newText;
        this.resize();
    }
}

// Export for use
window.TextTrail = TextTrail;