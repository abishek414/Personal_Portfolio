
// Hero topology diagram - line-draw-in animation

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    animateLinks();
    wireNodeLinks();
    animatePackets();
    wireTopologyToggle();
  });
  // Draw each connecting line in on load, like a link establishing.
   function animateLinks() {
    var links = document.querySelectorAll('.topology .link');
    links.forEach(function (line, i) {
      var length = line.getTotalLength();
      line.style.strokeDasharray = length;

      line.style.strokeDashoffset = length;
      line.getBoundingClientRect();
      line.style.transition = 'stroke-dashoffset 1.8s ease ' + (i * 0.25) + 's';
      line.style.strokeDashoffset = 0;
    });
  }
    // Clicking (or pressing Enter/Space on) a satellite node scrolls to the
  // matching skill card and briefly highlights it.
  function wireNodeLinks() {
    var nodes = document.querySelectorAll('.node-link');

    nodes.forEach(function (node) {
      node.addEventListener('click', function () {
        goToSkill(node.dataset.skill);
      });

      node.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          goToSkill(node.dataset.skill);
        }
      });
    });
  }

  function goToSkill(skill) {
    var card = document.querySelector('.skill-card[data-skill="' + skill + '"]');
    if (!card) return;

    card.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'center'
    });

    card.classList.add('is-highlighted');
    window.setTimeout(function () {
      card.classList.remove('is-highlighted');
    }, 1600);
  }

  // Continuous ambient motion: small "packets" travel back and forth along
  // each connection on their own, no interaction required.
  function animatePackets() {
    if (reduceMotion) return;

    var packets = Array.prototype.slice.call(document.querySelectorAll('.packet'));
    if (!packets.length) return;

    var durationMs = 2600;

    function frame(now) {
      packets.forEach(function (packet) {
        var line = document.querySelector('.link[data-link="' + packet.dataset.line + '"]');
        if (!line) return;

        var speed = parseFloat(packet.dataset.speed) || 1;
        var offset = parseFloat(packet.dataset.offset) || 0;
        var cycle = durationMs / speed;

        var raw = ((now + offset) % cycle) / cycle;
        var t = raw < 0.5 ? raw * 2 : 2 - raw * 2;

        var length = line.getTotalLength();
        var point = line.getPointAtLength(t * length);
        packet.setAttribute('cx', point.x);
        packet.setAttribute('cy', point.y);
      });

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  // Project topology image: hidden by default, revealed only on tap/click
  // of the "Show topology diagram" button. It auto-closes again as soon as
  // the tab/window loses focus.
  function wireTopologyToggle() {
    var container = document.querySelector('[data-topology-container]');
    if (!container) return;

    var toggleBtn = container.querySelector('[data-topology-toggle]');
    var labelEl = container.querySelector('.topology-toggle-label');
    if (!toggleBtn) return;

    function openTopology() {
      container.classList.add('is-open');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (labelEl) labelEl.textContent = 'Hide topology diagram';
    }

    function closeTopology() {
      if (!container.classList.contains('is-open')) return;
      container.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      if (labelEl) labelEl.textContent = 'Show topology diagram';
    }

    toggleBtn.addEventListener('click', function () {
      if (container.classList.contains('is-open')) {
        closeTopology();
      } else {
        openTopology();
      }
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) closeTopology();
    });

    window.addEventListener('blur', closeTopology);
  }
})();