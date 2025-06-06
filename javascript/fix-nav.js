document.addEventListener("DOMContentLoaded", () => {
  const visibleLinks = document.querySelector(".greedy-nav .visible-links");
  const hiddenLinks = document.querySelector(".greedy-nav .hidden-links");
  const toggleButton = document.querySelector(".greedy-nav__toggle");

  // Clone et détacher le menu pour contourner overflow hidden
  const floatingMenu = hiddenLinks.cloneNode(true);
  floatingMenu.classList.add("floating-hidden-links");
  floatingMenu.classList.add("hidden");
  document.body.appendChild(floatingMenu); // on sort du masthead
  hiddenLinks.style.display = "none";
  const clonedLinks = document.getElementById("cloned-links");
  const burgerOverlay = document.getElementById("burger-overlay");
  burgerOverlay.style.maxHeight="50%";


  // Appliquer le bon style en CSS
  const style = document.createElement("style");
  style.innerHTML = `
    .floating-hidden-links {
      display:none;
      position: fixed;
      top: 60px; /* Ajuste selon ta navbar */
      right: 0;
      width: 200px; /* ou selon besoin */
      z-index: 9999;
      background: white; /* ou autre couleur */
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }
  `;
  document.head.appendChild(style);

  // Déplacer les li vers floating menu
  function syncMenuContent() {
    // Vider le menu flottant
    clonedLinks.innerHTML = "";
    // Y injecter les éléments du vrai hiddenLinks
    hiddenLinks.querySelectorAll("li").forEach(li => {
      clonedLinks.appendChild(li.cloneNode(true));
    });
  }

  function forceHiddenLinks() {
    const isMobile = window.innerWidth <= 768;
    const visItems = visibleLinks.querySelectorAll("li");
    const hidItems = hiddenLinks.querySelectorAll("li");
    console.log("visItems= "+visItems.length+" hidItems= "+hidItems.length);

    if (isMobile) {
      visItems.forEach((li) => hiddenLinks.appendChild(li));
      toggleButton.classList.remove("hidden");
    } else {
      hidItems.forEach((li) => visibleLinks.appendChild(li));
      toggleButton.classList.add("hidden");
      toggleButton.classList.remove("close");
      clonedLinks.classList.add("hidden");
    }
    console.log("new visItems= "+visItems.length+" hidItems= "+hidItems.length);
    toggleButton.removeAttribute("count");
    syncMenuContent();
  }

  // Initialisation avec délai pour attendre le layout
  setTimeout(forceHiddenLinks, 100);
  window.addEventListener("resize", forceHiddenLinks);

  // Gestion du menu flottant au clic
  toggleButton.addEventListener("click", (e) => {
    e.stopImmediatePropagation();

    if (clonedLinks.classList.contains("hidden")) {
      // Positionner sous le bouton
      const rect = toggleButton.getBoundingClientRect();
      clonedLinks.style.top = `${rect.bottom + window.scrollY}px`;
      clonedLinks.style.left = `${rect.left + window.scrollX}px`;

      clonedLinks.classList.remove("hidden");
      toggleButton.classList.add("close");
    } else {
      clonedLinks.classList.add("hidden");
      toggleButton.classList.remove("close");
    }
  });

  // Fermer en cliquant ailleurs
  document.addEventListener("click", (e) => {
    if (!clonedLinks.contains(e.target) && !toggleButton.contains(e.target)) {
      clonedLinks.classList.add("hidden");
      toggleButton.classList.remove("close");
    }
  });
});

// Fermer le menu quand on clique sur un lien
clonedLinks.addEventListener("click", (event) => {
  const clickedLink = event.target.closest(".masthead__menu-item a");
  if (clickedLink) {
    clonedLinks.classList.add("hidden");
    toggleButton.classList.remove("close");
  }
});

const observer = new MutationObserver(() => {
  // Si des <li> reviennent dans visible-links alors qu'on est en mobile, on les vire
  if (window.innerWidth <= 768) {
    const rogueItems = visibleLinks.querySelectorAll("li");
    rogueItems.forEach(li => hiddenLinks.appendChild(li));
  }
});
observer.observe(visibleLinks, { childList: true });

window.addEventListener("scroll", () => {
  if (window.innerWidth <= 768) {
    const rogueItems = visibleLinks.querySelectorAll("li");
    rogueItems.forEach(li => hiddenLinks.appendChild(li));
  }
});

