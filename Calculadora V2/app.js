const CONFIG = {
  basePrices: {
    landing: { player One: 350, pro: 650, premium: 950 },
    institutional: { player One: 700, pro: 1200, premium: 1800 },
    personal: { player One: 600, pro: 1000, premium: 1600 },
    portfolio: { player One: 500, pro: 900, premium: 1400 },
    ecommerce: { player One: 1600, pro: 2400, premium: 3500 },
  },
  scope: {
    landing: {
      player One: ["1 página", "Secciones clave", "Formulario simple", "SEO básico"],
      pro: ["1 página", "Secciones avanzadas", "Copy ajustado", "SEO + analítica"],
      premium: ["1 página", "Microinteracciones", "Copy estratégico", "Performance premium"],
    },
    institutional: {
      player One: ["Hasta 4 páginas", "Servicios + contacto", "SEO básico", "CMS simple"],
      pro: ["Hasta 6 páginas", "Blog básico", "Optimización UX", "Analítica avanzada"],
      premium: ["Hasta 8 páginas", "Arquitectura a medida", "Accesibilidad", "SEO avanzado"],
    },
    personal: {
      player One: ["Hasta 3 páginas", "Bio + contacto", "CTA principal", "SEO básico"],
      pro: ["Hasta 5 páginas", "Sección de prensa", "Lead magnets", "Analítica"],
      premium: ["Hasta 6 páginas", "Storytelling", "Personalización", "SEO avanzado"],
    },
    portfolio: {
      player One: ["Hasta 4 páginas", "Galería de proyectos", "Formulario", "SEO básico"],
      pro: ["Hasta 6 páginas", "Casos de estudio", "UX refinado", "Analítica"],
      premium: ["Hasta 8 páginas", "Animaciones sutiles", "Optimización", "SEO avanzado"],
    },
    ecommerce: {
      player One: ["Home + catálogo", "Producto + carrito", "Checkout básico", "SEO base"],
      pro: ["Filtros avanzados", "Wishlist", "Integración pagos", "Automatizaciones"],
      premium: ["Catálogo avanzado", "Cross‑sell", "Optimización conversión", "Performance"],
    },
  },
  addons: {
    brand: { label: "Implementación de marca", price: 700 },
    conversion: { label: "Optimización de conversión", price: 400 },
    motion: { label: "Motion / animaciones", price: 500 },
    technical: { label: "Setup técnico", price: 150 },
    extraPages: { label: "Extra páginas", price: 120 },
  },
  ecomComplexity: {
    basic: { label: "Basic Store", multiplier: 1 },
    standard: { label: "Standard", multiplier: 1.2 },
    advanced: { label: "Advanced", multiplier: 1.4 },
  },
  visibility: {
    landing: ["brand", "conversion", "motion", "technical", "extraPages"],
    institutional: ["brand", "conversion", "motion", "technical", "extraPages"],
    personal: ["brand", "conversion", "motion", "technical", "extraPages"],
    portfolio: ["brand", "conversion", "motion", "technical", "extraPages"],
    ecommerce: ["brand", "conversion", "motion", "technical", "extraPages"],
  },
};

const state = {
  type: null,
  package: null,
  addons: {
    brand: false,
    conversion: false,
    motion: false,
    technical: false,
    extraPages: 0,
  },
  ecomLevel: "basic",
};

const typeButtons = document.querySelectorAll('[data-type="type"]');
const packageButtons = document.querySelectorAll('[data-type="package"]');
const scopeContent = document.getElementById("scopeContent");
const ecomComplexity = document.getElementById("ecomComplexity");
const ecomSelect = document.getElementById("ecomLevel");
const addonsList = document.getElementById("addonsList");
const totalValue = document.getElementById("totalValue");

const summaryType = document.getElementById("summaryType");
const summaryPackage = document.getElementById("summaryPackage");
const summaryScope = document.getElementById("summaryScope");
const summaryAddons = document.getElementById("summaryAddons");
const summaryTotal = document.getElementById("summaryTotal");

const openLead = document.getElementById("openLead");
const leadModal = document.getElementById("leadModal");
const closeLead = document.getElementById("closeLead");
const leadForm = document.getElementById("leadForm");
const leadSuccess = document.getElementById("leadSuccess");

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value);
}

function isConfigured() {
  return Boolean(state.type && state.package);
}

