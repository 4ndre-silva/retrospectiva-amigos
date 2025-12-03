const enterButton = document.querySelector('.enter-button');
const enterScreen = document.querySelector('.enter-screen');
const carouselTrack = document.querySelector('.carousel-track');
const memoryCards = document.querySelectorAll('.memory-card');
const navPrev = document.querySelector('.carousel-nav.prev');
const navNext = document.querySelector('.carousel-nav.next');
const sections = document.querySelectorAll('section');
const particlesContainer = document.querySelector('.particles');
const backgroundMusic = document.getElementById('background-music');
const musicToggle = document.getElementById('musicToggle');
const volumeSlider = document.getElementById('volumeSlider');
const currentSlideElement = document.querySelector('.current-slide');
const totalSlidesElement = document.querySelector('.total-slides');
const carouselCounter = document.querySelector('.carousel-counter');
const photoModal = document.querySelector('.photo-modal');
const photoModalImg = document.querySelector('.photo-modal-image');
const photoModalTitle = document.querySelector('.photo-modal-title');
const photoModalCaption = document.querySelector('.photo-modal-caption');
const photoModalClose = document.querySelector('.photo-modal-close');
const photoModalBackdrop = document.querySelector('.photo-modal-backdrop');
const photoModalSticker = document.querySelector('.photo-modal-sticker');
const oscarsParticlesContainer = document.querySelector('.oscars-particles');
const confettiLayer = document.querySelector('.confetti-layer');

let confettiTriggered = false;

