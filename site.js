// Copy buttons, the hero video's pause control, and the live GitHub star count.
(() => {
  for (const b of document.querySelectorAll("[data-copy]")) {
    b.addEventListener("click", async () => {
      const text = b.parentElement.querySelector("[data-cmd]").textContent;
      try {
        await navigator.clipboard.writeText(text);
        b.textContent = "Copied";
        b.classList.add("done");
        setTimeout(() => { b.textContent = "Copy"; b.classList.remove("done"); }, 1600);
      } catch {
        b.textContent = "Select it";
      }
    });
  }

  const video = document.getElementById("hero-video");
  const toggle = document.querySelector("[data-video-toggle]");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const sync = () => {
    toggle.textContent = video.paused ? "Play" : "Pause";
    toggle.setAttribute("aria-pressed", String(video.paused));
  };
  const respect = () => {
    if (reduced.matches) video.pause();
    else video.play().catch(() => {});
    sync();
  };
  if (video && toggle) {
    toggle.addEventListener("click", () => { video.paused ? video.play().catch(() => {}) : video.pause(); sync(); });
    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    reduced.addEventListener("change", respect);
    respect();
  }

  const stars = document.querySelector("[data-stars]");
  if (stars) {
    fetch("https://api.github.com/repos/barmoshe/playmark")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.stargazers_count === "number" && d.stargazers_count > 0) {
          stars.textContent = d.stargazers_count;
          stars.hidden = false;
        }
      })
      .catch(() => {});
  }
})();
