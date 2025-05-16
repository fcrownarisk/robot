class GifLoader {
            constructor() {
                this.gallery = document.getElementById('gifGallery');
                this.initFileInput();
            }

            initFileInput() {
                const input = document.getElementById('gifInput');
                input.addEventListener('change', (e) => {
                    this.handleFiles(e.target.files);
                });
            }

            handleFiles(files) {
                Array.from(files).forEach(file => {
                    if (!file.type.match(/image\/gif/)) return;

                    const reader = new FileReader();
                    const loader = this.createLoaderUI(file.name);
                    
                    reader.onloadstart = () => this.updateLoader(loader, 0);
                    reader.onprogress = (e) => 
                        this.updateLoader(loader, (e.loaded / e.total) * 100);
                    reader.onload = (e) => 
                        this.createGIFViewer(e.target.result, loader);
                    reader.onerror = () => 
                        this.loadError(loader, 'Error loading file');

                    reader.readAsArrayBuffer(file);
                });
            }

            createLoaderUI(filename) {
                const container = document.createElement('div');
                container.className = 'gif-container';
                container.innerHTML = `
                    <div class="loader">
                        <div class="filename">${filename}</div>
                        <div class="progress-bar" style="
                            width: 200px;
                            height: 20px;
                            border: 1px solid #333;
                            margin: 5px 0;">
                            <div class="progress" style="
                                width: 0%;
                                height: 100%;
                                background: #4CAF50;"></div>
                        </div>
                    </div>
                `;
                this.gallery.appendChild(container);
                return container;
            }

            updateLoader(container, percent) {
                const progress = container.querySelector('.progress');
                progress.style.width = `${Math.min(percent, 100)}%`;
            }

            loadError(container, message) {
                container.querySelector('.progress').style.background = '#f44336';
                container.querySelector('.filename').textContent = message;
            }

            createGIFViewer(arrayBuffer, loaderContainer) {
                const blob = new Blob([arrayBuffer], {type: 'image/gif'});
                const url = URL.createObjectURL(blob);
                
                const img = new Image();
                img.onload = () => {
                    URL.revokeObjectURL(url);
                    this.replaceLoaderWithGIF(loaderContainer, img);
                };
                img.onerror = () => 
                    this.loadError(loaderContainer, 'Invalid GIF file');
                img.src = url;
            }

            replaceLoaderWithGIF(container, img) {
                container.innerHTML = '';
                container.appendChild(img);
                img.style.display = 'block';
                img.style.maxWidth = '100%';
            }
        }

        // Initialize GIF loader
        new GifLoader();
