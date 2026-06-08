/* Bridge Point — interactions */
(function () {
  'use strict';

  var header = document.getElementById('header');
  var menuBtn = document.getElementById('menuBtn');
  var drawer = document.getElementById('drawer');

  /* ---- Sticky header solid state ---- */
  function onScroll() {
    if (window.scrollY > 40) header.classList.add('solid');
    else header.classList.remove('solid');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- Mobile drawer ---- */
  function closeDrawer() {
    drawer.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  menuBtn.addEventListener('click', function () {
    var open = drawer.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ---- Scroll-spy + reveal (scroll-based, IO-independent) ---- */
  var spyLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[data-spy]'));
  var sections = spyLinks.map(function (l) {
    return document.getElementById(l.getAttribute('data-spy'));
  });
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var ticking = false;

  function refresh() {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;

    /* reveal anything that has entered the lower ~92% of the viewport */
    for (var i = 0; i < reveals.length; i++) {
      var el = reveals[i];
      if (el.classList.contains('in')) continue;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('in');
    }

    /* scroll-spy: last section whose top has passed 45% of viewport */
    var activeId = null;
    for (var j = 0; j < sections.length; j++) {
      var s = sections[j];
      if (!s) continue;
      if (s.getBoundingClientRect().top <= vh * 0.45) activeId = s.id;
    }
    for (var k = 0; k < spyLinks.length; k++) {
      spyLinks[k].classList.toggle('active', spyLinks[k].getAttribute('data-spy') === activeId);
    }
  }
  function onScrollRefresh() {
    if (!ticking) { ticking = true; requestAnimationFrame(refresh); }
  }
  window.addEventListener('scroll', onScrollRefresh, { passive: true });
  window.addEventListener('resize', onScrollRefresh, { passive: true });
  window.addEventListener('load', refresh);
  refresh();
  /* safety net: never leave content hidden if something went wrong */
  setTimeout(function () {
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top < (window.innerHeight || 0)) el.classList.add('in');
    });
  }, 500);

  /* ---- Contact form → mailto ---- */
  var form = document.getElementById('contactForm');
  var ok = document.getElementById('formOk');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var name = encodeURIComponent(form.name.value || '');
      var company = form.company.value || '—';
      var phone = form.phone.value || '—';
      var msg = form.message.value || '';
      var body = encodeURIComponent(
        'Name: ' + form.name.value + '\n' +
        'Company: ' + company + '\n' +
        'Phone: ' + phone + '\n\n' +
        msg
      );
      var subject = encodeURIComponent('Website enquiry — ' + form.name.value);
      window.location.href = 'mailto:hello@bridgepoint.example?subject=' + subject + '&body=' + body;
      ok.classList.add('show');
    });
  }
})();
