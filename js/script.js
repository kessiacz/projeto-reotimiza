// --- CURSOR ---
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
function animateRing() {
rx += (mx - rx) * 0.12;
ry += (my - ry) * 0.12;
ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
requestAnimationFrame(animateRing);
}
animateRing();

// --- NAV SCROLL ---
const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
nav.classList.toggle('scrolled', window.scrollY > 40);
});

// --- MOBILE NAV ---
function openMobileNav() { document.getElementById('mobileNav').classList.add('open'); }
function closeMobileNav() { document.getElementById('mobileNav').classList.remove('open'); }

// --- REVEAL ON SCROLL ---
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.1 });
reveals.forEach(r => observer.observe(r));

// --- FORM SUBMIT ---
function submitForm() {
  const nome = document.querySelector('input[placeholder="Seu nome"]').value.trim();
  const empresa = document.querySelector('input[placeholder="Nome da empresa"]').value.trim();
  const contato = document.querySelector('input[placeholder*="0000"]').value.trim();
  const servico = document.querySelector('.form-select').value;
  const mensagem = document.querySelector('.form-textarea').value.trim();
  if (!nome || !empresa || !contato || !servico || !mensagem) {
    alert('Por favor, preencha todos os campos antes de enviar.');
    return;
  }
  const texto = encodeURIComponent(
    `Olá! Me chamo ${nome}
Empresa: ${empresa}
Contato: ${contato}
Serviço: ${servico}
Mensagem: ${mensagem}`
  );
  window.open(`https://wa.me/5583987473059?text=${texto}`, '_blank');
  document.querySelectorAll('.form-input, .form-select, .form-textarea')
    .forEach(i => i.value = '');
}
// --- SMOOTH SCROLL ---
document.querySelectorAll('a[href^="#"]').forEach(a => {
a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
});
});