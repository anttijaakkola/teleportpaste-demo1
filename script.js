<script>
  document.getElementById('copyBtn').addEventListener('click', async () => {
    const status = document.getElementById('status');
    const image = document.querySelector('img');

    try {
      const response = await fetch(image.src, { mode: "cors" });
      const blob = await response.blob();
      const clipboardItem = new ClipboardItem({ [blob.type]: blob });

      await navigator.clipboard.write([clipboardItem]);
      status.innerHTML = "✅ Image copied to clipboard!";
    } catch (err) {
      console.error("Clipboard write failed:", err);
      status.innerHTML = "❌ Clipboard write failed.";
    }
  });
</script>
