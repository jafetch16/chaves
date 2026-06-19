// Lluvia de corazones de fondo
const canvas = document.getElementById('lluvia-corazones');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const paresDegradado = [
  ['#ff8fb3', '#ffe4f0'],
  ['#ff6f9c', '#ffd1e6'],
  ['#ffb6d9', '#fff0f6'],
  ['#d6336c', '#ff8fb3'],
];

class Corazon {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * -canvas.height;
    this.size = 12 + Math.random() * 18;
    this.speed = 0.6 + Math.random() * 1.6;
    this.sway = Math.random() * 2 - 1;
    this.angle = Math.random() * Math.PI * 2;
    this.degradado = paresDegradado[Math.floor(Math.random() * paresDegradado.length)];
    this.opacity = 0.4 + Math.random() * 0.5;
  }
  dibujar() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate(Math.sin(this.angle) * 0.3);
    const s = this.size;
    const gradiente = ctx.createLinearGradient(0, 0, 0, s);
    gradiente.addColorStop(0, this.degradado[0]);
    gradiente.addColorStop(1, this.degradado[1]);
    ctx.fillStyle = gradiente;
    ctx.beginPath();
    ctx.moveTo(0, s / 4);
    ctx.bezierCurveTo(0, 0, -s / 2, 0, -s / 2, s / 4);
    ctx.bezierCurveTo(-s / 2, s / 2, 0, s / 2, 0, s);
    ctx.bezierCurveTo(0, s / 2, s / 2, s / 2, s / 2, s / 4);
    ctx.bezierCurveTo(s / 2, 0, 0, 0, 0, s / 4);
    ctx.fill();
    ctx.restore();
  }
  actualizar() {
    this.y += this.speed;
    this.x += Math.sin(this.angle) * this.sway * 0.3;
    this.angle += 0.02;
    if (this.y > canvas.height + 20) {
      this.reset();
      this.y = -20;
    }
  }
}

const corazones = Array.from({ length: 60 }, () => new Corazon());

function animar() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  corazones.forEach((c) => {
    c.actualizar();
    c.dibujar();
  });
  requestAnimationFrame(animar);
}
animar();

// Slideshow de fotos: una a la vez, cambia cada 10 segundos
const fotos = document.querySelectorAll('.galeria .foto');
let indiceActual = 0;
let intervaloSlideshow = null;

function mostrarSiguienteFoto() {
  fotos[indiceActual].classList.remove('activa');
  indiceActual = (indiceActual + 1) % fotos.length;
  fotos[indiceActual].classList.add('activa');
}

function iniciarSlideshow() {
  if (intervaloSlideshow || fotos.length === 0) return;
  intervaloSlideshow = setInterval(mostrarSiguienteFoto, 10000);
}

function detenerSlideshow() {
  clearInterval(intervaloSlideshow);
  intervaloSlideshow = null;
}

// Control de música
const audio = document.getElementById('audio');
const btnMusica = document.getElementById('btn-musica');

btnMusica.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
    btnMusica.textContent = '⏸ Pausar música';
    iniciarSlideshow();
  } else {
    audio.pause();
    btnMusica.textContent = '▶ Reproducir música';
    detenerSlideshow();
  }
});
