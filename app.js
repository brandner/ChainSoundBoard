const btn = document.getElementById("play-btn");
const audio = document.getElementById("chain-audio");
const status = document.getElementById("status");

function setStatus(text, cls) {
  status.textContent = text;
  status.className = "status" + (cls ? " " + cls : "");
}

audio.addEventListener("canplaythrough", () => setStatus("Ready to play", "ready"), { once: true });
audio.addEventListener("error", () => setStatus("Couldn't load the sound file", "error"));

btn.addEventListener("click", () => {
  audio.currentTime = 0;
  audio.play().catch(() => setStatus("Tap again to enable sound", "error"));

  btn.classList.remove("playing");
  void btn.offsetWidth; // restart the ripple animation on repeated taps
  btn.classList.add("playing");
});

audio.addEventListener("ended", () => btn.classList.remove("playing"));

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("sw.js")
      .catch((err) => console.error("Service worker registration failed:", err));
  });
}
