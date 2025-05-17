 class ImageLoader {
            constructor() {
                this.canvas = document.getElementById('imageCanvas');
                this.ctx = this.canvas.getContext('2d');
                this.images = []; // 存储加载的图片数据
                this.validSizes = new Set(['15x15', '20x20', '25x25']); // 允许的尺寸
                this.spacing = 10; // 图片间的最小间距

                this.initializeEventListeners();
            }

            initializeEventListeners() {
                this.canvas.addEventListener('dragover', e => e.preventDefault());
                this.canvas.addEventListener('drop', e => this.handleDrop(e));
            }

            handleDrop(e) {
                e.preventDefault();
                const files = e.dataTransfer.files;
                this.loadImages(files);
            }

            async loadImages(files) {
                for (const file of Array.from(files)) {
                    if (!file.type.startsWith('image/')) continue;

                    const img = new Image();
                    img.src = URL.createObjectURL(file);
                    
                    await new Promise(resolve => {
                        img.onload = () => {
                            const size = `${img.naturalWidth}x${img.naturalHeight}`;
                            if (this.validSizes.has(size)) {
                                this.placeImage(img, size);
                                this.drawAll();
                            }
                            resolve();
                        };
                    });
                }
            }

            placeImage(img, size) {
                // 计算随机位置（确保不超出画布边界）
                const maxX = this.canvas.width - img.naturalWidth - this.spacing;
                const maxY = this.canvas.height - img.naturalHeight - this.spacing;
                
                let collision;
                let attempts = 0;
                do {
                    collision = false;
                    const x = this.spacing + Math.floor(Math.random() * maxX);
                    const y = this.spacing + Math.floor(Math.random() * maxY);

                    // 简单碰撞检测
                    for (const existingImg of this.images) {
                        if (
                            x < existingImg.x + existingImg.width + this.spacing &&
                            x + img.naturalWidth + this.spacing > existingImg.x &&
                            y < existingImg.y + existingImg.height + this.spacing &&
                            y + img.naturalHeight + this.spacing > existingImg.y
                        ) {
                            collision = true;
                            break;
                        }
                    }

                    if (!collision) {
                        this.images.push({
                            img: img,
                            x: x,
                            y: y,
                            width: img.naturalWidth,
                            height: img.naturalHeight
                        });
                        return;
                    }
                    attempts++;
                } while (collision && attempts < 100); // 最多尝试100次
            }

            drawAll() {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                
                // 绘制所有图片
                this.images.forEach(image => {
                    this.ctx.drawImage(
                        image.img,
                        image.x,
                        image.y,
                        image.width,
                        image.height
                    );

                    // 添加尺寸标签（可选）
                    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                    this.ctx.fillRect(
                        image.x,
                        image.y + image.height - 20,
                        image.width,
                        20
                    );
                  
                    this.ctx.fillStyle = 'white';
                    this.ctx.font = '12px Arial';
                    this.ctx.fillText(
                        `${image.width}x${image.height}`,
                        image.x + 5,
                        image.y + image.height - 5
                    );
                });
            }
        }

        // 初始化加载器
        const loader = new ImageLoader();
