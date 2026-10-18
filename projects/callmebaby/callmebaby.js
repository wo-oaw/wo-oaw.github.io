(() => {
  const stage = document.querySelector(".presentation-stage");
  const previous = document.querySelector(".presentation-prev");
  const next = document.querySelector(".presentation-next");
  const count = document.querySelector("#presentation-slide-count");
  const title = document.querySelector("#presentation-slide-title");
  if (!stage || !previous || !next || !count || !title) return;

  const slideTitles = [
    "표지", "그림을 그려요", "같이 그림을 그려요", "스티커로 꾸며요", "관심사를 알아봐요",
    "관심사로 대화해요", "추억을 기록해요", "그림일기로 기록해요", "기술 소개", "핵심 AI 기술",
    "아이의 말 인식", "음성 인식 결과", "대화 속 관심사", "관심사 추출", "관심사 추출",
    "관심사 추출", "그림일기 생성", "컨텍스트 주입", "그림일기 생성", "필터 최적화",
    "입력 해상도와 추론", "필터 최적화", "통화가 끊길 때", "비정상 종료", "LiveKit 참가자 이벤트",
    "재접속", "사용자 테스트", "마무리", "팀 소개", "마지막 슬라이드"
  ];

  // The GIFs are the original animated pictures embedded in the presentation.
  // Coordinates and crop values follow their picture frames in the 16:9 PPT slide.
  const animatedSlides = {
    "03": { left: 46.25, top: 21.944, width: 44.062, height: 41.259, crop: [1.36, 0, 2.762, 0] },
    "04": { left: 28.281, top: 36.111, width: 43.438, height: 42.778, crop: [1.375, 0, 0.67, 2.229] },
    "06": { left: 9.688, top: 25.556, width: 41.875, height: 42.242, crop: [0.73, 0, 1.46, 0] },
    "08": { left: 25.391, top: 35.093, width: 47.188, height: 44.444, crop: [0, 0, 0, 0] },
    "16": { left: 27.208, top: 36.111, width: 44.231, height: 43.889, crop: [1.398, 1.224, 1.164, 2.094] }
  };

  for (let index = 1; index < slideTitles.length; index += 1) {
    const number = String(index + 1).padStart(2, "0");
    const slide = document.createElement("div");
    slide.className = "presentation-slide";
    slide.dataset.slideNumber = number;
    slide.dataset.slideTitle = slideTitles[index];
    slide.setAttribute("aria-hidden", "true");

    if (index === 27 || index === 29) {
      const message = document.createElement("div");
      message.className = "web-slide-message";
      message.setAttribute("role", "img");
      message.setAttribute("aria-label", index === 27 ? "평범한 통화에서 함께 만드는 경험으로" : "오늘의 통화가 다음 이야기의 시작이 되도록");
      const line = document.createElement("p");
      line.textContent = index === 27 ? "평범한 통화에서" : "오늘의 통화가";
      const highlight = document.createElement("strong");
      highlight.textContent = index === 27 ? "함께 만드는 경험으로" : "다음 이야기의 시작이 되도록";
      const logo = document.createElement("img");
      logo.src = "../../assets/callmebaby/cover-logo.png";
      logo.alt = "";
      message.append(line, highlight, logo);
      slide.append(message);
    } else {
      const image = document.createElement("img");
      image.dataset.src = `../../assets/callmebaby/presentation/slide-${number}.png?v=fontfix-1`;
      image.alt = `Call Me Baby 최종 발표 ${number}번 슬라이드: ${slideTitles[index]}`;
      image.decoding = "async";
      image.draggable = false;
      slide.append(image);

      const animation = animatedSlides[number];
      if (animation) {
        const viewport = document.createElement("div");
        viewport.className = "presentation-motion";
        viewport.setAttribute("aria-hidden", "true");
        viewport.style.left = `${animation.left}%`;
        viewport.style.top = `${animation.top}%`;
        viewport.style.width = `${animation.width}%`;
        viewport.style.height = `${animation.height}%`;

        const gif = document.createElement("img");
        const [left, top, right, bottom] = animation.crop;
        const visibleWidth = 100 - left - right;
        const visibleHeight = 100 - top - bottom;
        gif.dataset.motionSrc = `../../assets/callmebaby/presentation/animated/slide-${number}.gif`;
        gif.style.width = `${10000 / visibleWidth}%`;
        gif.style.height = `${10000 / visibleHeight}%`;
        gif.style.left = `${-100 * left / visibleWidth}%`;
        gif.style.top = `${-100 * top / visibleHeight}%`;
        gif.alt = "";
        gif.draggable = false;
        viewport.append(gif);
        slide.append(viewport);
      }
    }
    stage.append(slide);
  }

  const slides = Array.from(stage.querySelectorAll(".presentation-slide"));
  let currentIndex = 0;
  let pointerStartX = null;
  let pointerId = null;

  const hydrateSlide = (slide) => {
    const image = slide.querySelector("img[data-src]");
    if (!image) return;
    image.src = image.dataset.src;
    image.removeAttribute("data-src");
  };

  const startMotion = (slide) => {
    const gif = slide.querySelector("img[data-motion-src]");
    if (gif && !gif.hasAttribute("src")) gif.src = gif.dataset.motionSrc;
  };

  const stopMotion = (slide) => {
    const gif = slide.querySelector("img[data-motion-src]");
    if (gif) gif.removeAttribute("src");
  };

  const showSlide = (requestedIndex) => {
    const nextIndex = (requestedIndex + slides.length) % slides.length;
    if (nextIndex === currentIndex) return;
    const outgoing = slides[currentIndex];
    outgoing.classList.remove("is-active", "is-leaving-next", "is-leaving-previous");
    outgoing.classList.add(nextIndex < currentIndex ? "is-leaving-previous" : "is-leaving-next");
    outgoing.setAttribute("aria-hidden", "true");
    stopMotion(outgoing);

    currentIndex = nextIndex;
    const incoming = slides[currentIndex];
    hydrateSlide(incoming);
    hydrateSlide(slides[(currentIndex + 1) % slides.length]);
    hydrateSlide(slides[(currentIndex - 1 + slides.length) % slides.length]);
    incoming.classList.remove("is-leaving-next", "is-leaving-previous");
    incoming.classList.add("is-active");
    incoming.setAttribute("aria-hidden", "false");
    startMotion(incoming);
    count.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")} · SLIDE ${incoming.dataset.slideNumber}`;
    title.textContent = incoming.dataset.slideTitle;
  };

  previous.addEventListener("click", () => showSlide(currentIndex - 1));
  next.addEventListener("click", () => showSlide(currentIndex + 1));
  stage.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); showSlide(currentIndex - 1); }
    if (event.key === "ArrowRight") { event.preventDefault(); showSlide(currentIndex + 1); }
  });
  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStartX = event.clientX;
    pointerId = event.pointerId;
    stage.setPointerCapture?.(event.pointerId);
    stage.classList.add("is-dragging");
  });
  stage.addEventListener("pointermove", (event) => {
    if (pointerStartX === null || event.pointerId !== pointerId) return;
    const distance = Math.max(-120, Math.min(120, event.clientX - pointerStartX));
    const activeSlide = slides[currentIndex];
    activeSlide.style.transition = "none";
    activeSlide.style.transform = `translateX(${distance * 0.35}px)`;
  });
  const endDrag = (event, shouldNavigate) => {
    if (pointerStartX === null || event.pointerId !== pointerId) return;
    const distance = event.clientX - pointerStartX;
    const activeSlide = slides[currentIndex];
    activeSlide.style.removeProperty("transition");
    activeSlide.style.removeProperty("transform");
    stage.classList.remove("is-dragging");
    if (stage.hasPointerCapture?.(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    pointerStartX = null;
    pointerId = null;
    if (shouldNavigate && Math.abs(distance) > 48) showSlide(currentIndex + (distance < 0 ? 1 : -1));
  };
  stage.addEventListener("pointerup", (event) => endDrag(event, true));
  stage.addEventListener("pointercancel", (event) => endDrag(event, false));

  hydrateSlide(slides[1]);
  hydrateSlide(slides[slides.length - 1]);
})();

(() => {
  const header = document.querySelector("[data-header]");
  const themeSections = Array.from(document.querySelectorAll("[data-theme]"));
  const navLinks = Array.from(document.querySelectorAll('.project-nav a[href^="#"]'));
  if (!header || themeSections.length === 0) return;
  let ticking = false;

  const updateHeader = () => {
    const marker = window.scrollY + 90;
    let activeSection = themeSections[0];
    themeSections.forEach((section) => {
      if (section.offsetTop <= marker) activeSection = section;
    });
    header.dataset.currentTheme = activeSection.dataset.theme || "light";
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeSection.dataset.nav || ""}`;
      link.classList.toggle("is-active", isActive);
      if (isActive) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
    ticking = false;
  };

  const requestHeaderUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHeader);
  };

  updateHeader();
  window.addEventListener("scroll", requestHeaderUpdate, { passive: true });
  window.addEventListener("resize", requestHeaderUpdate);
})();
