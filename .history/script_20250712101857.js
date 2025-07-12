const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");

const TEMPLATE = new Image();
TEMPLATE.src = "images/twibbon.png";

canvas.width = 768;
canvas.height = 768;

// Gambar template harus sudah ter-load sebelum bisa digunakan
TEMPLATE.onload = () => {
    ctx.drawImage(TEMPLATE, 0, 0, canvas.width, canvas.height);
};

upload.addEventListener("change", function () {
    const file = upload.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const userImage = new Image();
        userImage.onload = function () {
            drawTwibbon(userImage);
        };
        userImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
});

function drawTwibbon(userImage) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // ⭕ Koordinat lingkaran biru (dari template Anda)
    const centerX = 384;
    const centerY = 255;
    const radius = 185;

    // Gambar user dalam lingkaran
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Masukkan gambar user pas ke lingkaran
    ctx.drawImage(userImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();

    // Gambar twibbon template
    ctx.drawImage(TEMPLATE, 0, 0, canvas.width, canvas.height);

    // Tampilkan tombol share
    document.getElementById("shareSection").style.display = "block";
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
            alert("Browser tidak mendukung fitur ini. Silakan upload manual.");
        }
    });
}
