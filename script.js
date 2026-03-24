// Elementos del DOM
const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const headingEl = document.getElementById('heading');
const descriptionEl = document.getElementById('description');
const nameEl = document.getElementById('name');
const emailEl = document.getElementById('email');
const messageEl = document.getElementById('message');
const submitBtn = document.getElementById('submitBtn');
const pageTitle = document.getElementById('pageTitle');

let langStrings = {};

// Detectar idioma del navegador
const userLang = navigator.language || navigator.userLanguage;
const langCode = userLang.split('-')[0]; // "es", "en", "fr", etc.

// Cargar cadenas desde JSON
fetch('lang.json')
  .then(res => res.json())
  .then(data => {
    langStrings = data[langCode] || data['en']; // default English
    setText(langStrings);
  })
  .catch(err => console.error('Error cargando idiomas:', err));

// Aplicar texto al HTML
function setText(strings) {
  pageTitle.textContent = strings.title;
  headingEl.textContent = strings.heading;
  descriptionEl.textContent = strings.description;
  nameEl.placeholder = strings.name;
  emailEl.placeholder = strings.email;
  messageEl.placeholder = strings.message;
  submitBtn.textContent = strings.submit;
}

// Manejo del formulario
form.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = nameEl.value.trim();
  const email = emailEl.value.trim();
  const message = messageEl.value.trim();

  if(!name || !email || !message){
    formMessage.textContent = langStrings.incomplete;
    formMessage.style.color = "#ff4444";
    formMessage.classList.remove('hidden');
    return;
  }

  // Enviar a Formspree
  fetch("https://formspree.io/f/tu-form-id", {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message })
  })
  .then(response => {
    if(response.ok){
      formMessage.textContent = langStrings.success;
      formMessage.style.color = "#00ff00";
      formMessage.classList.remove('hidden');
      form.reset();
    } else {
      formMessage.textContent = langStrings.error;
      formMessage.style.color = "#ff4444";
      formMessage.classList.remove('hidden');
    }
  })
  .catch(() => {
    formMessage.textContent = langStrings.error;
    formMessage.style.color = "#ff4444";
    formMessage.classList.remove('hidden');
  });
});