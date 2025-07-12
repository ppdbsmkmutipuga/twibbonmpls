const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");
const TEMPLATE = new Image();
TEMPLATE.src = "images/twibbon.png";

let userImage = null;
let imgX = 0, imgY = 0, imgScale = 1;
let isDragging = false, dragStartX = 0, dragStartY = 0;

TEMPLATE.onload = () => drawCanvas();

upload.addEventListener("change", function () {
    const file = upload.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        userImage = new Image();
        userImage.onload = function () {
            const circleCenterX = 384;   // tengah canvas
            const circleCenterY = 255;   // tengah lingkaran
            const circleRadius = 185;
            const targetSize = circleRadius * 2;

            // Hitung rasio untuk cover penuh area lingkaran
            const scaleX = targetSize / userImage.width;
            const scaleY = targetSize / userImage.height;

            // Ambil skala maksimum agar menutup semua sisi (tanpa putih)
            imgScale = Math.max(scaleX, scaleY) * 1.2;  // zoom lebih akurat

            const newWidth = userImage.width * imgScale;
            const newHeight = userImage.height * imgScale;

            // Atur agar wajah pengguna berada di tengah lingkaran dengan sedikit offset ke bawah
            imgX = circleCenterX - newWidth / 2;
            imgY = circleCenterY - newHeight / 2 + 35; // offset wajah sedikit ke bawah

            drawCanvas();

        };
        userImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

canvas.addEventListener("mousedown", e => {
    if (!userImage) return;
    isDragging = true;
    dragStartX = e.offsetX - imgX;
    dragStartY = e.offsetY - imgY;
});

canvas.addEventListener("mousemove", e => {
    if (!isDragging) return;
    imgX = e.offsetX - dragStartX;
    imgY = e.offsetY - dragStartY;
    drawCanvas();
});

canvas.addEventListener("mouseup", () => isDragging = false);
canvas.addEventListener("mouseleave", () => isDragging = false);

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (userImage) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(384, 255, 185, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(
            userImage,
            imgX,
            imgY,
            userImage.width * imgScale,
            userImage.height * imgScale
        );
        ctx.restore();
    }
    ctx.drawImage(TEMPLATE, 0, 0, canvas.width, canvas.height);
    document.getElementById("shareSection").style.display = userImage ? "block" : "none";
}

function downloadImage() {
    const link = document.createElement("a");
    link.download = "Twibbon_MPLS2025.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
}

function shareImage() {
    canvas.toBlob(blob => {
        const file = new File([blob], "Twibbon_MPLS2025.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                title: "Twibbon MPLS 2025",
                text: "Aku siap mengikuti MPLS 2025 di SMK MUTIPUGA!",
                files: [file]
            }).catch(err => alert("Gagal membagikan: " + err.message));
        } else {
            alert("Perangkat tidak mendukung share langsung. Silakan unggah manual.");
        }
    });
}
