// Get the current commit hash
fetch('https://api.github.com/repos/anttijaakkola/teleportpaste-demo1/commits/main')
  .then(response => response.json())
  .then(data => {
    const shortHash = data.sha.substring(0, 7);
    const date = new Date(data.commit.author.date).toLocaleString();
    document.getElementById('version').textContent = `Deployment: ${shortHash} (${date})`;
  })
  .catch(err => {
    console.error('Failed to fetch commit info:', err);
    document.getElementById('version').textContent = 'Version info unavailable';
  });

// Copy to clipboard functionality
document.getElementById('copyBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  const image = document.querySelector('img');

  try {
    // First try to copy SVG directly if the image is an SVG
    if (image.src.toLowerCase().endsWith('.svg')) {
      try {
        const response = await fetch(image.src);
        const svgBlob = await response.blob();
        const clipboardItem = new ClipboardItem({ 'image/svg+xml': svgBlob });
        await navigator.clipboard.write([clipboardItem]);
        status.innerHTML = "✅ SVG copied to clipboard as vector format!";
        return;
      } catch (svgErr) {
        console.warn('SVG direct copy failed, falling back to PNG conversion:', svgErr);
      }
    }

    // Create a canvas to convert the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (image.complete) {
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);
    } else {
      await new Promise((resolve) => {
        image.onload = () => {
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          ctx.drawImage(image, 0, 0);
          resolve();
        };
      });
    }
    
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const clipboardItem = new ClipboardItem({ 'image/png': blob });

    await navigator.clipboard.write([clipboardItem]);
    status.innerHTML = "✅ Image copied to clipboard as PNG!";
  } catch (err) {
    console.error("Clipboard write failed:", err);
    status.innerHTML = "❌ Clipboard write failed.";
  }
});

// Download SVG functionality
document.getElementById('downloadBtn').addEventListener('click', async () => {
  const image = document.querySelector('img');
  try {
    const response = await fetch(image.src);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.svg';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err) {
    console.error('Download failed:', err);
    document.getElementById('status').innerHTML = "❌ Download failed.";
  }
});

// View SVG source functionality
document.getElementById('viewSourceBtn').addEventListener('click', async () => {
  const image = document.querySelector('img');
  const sourceBlock = document.getElementById('svgSource');
  
  try {
    const response = await fetch(image.src);
    const svgText = await response.text();
    sourceBlock.textContent = svgText;
    sourceBlock.style.display = sourceBlock.style.display === 'none' ? 'block' : 'none';
  } catch (err) {
    console.error('Failed to fetch SVG source:', err);
    document.getElementById('status').innerHTML = "❌ Failed to fetch SVG source.";
  }
}); 