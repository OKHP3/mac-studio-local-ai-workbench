const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
let analyticsReady = false;

function initializeGoogleAnalytics() {
  if (!measurementId || typeof window === "undefined") return false;
  if (analyticsReady) return true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { send_page_view: false });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  script.dataset.ga4 = measurementId;
  document.head.appendChild(script);
  analyticsReady = true;
  return true;
}

export function trackPageView(pagePath, pageTitle) {
  if (!initializeGoogleAnalytics()) return;

  try {
    window.gtag("event", "page_view", {
      page_title: pageTitle,
      page_path: pagePath,
      page_location: new URL(pagePath, window.location.origin).href,
    });
  } catch {
    // Analytics failures must never interrupt navigation or rendering.
  }
}