const createParticles = (total = 45) => {
  if (!particlesContainer) return;
  for (let i = 0; i < total; i += 1) {
    const particle = document.createElement('span');
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 4}s`;
    particle.style.animationDuration = `${4 + Math.random() * 4}s`;
    particlesContainer.appendChild(particle);
  }
};

const createOscarStars = (total = 25) => {
  if (!oscarsParticlesContainer) return;
  for (let i = 0; i < total; i += 1) {
    const star = document.createElement('span');
    star.style.left = `${Math.random() * 100}%`;
    star.style.bottom = `${Math.random() * 20}px`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    star.style.animationDuration = `${4 + Math.random() * 3}s`;
    oscarsParticlesContainer.appendChild(star);
  }
};

const launchConfetti = (total = 80) => {
  if (!confettiLayer || confettiTriggered) return;
  confettiTriggered = true;

  for (let i = 0; i < total; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.animationDelay = `${Math.random() * 1.5}s`;
    piece.style.animationDuration = `${3 + Math.random() * 2}s`;
    confettiLayer.appendChild(piece);
  }
};

const handleEnter = () => {
  document.body.classList.add('entered');
  enterScreen.classList.add('hidden');
  
  // Iniciar música de fundo
  if (backgroundMusic) {
    backgroundMusic.volume = 0.3;
    backgroundMusic.play().catch((error) => {
      console.log('Autoplay bloqueado. Clique para reproduzir:', error);
      // Tenta reproduzir após interação do usuário
      document.addEventListener('click', () => {
        backgroundMusic.play().catch(() => {});
      }, { once: true });
    });
  }
  
  document.getElementById('video').scrollIntoView({ behavior: 'smooth' });
};

const updateActiveCard = () => {
  if (!carouselTrack) return;
  
  const trackRect = carouselTrack.getBoundingClientRect();
  let activeIndex = 0;
  let minDistance = Infinity;
  
  memoryCards.forEach((card, index) => {
    const cardRect = card.getBoundingClientRect();
    const cardCenter = cardRect.left + cardRect.width / 2;
    const trackCenter = trackRect.left + trackRect.width / 2;
    const distance = Math.abs(cardCenter - trackCenter);
    const scale = Math.max(0.92, 1 - distance / trackRect.width);
    card.style.transform = `scale(${scale})`;
    card.classList.toggle('active', distance < cardRect.width / 2);
    
    if (distance < minDistance) {
      minDistance = distance;
      activeIndex = index;
    }
  });
  
  // Atualizar contador de slides
  if (currentSlideElement) {
    currentSlideElement.textContent = activeIndex + 1;
  }
};

const scrollCarousel = (direction) => {
  const cardWidth = memoryCards[0].offsetWidth + 16;
  carouselTrack.scrollBy({
    left: direction * cardWidth,
    behavior: 'smooth',
  });
  setTimeout(updateActiveCard, 400);
};

const initIntersectionObserver = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }

        if (entry.target.id === 'memorias' && carouselCounter) {
          if (entry.isIntersecting) {
            carouselCounter.classList.add('show');
          } else {
            carouselCounter.classList.remove('show');
          }
        }

        // Tema de fundo por seção
        if (entry.isIntersecting && entry.target.dataset.theme) {
          const themeClass = `theme-${entry.target.dataset.theme}`;
          document.body.classList.remove(
            'theme-video',
            'theme-gallery',
            'theme-rankings',
            'theme-oscars',
            'theme-homenagens',
            'theme-final'
          );
          document.body.classList.add(themeClass);
        }

        // Ativar timeline dos rankings
        if (entry.target.id === 'rankings' && entry.isIntersecting) {
          entry.target.classList.add('timeline-active');
        }

        // Ativar confete na mensagem final
        if (entry.target.id === 'final' && entry.isIntersecting) {
          launchConfetti();
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((section) => {
    section.classList.add('animate-on-scroll');
    observer.observe(section);
  });
};

const toggleCardExpand = (card) => {
  memoryCards.forEach((item) => {
    if (item !== card) item.classList.remove('expanded');
  });
  card.classList.toggle('expanded');
};

const openPhotoModal = (card) => {
  if (!photoModal || !photoModalImg || !photoModalTitle || !photoModalCaption) return;

  const img = card.querySelector('img');
  const title = card.dataset.title || 'Memória do ano';
  const caption = card.dataset.caption || img?.alt || '';

  if (img) {
    photoModalImg.src = img.src;
    photoModalImg.alt = img.alt;
  }

  photoModalTitle.textContent = title;
  photoModalCaption.textContent = caption;

  if (photoModalSticker && img) {
    photoModalSticker.textContent = '✨';
  }

  photoModal.classList.add('open');
  document.body.classList.add('modal-open');
};

const closePhotoModal = () => {
  if (!photoModal) return;
  photoModal.classList.remove('open');
  document.body.classList.remove('modal-open');
};

// Controles de música
const initMusicControls = () => {
  if (!backgroundMusic || !musicToggle || !volumeSlider) return;
  
  // Definir volume inicial
  backgroundMusic.volume = volumeSlider.value / 100;
  
  // Toggle play/pause
  musicToggle.addEventListener('click', () => {
    if (backgroundMusic.paused) {
      backgroundMusic.play().catch(() => {});
      musicToggle.querySelector('.music-status').textContent = 'Tocando';
      musicToggle.querySelector('.music-icon').textContent = '🎵';
    } else {
      backgroundMusic.pause();
      musicToggle.querySelector('.music-status').textContent = 'Pausado';
      musicToggle.querySelector('.music-icon').textContent = '🔇';
    }
  });
  
  // Controle de volume
  volumeSlider.addEventListener('input', (e) => {
    backgroundMusic.volume = e.target.value / 100;
  });
  
  // Atualizar ícone quando música terminar ou pausar
  backgroundMusic.addEventListener('pause', () => {
    musicToggle.querySelector('.music-status').textContent = 'Pausado';
    musicToggle.querySelector('.music-icon').textContent = '🔇';
  });
  
  backgroundMusic.addEventListener('play', () => {
    musicToggle.querySelector('.music-status').textContent = 'Tocando';
    musicToggle.querySelector('.music-icon').textContent = '🎵';
  });
};

// Botão Voltar ao Topo
const initBackToTop = () => {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  const toggleButton = () => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleButton);
  
  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

// Scratch Card - Revelar vencedores dos Oscars
const initScratchCards = () => {
  const oscarCards = document.querySelectorAll('.oscar-card');
  
  // Nomes dos vencedores (você pode personalizar aqui)
  const winners = [
    'Werlei Beh', // Mais preguiçoso
    'João Foquinha', // Mais esquisito
    'Andrézin 085', // Mais gaiato
    'Edson delas' , // Casal que não é casal
    'Romulo Pindidy' // Lesado
  ];

  oscarCards.forEach((card, index) => {
    const winnerNameEl = card.querySelector('.winner-name');
    if (!winnerNameEl) return;

    let isRevealed = false;

    card.addEventListener('mouseenter', () => {
      if (!isRevealed) {
        setTimeout(() => {
          if (winnerNameEl && winners[index]) {
            winnerNameEl.textContent = winners[index];
            isRevealed = true;
          }
        }, 300);
      }
    });

    // Opcional: revelar ao clicar também
    card.addEventListener('click', () => {
      if (!isRevealed && winnerNameEl && winners[index]) {
        winnerNameEl.textContent = winners[index];
        isRevealed = true;
      }
    });
  });
};

// Animações em cascata + lock por senha para cards de homenagem
const initHomenagensAnimation = () => {
  const homenagemCards = document.querySelectorAll('.homenagem-card');

  // Senhas ofuscadas (base64 simples para não ficar visível)
  const senhasOfuscadas = {
    Edson: btoa('edsin').split('').reverse().join(''),
    Beh: btoa('werlei').split('').reverse().join(''),
    Romulo: btoa('pindidy').split('').reverse().join(''),
    João: btoa('foquinha').split('').reverse().join(''),
  };

  // Função para decodificar senha
  const decodificarSenha = (ofuscada) => {
    return atob(ofuscada.split('').reverse().join(''));
  };

  const senhaPorNome = {};
  Object.keys(senhasOfuscadas).forEach(nome => {
    senhaPorNome[nome] = decodificarSenha(senhasOfuscadas[nome]);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  homenagemCards.forEach((card) => {
    observer.observe(card);

    // Começa bloqueado
    card.classList.add('locked');

    card.addEventListener('click', () => {
      if (!card.classList.contains('locked')) return;

      const nameEl = card.querySelector('h3');
      if (!nameEl) return;
      const nome = nameEl.textContent.trim();
      const senhaEsperada = senhaPorNome[nome];
      if (!senhaEsperada) return;

      const tentativa = window.prompt(`Digite a senha de ${nome}:`);
      if (!tentativa) return;

      if (tentativa.trim().toLowerCase() === senhaEsperada.toLowerCase()) {
        card.classList.remove('locked');
      } else {
        window.alert('Senha incorreta. Tenta de novo 😉');
      }
    });
  });
};

document.addEventListener('DOMContentLoaded', () => {
  createParticles();
  createOscarStars();
  initIntersectionObserver();
  initMusicControls();
  initBackToTop();
  initScratchCards();
  initHomenagensAnimation();
  
  // Atualizar total de slides automaticamente
  const updateTotalSlides = () => {
    const cards = document.querySelectorAll('.carousel-track .memory-card');
    const count = cards.length;
    if (totalSlidesElement) {
      totalSlidesElement.textContent = count;
      console.log('Total de fotos atualizado:', count); // Debug
    }
  };
  
  // Atualizar inicialmente após um pequeno delay para garantir que o DOM está pronto
  setTimeout(() => {
    updateTotalSlides();
  }, 100);
  
  // Observar mudanças no DOM para atualizar automaticamente
  const carouselTrack = document.querySelector('.carousel-track');
  if (carouselTrack) {
    const observer = new MutationObserver(() => {
      updateTotalSlides();
    });
    
    observer.observe(carouselTrack, {
      childList: true,
      subtree: true
    });
    
    // Também atualizar quando o carrossel for atualizado
    updateTotalSlides();
  }
  
  updateActiveCard();

  if (enterButton) {
    enterButton.addEventListener('click', handleEnter);
  }

  if (carouselTrack) {
    let debounce;
    carouselTrack.addEventListener('scroll', () => {
      clearTimeout(debounce);
      debounce = setTimeout(updateActiveCard, 80);
    });
  }

  memoryCards.forEach((card) => {
    card.addEventListener('click', () => openPhotoModal(card));
  });

  navPrev?.addEventListener('click', () => scrollCarousel(-1));
  navNext?.addEventListener('click', () => scrollCarousel(1));
  
  // Suporte para teclado no carrossel
  document.addEventListener('keydown', (e) => {
    if (photoModal?.classList.contains('open') && e.key === 'Escape') {
      closePhotoModal();
      return;
    }

    if (e.key === 'ArrowLeft') {
      navPrev?.click();
    } else if (e.key === 'ArrowRight') {
      navNext?.click();
    }
  });

  // Fechar modal de foto
  photoModalClose?.addEventListener('click', closePhotoModal);
  photoModalBackdrop?.addEventListener('click', closePhotoModal);
});

