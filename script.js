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
        status.innerHTML = "✅ SVG copied to clipboard!";
        return;
      } catch (svgErr) {
        console.log('SVG direct copy failed, falling back to PNG conversion:', svgErr);
        // Continue to PNG conversion if SVG copy fails
      }
    }

    // Create a canvas to convert the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // For SVG, we need to wait for the image to load completely
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
    
    // Convert to PNG blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const clipboardItem = new ClipboardItem({ 'image/png': blob });

    await navigator.clipboard.write([clipboardItem]);
    status.innerHTML = "✅ Image copied to clipboard as PNG!";
  } catch (err) {
    console.error("Clipboard write failed:", err);
    status.innerHTML = "❌ Clipboard write failed.";
  }
});
