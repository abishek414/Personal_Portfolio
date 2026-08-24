
// Hero topology diagram - line-draw-in animation

(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    animateLinks();
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
})();