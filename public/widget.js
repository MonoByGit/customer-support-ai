(function() {
  // Prevent duplicate initialization
  if (window.__VERDE_AI_WIDGET_LOADED__) return;
  window.__VERDE_AI_WIDGET_LOADED__ = true;

  // Find script element to get config
  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var slug = currentScript ? currentScript.getAttribute('data-slug') : 'tandarts-demo';
  var host = currentScript && currentScript.src ? new URL(currentScript.src).origin : 'https://verde-ai.up.railway.app';
  var position = (currentScript && currentScript.getAttribute('data-position')) || 'bottom-right';

  // Create Container
  var container = document.createElement('div');
  container.id = 'verde-ai-widget-container';
  container.style.position = 'fixed';
  container.style.zIndex = '999999';
  container.style.bottom = '24px';
  container.style.right = position === 'bottom-left' ? 'auto' : '24px';
  container.style.left = position === 'bottom-left' ? '24px' : 'auto';
  container.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

  // Create Button
  var btn = document.createElement('button');
  btn.style.width = '60px';
  btn.style.height = '60px';
  btn.style.borderRadius = '30px';
  btn.style.backgroundColor = '#25D366';
  btn.style.border = 'none';
  btn.style.boxShadow = '0 10px 25px rgba(37, 211, 102, 0.4)';
  btn.style.cursor = 'pointer';
  btn.style.display = 'flex';
  btn.style.alignItems = 'center';
  btn.style.justifyContent = 'center';
  btn.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
  btn.title = 'Afspraak maken via WhatsApp AI';

  btn.onmouseover = function() { btn.style.transform = 'scale(1.08)'; };
  btn.onmouseout = function() { btn.style.transform = 'scale(1)'; };

  // SVG WhatsApp Icon
  btn.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24" fill="white"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.782 2.796.782 3.185 0 5.77-2.587 5.77-5.768 0-3.18-2.586-5.766-5.77-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.748 0-3.39-.452-4.82-1.246l-7.18 1.884 1.921-7.013c-.876-1.488-1.378-3.218-1.378-5.068 0-5.514 4.486-10 10-10s9.457 4.486 10 10z"/></svg>';

  // Iframe modal for the chat
  var iframeContainer = document.createElement('div');
  iframeContainer.style.display = 'none';
  iframeContainer.style.position = 'fixed';
  iframeContainer.style.bottom = '96px';
  iframeContainer.style.right = position === 'bottom-left' ? 'auto' : '24px';
  iframeContainer.style.left = position === 'bottom-left' ? '24px' : 'auto';
  iframeContainer.style.width = '390px';
  iframeContainer.style.height = '620px';
  iframeContainer.style.maxHeight = 'calc(100vh - 120px)';
  iframeContainer.style.maxWidth = 'calc(100vw - 32px)';
  iframeContainer.style.borderRadius = '24px';
  iframeContainer.style.overflow = 'hidden';
  iframeContainer.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.25)';
  iframeContainer.style.border = '1px solid rgba(0, 0, 0, 0.08)';
  iframeContainer.style.zIndex = '999999';
  iframeContainer.style.backgroundColor = '#EFEAE2';

  var iframe = document.createElement('iframe');
  iframe.src = host + '/demo/' + slug;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = 'none';

  iframeContainer.appendChild(iframe);

  var isOpen = false;
  btn.onclick = function() {
    isOpen = !isOpen;
    if (isOpen) {
      iframeContainer.style.display = 'block';
      btn.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
    } else {
      iframeContainer.style.display = 'none';
      btn.innerHTML = '<svg width="34" height="34" viewBox="0 0 24 24" fill="white"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.771.782 2.796.782 3.185 0 5.77-2.587 5.77-5.768 0-3.18-2.586-5.766-5.77-5.766zm9.969 5.766c0 5.514-4.486 10-10 10-1.748 0-3.39-.452-4.82-1.246l-7.18 1.884 1.921-7.013c-.876-1.488-1.378-3.218-1.378-5.068 0-5.514 4.486-10 10-10s9.457 4.486 10 10z"/></svg>';
    }
  };

  container.appendChild(btn);
  document.body.appendChild(iframeContainer);
  document.body.appendChild(container);
})();
