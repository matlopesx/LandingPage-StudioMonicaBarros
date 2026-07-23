/**
 * ==========================================================================
 * SCRIPTS DA LANDING PAGE - MÔNICA BARROS (VANILLA JS)
 * Arquitetura modularizada e segura.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

/* ==========================================================================
   1. CONTROLE DEFINITIVO DO MENU MOBILE (GAVETA + OVERLAY + ACESSIBILIDADE)
   ========================================================================== */
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuOverlay = document.getElementById('menu-overlay');
const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-menu__link');

if (mobileMenuBtn && mobileMenu && menuOverlay) {
    // Aplica o inert via JS ao carregar a página para evitar travamento inicial
    mobileMenu.setAttribute('inert', '');
    menuOverlay.setAttribute('inert', '');

    const openMobileMenu = () => {
        // Remove o bloqueio para a gaveta poder abrir e receber cliques
        mobileMenu.removeAttribute('inert');
        menuOverlay.removeAttribute('inert');
        
        mobileMenu.classList.add('active', 'open');
        menuOverlay.classList.add('active', 'open');
        
        mobileMenu.setAttribute('aria-hidden', 'false');
        menuOverlay.setAttribute('aria-hidden', 'false');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // Trava o scroll do fundo
    };

    const closeMobileMenu = () => {
        // Tira o foco do botão de fechar ANTES de esconder para não dar erro no WAI-ARIA
        if (mobileMenuBtn) {
            mobileMenuBtn.focus();
        } else if (document.activeElement) {
            document.activeElement.blur();
        }

        mobileMenu.classList.remove('active', 'open');
        menuOverlay.classList.remove('active', 'open');
        
        mobileMenu.setAttribute('aria-hidden', 'true');
        menuOverlay.setAttribute('aria-hidden', 'true');
        
        // Devolve o bloqueio quando o menu fecha
        mobileMenu.setAttribute('inert', '');
        menuOverlay.setAttribute('inert', '');
        
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = ''; // Libera o scroll da página
    };

    mobileMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openMobileMenu();
    });

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', closeMobileMenu);
    }

    menuOverlay.addEventListener('click', closeMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && (mobileMenu.classList.contains('active') || mobileMenu.classList.contains('open'))) {
            closeMobileMenu();
        }
    });
}
/* ==========================================================================
   2. HEADER FIXO (STICKY) COM TRANSIÇÃO E LOGO DINÂMICA UNIFICADOS
   ========================================================================== */
const header = document.getElementById('main-header');
const logoImg = document.querySelector('.header__logo img');

if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            // Efeito ao rolar a página
            header.style.padding = '8px 0';
            header.style.boxShadow = '0 4px 15px rgba(0,0,0,0.08)';
            if (logoImg && window.innerWidth > 768) {
                logoImg.style.height = '75px'; 
            }
        } else {
            // Efeito no topo da página
            header.style.padding = '0';
            header.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
            if (logoImg && window.innerWidth > 768) {
                logoImg.style.height = '110px'; 
            }
        }
    });
}

    /* ==========================================================================
       3. ANIMAÇÕES DE SCROLL (REVEAL)
       ========================================================================== */
    // Configura o observador para disparar quando o elemento estiver 10% visível
    const observerOptions = { 
        threshold: 0.1, 
        rootMargin: '0px 0px -50px 0px' 
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Se quiser que anime apenas 1x, descomente a linha abaixo:
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Aplica o observador a todos os elementos com a classe .reveal
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    /* ==========================================================================
       4. GALERIA: MINI SLIDESHOW DE CASOS (CROSSFADE)
       ========================================================================== */
    const slideshows = document.querySelectorAll('.mini-slideshow');
    
    if (slideshows.length > 0) {
        slideshows.forEach(slideshow => {
            const slides = slideshow.querySelectorAll('.mini-slideshow__slide');
            let currentSlide = 0;
            
            // Troca a foto automaticamente a cada 3.5 segundos
            setInterval(() => {
                // Remove a opacidade da foto atual
                slides[currentSlide].classList.remove('active');
                
                // Calcula qual é a próxima (se for a última, volta pro 0)
                currentSlide = (currentSlide + 1) % slides.length;
                
                // Adiciona a opacidade na nova foto
                slides[currentSlide].classList.add('active');
            }, 3500); 
        });
    }

    /* ==========================================================================
       5. CARROSSEL (SEÇÃO SOBRE)
       ========================================================================== */
    const track = document.getElementById('prof-track');
    
    if (track) {
        const slides = Array.from(track.children);
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        let currentSlide = 0;

        const updateCarousel = () => {
            track.style.transform = `translateX(-${currentSlide * 100}%)`;
        };

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = (currentSlide + 1) % slides.length;
                updateCarousel();
            });

            prevBtn.addEventListener('click', () => {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                updateCarousel();
            });
        }

        // Auto-play do carrossel (a cada 6 segundos)
        setInterval(() => {
            currentSlide = (currentSlide + 1) % slides.length;
            updateCarousel();
        }, 6000);
    }

    /* ==========================================================================
       6. ROLAGEM SUAVE (SMOOTH SCROLL) PARA LINKS INTERNOS
       ========================================================================== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            
            // Ignora se o href for apenas "#"
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                // Subtrai a altura aproximada do header fixo (80px) 
                // para que o título não fique escondido embaixo dele
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* ==========================================================================
       7. RASTREAMENTO INTELIGENTE DE LEADS (META PIXEL)
       ========================================================================== */
    const whatsappNumber = "5511988470138"; //
    const defaultMessage = "Olá,%20Mônica!%20Vim%20pelo%20site%20e%20gostaria%20de%20agendar%20uma%20avaliação.";
    
    // Seleciona todos os botões de agendamento/WhatsApp da página
    const ctaButtons = document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]');
    
    ctaButtons.forEach(btn => {
        // Garante que o link já sai com a mensagem pronta otimizada para conversão
        btn.href = `https://wa.me/${whatsappNumber}?text=${defaultMessage}`;
        
        // Adiciona o gatilho de rastreamento no clique
        btn.addEventListener('click', () => {
            if (typeof fbq === 'function') {
                // Dispara o evento padrão de Lead para o Gerenciador de Anúncios
                fbq('track', 'Lead');
                console.log('Conversão de Lead registrada com sucesso!');
            }
        });
    });
});