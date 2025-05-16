class ImageProcessor {
            constructor() {
                this.gallery = document.getElementById('imageGallery');
                this.maxWidth = document.getElementById('maxWidth');
                this.quality = document.getElementById('quality');
                this.initFileInput();
            }

            initFileInput() {
                const input = document.getElementById('fileInput');
                input.addEventListener('change', (e) => this.handleFiles(e.target.files));
            }

            async handleFiles(files) {
                for (const file of Array.from(files)) {
                    const loader = this.createLoaderUI(file.name);
                    try {
                        if (file.type === 'image/gif') {
                            await this.processGIF(file, loader);
                        } else if (file.type === 'image/png') {
                            await this.processPNG(file, loader);
                        }
                    } catch (error) {
                        this.showError(loader, error.message);
                    }
                }
            }

            async processGIF(file, loader) {
                const arrayBuffer = await this.readFile(file, loader);
                const blob = new Blob([arrayBuffer], { type: 'image/gif' });
                const img = await this.loadImage(blob);
                this.createImageViewer(img, loader, 'Original GIF');
            }

            async processPNG(file, loader) {
                const img = await this.loadImage(file);
                const processed = await this.shrinkImage(img);
                this.createImageViewer(processed, loader, 
                    `Resized: ${processed.width}x${processed.height}`);
            }

            async shrinkImage(img) {
                return new Promise((resolve) => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    
                    // Calculate new dimensions
                    const ratio = Math.min(
                        this.maxWidth.value / img.width,
                        1 // Don't scale up
                    );
                    
                    canvas.width = img.width * ratio;
                    canvas.height = img.height * ratio;
                    
                    // Draw scaled image
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    
                    // Convert to PNG blob
                    canvas.toBlob((blob) => {
                        const url = URL.createObjectURL(blob);
                        const newImg = new Image();
                        newImg.onload = () => {
                            URL.revokeObjectURL(url);
                            resolve(newImg);
                        };
                        newImg.src = url;
                    }, 'image/png', this.quality.value);
                });
            }

            readFile(file, loader) {
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onprogress = (e) => 
                        this.updateProgress(loader, (e.loaded / e.total) * 100);
                    reader.onload = (e) => resolve(e.target.result);
                    reader.onerror = () => reject(new Error('File read failed'));
                    reader.readAsArrayBuffer(file);
                });
            }

            loadImage(blob) {
                return new Promise((resolve, reject) => {
                    const url = URL.createObjectURL(blob);
                    const img = new Image();
                    img.onload = () => {
                        URL.revokeObjectURL(url);
                        resolve(img);
                    };
                    img.onerror = () => reject(new Error('Image load failed'));
                    img.src = url;
                });
            }

            createLoaderUI(filename) {
                const container = document.createElement('div');
                container.className = 'image-container';
                container.innerHTML = `filename`;
                this.gallery.appendChild(container);
                return container;
            }

            updateProgress(container, percent) {
                container.querySelector('.progress').style.width = `${percent}%`;
            }

            createImageViewer(img, container, label) {
                container.innerHTML = '';
                container.appendChild(img);
                const sizeLabel = document.createElement('div');
                sizeLabel.className = 'size-label';
                sizeLabel.textContent = label;
                container.appendChild(sizeLabel);
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
            }

            showError(container, message) {
                container.querySelector('.progress').style.background = '#f44336';
                container.querySelector('.filename').textContent = message;
            }
        }

        // Initialize processor with real-time controls
        const processor = new ImageProcessor();
        document.getElementById('maxWidth').addEventListener('input', () => 
            processor.maxWidth = document.getElementById('maxWidth').value);
        document.getElementById('quality').addEventListener('input', () => 
            processor.quality = document.getElementById('quality').value);

        async shrinkImage(img) {
        const ratio = Math.min(maxWidth / img.width, 1);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
}
