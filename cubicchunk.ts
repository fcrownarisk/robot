function cubicchunk(canvas) {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  
  // 量子化颜色通道 (0D点参数)
  const dot = data.reduce((acc, val, i) => {
    acc[i%4] += val; // 累加RGBA通道
    if((i+1)%4 === 0) acc[4]++; // 像素计数
    return acc;
  }, [0,0,0,0,0]);

  // 计算平均并生成0D点签名
  return dot.slice(0,4).map(v => 
    Math.round(v/dot[4])
  ).concat(canvas.width, canvas.height).join('-');
}

// 使用示例
const canvas = document.createElement('canvas');
canvas.width = 50;
canvas.height = 50;
// ... 绘制机器人核心 ...

const zeroDot = cubicchunk(canvas); 
// 输出示例："119-0-0-255-50-50" (RGBA平均值+原始尺寸)

data.reduce((acc, val, i) => {
  acc[i%4] += val; // 通道累加器
  if((i+1)%4 === 0) acc[4]++; // 像素计数器
  return acc;
}, [0,0,0,0,0]);

function decodeDot(zeroDot) {
  const [r, g, b, a, w, h] = zeroDot.split('-').map(Number);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = `rgba(${r},${g},${b},${a/255})`;
  ctx.fillRect(0, 0, w, h);
  
  return canvas; // 返回纯色画布近似原始内容
}
