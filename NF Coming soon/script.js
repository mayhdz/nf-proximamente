const defaultConfig = {
  main_title: "Próximamente",
  subtitle: "Estamos construyendo algo extraordinario",
  description:
    "Mientras tanto, conversemos sobre tus necesidades de ingeniería. Nuestro equipo está listo para ayudarte con tus próximos proyectos.",
  button_text: "Solicitar servicios",
};

// =========================
// REEMPLAZA ESTO CON TUS DATOS DE GOOGLE FORMS
// =========================
const GOOGLE_FORM_ACTION_URL = "PEGAR_AQUI_TU_URL_DE_GOOGLE_FORMS/formResponse";

const FIELD_NAME = "entry.1111111111";
const FIELD_COMPANY = "entry.2222222222";
const FIELD_EMAIL = "entry.3333333333";
const FIELD_SERVICE = "entry.4444444444";
// =========================

const mainTitle = document.getElementById("main-title");
const subtitle = document.getElementById("subtitle");
const description = document.getElementById("description");
const btnText = document.getElementById("btn-text");
const emailForm = document.getElementById("email-form");
const nameInput = document.getElementById("name-input");
const companyInput = document.getElementById("company-input");
const emailInput = document.getElementById("email-input");
const serviceInput = document.getElementById("service-input");
const submitBtn = document.getElementById("submit-btn");
const btnIcon = document.getElementById("btn-icon");
const btnSpinner = document.getElementById("btn-spinner");
const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toast-message");

let isSubmitting = false;

function showToast(message, isError = false) {
  const toastIcon = document.getElementById("toast-icon");
  toastMessage.textContent = message;

  if (isError) {
    toastIcon.style.background = "rgba(239, 68, 68, 0.2)";
    toastIcon.innerHTML =
      '<i data-lucide="x" class="w-4 h-4" style="color: #ef4444;"></i>';
  } else {
    toastIcon.style.background = "rgba(34, 197, 94, 0.2)";
    toastIcon.innerHTML =
      '<i data-lucide="check" class="w-4 h-4" style="color: #22c55e;"></i>';
  }

  lucide.createIcons();
  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 4000);
}

function setLoading(loading) {
  isSubmitting = loading;
  submitBtn.disabled = loading;
  nameInput.disabled = loading;
  companyInput.disabled = loading;
  emailInput.disabled = loading;
  serviceInput.disabled = loading;

  if (loading) {
    btnIcon.classList.add("hidden");
    btnSpinner.classList.remove("hidden");
    btnText.textContent = "Enviando...";
  } else {
    btnIcon.classList.remove("hidden");
    btnSpinner.classList.add("hidden");
    btnText.textContent = defaultConfig.button_text;
  }
}

function isGoogleFormsConfigured() {
  return (
    GOOGLE_FORM_ACTION_URL &&
    !GOOGLE_FORM_ACTION_URL.includes("PEGAR_AQUI") &&
    FIELD_NAME.startsWith("entry.") &&
    FIELD_COMPANY.startsWith("entry.") &&
    FIELD_EMAIL.startsWith("entry.") &&
    FIELD_SERVICE.startsWith("entry.")
  );
}

emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (isSubmitting) return;

  const name = nameInput.value.trim();
  const company = companyInput.value.trim();
  const email = emailInput.value.trim();
  const service = serviceInput.value;

  if (!name || !company || !email || !service) {
    showToast("Por favor completa todos los campos", true);
    return;
  }

  if (!isGoogleFormsConfigured()) {
    showToast("Falta configurar Google Forms en script.js", true);
    return;
  }

  setLoading(true);

  try {
    const formData = new FormData();
    formData.append(FIELD_NAME, name);
    formData.append(FIELD_COMPANY, company);
    formData.append(FIELD_EMAIL, email);
    formData.append(FIELD_SERVICE, service);

    await fetch(GOOGLE_FORM_ACTION_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });

    showToast("Solicitud enviada. Te contactaremos pronto.");
    emailForm.reset();
  } catch (error) {
    console.error(error);
    showToast("Ocurrió un error. Intenta de nuevo.", true);
  } finally {
    setLoading(false);
  }
});

mainTitle.textContent = defaultConfig.main_title;
subtitle.textContent = defaultConfig.subtitle;
description.textContent = defaultConfig.description;
btnText.textContent = defaultConfig.button_text;

lucide.createIcons();