const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");

const TEMPLATE = new Image();
TEMPLATE.src = "images/twibbon.png";

let userImage = null;
let imgX = 0, imgY = 0, imgScale = 1;
let isDragging = false, dragStartX = 0, dragStartY = 0;
let lastTouchDistance = 0;
let initialPinchScale = imgScale;

const circleCenterX = 384;
const circleCenterY = 350;
const circleRadius = 200;

const scaleSlider = document.getElementById("scaleRange");

TEMPLATE.onload = () => drawCanvas();

upload.addEventListener("change", function () {
    const file = upload.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        userImage = new Image();
        userImage.onload = function () {
            const diameter = circleRadius * 2;
            const scaleX = diameter / userImage.width;
            const scaleY = diameter / userImage.height;

            // Hitung skala awal agar foto menutupi area lingkaran
            imgScale = Math.max(scaleX, scaleY) * 1.15;

            // Hitung posisi awal agar foto berada di tengah lingkaran
            const newW = userImage.width * imgScale;
            const newH = userImage.height * imgScale;

            imgX = circleCenterX - newW / 2;
            imgY = circleCenterY - newH / 2;

            // ✅ Update slider zoom agar sesuai dengan skala awal
            scaleSlider.min = (imgScale * 0.5).toFixed(2);  // bisa diperkecil hingga 50%
            scaleSlider.max = (imgScale * 3).toFixed(2);    // bisa diperbesar hingga 3x
            scaleSlider.step = "0.01";
            scaleSlider.value = imgScale.toFixed(2);

            drawCanvas();
        };
        userImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
});


scaleSlider.addEventListener("input", () => {
    if (!userImage) return;
    imgScale = parseFloat(scaleSlider.value);
    const newW = userImage.width * imgScale;
    const newH = userImage.height * imgScale;
    imgX = circleCenterX - newW / 2;
    imgY = circleCenterY - newH / 2;
    drawCanvas();
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

// Mobile gesture
canvas.addEventListener("touchstart", function (e) {
    if (!userImage) return;
    if (e.touches.length === 1) {
        isDragging = true;
        const touch = e.touches[0];
        dragStartX = touch.clientX - imgX;
        dragStartY = touch.clientY - imgY;
    } else if (e.touches.length === 2) {
        isDragging = false;
        lastTouchDistance = getTouchDistance(e.touches);
        initialPinchScale = imgScale;
    }
}, { passive: false });

canvas.addEventListener("touchmove", function (e) {
    if (!userImage) return;
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0];
        imgX = touch.clientX - dragStartX;
        imgY = touch.clientY - dragStartY;
        drawCanvas();
    } else if (e.touches.length === 2) {
        const newDistance = getTouchDistance(e.touches);
        const zoomFactor = newDistance / lastTouchDistance;
        imgScale = initialPinchScale * zoomFactor;
        scaleSlider.value = imgScale.toFixed(2);
        const newW = userImage.width * imgScale;
        const newH = userImage.height * imgScale;
        imgX = circleCenterX - newW / 2;
        imgY = circleCenterY - newH / 2;
        drawCanvas();
    }
}, { passive: false });

canvas.addEventListener("touchend", () => {
    isDragging = false;
});

function getTouchDistance(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
}

function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (userImage) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(userImage, imgX, imgY, userImage.width * imgScale, userImage.height * imgScale);
        ctx.restore();
    }
    ctx.drawImage(TEMPLATE, 0, 0, canvas.width, canvas.height);
    document.getElementById("shareSection").style.display = userImage ? "flex" : "none";
}

function downloadImage() {
    if (!userImage) return alert("⚠️ Silakan upload foto terlebih dahulu.");
    const link = document.createElement("a");
    link.download = "Twibbon_MPLS2025.png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function shareImage() {
    if (!userImage) return alert("⚠️ Silakan upload foto terlebih dahulu.");
    canvas.toBlob(blob => {
        const file = new File([blob], "Twibbon_MPLS2025.png", { type: "image/png" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                title: "Twibbon MPLS 2025",
                text: "Aku siap mengikuti MPLS 2025 di SMK MUTIPUGA!",
                files: [file]
            }).catch(console.error);
        } else {
            alert("❌ Perangkat tidak mendukung berbagi otomatis.");
        }
    });

    const scaleSlider = document.getElementById("scaleRange");

    scaleSlider.addEventListener("input", () => {
        if (!userImage) return;

        imgScale = parseFloat(scaleSlider.value);

        const newW = userImage.width * imgScale;
        const newH = userImage.height * imgScale;

        imgX = circleCenterX - newW / 2;
        imgY = circleCenterY - newH / 2;

        drawCanvas();
    });

}

