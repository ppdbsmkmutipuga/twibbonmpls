const upload = document.getElementById("upload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const TEMPLATE_IMAGE = new Image();
TEMPLATE_IMAGE.src = "images/twibbon_mpls2025.png";

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const centerX = 384;
    const centerY = 260;
    const radius = 160;

    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    ctx.drawImage(userImage, centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();

    ctx.drawImage(TEMPLATE_IMAGE, 0, 0, canvas.width, canvas.height);
}

function downloadImage() {
    const imageData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "Twibbon_MPLS2025.png";
    link.href = imageData;
    link.click();

    document.getElementById("shareSection").style.display = "block";
}

function shareImage() {
    canvas.toBlob(function (blob) {
        const file = new File([blob], "Twibbon_MPLS2025.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                title: "Twibbon MPLS 2025",
                text: "Aku siap mengikuti MPLS 2025 di SMK MUTIPUGA!",
                files: [file]
            }).catch(console.error);
        } else {
            alert("Browser Anda tidak mendukung Web Share API untuk gambar.\nSilakan bagikan secara manual ke media sosial.");
        }
    });
}
