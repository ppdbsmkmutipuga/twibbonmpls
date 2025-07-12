const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");

canvas.width = 768;
canvas.height = 768;

const TEMPLATE = new Image();
TEMPLATE.src = "images/twibbon.png"; // template PNG transparan

let userImage = null;
let imgX = 0;
let imgY = 0;
let imgScale = 1;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;

TEMPLATE.onload = () => {
    drawCanvas();
};

upload.addEventListener("change", function () {
    const file = upload.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        userImage = new Image();
        userImage.onload = function () {
            // Auto-center gambar user saat diunggah
            const scaleFactor = 370 / Math.max(userImage.width, userImage.height);
            imgScale = scaleFactor;
            imgX = (canvas.width - userImage.width * imgScale) / 2;
            imgY = (canvas.height - userImage.height * imgScale) / 2;
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

canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

canvas.addEventListener("mouseleave", () => {
    isDragging = false;
});

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (userImage) {
        // Lingkaran kliping (sesuai area di template)
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
    link.href = canvas.toDataURL();
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
            alert("Browser tidak mendukung share otomatis. Silakan unggah manual ke Instagram / WhatsApp.");
        }
    });
}
