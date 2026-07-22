/**
 * ==========================================================================
 * SCRIPTS DA LANDING PAGE - MÔNICA BARROS (VANILLA JS)
 * Arquitetura modularizada e segura.
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. MENU MOBILE
       ========================================================================== */
    const menuBtn = document.getElementById('mobile-menu-btn');
    const closeBtn = document.getElementById('close-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('menu-overlay');
    const navLinks = document.querySelectorAll('.mobile-nav-link');

    if (menuBtn && closeBtn && menu && overlay) {
        const openMenu = () => {
            menu.classList.add('open');
            overlay.classList.add('active');
            // Trava o scroll do fundo enquanto o menu está aberto
            document.body.style.overflow = 'hidden'; 
        };

        const closeMenu = () => {
            menu.classList.remove('open');
            overlay.classList.remove('active');
            // Libera o scroll do fundo
            document.body.style.overflow = '';
        };

        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openMenu();
        });
        
        closeBtn.addEventListener('click', closeMenu);
        overlay.addEventListener('click', closeMenu);
        
        // Fecha o menu ao clicar em qualquer link
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Acessibilidade: fechar menu com a tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                closeMenu();
            }
        });
    }

    /* ==========================================================================
       2. HEADER FIXO (STICKY) COM TRANSIÇÃO
       ========================================================================== */
    const header = document.getElementById('main-header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.style.padding = '8px 0';
                header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)';
            } else {
                header.style.padding = '0';
                header.style.boxShadow = 'none';
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