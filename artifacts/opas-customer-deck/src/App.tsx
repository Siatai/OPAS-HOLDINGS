/**
 * Platform contract file — do not restructure.
 *
 * This file is part of the contract between the slides artifact and
 * the surrounding workspace tooling (preview, thumbnails, exports).
 * Reorganizing it, swapping the router, or changing the structure
 * of `AllSlides` can quietly break that tooling even when the page
 * still looks correct in the preview.
 *
 * Agents: see the slides skill `<workspace_contract>` for the full
 * rules, and `references/visual_qa.md` → "Platform contract sanity
 * check" if this file has been hand-edited and needs repair.
 */

import { useEffect, useRef } from "react";
import { useLocation } from "wouter";

import { slides } from "@/slideLoader";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function toDeckPath(path: string): string {
  if (!basePath) return path;
  return path.startsWith(basePath) ? path.slice(basePath.length) || "/" : path;
}

function deckHref(path: string): string {
  return `${basePath}${path}`;
}

function getSlideIndex(pathname: string): number {
  const match = toDeckPath(pathname).match(/^\/slide(\d+)$/);
  if (!match) return -1;
  const position = parseInt(match[1], 10);
  return slides.findIndex((s) => s.position === position);
}

function SlideEditor() {
  const [location, navigate] = useLocation();
  const currentIndex = getSlideIndex(location);

  // In the workspace, the slide iframe is nested inside another iframe,
  // so window.parent !== window.parent.parent. In the deployed SlideViewer,
  // the parent is the top-level window, so they're equal. Disable local
  // navigation only in the workspace — the parent owns it there.
  const navigationDisabledRef = useRef(window.parent !== window.parent.parent);
  const touchHandledRefStable = useRef(false);
  const wheelLockRef = useRef(false);

  useEffect(() => {
    if (currentIndex === -1) return;

    const goToIndex = (nextIndex: number) => {
      if (nextIndex < 0 || nextIndex >= slides.length || nextIndex === currentIndex) return;
      navigate(deckHref(`/slide${slides[nextIndex].position}`));
    };

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (navigationDisabledRef.current) return;
      if (event.key === " ") {
        event.preventDefault();
      }
      if ((event.key === "ArrowLeft" || event.key === "ArrowUp") && currentIndex > 0) {
        goToIndex(currentIndex - 1);
      }
      if (
        (event.key === "ArrowRight" || event.key === "ArrowDown" || event.key === " ") &&
        currentIndex < slides.length - 1
      ) {
        goToIndex(currentIndex + 1);
      }
    };

    const INTERACTIVE =
      "a,button,video,audio,input,select,textarea,details,summary,iframe,svg,canvas," +
      '[role="button"],[contenteditable="true"]';

    const isInteractive = (target: EventTarget | null) =>
      (target as HTMLElement | null)?.closest?.(INTERACTIVE);

    const touchHandledRef = touchHandledRefStable;

    const onClick = (event: MouseEvent) => {
      if (touchHandledRef.current) {
        touchHandledRef.current = false;
        return;
      }
      if (event.button !== 0 || event.metaKey || event.ctrlKey) return;
      if (isInteractive(event.target)) return;

      if (navigationDisabledRef.current) {
        window.parent.postMessage({ type: "advanceSlide" }, "*");
        return;
      }

      if (currentIndex < slides.length - 1) {
        goToIndex(currentIndex + 1);
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (isInteractive(event.target)) return;
      const dominant = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(dominant) < 24) return;
      event.preventDefault();

      if (wheelLockRef.current) return;
      wheelLockRef.current = true;
      window.setTimeout(() => {
        wheelLockRef.current = false;
      }, 420);

      if (dominant > 0 && currentIndex < slides.length - 1) {
        goToIndex(currentIndex + 1);
      } else if (dominant < 0 && currentIndex > 0) {
        goToIndex(currentIndex - 1);
      }
    };

    let touchStartX = 0;
    let touchStartY = 0;
    let touchTarget: EventTarget | null = null;

    const onTouchStart = (event: TouchEvent) => {
      touchHandledRef.current = false;
      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
      touchTarget = event.target;
    };

    const onTouchEnd = (event: TouchEvent) => {
      const dx = event.changedTouches[0].clientX - touchStartX;
      const dy = event.changedTouches[0].clientY - touchStartY;
      if (isInteractive(touchTarget)) return;

      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const isSwipe = Math.max(absX, absY) >= 36;

      if (navigationDisabledRef.current) {
        if (isSwipe) {
          window.parent.postMessage({ type: absY > absX ? (dy > 0 ? "retreatSlide" : "advanceSlide") : (dx > 0 ? "retreatSlide" : "advanceSlide") }, "*");
        } else {
          touchHandledRef.current = true;
          window.parent.postMessage({ type: "advanceSlide" }, "*");
        }
        return;
      }

      if (isSwipe) {
        if (absY > absX) {
          if (dy < 0 && currentIndex < slides.length - 1) goToIndex(currentIndex + 1);
          if (dy > 0 && currentIndex > 0) goToIndex(currentIndex - 1);
        } else {
          if (dx < 0 && currentIndex < slides.length - 1) goToIndex(currentIndex + 1);
          if (dx > 0 && currentIndex > 0) goToIndex(currentIndex - 1);
        }
        return;
      }

      touchHandledRef.current = true;
      const fraction = touchStartX / window.innerWidth;
      if (fraction < 0.4 && currentIndex > 0) {
        goToIndex(currentIndex - 1);
      } else if (fraction >= 0.4 && currentIndex < slides.length - 1) {
        goToIndex(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("click", onClick);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart);
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("click", onClick);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [currentIndex, navigate]);

  return (
    <div className="select-none">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          style={{ display: index === currentIndex ? "block" : "none" }}
        >
          <slide.Component />
        </div>
      ))}
    </div>
  );
}

