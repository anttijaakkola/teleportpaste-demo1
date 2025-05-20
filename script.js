document.getElementById('copyBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  const imgURL = document.getElementById('targetImage').src;

  try {
    const response = await fetch(imgURL);
    const blob = await response.blob();
    const item = new ClipboardItem({ [blob.type]: blob });

    await navigator.clipboard.write([item]);
    status.textContent = "✅ Image copied! Try Ctrl+V in PowerPoint or Docs.";
  } catch (err) {
    console.error("Clipboard write failed", err);
    status.textContent = "❌ Clipboard write failed. Are you using Chrome?";
  }
});

