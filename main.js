let w, h, canvas, ctx;

const fireworksMax = 5;
const fireworkChance = 1;

let fireworks = [];
let particles = [];
let circles = [];
let hue = 0;

/******************************* LOGIC *****************************************/

function easeOutQuart(x) {
  return 1 - Math.pow(1 - x, 4);
}

function getRandomInt(min, max) {
  return Math.round(Math.random() * (max - min)) + min;
}

/******************************* ELEMENT *****************************************/
class Firework {
  constructor() {
    (this.x = getRandomInt(w * 0.3, w * 0.7)), (this.y = h);
    this.hue = hue;
    this.alpha = 1;
    (this.tick = 0),
      (this.ttl = getRandomInt(120, 180)),
      (this.targetY = getRandomInt(h * 0.2, h * 0.4));
  }
  draw() {
    if (this.tick <= this.ttl) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue},100%,50%, ${this.alpha})`;
      ctx.fill();
    }
  }
  update() {
    let progress = 1 - (this.ttl - this.tick) / this.ttl;

    // console.log(easeOutQuart(progress));
    this.y = h - (h - this.targetY) * easeOutQuart(progress);
    this.alpha = 1 - easeOutQuart(progress);

    this.tick++;
  }
}

class Particle {
  constructor(x, y, hue, i) {
    (this.x = x),
      (this.y = y),
      (this.hue = hue),
      (this.size = 3),
      (this.speed = 3),
      (this.angle = getRandomInt(0, 60) + 60 * i);
  }
  draw() {
    if (this.size > 0) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 50%, 1)`;
      ctx.fill();
      ctx.closePath();
    }
  }
  update() {
    (this.radian = (Math.PI / 180) * this.angle),
      (this.x += this.speed * Math.sin(this.radian));
    this.y += this.speed * Math.cos(this.radian);
    this.size -= 0.05;
  }
}

class Circle {
  constructor(x, y, hue) {
    (this.x = x),
      (this.y = y),
      (this.hue = hue),
      (this.size = 0),
      (this.endSize = getRandomInt(100, 130));
  }
  draw() {
    if (this.size < this.endSize) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size ,0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, .2)`;
      ctx.fill();
      ctx.closePath();
    }
  }
  update() {
    this.size += 15;
  }
}

/******************************* FEATURE *****************************************/
function init() {
  canvas = document.getElementById("container");
  ctx = canvas.getContext("2d");

  // fireworks.push(new Firework());
  resizeReset();
  animationLoop();
}
init();

function resizeReset() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  ctx.fillStyle = `#222`;
  ctx.fillRect(0, 0, w, h);
}

function fireworkCleanup() {
  let dump1 = [],
    dump2 = [],
    dump3 = []

  fireworks.map((firework) => {
    // console.log(fireworks);
    if (firework.alpha > 0) {
      dump1.push(firework);
    } else {
      createFireworks(firework.x, firework.y, firework.hue);
    }
  });

  fireworks = dump1;

  particles.map((particle) => {
    if (particle.size > 0) {
      dump2.push(particle);
    }
  });
  particles = dump2;

  circles.map((circle)=>{
    // console.log(circle.size);
    if(circle.size < circle.endSize){
      dump3.push(circle);
    }
  })
  // circles = dump3;

}

function createFireworks(x, y, hue) {
  // console.log(" hi");
  for (let i = 0; i < 20; i++) {
    particles.push(new Particle(x, y, hue, i));
  }
  circles.push(new Circle(x,y,hue));

}

function animationLoop() {
  // console.log();

  if (fireworks.length < fireworksMax && Math.random() < fireworkChance) {
    fireworks.push(new Firework());
    hue += 10;
  }

  ctx.GlobalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(0,0,0, 0.1)";
  ctx.fillRect(0, 0, w, h);
  ctx.GlobalCompositeOperation = "lighter";

  render();
  fireworkCleanup();
  requestAnimationFrame(animationLoop);
}

function render() {
  fireworks.map((firework) => {
    firework.update();
    firework.draw();
  });
  particles.map((particle) => {
    particle.update();
    particle.draw();
  });
  circles.map((circle) => {
    circle.update();
    // console.log(circle.size);
    circle.draw();
  });
}

window.addEventListener("DOMContentLoaded", init());
window.addEventListener("resize", resizeReset());
