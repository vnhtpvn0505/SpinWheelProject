const prizes = [
    "Pin", "Sticker", "Hat", "Sticker",
    "Pin", "Free 1 drink", "Keychain", "Pin"
  ];
  const colors = ["#ff7f3f", "#2ecc71"];
  const canvas = document.getElementById('wheel');
  const ctx = canvas.getContext('2d');
  const spinBtn = document.getElementById('spin');
  let angle = 0;
  let spinning = false;
  
  function isMobile() {
    return window.innerWidth <= 600;
  }

  function resizeCanvas() {
    if (isMobile()) {
      // Mobile: canvas co giãn theo viewport
      const size = Math.min(window.innerWidth, window.innerHeight * 0.6, 550);
      canvas.width = size;
      canvas.height = size;
    } else {
      // Desktop: canvas cố định 550x550
      canvas.width = 550;
      canvas.height = 550;
    }
    drawWheel();
  }
  window.addEventListener('resize', resizeCanvas);
  window.addEventListener('DOMContentLoaded', resizeCanvas);
  
  function drawWheel() {
    const size = Math.min(canvas.width, canvas.height);
    const center = size / 2;
    const radius = size / 2 - 25;
    const spinRadius = size / 5.5;
    const num = prizes.length;
    const arc = 2 * Math.PI / num;
    for (let i = 0; i < num; i++) {
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle + i * arc, angle + (i + 1) * arc);
      ctx.closePath();
      ctx.fillStyle = colors[i % 2];
      ctx.fill();
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + (i + 0.5) * arc);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px Arial";
      ctx.fillText(prizes[i], radius - 30, 10);
      ctx.restore();
    }
    // Draw center circle
    ctx.beginPath();
    ctx.arc(center, center, spinRadius, 0, 2 * Math.PI);
    ctx.fillStyle = "#0b5c3b";
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 36px Arial";
    ctx.textAlign = "center";
    ctx.fillText("SPIN", center, center + 12);

    // Draw pointer (hướng lên trên, sát mép ngoài nút SPIN)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(center, center - spinRadius - 20);   // Đỉnh mũi tên
    ctx.lineTo(center - 15, center - spinRadius + 10); // Góc trái
    ctx.lineTo(center + 15, center - spinRadius + 10); // Góc phải
    ctx.closePath();
    ctx.fillStyle = "#0b5c3b";
    ctx.shadowColor = "#333";
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.restore();
  }
  
  function showCongratulation(prize) {
    let message;
    if (prize === "Pin") {
      message = `🎉 Chúc bạn có một buổi Offline vui vẻ! 🎉`;
    } else {
      message = `🎉 Chúc mừng bạn đã đạt giải: ${prize}! 🎉`;
    }
    const msg = document.createElement('div');
    msg.textContent = message;
    msg.style.position = 'fixed';
    msg.style.top = '10%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = '#fff';
    msg.style.color = '#0b5c3b';
    msg.style.padding = '32px 24px';
    msg.style.borderRadius = '16px';
    msg.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
    msg.style.fontSize = '1.5rem';
    msg.style.fontWeight = 'bold';
    msg.style.zIndex = 9999;
    msg.style.textAlign = 'center';
    msg.style.cursor = 'pointer';
    msg.onclick = () => document.body.removeChild(msg);
    document.body.appendChild(msg);
    setTimeout(() => {
      if (document.body.contains(msg)) document.body.removeChild(msg);
    }, 3500);
  }

  spinBtn.onclick = function() {
    if (spinning) return;
    spinning = true;
    let spinAngle = Math.random() * 360 + 1440; // 4 vòng trở lên
    let start = null;
    function animate(ts) {
      if (!start) start = ts;
      let progress = ts - start;
      let current = Math.min(progress / 2000, 1);
      angle = (spinAngle * easeOut(current)) * Math.PI / 180;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawWheel();
      if (current < 1) {
        requestAnimationFrame(animate);
      } else {
        spinning = false;
        // Xác định phần thưởng trúng (chuẩn hóa lại phép tính)
        const num = prizes.length;
        const arc = 2 * Math.PI / num;
        let finalAngle = (angle % (2 * Math.PI));
        // Góc 0 là hướng lên trên, cần đảo chiều để đúng với mũi tên
        let normalized = (1.5 * Math.PI - finalAngle + 2 * Math.PI) % (2 * Math.PI);
        let index = Math.floor(normalized / arc) % num;
        showCongratulation(prizes[index]);
      }
    }
    requestAnimationFrame(animate);
  };
  
  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }