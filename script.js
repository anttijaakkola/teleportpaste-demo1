document.getElementById('copyBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  const image = document.querySelector('img');

  try {
    // Create a canvas to convert the image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    
    // Draw the image on canvas
    ctx.drawImage(image, 0, 0);
    
    // Convert to PNG blob
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    const clipboardItem = new ClipboardItem({ 'image/png': blob });

    await navigator.clipboard.write([clipboardItem]);
    status.innerHTML = "✅ Image copied to clipboard!";
  } catch (err) {
    console.error("Clipboard write failed:", err);
    status.innerHTML = "❌ Clipboard write failed.";
  }
});
