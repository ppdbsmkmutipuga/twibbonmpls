const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");

canvas.width = 768;
canvas.height = 768;

const TEMPLATE = new Image();
TEMPLATE.src = "images/twibbon.png";

let userImage = null;
let imgX = 0, imgY = 0;
let imgScale = 1;
let isDragging = false;
let dragStartX = 0, dragStartY = 0;

TEMPLATE.onload = () => drawCanvas();

upload.addEventListener("change", function () {
    const file = upload.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        userImage = new Image();
        userImage.onload = function () {
            const radius = 185;
            const targetSize = radius * 2;

            const scaleX = targetSize / userImage.width;
            const scaleY = targetSize / userImage.height;

            imgScale = Math.max(scaleX, scaleY); // agar lingkaran terisi penuh

            const newWidth = userImage.width * imgScale;
            const newHeight = userImage.height * imgScale;

            imgX = 384 - newWidth / 2;
            imgY = 255 - newHeight / 2;

            drawCanvas();
        };
        userImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

canvas.addEventListener("mousedown", (e) => {
    if (!userImage) return;
    isDragging = true;
    dragStartX = e.offsetX - imgX;
    dragStartY = e.offsetY - imgY;
});

canvas.addEventListener("mousemove", (e) => {
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
        const centerX = 384;
        const centerY = 255;
        const radius = 185;

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
            userImage,
            imgX, imgY,
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
    canvas.toBlob(function (blob) {
        const file = new File([blob], "Twibbon_MPLS2025.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                title: "Twibbon MPLS 2025",
                text: "Aku siap mengikuti MPLS 2025 di SMK MUTIPUGA!",
                files: [file]
            }).catch(err => alert("Gagal membagikan: " + err.message));
        } else {
            alert("Browser tidak mendukung berbagi langsung. Silakan upload manual.");
        }
    });
}
