/* =========================================================
   SITE DO MÚSICO — SCRIPT.JS
   Personalização principal: altere a variável whatsapp abaixo.
   ========================================================= */

// COLOQUE AQUI SEU NÚMERO REAL COM DDI, SEM +, ESPAÇOS OU PARÊNTESES.
// Exemplo: const whatsapp = "5511999999999";
const whatsapp = "5511913471532";

document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-menu a:not(.nav-cta)");
  const sections = document.querySelectorAll("main section[id]");
  const form = document.querySelector("#quoteForm");
  const status = document.querySelector("#formStatus");
  const lightbox = document.querySelector("#lightbox");
  const lightboxImage = document.querySelector("#lightboxImage");
  const lightboxCaption = document.querySelector("#lightboxCaption");
  const lightboxClose = document.querySelector(".lightbox-close");

  // WhatsApp: centraliza o número em todos os links do site.
  document.querySelectorAll("[data-whatsapp-link]").forEach(link => {
    link.href = `https://wa.me/${whatsapp}`;
  });

  // Header fixo com estado visual ao rolar.
  const updateHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 25);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Menu mobile.
  const closeMenu = () => {
    menuToggle.classList.remove("open");
    navMenu.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  };

  menuToggle.addEventListener("click", () => {
    const open = navMenu.classList.toggle("open");
    menuToggle.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("no-scroll", open);
  });

  navLinks.forEach(link => link.addEventListener("click", closeMenu));
  document.querySelectorAll(".nav-cta").forEach(link => link.addEventListener("click", closeMenu));

  // Indicador da seção atual no menu.
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      }
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => sectionObserver.observe(section));

  // Animações suaves de entrada.
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.transitionDelay = `${Math.min(index * 35, 180)}ms`;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

  // Botões das formações preenchem o select automaticamente.
  document.querySelectorAll("[data-formation]").forEach(button => {
    button.addEventListener("click", () => {
      const select = document.querySelector('select[name="formacao"]');
      if (select) select.value = button.dataset.formation;
    });
  });

  // Formulário -> WhatsApp.
  form.addEventListener("submit", event => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      status.textContent = "Confira os campos obrigatórios antes de continuar.";
      return;
    }

    if (whatsapp.includes("SEUNUMERO")) {
      status.textContent = "Antes de usar o formulário, coloque seu número real na variável 'whatsapp' deste arquivo.";
      return;
    }

    const data = new FormData(form);
    const mensagem = [
      "Olá! Gostaria de solicitar um orçamento para música ao vivo.",
      "",
      `Nome: ${data.get("nome")}`,
      `E-mail: ${data.get("email")}`,
      `WhatsApp: ${data.get("telefone")}`,
      `Data do evento: ${formatDate(data.get("data"))}`,
      `Tipo de evento: ${data.get("tipo")}`,
      `Local: ${data.get("local")}`,
      `Formação: ${data.get("formacao")}`,
      `Mensagem: ${data.get("mensagem") || "Não informada"}`
    ].join("\n");

    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(mensagem)}`, "_blank", "noopener,noreferrer");
    status.textContent = "Mensagem preparada. O WhatsApp foi aberto em uma nova aba.";
  });

  function formatDate(value) {
    if (!value) return "Não informada";
    const [year, month, day] = value.split("-");
    return `${day}/${month}/${year}`;
  }

  // Lightbox da galeria.
  const openLightbox = (item) => {
    const src = item.dataset.src;
    const img = item.querySelector("img");
    if (!src || !img || img.style.display === "none") {
      lightboxCaption.textContent = "Substitua este placeholder por uma imagem real.";
      lightboxImage.removeAttribute("src");
      lightboxImage.style.display = "none";
    } else {
      lightboxImage.src = src;
      lightboxImage.alt = img.alt;
      lightboxImage.style.display = "block";
      lightboxCaption.textContent = img.alt;
    }
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
  };

  const closeLightbox = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    lightboxImage.removeAttribute("src");
  };

  document.querySelectorAll(".gallery-item").forEach(item => {
    item.addEventListener("click", () => openLightbox(item));
  });

  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
      if (lightbox.classList.contains("open")) closeLightbox();
    }
  });
});
