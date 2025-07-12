const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");

const TEMPLATE = new Image();
TEMPLATE.src = "images/twibbon.png"; // Pastikan path benar

let userImage = null;
let imgX = 0, imgY = 0, imgScale = 1;
let isDragging = false, dragStartX = 0, dragStartY = 0;

// Titik tengah & radius lingkaran dari desain PNG
const circleCenterX = 384;
const circleCenterY = 350; // kamu sudah sesuaikan ke bawah
const circleRadius = 200;

TEMPLATE.onload = () => drawCanvas();

upload.addEventListener("change", function () {
    const file = upload.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        userImage = new Image();
        userImage.onload = function () {
            const diameter = circleRadius * 2;

            // Skala agar gambar menutupi lingkaran seluruhnya tanpa putih
            const scaleX = diameter / userImage.width;
            const scaleY = diameter / userImage.height;
            imgScale = Math.max(scaleX, scaleY) * 1.15; // Tambah zoom agar full cover

            const newW = userImage.width * imgScale;
            const newH = userImage.height * imgScale;

            // Posisi gambar di tengah lingkaran
            imgX = circleCenterX - newW / 2;
            imgY = circleCenterY - newH / 2;

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
        ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2);
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
            alert("Perangkat tidak mendukung share langsung. Silakan unduh manual.");
        }
    });
}


