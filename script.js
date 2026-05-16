// ===================================
// DETECÇÃO DE DISPOSITIVO
// ===================================
const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
           || window.innerWidth <= 768;
};

const isTouch = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// ===================================
// CONFIGURAÇÕES GLOBAIS
// ===================================
const VALOR_CONSULTA_BASE = 350; // Valor base da consulta em reais
const VALOR_KM = 2; // Valor por quilômetro
const WHATSAPP_NUMERO = '5519999568568'; // Número do WhatsApp

// Configurações de animação baseadas no dispositivo
const ANIMATION_CONFIG = {
    mobile: {
        duration: 400,
        delay: 100,
        enableParallax: false,
        enableFloating: false
    },
    desktop: {
        duration: 800,
        delay: 150,
        enableParallax: true,
        enableFloating: true
    }
};

const config = isMobile() ? ANIMATION_CONFIG.mobile : ANIMATION_CONFIG.desktop;

// ===================================
// HEADER SCROLL EFFECT
// ===================================
// MENU HAMBÚRGUER MOBILE
// ===================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks?.querySelectorAll('.nav-link');
    
    if (!menuToggle || !navLinks) return;
    
    // Toggle menu
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });
    
    // Fecha menu ao clicar em um link
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
    
    // Fecha menu ao clicar fora (no overlay)
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('active')) {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        }
    });
    
    // Fecha menu ao pressionar ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

