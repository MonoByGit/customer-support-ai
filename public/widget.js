(function () {
  "use strict";

  // Voorkom dubbele initialisatie wanneer het script twee keer wordt ingesloten.
  if (window.__VERDE_AI_WIDGET_LOADED__) return;
  window.__VERDE_AI_WIDGET_LOADED__ = true;

  var BRAND = "#2196F3";
  var BRAND_HOVER = "#1E88E5";

  var currentScript =
    document.currentScript ||
    (function () {
      var scripts = document.getElementsByTagName("script");
      return scripts[scripts.length - 1];
    })();

  var slug = (currentScript && currentScript.getAttribute("data-slug")) || "tandartspraktijk-amsterdam";
  var host =
    currentScript && currentScript.src
      ? new URL(currentScript.src).origin
      : "https://verde-whatsapp-ai-production.up.railway.app";
  var position = (currentScript && currentScript.getAttribute("data-position")) || "bottom-right";
  var label = (currentScript && currentScript.getAttribute("data-label")) || "Afspraak maken via WhatsApp";
  var isLeft = position === "bottom-left";

  var WA_ICON =
    '<svg width="30" height="30" viewBox="0 0 24 24" fill="white" aria-hidden="true"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.782 2.796.782 3.185 0 5.77-2.587 5.77-5.768 0-3.18-2.586-5.766-5.77-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.748 0-3.39-.452-4.82-1.246l-7.18 1.884 1.921-7.013c-.876-1.488-1.378-3.218-1.378-5.068 0-5.514 4.486-10 10-10s9.457 4.486 10 10z"/></svg>';
  var CLOSE_ICON =
    '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  function applyStyles(el, styles) {
    for (var key in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, key)) el.style[key] = styles[key];
    }
  }

  // --- Paneel met de assistent -------------------------------------------
  var panel = document.createElement("div");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Verde AI afsprakenassistent");
  applyStyles(panel, {
    display: "none",
    position: "fixed",
    bottom: "96px",
    right: isLeft ? "auto" : "24px",
    left: isLeft ? "24px" : "auto",
    width: "390px",
    height: "620px",
    maxHeight: "calc(100vh - 128px)",
    maxWidth: "calc(100vw - 32px)",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 24px 60px rgba(10, 25, 47, 0.28)",
    border: "1px solid rgba(10, 25, 47, 0.1)",
    zIndex: "2147483000",
    backgroundColor: "#EFEAE2",
  });

  var iframe = document.createElement("iframe");
  iframe.title = "Verde AI afsprakenassistent";
  // Lazy: de assistent laadt pas bij de eerste opening, niet bij elke paginaweergave.
  iframe.loading = "lazy";
  applyStyles(iframe, { width: "100%", height: "100%", border: "none", display: "block" });
  panel.appendChild(iframe);

  // --- Knop ---------------------------------------------------------------
  var btn = document.createElement("button");
  btn.type = "button";
  btn.setAttribute("aria-label", label);
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = WA_ICON;
  applyStyles(btn, {
    width: "58px",
    height: "58px",
    borderRadius: "29px",
    backgroundColor: BRAND,
    border: "none",
    boxShadow: "0 10px 28px rgba(33, 150, 243, 0.42)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), background-color 0.2s ease",
    padding: "0",
  });

  btn.addEventListener("mouseenter", function () {
    btn.style.transform = "scale(1.06)";
    btn.style.backgroundColor = BRAND_HOVER;
  });
  btn.addEventListener("mouseleave", function () {
    btn.style.transform = "scale(1)";
    btn.style.backgroundColor = BRAND;
  });

  var container = document.createElement("div");
  container.id = "verde-ai-widget-container";
  applyStyles(container, {
    position: "fixed",
    zIndex: "2147483001",
    bottom: "24px",
    right: isLeft ? "auto" : "24px",
    left: isLeft ? "24px" : "auto",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  });
  container.appendChild(btn);

  var isOpen = false;

  function setOpen(next) {
    isOpen = next;
    btn.setAttribute("aria-expanded", String(next));

    if (next) {
      // Pas laden bij de eerste opening.
      if (!iframe.src) iframe.src = host + "/live/" + encodeURIComponent(slug);
      panel.style.display = "block";
      btn.innerHTML = CLOSE_ICON;
      btn.setAttribute("aria-label", "Sluit de afsprakenassistent");
    } else {
      panel.style.display = "none";
      btn.innerHTML = WA_ICON;
      btn.setAttribute("aria-label", label);
    }
  }

  btn.addEventListener("click", function () {
    setOpen(!isOpen);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && isOpen) setOpen(false);
  });

  function mount() {
    document.body.appendChild(panel);
    document.body.appendChild(container);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
