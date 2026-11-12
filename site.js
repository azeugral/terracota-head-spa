(function () {
  var topo = document.getElementById('topo');
  var barra = document.getElementById('barra');
  var hero = document.getElementById('inicio');
  var menu = document.getElementById('menu');
  var botaoMenu = document.querySelector('.topo-menu');

  // topo e barra de agendamento
  barra.hidden = false;
  function aoRolar() {
    var y = window.scrollY;
    topo.classList.toggle('rolou', y > 40);
    var fim = document.documentElement.scrollHeight - window.innerHeight - 260;
    barra.classList.toggle('sobe', y > hero.offsetHeight * 0.7 && y < fim);
  }
  window.addEventListener('scroll', aoRolar, { passive: true });
  aoRolar();

  // menu no celular
  function fechaMenu() {
    menu.classList.remove('aberto');
    topo.classList.remove('menu-aberto');
    botaoMenu.setAttribute('aria-expanded', 'false');
  }
  botaoMenu.addEventListener('click', function () {
    var abre = !menu.classList.contains('aberto');
    menu.classList.toggle('aberto', abre);
    topo.classList.toggle('menu-aberto', abre);
    botaoMenu.setAttribute('aria-expanded', String(abre));
  });
  menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') fechaMenu(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fechaMenu(); });

  // entradas suaves
  var revs = document.querySelectorAll('.rev');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visto'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px 6% 0px', threshold: 0.01 });
    revs.forEach(function (el) { io.observe(el); });

    // vídeos só tocam quando aparecem
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else v.pause();
      });
    }, { threshold: 0.35 });
    document.querySelectorAll('video[data-auto]').forEach(function (v) { vio.observe(v); });
  } else {
    revs.forEach(function (el) { el.classList.add('visto'); });
  }

  // tudo carregado de saída: fotos decodificadas e vídeos no buffer antes de rolar
  document.querySelectorAll('img').forEach(function (i) { if (i.decode) i.decode().catch(function () {}); });
  window.addEventListener('load', function () {
    document.querySelectorAll('video').forEach(function (v) { v.preload = 'auto'; if (v.readyState < 2) v.load(); });
  });

  // carrossel de vídeos começa no do meio
  var reels = document.querySelector('.reels');
  function centraReels() {
    if (reels.scrollWidth > reels.clientWidth) reels.scrollLeft = (reels.scrollWidth - reels.clientWidth) / 2;
  }
  centraReels();
  window.addEventListener('load', centraReels);

  // abas das experiências
  var abas = Array.prototype.slice.call(document.querySelectorAll('.abas [role="tab"]'));
  function ativa(aba, foco) {
    abas.forEach(function (a) {
      var on = a === aba;
      a.setAttribute('aria-selected', String(on));
      a.tabIndex = on ? 0 : -1;
      var p = document.getElementById(a.getAttribute('aria-controls'));
      p.hidden = !on;
      p.classList.toggle('troca', on);
    });
    if (foco) aba.focus();
  }
  abas.forEach(function (a, i) {
    a.addEventListener('click', function () { ativa(a); });
    a.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') ativa(abas[(i + 1) % abas.length], true);
      if (e.key === 'ArrowLeft') ativa(abas[(i - 1 + abas.length) % abas.length], true);
    });
  });
})();
