// Target date: November 30 Philippines (UTC+8)
const targetDate = new Date("2025-10-30T00:00:00+08:00");

const countdownEl = document.getElementById("countdown");
const proceedBtn = document.getElementById("proceedBtn");

function fireConfetti() {
  const duration = 2500;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 8,
      angle: 60,
      spread: 55,
      origin: { x: 0 }
    });
    confetti({
      particleCount: 8,
      angle: 120,
      spread: 55,
      origin: { x: 1 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}

function updateCountdown() {
  const now = new Date();
  const diff = targetDate - now;

  if (diff <= 0) {
    countdownEl.innerHTML = "00d : 00h : 00m : 00s";

    fireConfetti();
    proceedBtn.style.display = "inline-block";
    return clearInterval(countdownInterval);
  }

  // Calculate remaining time
  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  let minutes = Math.floor((diff / (1000 * 60)) % 60);
  let seconds = Math.floor((diff / 1000) % 60);

  // Formatting
  days = days.toString().padStart(2, "0");
  hours = hours.toString().padStart(2, "0");
  minutes = minutes.toString().padStart(2, "0");
  seconds = seconds.toString().padStart(2, "0");

  countdownEl.innerHTML = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
}

const countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

proceedBtn.addEventListener("click", () => {
  window.location.href = "./pages/cake.html";
});
