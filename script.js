document.addEventListener("DOMContentLoaded", () => {
  //
  // ─── FIREBASE INIT ───────────────────────────────────────────────────────────
  //
  const firebaseConfig = {
    apiKey: "AIzaSyArKl-lnlAWJQM2hDdlXnKyAyCpfTqkabA",
    authDomain: "y3s1-capstone-parallax-paradox.firebaseapp.com",
    projectId: "y3s1-capstone-parallax-paradox",
    storageBucket: "y3s1-capstone-parallax-paradox.firebasestorage.app",
    messagingSenderId: "549505580384",
    appId: "1:549505580384:web:67b59c9362ecd399f7f205",
  };

  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  //
  // ─── FORM SUBMISSION & FIRESTORE WRITE ──────────────────────────────────────────────────────────
  //
  const signupForm = document.querySelector(".signup");
  const emailInput = signupForm.querySelector("#email");

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (!email) {
      alert("Please enter a valid email.");
      return;
    }

    try {
      // write to "subscribers" collection
      await db.collection("subscribers").add({
        email,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
      alert("Thanks! You’re on the list.");
      signupForm.reset();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Oops, something went wrong. Please try again.");
    }
  });

  //
  // ─── CAROUSEL LOOP & AUTO-ROTATE ──────────────────────────────────────────────
  //
  const container = document.querySelector(".carousel-container");
  const track = document.querySelector(".carousel-track");
  const nextBtn = document.querySelector(".carousel-btn.next");
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const slides = Array.from(track.children);

  // 1) Clone first & last
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  track.appendChild(firstClone);
  track.insertBefore(lastClone, slides[0]);

  // 2) Measure the viewport width, jump to real first
  const slideWidth = container.clientWidth;
  track.scrollLeft = slideWidth;

  // helper to toggle smooth vs instant
  function setScrollBehavior(smooth) {
    track.classList.toggle("no-anim", !smooth);
  }

  // 3) Next / Prev handlers
  nextBtn.addEventListener("click", () => {
    setScrollBehavior(true);
    track.scrollBy({ left: slideWidth, behavior: "smooth" });
  });
  prevBtn.addEventListener("click", () => {
    setScrollBehavior(true);
    track.scrollBy({ left: -slideWidth, behavior: "smooth" });
  });

  // 4) Loop when hitting clones
  let isThrottled = false;
  track.addEventListener("scroll", () => {
    if (isThrottled) return;
    isThrottled = true;
    setTimeout(() => {
      const maxScroll = track.scrollWidth - slideWidth;
      if (track.scrollLeft <= 0) {
        setScrollBehavior(false);
        track.scrollLeft = maxScroll - slideWidth;
      } else if (track.scrollLeft >= maxScroll) {
        setScrollBehavior(false);
        track.scrollLeft = slideWidth;
      }
      isThrottled = false;
    }, 200);
  });

  // 5) Auto-rotate every 4s
  setInterval(() => nextBtn.click(), 6000);
});
