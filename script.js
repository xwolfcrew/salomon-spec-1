const wrapper = document.querySelector(".hero-wrapper");
const slides = document.querySelectorAll(".hero-item");

let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let currentIndex = 0;
const dragThreshold = 100;

wrapper.addEventListener("mousedown", dragStart);
window.addEventListener("mousemove", dragMove);
window.addEventListener("mouseup", dragEnd);

wrapper.addEventListener("touchstart", dragStart);
window.addEventListener("touchmove", dragMove);
window.addEventListener("mouseup", dragEnd);

function dragStart(e) {
  isDragging = true;

  if (e.type.includes("mouse")) {
    startX = e.pageX;
  } else {
    startX = e.touches[0].clientX;
  }
  wrapper.style.transition = "none";
}

function dragMove(e) {
  if (!isDragging) return;

  e.preventDefault();

  let currentX = 0;
  if (e.type.includes("mouse")) {
    currentX = e.pageX;
  } else {
    currentX = e.touches[0].clientX;
  }

  const currentMovedDistance = currentX - startX;

  currentTranslate = prevTranslate + currentMovedDistance;

  wrapper.style.transform = `translateX(${currentTranslate}px)`;
}

function dragEnd(e) {
  if (!isDragging) return;
  isDragging = false;

  wrapper.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -dragThreshold) {
    if (currentIndex < slides.length - 1) {
      currentIndex += 1;
    } else {
      currentIndex = 0;
    }
  } else if (movedBy > dragThreshold) {
    if (currentIndex > 0) {
      currentIndex -= 1;
    } else {
      currentIndex = slides.length - 1;
    }
  }

  snapToSlide();
}

function snapToSlide() {
  const slideWidth = window.innerWidth;
  currentTranslate = currentIndex * -slideWidth;
  prevTranslate = currentTranslate;

  wrapper.style.transform = `translateX(${currentTranslate}px)`;
}

window.addEventListener("resize", snapToSlide);

setInterval(() => {
  currentIndex = currentIndex < slides.length - 1 ? currentIndex + 1 : 0;

  wrapper.style.transition = "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)";
  snapToSlide();
}, 5000);

const emailForm = document.getElementById("emailForm");
const emailInput = document.getElementById("emailInput");
const formMessage = document.getElementById("formMessage");
const submitButton = emailForm.querySelector("button");

emailForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const emailValue = emailInput.value.trim();

  submitButton.disabled = true;
  submitButton.textContent = "Saving...";
  formMessage.textContent = "";

  setTimeout(() => {
    let storedEmails = JSON.parse(localStorage.getItem("capturedEmails")) || [];

    storedEmails.push({
      email: emailValue,
      submittedAt: new Date().toLocaleString(),
    });

    localStorage.setItem("capturedEmails", JSON.stringify(storedEmails));

    formMessage.textContent = "Email saved successfully";
    formMessage.style.color = "lightgreen";

    emailInput.value = "";
    submitButton.disabled = false;
    submitButton.textContent = "Submit";

    setTimeout(() => {
      formMessage.textContent = "";
    }, 3000);

    console.log("Current Database Status:", storedEmails);
  }, 1200);
});
