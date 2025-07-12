const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const TEMPLATE_IMAGE = new Image();
TEMPLATE_IMAGE.src = "5c6cedc1-72ac-4269-a5f9-59364a2a4097.png";

upload.addEventListener("change", function () {
  const file = upload.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const userImage = new Image();
    userImage.onload = function () {
      drawImage(userImage);
    };
    userImage.src = e.target.result;
  };
  reader.readAsDataURL(file);
});

function drawImage(userImage) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Lingkaran tengah
  const centerX = 384;
  const centerY = 260;
  const radius = 160;

  ctx.save();
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Gambar foto pengguna
  ctx.drawImage(userImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
  ctx.restore();

  // Gambar template twibbon
  ctx.drawImage(TEMPLATE_IMAGE, 0, 0, canvas.width, canvas.height);
}

function downloadImage() {
  const link = document.createElement("a");
  link.download = "Twibbon_MPLS2025.png";
  link.href = canvas.toDataURL();
  link.click();
}
