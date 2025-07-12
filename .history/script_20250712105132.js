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
            const circleCenterX = 384;
            const circleCenterY = 255;
            const circleRadius = 185;
            const targetSize = circleRadius * 2;

            // Rasio lingkaran dan gambar
            const imgAspectRatio = userImage.width / userImage.height;
            const circleAspectRatio = 1; // karena lingkaran = tinggi = lebar

            // Gunakan background-size: cover logic
            if (imgAspectRatio > circleAspectRatio) {
                // Gambar lebih lebar → sesuaikan tinggi
                imgScale = targetSize / userImage.height;
            } else {
                // Gambar lebih tinggi → sesuaikan lebar
                imgScale = targetSize / userImage.width;
            }

            // Tambahkan sedikit zoom (1.15x)
            imgScale *= 1.15;

            const newWidth = userImage.width * imgScale;
            const newHeight = userImage.height * imgScale;

            // Atur posisi tengah dan offset ke bawah
            imgX = circleCenterX - newWidth / 2;
            imgY = circleCenterY - newHeight / 2 + 30;

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