function setPressed(buttons, selectedValue) {
  buttons.forEach((btn) => {
    const active = btn.dataset.value === selectedValue;
    btn.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function updateScope() {
  if (!isConfigured()) {
    scopeContent.innerHTML = '<p class="muted">Elegí tipo de sitio y paquete para ver el alcance.</p>';
    summaryScope.innerHTML = "";
    ecomComplexity.hidden = true;
    ecomSelect.disabled = true;
    return;
  }

  const items = CONFIG.scope[state.type][state.package];
  scopeContent.innerHTML = `<ul class="list">${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
  summaryScope.innerHTML = items.map((i) => `<li>${i}</li>`).join("");

  if (state.type === "ecommerce") {
    ecomComplexity.hidden = false;
    ecomSelect.disabled = false;
  } else {
    ecomComplexity.hidden = true;
    ecomSelect.disabled = true;
  }
}

function updateAddonsState() {
  const enabled = isConfigured();
  const visible = state.type ? CONFIG.visibility[state.type] : [];
  addonsList.querySelectorAll("[data-addon]").forEach((input) => {
    const key = input.dataset.addon;
    const wrapper = input.closest(".addon");
    if (!visible.includes(key)) {
      wrapper.style.display = "none";
      input.checked = false;
      if (input.type === "number") input.value = 0;
      state.addons[key] = key === "extraPages" ? 0 : false;
      return;
    }

    wrapper.style.display = "grid";
    input.disabled = !enabled;
  });

  addonsList.querySelectorAll("[data-extra]").forEach((btn) => {
    btn.disabled = !enabled;
  });
}

function updateSummary() {
  summaryType.textContent = state.type ? labelFromValue(state.type) : "—";
  summaryPackage.textContent = state.package ? labelFromValue(state.package) : "—";

  const addons = [];
  Object.entries(state.addons).forEach(([key, val]) => {
    if (key === "extraPages" && val > 0) {
      addons.push(`${CONFIG.addons.extraPages.label}: ${val}`);
    }
    if (val === true) addons.push(CONFIG.addons[key].label);
  });

  if (state.type === "ecommerce") {
    const ecomLabel = CONFIG.ecomComplexity[state.ecomLevel].label;
    addons.push(`Complejidad e‑commerce: ${ecomLabel}`);
  }

  summaryAddons.innerHTML = addons.length
    ? addons.map((i) => `<li>${i}</li>`).join("")
    : "<li>Sin opcionales</li>";
}

function labelFromValue(value) {
  const map = {
    landing: "Landing",
    institutional: "Institucional",
    personal: "Marca Personal",
    portfolio: "Portfolio",
    ecommerce: "E‑commerce",
    player One: "player One",
    pro: "Pro",
    premium: "Premium",
  };
  return map[value] || value;
}

function computeTotal() {
  if (!isConfigured()) {
    totalValue.textContent = "—";
    summaryTotal.textContent = "—";
    return;
  }

  let total = CONFIG.basePrices[state.type][state.package];

  if (state.type === "ecommerce") {
    total *= CONFIG.ecomComplexity[state.ecomLevel].multiplier;
  }

  Object.entries(state.addons).forEach(([key, val]) => {
    if (key === "extraPages" && val > 0) {
      total += val * CONFIG.addons.extraPages.price;
    }
    if (val === true) total += CONFIG.addons[key].price;
  });

  totalValue.textContent = formatCurrency(total);
  summaryTotal.textContent = formatCurrency(total);
}

typeButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.type = btn.dataset.value;
    setPressed(typeButtons, state.type);
    updateScope();
    updateAddonsState();
    updateSummary();
    computeTotal();
  });
});

packageButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    state.package = btn.dataset.value;
    setPressed(packageButtons, state.package);
    updateScope();
    updateAddonsState();
    updateSummary();
    computeTotal();
  });
});

addonsList.addEventListener("change", (event) => {
  const target = event.target;
  if (target.matches('[data-addon="extraPages"]')) {
    state.addons.extraPages = Number(target.value || 0);
  } else if (target.matches("[data-addon]")) {
    state.addons[target.dataset.addon] = target.checked;
  }
  updateSummary();
  computeTotal();
});

addonsList.addEventListener("click", (event) => {
  const btn = event.target.closest("[data-extra]");
  if (!btn) return;
  const input = addonsList.querySelector('[data-addon="extraPages"]');
  let val = Number(input.value || 0);
  if (btn.dataset.extra === "inc") val += 1;
  if (btn.dataset.extra === "dec") val = Math.max(0, val - 1);
  input.value = val;
  state.addons.extraPages = val;
  updateSummary();
  computeTotal();
});

ecomSelect.addEventListener("change", () => {
  state.ecomLevel = ecomSelect.value;
  updateSummary();
  computeTotal();
});

openLead.addEventListener("click", () => {
  leadModal.setAttribute("aria-hidden", "false");
});

closeLead.addEventListener("click", () => {
  leadModal.setAttribute("aria-hidden", "true");
});

leadForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(leadForm);
  const name = data.get("name").trim();
  const email = data.get("email").trim();

  if (!name || !email) {
    leadSuccess.hidden = true;
    return;
  }

  leadSuccess.hidden = false;
  leadForm.reset();
});

updateScope();
updateAddonsState();
updateSummary();
computeTotal();