// ===================================
// SCROLL DO HEADER
// ===================================
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// ===================================
// SMOOTH SCROLL PARA LINKS INTERNOS
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// CALCULADORA DE CUSTO
// ===================================
function initCalculadora() {
    const calcForm = document.getElementById('calcForm');
    const resultado = document.getElementById('resultado');
    const valorTotal = document.getElementById('valorTotal');
    const detalhes = document.getElementById('detalhes');
    
    if (!calcForm || !resultado || !valorTotal || !detalhes) {
        console.error('Elementos da calculadora não encontrados');
        return;
    }
    
    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const cidadeSelect = document.getElementById('cidade');
        const distancia = parseInt(cidadeSelect.value);
        const cidadeNome = cidadeSelect.options[cidadeSelect.selectedIndex].text;
        
        // Calcula o custo
        const custoDeslocamento = distancia * VALOR_KM * 2; // Ida e volta
        const total = VALOR_CONSULTA_BASE + custoDeslocamento;
        
        // Exibe o resultado
        valorTotal.textContent = formatarMoeda(total);
        
        if (distancia === 0) {
            detalhes.innerHTML = `
                <strong>${cidadeNome}</strong><br>
                Consulta domiciliar: ${formatarMoeda(VALOR_CONSULTA_BASE)}<br>
                Deslocamento: Não há (cidade base)
            `;
        } else {
            detalhes.innerHTML = `
                <strong>${cidadeNome}</strong><br>
                Consulta: ${formatarMoeda(VALOR_CONSULTA_BASE)}<br>
                Deslocamento (${distancia}km ida + ${distancia}km volta): ${formatarMoeda(custoDeslocamento)}
            `;
        }
        
        // Mostra o resultado com animação
        resultado.classList.add('ativo');
        resultado.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// ===================================
// FORMULÁRIO DE AGENDAMENTO
// ===================================
function initFormularioAgendamento() {
    const agendamentoForm = document.getElementById('agendamentoForm');
    
    if (!agendamentoForm) {
        console.error('Formulário de agendamento não encontrado');
        return;
    }
    
    agendamentoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Captura os dados do formulário
        const nome = document.getElementById('nome').value;
        const cidade = document.getElementById('cidadeForm').value;
        const endereco = document.getElementById('endereco').value;
        const problema = document.getElementById('problema').value;
        
        // Monta a mensagem para o WhatsApp
        const mensagem = `Olá, Dra. Iris! Meu nome é ${nome}.

📍 *Cidade:* ${cidade}
🏠 *Endereço:* ${endereco}

💬 *Motivo da consulta:*
${problema}

Gostaria de agendar uma consulta domiciliar.`;
        
        // Codifica a mensagem e abre o WhatsApp
        const mensagemEncoded = encodeURIComponent(mensagem);
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMERO}?text=${mensagemEncoded}`;
        
        // Abre em nova aba
        window.open(whatsappURL, '_blank');
        
        // Opcional: Limpar o formulário após envio
        // agendamentoForm.reset();
    });
}

// ===================================
// ANIMAÇÕES DE ENTRADA (INTERSECTION OBSERVER)
// ===================================
function initScrollAnimations() {
    // Configurações do observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    // Observer para animações gerais
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Adiciona delay baseado no índice para efeito cascata
                setTimeout(() => {
                    entry.target.classList.add('animate-in');
                }, index * 100);
                
                // Para de observar após animar (performance)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Seleciona elementos para animar
    const animatedElements = document.querySelectorAll(
        '.publico-card, .diferencial-card, .depoimento-card, .timeline-item, .credencial, .hero-feature'
    );

    // Adiciona classe inicial e observa cada elemento
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Animação especial para títulos de seção
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.classList.add('animate-on-scroll');
        observer.observe(header);
    });
}

// ===================================
// PARALLAX SUAVE (Desativado em mobile para performance)
// ===================================
function initParallax() {
    if (!config.enableParallax) return;
    
    const parallaxElements = document.querySelectorAll('.hero-image, .sobre-image');
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(el => {
                    const speed = 0.3;
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ===================================
// CONTADOR ANIMADO (Sobre - Anos de Experiência)
// ===================================
function initCounterAnimation() {
    const counter = document.querySelector('.sobre-badge-number');
    
    if (!counter) return;
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(counter);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    observer.observe(counter);
}

function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = isMobile() ? 1500 : 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    };
    
    updateCounter();
}

// ===================================
// ANIMAÇÃO DOS BADGES FLUTUANTES (Simplificado em mobile)
// ===================================
function initFloatingBadges() {
    if (!config.enableFloating) return;
    
    const badges = document.querySelectorAll('.hero-badge-float');
    let ticking = false;
    
    badges.forEach((badge, index) => {
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    const speed = 0.2 + (index * 0.1);
                    const movement = Math.sin(scrolled * 0.01 + index) * 8;
                    badge.style.transform = `translateY(${movement}px)`;
                    ticking = false;
                });
                ticking = true;
            }
        });
    });
}

// ===================================
// REVEAL PROGRESSIVO DE CARDS
// ===================================
function initProgressiveReveal() {
    const cardContainers = document.querySelectorAll('.publicos-grid, .depoimentos-grid');
    
    cardContainers.forEach(container => {
        const cards = container.querySelectorAll('.publico-card, .depoimento-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cards.forEach((card, index) => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0) scale(1)';
                        }, index * 150);
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        // Prepara cards para animação
        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        });
        
        observer.observe(container);
    });
}

// ===================================
// SMOOTH REVEAL PARA TEXTOS
// ===================================
function initTextReveal() {
    const textElements = document.querySelectorAll('h1, h2, h3, .hero-description');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('text-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    textElements.forEach(el => {
        el.classList.add('text-hidden');
        observer.observe(el);
    });
}

// ===================================
// PROGRESSO DE LEITURA
// ===================================
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / (documentHeight - windowHeight)) * 100;
        
        progressBar.style.width = `${progress}%`;
    });
}

// ===================================
// HEADER COM EFEITO GLASSMORPHISM
// ===================================
function enhanceHeaderScroll() {
    const header = document.getElementById('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            header.classList.add('scrolled');
            
            // Esconde header ao rolar para baixo, mostra ao rolar para cima
            if (currentScroll > lastScroll && currentScroll > 500) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
        } else {
            header.classList.remove('scrolled');
            header.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
}

// ===================================
// ANIMAÇÃO DA CALCULADORA
// ===================================
function enhanceCalculatorAnimation() {
    const calcSection = document.querySelector('.calculadora');
    
    if (!calcSection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const form = calcSection.querySelector('.calculadora-form');
                form.style.transform = 'scale(1)';
                form.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    const form = calcSection.querySelector('.calculadora-form');
    form.style.transform = 'scale(0.95)';
    form.style.opacity = '0';
    form.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    observer.observe(calcSection);
}

// ===================================
// UTILITÁRIOS
// ===================================

/**
 * Formata um número para o formato de moeda brasileira
 * @param {number} valor - Valor a ser formatado
 * @returns {string} - Valor formatado (ex: "R$ 1.234,56")
 */
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

/**
 * Valida se um campo está vazio
 * @param {string} valor - Valor do campo
 * @returns {boolean} - True se válido, False se inválido
 */
function validarCampoObrigatorio(valor) {
    return valor && valor.trim().length > 0;
}

/**
 * Exibe mensagem de erro em um campo
 * @param {HTMLElement} campo - Elemento do campo
 * @param {string} mensagem - Mensagem de erro
 */
function exibirErro(campo, mensagem) {
    const erro = document.createElement('span');
    erro.className = 'campo-erro';
    erro.textContent = mensagem;
    erro.style.color = '#d32f2f';
    erro.style.fontSize = '0.875rem';
    erro.style.marginTop = '0.25rem';
    
    // Remove erro anterior se existir
    const erroAnterior = campo.parentElement.querySelector('.campo-erro');
    if (erroAnterior) {
        erroAnterior.remove();
    }
    
    campo.parentElement.appendChild(erro);
    campo.style.borderColor = '#d32f2f';
}

/**
 * Remove mensagem de erro de um campo
 * @param {HTMLElement} campo - Elemento do campo
 */
function removerErro(campo) {
    const erro = campo.parentElement.querySelector('.campo-erro');
    if (erro) {
        erro.remove();
    }
    campo.style.borderColor = '';
}

// ===================================
// VALIDAÇÃO DE FORMULÁRIOS (OPCIONAL)
// ===================================
function validarFormularioAgendamento() {
    const form = document.getElementById('agendamentoForm');
    
    if (!form) return;
    
    const campos = {
        nome: document.getElementById('nome'),
        cidadeForm: document.getElementById('cidadeForm'),
        endereco: document.getElementById('endereco'),
        problema: document.getElementById('problema')
    };
    
    // Adiciona validação em tempo real
    Object.values(campos).forEach(campo => {
        if (!campo) return;
        
        campo.addEventListener('input', () => {
            if (validarCampoObrigatorio(campo.value)) {
                removerErro(campo);
            }
        });
        
        campo.addEventListener('blur', () => {
            if (!validarCampoObrigatorio(campo.value)) {
                exibirErro(campo, 'Este campo é obrigatório');
            }
        });
    });
}

// ===================================
// TRATAMENTO DE ERROS GLOBAL
// ===================================
function initErrorHandling() {
    window.addEventListener('error', (event) => {
        console.error('Erro capturado:', event.error);
        // Aqui você pode adicionar lógica para reportar erros
    });
    
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promise rejeitada:', event.reason);
        // Aqui você pode adicionar lógica para reportar erros de promises
    });
}

// ===================================
// PERFORMANCE MONITORING (OPCIONAL)
// ===================================
function logPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.timing;
                const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
                console.log(`Tempo de carregamento da página: ${pageLoadTime}ms`);
            }, 0);
        });
    }
}

// ===================================
// ANALYTICS HELPER (PLACEHOLDER)
// ===================================
function trackEvent(eventName, eventData = {}) {
    // Placeholder para integração com Google Analytics ou similar
    console.log('Event tracked:', eventName, eventData);
    
    // Exemplo de uso:
    // if (typeof gtag !== 'undefined') {
    //     gtag('event', eventName, eventData);
    // }
}

// ===================================
// INICIALIZAÇÃO
// ===================================
function init() {
    console.log('🏥 Iniciando aplicação Dra. Iris Cajaí...');
    
    try {
        // Funcionalidades básicas
        initMobileMenu(); // Menu hambúrguer mobile
        initHeaderScroll();
        enhanceHeaderScroll(); // Header com efeito avançado
        initSmoothScroll();
        initCalculadora();
        initFormularioAgendamento();
        validarFormularioAgendamento();
        initErrorHandling();
        
        // Sistema de animações avançado
        initScrollAnimations();
        initProgressiveReveal();
        initTextReveal();
        initParallax();
        initFloatingBadges();
        initCounterAnimation();
        enhanceCalculatorAnimation();
        initReadingProgress();
        
        // Opcional: Log de performance
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            logPerformance();
        }
        
        console.log('✅ Aplicação inicializada com sucesso!');
        console.log('🎨 Sistema de animações ativado!');
        
        // Track page view (exemplo)
        trackEvent('page_view', {
            page_title: document.title,
            page_location: window.location.href
        });
        
    } catch (error) {
        console.error('❌ Erro ao inicializar aplicação:', error);
    }
}

// ===================================
// ESPERA O DOM ESTAR PRONTO
// ===================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    // DOM já está pronto
    init();
}

// ===================================
// EXPORT PARA USO EXTERNO (SE NECESSÁRIO)
// ===================================
// Se você precisar acessar funções externamente, descomente:
// window.DrIrisApp = {
//     formatarMoeda,
//     trackEvent,
//     VALOR_CONSULTA_BASE,
//     VALOR_KM
// };