// Do not rewrite this component. Each slide must remain wrapped in
// `<div className="slide">` sized 1920×1080 — the class name and
// dimensions are part of the platform contract. See the file-level
// banner above for context.
function AllSlides() {
  return (
    <div className="bg-black">
      {slides.map((slide) => (
        <div
          key={slide.id}
          className="slide relative aspect-video overflow-hidden"
          style={{ width: "1920px", height: "1080px" }}
        >
          <div className="h-full w-full [&_.h-screen]:!h-full [&_.w-screen]:!w-full">
            <slide.Component />
          </div>
        </div>
      ))}
    </div>
  );
}

// This component is used for the deployed view at `/`
function SlideViewer() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight" && event.key !== " ") return;
      if (event.key === " ") event.preventDefault();
      iframeRef.current?.contentWindow?.dispatchEvent(
        new KeyboardEvent("keydown", { key: event.key, code: event.code, bubbles: true }),
      );
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    let wheelLocked = false;
    const post = (type: "advanceSlide" | "retreatSlide") => {
      iframeRef.current?.contentWindow?.postMessage({ type }, "*");
    };

    const onWheel = (event: WheelEvent) => {
      const dominant = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(dominant) < 24) return;
      event.preventDefault();
      if (wheelLocked) return;
      wheelLocked = true;
      window.setTimeout(() => {
        wheelLocked = false;
      }, 420);
      post(dominant > 0 ? "advanceSlide" : "retreatSlide");
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const firstPosition = slides.length > 0 ? slides[0].position : 1;

  return (
    <div
      className="slide-viewer h-screen w-screen overflow-hidden bg-black flex items-center justify-center"
      onClick={() => iframeRef.current?.focus()}
    >
      <iframe
        ref={iframeRef}
        src={`${base}/slide${firstPosition}`}
        style={{ width: "100vw", height: "100vh", border: "none" }}
        onLoad={() => iframeRef.current?.focus()}
        title="Slide viewer"
      />
    </div>
  );
}

export default function App() {
  const [location, navigate] = useLocation();

  // DO NOT edit this useEffect - redirects unknown routes to the first slide.
  // The "/" and "/allslides" routes are handled separately below.
  useEffect(() => {
    if (
      toDeckPath(location) !== "/" &&
      toDeckPath(location) !== "/allslides" &&
      getSlideIndex(location) === -1
    ) {
      if (slides.length > 0) {
        navigate(deckHref(`/slide${slides[0].position}`), { replace: true });
      }
    }
  }, [location, navigate]);

  // DO NOT edit this useEffect - allows the parent frame to navigate
  // between slides via postMessage so it can avoid changing the iframe
  // src (which causes a white flash).
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.data?.type === "advanceSlide") {
        const idx = getSlideIndex(window.location.pathname);
        if (idx >= 0 && idx < slides.length - 1) {
          navigate(deckHref(`/slide${slides[idx + 1].position}`));
        }
        return;
      }
      if (event.data?.type === "retreatSlide") {
        const idx = getSlideIndex(window.location.pathname);
        if (idx > 0) {
          navigate(deckHref(`/slide${slides[idx - 1].position}`));
        }
        return;
      }
      if (
        event.data?.type === "navigateToSlide" &&
        typeof event.data.position === "number" &&
        slides.some((s) => s.position === event.data.position)
      ) {
        navigate(deckHref(`/slide${event.data.position}`));
      }
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [navigate]);

  if (toDeckPath(location) === "/") return <SlideViewer />;
  if (toDeckPath(location) === "/allslides") return <AllSlides />;
  return <SlideEditor />;
}
