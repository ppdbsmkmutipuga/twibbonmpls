const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const upload = document.getElementById("upload");

const TEMPLATE = new Image();
TEMPLATE.src = "images/twibbon.png";

let userImage = null;
let imgX = 0, imgY = 0, imgScale = 1;
let isDragging = false, dragStartX = 0, dragStartY = 0;

const circleCenterX = 384;
const circleCenterY = 350;
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
            const scaleX = diameter / userImage.width;
            const scaleY = diameter / userImage.height;
            imgScale = Math.max(scaleX, scaleY) * 1.15;

            const newW = userImage.width * imgScale;
            const newH = userImage.height * imgScale;

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
        ctx.drawImage(userImage, imgX, imgY, userImage.width * imgScale, userImage.height * imgScale);
        ctx.restore();
    }

    ctx.drawImage(TEMPLATE, 0, 0, canvas.width, canvas.height);
    document.getElementById("shareSection").style.display = userImage ? "flex" : "none";
}

function downloadImage() {
    if (!userImage) {
        alert("⚠️ Silakan upload foto terlebih dahulu.");
        return;
    }

    const link = document.createElement("a");
    link.download = "Twibbon_MPLS2025.png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
        showCopywritingModal();
    }, 500);
}

function shareImage() {
    if (!userImage) {
        alert("⚠️ Silakan upload foto terlebih dahulu.");
        return;
    }

    canvas.toBlob(blob => {
        const file = new File([blob], "Twibbon_MPLS2025.png", { type: "image/png" });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                title: "Twibbon MPLS 2025",
                text: "Aku siap mengikuti MPLS 2025 di SMK MUTIPUGA!",
                files: [file]
            }).then(() => {
                showCopywritingModal();
            }).catch(() => {
                showCopywritingModal();
            });
        } else {
            showCopywritingModal();
        }
    });
}

function showCopywritingModal() {
    const modal = document.getElementById("shareModal");
    modal.classList.add("show");
}

function closeShareModal() {
    const modal = document.getElementById("shareModal");
    modal.classList.remove("show");
}

function copyText() {
    const textarea = document.getElementById("copyText");
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textarea.value);
    alert("✅ Caption disalin ke clipboard!");
}
const campaignUrl = encodeURIComponent("https://ppdbsmkmutipuga.github.io/twibbonmpls/");
const caption = encodeURIComponent(document.getElementById("copyText").value);

// ✅ Tambahan direct ke sosial media
function shareToWhatsApp() {
    window.open(`https://wa.me/?text=${caption}`, "_blank");
}

function shareToFacebook() {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${campaignUrl}&quote=${caption}`, "_blank");
}

function shareToLinkedIn() {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${campaignUrl}`, "_blank");
}

function shareToInstagram() {
    alert("📋 Caption sudah disalin. Silakan buka Instagram dan tempel saat membuat post.");
    window.open("https://www.instagram.com/", "_blank");
}

function shareToTikTok() {
    alert("📋 Caption sudah disalin. Silakan buka TikTok dan tempel saat upload.");
    window.open("https://www.tiktok.com/", "_blank");
}

window.addEventListener("click", function (e) {
    const modal = document.getElementById("shareModal");
    if (e.target === modal) {
        closeShareModal();
    }
});
