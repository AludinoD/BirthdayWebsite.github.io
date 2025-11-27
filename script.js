document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const proceedContainer = document.querySelector(".button-container");
  const resetBtn = document.querySelector(".reset-btn");

  let candles = [];
  let audioContext, analyser, microphone;
  let candlesBlownOut = false; // flag to prevent multiple confetti triggers

  proceedContainer.style.display = "none"; // Hide proceed button initially

  // Update candle count display
  function updateCandleCount() {
    const activeCandles = candles.filter(c => !c.classList.contains("out")).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function showProceedButton() {
    proceedContainer.style.display = "flex";
    proceedContainer.style.justifyContent = "center";
    proceedContainer.style.flexDirection = "column";
    proceedContainer.style.alignItems = "center";
  }

  // Add a candle at clicked position
  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  // Click cake to add candles
  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left - 6; // center candle
    const top = event.clientY - rect.top - 35;
    addCandle(left, top);
  });

  // Check if user is blowing
  function isBlowing() {
    if (!analyser) return false;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
    const average = sum / bufferLength;
    return average > 50; // adjust sensitivity if needed
  }

  // Blow out candles based on mic input
  function blowOutCandles() {
    if (candles.length === 0) return;

    if (isBlowing()) {
      let blownOut = 0;
      candles.forEach(c => {
        if (!c.classList.contains("out") && Math.random() > 0.5) {
          c.classList.add("out");
          c.querySelector(".flame").style.opacity = 0;
          blownOut++;
        }
      });
      if (blownOut > 0) updateCandleCount();
    }

    // If all candles are out and confetti not triggered yet
    if (candles.every(c => c.classList.contains("out")) && !candlesBlownOut && candles.length > 0) {
      candlesBlownOut = true; // prevent multiple triggers
      showProceedButton();
      setTimeout(() => {
        triggerConfetti();
        limitedConfetti(3000); // confetti lasts 3 seconds
      }, 200);
    }
  }

  // Setup microphone input
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        setInterval(blowOutCandles, 200);
      })
      .catch(err => console.log("Unable to access microphone: " + err));
  } else {
    console.log("getUserMedia not supported!");
  }

  // RESET button functionality
  resetBtn.addEventListener("click", function () {
    // Remove all candle elements from the cake
    candles.forEach(c => {
      if (cake.contains(c)) {
        cake.removeChild(c);
      }
    });

    // Clear the candles array
    candles = [];

    // Reset candle count display
    updateCandleCount();

    // Hide proceed button again
    proceedContainer.style.display = "none";

    // Reset confetti flag
    candlesBlownOut = false;
  });

  updateCandleCount();
});

// CONFETTI FUNCTIONS
function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

// Confetti for a limited duration
function limitedConfetti(duration = 3000) {
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      spread: 70,
      origin: { y: Math.random() * 0.5 }
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();
}
