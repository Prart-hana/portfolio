/**
 * Portfolio Photo Manager
 * Click any photo circle to set your photo — it saves automatically across all pages.
 */
(function () {
  var KEY = 'portfolioPhoto';

  /* ── Apply a data-URL to every photo slot on the page ── */
  function applyPhoto(dataUrl) {
    // Nav avatar images
    document.querySelectorAll('.nav-avatar img').forEach(function (img) {
      img.src = dataUrl;
      img.style.display = 'block';
      img.parentElement.textContent = '';
      img.parentElement.appendChild(img);
    });

    // Large hero / about photo
    document.querySelectorAll(
      '.about-photo-inner img, .photo-inner img, .hero-photo-inner img'
    ).forEach(function (img) {
      img.src = dataUrl;
      img.style.display = 'block';
    });

    // Hide "PB" fallback divs
    ['aboutFb', 'photo-fb'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    // Remove hint badge if present
    document.querySelectorAll('.photo-hint').forEach(function (h) { h.remove(); });
  }

  /* ── Open file picker and save choice ── */
  function pickPhoto(e) {
    e.stopPropagation();
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function (ev) {
      var file = ev.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function (re) {
        var dataUrl = re.target.result;
        try { localStorage.setItem(KEY, dataUrl); } catch (_) {}
        applyPhoto(dataUrl);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  /* ── Add a "📸 click to add photo" badge when photo is missing ── */
  function addHint(container) {
    if (container.querySelector('.photo-hint')) return;
    var badge = document.createElement('div');
    badge.className = 'photo-hint';
    badge.innerHTML = '📸';
    badge.title = 'Click to set your photo';
    badge.style.cssText = [
      'position:absolute', 'bottom:4px', 'right:4px',
      'background:rgba(202,138,4,0.9)', 'color:#fff',
      'border-radius:50%', 'width:22px', 'height:22px',
      'display:flex', 'align-items:center', 'justify-content:center',
      'font-size:11px', 'pointer-events:none', 'z-index:10'
    ].join(';');
    container.style.position = 'relative';
    container.appendChild(badge);
  }

  /* ── Wire up click handlers on all photo containers ── */
  function wireContainers() {
    var selectors = [
      '.nav-avatar',
      '.about-photo-ring',
      '.photo-ring',
      '.about-photo-inner',
      '.photo-inner'
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) {
        el.style.cursor = 'pointer';
        el.title = 'Click to set your photo';
        el.addEventListener('click', pickPhoto);
      });
    });
  }

  /* ── Boot ── */
  function init() {
    wireContainers();
    var stored = null;
    try { stored = localStorage.getItem(KEY); } catch (_) {}

    if (stored) {
      applyPhoto(stored);
    } else {
      // Show hint badge on nav avatar and large ring
      document.querySelectorAll('.nav-avatar, .about-photo-ring, .photo-ring').forEach(function (el) {
        addHint(el);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
