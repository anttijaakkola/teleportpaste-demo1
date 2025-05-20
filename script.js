// Get the current commit hash
fetch('https://api.github.com/repos/anttijaakkola/teleportpaste-demo1/commits/main')
  .then(response => response.json())
  .then(data => {
    const shortHash = data.sha.substring(0, 7);
    const date = new Date(data.commit.author.date).toLocaleString();
    document.getElementById('version').textContent = `Deployment: ${shortHash} (${date})`;
    console.log('Version info loaded:', { hash: shortHash, date });
  })
  .catch(err => {
    console.error('Failed to fetch commit info:', err);
    document.getElementById('version').textContent = 'Version info unavailable';
  });

document.getElementById('copyBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  const image = document.querySelector('img');
  console.log('Copy button clicked, image source:', image.src);

  try {
    // First try to copy SVG directly if the image is an SVG
    if (image.src.toLowerCase().endsWith('.svg')) {
      console.log('Detected SVG image, attempting direct SVG copy...');
      try {
        const response = await fetch(image.src);
        console.log('SVG fetch response:', response.status, response.statusText);
        const svgBlob = await response.blob();
        console.log('SVG blob created:', { type: svgBlob.type, size: svgBlob.size });
        const clipboardItem = new ClipboardItem({ 'image/svg+xml': svgBlob });
        await navigator.clipboard.write([clipboardItem]);
        console.log('✅ SVG successfully copied to clipboard as vector format!');
        status.innerHTML = "✅ SVG copied to clipboard as vector format!";
        return;
      } catch (svgErr) {
        console.warn('SVG direct copy failed, falling back to PNG conversion:', svgErr);
        // Continue to PNG conversion if SVG copy fails
      }
    }

    console.log('Starting PNG conversion process...');
    // Create a canvas to convert the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // For SVG, we need to wait for the image to load completely
    if (image.complete) {
      console.log('Image already loaded, proceeding with conversion');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      ctx.drawImage(image, 0, 0);
    } else {
      console.log('Waiting for image to load...');
      await new Promise((resolve) => {
        image.onload = () => {
          console.log('Image loaded, proceeding with conversion');
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          ctx.drawImage(image, 0, 0);
          resolve();
        };
      });
    }
    
    // Convert to PNG blob
    console.log('Converting to PNG blob...');
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    console.log('PNG blob created:', { type: blob.type, size: blob.size });
    const clipboardItem = new ClipboardItem({ 'image/png': blob });

    await navigator.clipboard.write([clipboardItem]);
    console.log('✅ Image successfully copied to clipboard as PNG!');
    status.innerHTML = "✅ Image copied to clipboard as PNG!";
  } catch (err) {
    console.error("Clipboard write failed:", err);
    status.innerHTML = "❌ Clipboard write failed.";
  }
});
