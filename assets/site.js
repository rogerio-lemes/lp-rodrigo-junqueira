(function(){
  var CFG = window.SITE_CONFIG || {};
  var WA = CFG.wa || "5511999974094";

  function waLink(msg){ return "https://wa.me/" + WA + "?text=" + msg; }
  function openWa(msg){ window.open(waLink(msg), "_blank", "noopener"); }
  function enc(s){ return encodeURIComponent(s); }

  /* Header scroll shadow */
  var header = document.getElementById('siteHeader');
  function onScrollHeader(){
    if(!header) return;
    if(window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScrollHeader, {passive:true});
  onScrollHeader();

  /* Hamburger / drawer */
  var hamburger = document.getElementById('hamburgerBtn');
  var drawer = document.getElementById('drawer');
  var overlayDim = document.getElementById('overlayDim');
  function closeDrawer(){
    if(hamburger) hamburger.classList.remove('open');
    if(drawer) drawer.classList.remove('open');
    if(overlayDim) overlayDim.classList.remove('open');
  }
  if(hamburger){
    hamburger.addEventListener('click', function(){
      hamburger.classList.toggle('open');
      drawer.classList.toggle('open');
      overlayDim.classList.toggle('open');
    });
  }
  if(overlayDim) overlayDim.addEventListener('click', closeDrawer);
  if(drawer) drawer.querySelectorAll('a').forEach(function(a){ a.addEventListener('click', closeDrawer); });

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('active'); io.unobserve(e.target); }
      });
    }, {threshold:.2});
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('active'); });
  }

  /* Count up */
  var counters = document.querySelectorAll('[data-count]');
  function animateCount(el){
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var dur = 1400, start = null;
    function step(ts){
      if(!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.floor(p * target) + (p===1 && (target===98||target===100) ? '' : '');
      if(p < 1) requestAnimationFrame(step); else el.textContent = target;
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window && counters.length){
    var ioC = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ animateCount(e.target); ioC.unobserve(e.target); }
      });
    }, {threshold:.4});
    counters.forEach(function(el){ ioC.observe(el); });
  }

  /* FAQ accordion */
  document.querySelectorAll('.acc-item').forEach(function(item){
    var q = item.querySelector('.acc-q');
    var a = item.querySelector('.acc-a');
    if(!q || !a) return;
    q.addEventListener('click', function(){
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.acc-item.open').forEach(function(o){
        if(o !== item){ o.classList.remove('open'); o.querySelector('.acc-a').style.maxHeight = null; }
      });
      if(isOpen){ item.classList.remove('open'); a.style.maxHeight = null; }
      else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
    });
  });

  /* Back to top */
  var backTop = document.getElementById('backTop');
  window.addEventListener('scroll', function(){
    if(!backTop) return;
    if(window.scrollY > 400) backTop.classList.add('show'); else backTop.classList.remove('show');
  }, {passive:true});
  if(backTop) backTop.addEventListener('click', function(){ window.scrollTo({top:0, behavior:'smooth'}); });

  /* WhatsApp widget */
  var waFab = document.getElementById('waFab');
  var waPanel = document.getElementById('waPanel');
  var waClose = document.getElementById('waClose');
  var waAutoOpened = false;
  function toggleWaPanel(force){
    if(!waPanel) return;
    if(typeof force === 'boolean'){ waPanel.classList[force ? 'add' : 'remove']('show'); }
    else waPanel.classList.toggle('show');
  }
  if(waFab) waFab.addEventListener('click', function(){ toggleWaPanel(); });
  if(waClose) waClose.addEventListener('click', function(e){ e.stopPropagation(); toggleWaPanel(false); });
  setTimeout(function(){ if(!waAutoOpened){ toggleWaPanel(true); waAutoOpened = true; } }, 3000);

  document.querySelectorAll('.wa-opt').forEach(function(btn){
    btn.addEventListener('click', function(){
      openWa(btn.getAttribute('data-msg'));
      toggleWaPanel(false);
    });
  });
  var waFreeForm = document.getElementById('waFreeForm');
  if(waFreeForm){
    waFreeForm.addEventListener('submit', function(e){
      e.preventDefault();
      var txt = document.getElementById('waFreeText').value.trim();
      if(!txt) return;
      openWa(enc(txt));
      document.getElementById('waFreeText').value = '';
      toggleWaPanel(false);
    });
  }

  /* Lead form -> WhatsApp */
  var leadForm = document.getElementById('leadForm');
  if(leadForm){
    leadForm.addEventListener('submit', function(e){
      e.preventDefault();
      var name = leadForm.querySelector('input[type=text]');
      var phone = leadForm.querySelector('#leadPhone');
      var svc = leadForm.querySelector('select');
      var name_v = name ? name.value : '';
      var svc_v = svc ? svc.value : '';
      var msg = 'Olá! Meu nome é ' + name_v + '. Quero agendar: ' + svc_v + '.';
      openWa(enc(msg));
    });
  }

  /* Exit intent */
  var exitModal = document.getElementById('exitModal');
  var exitShown = sessionStorage.getItem('ccm_exit_shown');
  if(exitModal && !exitShown && window.innerWidth > 900){
    document.addEventListener('mouseleave', function(e){
      if(e.clientY <= 0 && !sessionStorage.getItem('ccm_exit_shown')){
        exitModal.classList.add('show');
        sessionStorage.setItem('ccm_exit_shown', '1');
      }
    });
  }
  var exitClose = document.getElementById('exitClose');
  if(exitClose) exitClose.addEventListener('click', function(){ exitModal.classList.remove('show'); });
  if(exitModal) exitModal.addEventListener('click', function(e){ if(e.target === exitModal) exitModal.classList.remove('show'); });
  var exitSubmit = document.getElementById('exitSubmit');
  if(exitSubmit) exitSubmit.addEventListener('click', function(){
    var n = document.getElementById('exitName').value;
    var p = document.getElementById('exitPhone').value;
    openWa(enc('Olá! Meu nome é ' + n + ' (WhatsApp ' + p + '). Quero que me chamem para agendar.'));
    exitModal.classList.remove('show');
  });

  /* Review modal */
  var reviewModal = document.getElementById('reviewModal');
  var openReviewBtn = document.getElementById('openReviewModal');
  if(openReviewBtn) openReviewBtn.addEventListener('click', function(){ reviewModal.classList.add('show'); });
  var reviewClose = document.getElementById('reviewClose');
  if(reviewClose) reviewClose.addEventListener('click', function(){ reviewModal.classList.remove('show'); });
  if(reviewModal) reviewModal.addEventListener('click', function(e){ if(e.target === reviewModal) reviewModal.classList.remove('show'); });

  /* Mobile capture */
  var mobileCapture = document.getElementById('mobileCapture');
  var mcClose = document.getElementById('mcClose');
  var mcShown = sessionStorage.getItem('ccm_mc_shown');
  if(mobileCapture && !mcShown && window.innerWidth < 768){
    var footerEl = document.querySelector('footer.site');
    if(footerEl && 'IntersectionObserver' in window){
      var ioF = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if(e.isIntersecting && !sessionStorage.getItem('ccm_mc_shown')){
            mobileCapture.classList.add('show');
            sessionStorage.setItem('ccm_mc_shown', '1');
            ioF.unobserve(footerEl);
          }
        });
      }, {threshold:.1});
      ioF.observe(footerEl);
    }
  }
  if(mcClose) mcClose.addEventListener('click', function(){ mobileCapture.classList.remove('show'); });
  var mcSubmit = document.getElementById('mcSubmit');
  if(mcSubmit) mcSubmit.addEventListener('click', function(){
    var n = document.getElementById('mcName').value;
    var p = document.getElementById('mcPhone').value;
    openWa(enc('Olá! Meu nome é ' + n + ' (WhatsApp ' + p + '). Quero um horário especial.'));
    mobileCapture.classList.remove('show');
  });

  /* PWA install */
  var deferredPrompt = null;
  var installCard = document.getElementById('installCard');
  var installClose = document.getElementById('installClose');
  var installBtn = document.getElementById('installBtn');
  var footerInstallBtn = document.getElementById('footerInstallBtn');
  window.addEventListener('beforeinstallprompt', function(e){
    e.preventDefault();
    deferredPrompt = e;
    if(!sessionStorage.getItem('ccm_install_dismissed')){
      setTimeout(function(){ if(installCard) installCard.classList.add('show'); }, 6000);
    }
  });
  function triggerInstall(){
    if(deferredPrompt){
      deferredPrompt.prompt();
      deferredPrompt.userChoice.finally(function(){ deferredPrompt = null; if(installCard) installCard.classList.remove('show'); });
    } else {
      alert('Para instalar: toque em Compartilhar e depois em "Adicionar à Tela de Início".');
    }
  }
  if(installBtn) installBtn.addEventListener('click', triggerInstall);
  if(footerInstallBtn) footerInstallBtn.addEventListener('click', function(e){ e.preventDefault(); triggerInstall(); });
  if(installClose) installClose.addEventListener('click', function(){
    installCard.classList.remove('show');
    sessionStorage.setItem('ccm_install_dismissed', '1');
  });

  if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
      navigator.serviceWorker.register('/sw.js').catch(function(){});
    });
  }

  /* ===== Tour engine ===== */
  var tourTrigger = document.getElementById('tourTrigger');
  var tourDim, tourHighlight, tourBalloon;
  var steps = [];
  var curStep = -1;
  var stepToken = 0;

  function buildTourDom(){
    tourDim = document.createElement('div');
    tourDim.className = 'tour-dim';
    tourHighlight = document.createElement('div');
    tourHighlight.className = 'tour-highlight';
    tourHighlight.style.display = 'none';
    tourBalloon = document.createElement('div');
    tourBalloon.className = 'tour-balloon';
    tourBalloon.innerHTML =
      '<span class="t-close" id="tCloseBtn">✕</span>' +
      '<span class="t-count" id="tCount"></span>' +
      '<h4 id="tTitle"></h4>' +
      '<p id="tText"></p>' +
      '<div class="t-cta" id="tCta" style="display:none;"></div>' +
      '<div class="t-nav"><button id="tPrev">← Anterior</button><button id="tNext">Próximo →</button></div>';
    document.body.appendChild(tourDim);
    document.body.appendChild(tourHighlight);
    document.body.appendChild(tourBalloon);
    document.getElementById('tCloseBtn').addEventListener('click', closeTour);
    document.getElementById('tPrev').addEventListener('click', function(){ showStep(curStep - 1); });
    document.getElementById('tNext').addEventListener('click', function(){
      if(curStep >= steps.length - 1) closeTour(); else showStep(curStep + 1);
    });
    tourDim.addEventListener('click', closeTour);
    document.addEventListener('keydown', function(e){
      if(tourDim.classList.contains('show')){
        if(e.key === 'ArrowRight') showStep(curStep + 1);
        if(e.key === 'ArrowLeft') showStep(curStep - 1);
        if(e.key === 'Escape') closeTour();
      }
    });
  }

  function computeSteps(){
    var raw = (CFG.tourSteps || []).slice();
    var isMobile = window.innerWidth < 768;
    return raw.filter(function(s){
      if(s.mobileOnly && !isMobile) return false;
      if(s.sel){
        var el = document.querySelector(s.sel);
        return !!el;
      }
      return true;
    });
  }

  function openTour(){
    if(!tourDim) buildTourDom();
    steps = computeSteps();
    if(!steps.length) return;
    tourDim.classList.add('show');
    showStep(0);
  }

  function closeTour(){
    if(tourDim) tourDim.classList.remove('show');
    if(tourHighlight) tourHighlight.style.display = 'none';
    if(tourBalloon) tourBalloon.classList.remove('show');
    curStep = -1;
  }

  function positionForElement(el){
    var r = el.getBoundingClientRect();
    tourHighlight.style.display = 'block';
    tourHighlight.style.top = (r.top - 8) + 'px';
    tourHighlight.style.left = (r.left - 8) + 'px';
    tourHighlight.style.width = (r.width + 16) + 'px';
    tourHighlight.style.height = (r.height + 16) + 'px';

    var vh = window.innerHeight, vw = window.innerWidth;
    var balloonW = Math.min(340, vw - 32);
    tourBalloon.style.width = balloonW + 'px';
    var spaceBelow = vh - r.bottom;
    var top, arrowClass;
    if(spaceBelow > 220 || spaceBelow > (r.top)){
      top = r.bottom + 18;
      arrowClass = 'arrow-top';
    } else {
      top = Math.max(16, r.top - 18 - 200);
      arrowClass = 'arrow-bottom';
    }
    top = Math.min(top, vh - 40);
    var left = Math.min(Math.max(16, r.left), vw - balloonW - 16);
    tourBalloon.classList.remove('arrow-top', 'arrow-bottom');
    tourBalloon.classList.add(arrowClass);
    tourBalloon.style.top = top + 'px';
    tourBalloon.style.left = left + 'px';
  }

  function positionCenter(){
    tourHighlight.style.display = 'none';
    tourBalloon.classList.remove('arrow-top', 'arrow-bottom');
    var vh = window.innerHeight, vw = window.innerWidth;
    var balloonW = Math.min(360, vw - 32);
    tourBalloon.style.width = balloonW + 'px';
    tourBalloon.style.left = ((vw - balloonW) / 2) + 'px';
    tourBalloon.style.top = ((vh - 220) / 2) + 'px';
  }

  function showStep(idx){
    if(idx < 0 || idx >= steps.length) return;
    curStep = idx;
    var s = steps[idx];
    var myToken = ++stepToken;
    tourBalloon.classList.remove('show');
    document.getElementById('tCount').textContent = (idx + 1) + ' de ' + steps.length;
    document.getElementById('tTitle').textContent = s.title;
    document.getElementById('tText').textContent = s.text;
    document.getElementById('tPrev').disabled = idx === 0;
    document.getElementById('tNext').textContent = idx === steps.length - 1 ? 'Finalizar' : 'Próximo →';
    var ctaBox = document.getElementById('tCta');
    ctaBox.innerHTML = '';
    ctaBox.style.display = 'none';
    if(s.final){
      ctaBox.style.display = 'block';
      ctaBox.innerHTML = '<a class="btn btn-action btn-block" style="margin-bottom:8px;height:40px;font-size:13px;" target="_blank" rel="noopener" href="https://wa.me/5534988634055?text=Ol%C3%A1%20Rog%C3%A9rio%20tudo%20bem%3F%20Gostei%20muito%20e%20quero%20fechar%20neg%C3%B3cio!%20Bora%20iniciar%20o%20projeto!">Quero fechar negócio 🚀</a><button class="btn btn-outline btn-block" id="tCloseFinal" style="height:38px;font-size:13px;">Fechar tour</button>';
      document.getElementById('tCloseFinal').addEventListener('click', closeTour);
    }

    var el = s.sel ? document.querySelector(s.sel) : null;
    if(el){
      el.scrollIntoView({behavior:'smooth', block:'center'});
      setTimeout(function(){
        if(myToken !== stepToken) return;
        positionForElement(el);
        tourBalloon.classList.add('show');
      }, 420);
    } else {
      window.scrollTo({top: window.scrollY, behavior:'smooth'});
      positionCenter();
      setTimeout(function(){
        if(myToken !== stepToken) return;
        tourBalloon.classList.add('show');
      }, 60);
    }
  }

  if(tourTrigger) tourTrigger.addEventListener('click', openTour);

  /* ===== Article: TOC, mobile collapsible, TTS player ===== */
  (function setupTOC(){
    var tocLinks = document.querySelectorAll('.toc-box a[href^="#"]');
    if(!tocLinks.length) return;
    tocLinks.forEach(function(a){
      a.addEventListener('click', function(e){
        e.preventDefault();
        var id = a.getAttribute('href').slice(1);
        var el = document.getElementById(id);
        if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
    var headings = Array.prototype.map.call(tocLinks, function(a){
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);
    if('IntersectionObserver' in window && headings.length){
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            tocLinks.forEach(function(a){ a.classList.remove('active'); });
            var match = document.querySelector('.toc-box a[href="#' + entry.target.id + '"]');
            if(match) match.classList.add('active');
          }
        });
      }, {rootMargin:'-100px 0px -70% 0px'});
      headings.forEach(function(h){ obs.observe(h); });
    }
  })();

  (function setupMobileToc(){
    var toggle = document.getElementById('mobileTocToggle');
    var box = document.getElementById('tocCollapsible');
    if(!toggle || !box) return;
    toggle.addEventListener('click', function(){
      box.classList.toggle('open');
      toggle.classList.toggle('open');
    });
  })();

  (function setupTTS(){
    var btn = document.getElementById('ttsPlay');
    if(!btn) return;
    var speedBtns = document.querySelectorAll('.player-speeds button');
    var rate = 1, utter = null, playing = false;
    function getText(){
      var els = document.querySelectorAll('.art-content p, .art-content h2, .art-content h3');
      return Array.prototype.map.call(els, function(e){ return e.textContent; }).join('. ');
    }
    function updateBtn(){ btn.textContent = playing ? '❚❚' : '▶'; }
    function startSpeak(){
      if(!('speechSynthesis' in window)){ alert('Seu navegador não suporta leitura em voz alta.'); return; }
      utter = new SpeechSynthesisUtterance(getText());
      utter.lang = 'pt-BR';
      utter.rate = rate;
      utter.onend = function(){ playing = false; updateBtn(); };
      window.speechSynthesis.speak(utter);
      playing = true;
      updateBtn();
    }
    speedBtns.forEach(function(b){
      b.addEventListener('click', function(){
        speedBtns.forEach(function(x){ x.classList.remove('active'); });
        b.classList.add('active');
        rate = parseFloat(b.getAttribute('data-rate'));
        if(utter) utter.rate = rate;
        if(playing && 'speechSynthesis' in window){
          window.speechSynthesis.cancel();
          startSpeak();
        }
      });
    });
    btn.addEventListener('click', function(){
      if(!('speechSynthesis' in window)){ alert('Seu navegador não suporta leitura em voz alta.'); return; }
      if(playing){
        window.speechSynthesis.pause();
        playing = false;
        updateBtn();
      } else if(window.speechSynthesis.paused){
        window.speechSynthesis.resume();
        playing = true;
        updateBtn();
      } else {
        startSpeak();
      }
    });
  })();

})();
