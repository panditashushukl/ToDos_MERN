export default function getCroppedImg(imageSrc, pixelCrop) {
  const canvas = document.createElement("canvas");
  const image = new Image();
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      const ctx = canvas.getContext("2d");

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Canvas is empty"));
          return;
        }
        const fileUrl = URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/jpeg");
    };
    image.onerror = reject;
    image.src = imageSrc;
  });
}
