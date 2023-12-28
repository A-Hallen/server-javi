// Definición de la clase Particle
class Particle {
  // Constructor de la clase que toma un objeto padre, y las coordenadas opcionales x e y
  constructor(parent, x = Math.random() * parent.canvas.width, y = Math.random() * parent.canvas.height) {
    // Se asigna el objeto padre, el canvas y su contexto al objeto Particle
    this.network = parent;
    this.canvas = parent.canvas;
    this.ctx = parent.ctx;

    // Se extraen las opciones de colores de partículas y velocidad del objeto padre
    const { particleColors, velocity } = parent.options;

    // Se asigna un color aleatorio a la partícula
    this.particleColor = this.getRandomArrayItem(particleColors);

    // Se asigna un radio aleatorio limitado a la partícula
    this.radius = this.getLimitedRandom(1.5, 2.5);

    // La opacidad de la partícula comienza en 0
    this.opacity = 0;

    // Se asignan las coordenadas x e y a la partícula
    this.x = x;
    this.y = y;

    // Se asigna una velocidad aleatoria a la partícula
    this.velocity = {
      x: (Math.random() - 0.5) * velocity,
      y: (Math.random() - 0.5) * velocity,
    };
  }

  // Método para obtener un elemento aleatorio de un array
  getRandomArrayItem(array){
    return array[Math.floor(Math.random() * array.length)];
  }

  // Método para obtener un número aleatorio limitado
  getLimitedRandom(min, max){
    return Math.round(Math.random() * (max - min) + min);
  }

  // Método para actualizar la posición y opacidad de la partícula
  update() {
    // La opacidad de la partícula aumenta gradualmente hasta llegar a 1
    this.opacity = Math.min(this.opacity + 0.01, 1);

    // Se obtiene el ancho y alto del canvas
    const { width, height } = this.canvas;

    // Si la partícula sale del canvas por la izquierda o derecha, se invierte su velocidad en x
    if (this.x > width + 100 || this.x < -100) {
      this.velocity.x = -this.velocity.x;
    }

    // Si la partícula sale del canvas por arriba o abajo, se invierte su velocidad en y
    if (this.y > height + 100 || this.y < -100) {
      this.velocity.y = -this.velocity.y;
    }

    // Se actualiza la posición de la partícula según su velocidad
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }

  // Método para dibujar la partícula en el canvas
  draw() {
    // Se comienza un nuevo trazo
    this.ctx.beginPath();

    // Se asigna el color de la partícula y su opacidad
    this.ctx.fillStyle = this.particleColor;
    this.ctx.globalAlpha = this.opacity;

    // Se dibuja un círculo en la posición de la partícula con su radio
    this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

    // Se rellena el círculo con el color y opacidad asignados
    this.ctx.fill();
  }
}

export class ParticleNetwork {
  constructor(parent) {
    this.options = {
      velocity: 3,
      density: 15000,
      netLineDistance: 200,
      netLineColor: "#0394a7",
      particleColors: ["#01cad0", "white", "#01344e"], // ['#6D4E5C', '#aaa', '#FFC458' ]
    };
    this.canvas = parent.canvas;
    this.ctx = parent.ctx;

    this.init();
  }

  init() {
    // Create particle objects
    this.createParticles(true);

    // Update canvas
    this.animationFrame = requestAnimationFrame(this.update.bind(this));

    this.bindUiActions();
  }

  removeInteractionParticle() {
    // Find it
    var index = this.particles.indexOf(this.interactionParticle);
    if (index > -1) {
      // Remove it
      this.interactionParticle = undefined;
      this.particles.splice(index, 1);
    }
  }

  createInteractionParticle() {
    // Add interaction particle
    this.interactionParticle = new Particle(this);
    this.interactionParticle.velocity = {
      x: 0,
      y: 0,
    };
    this.particles.push(this.interactionParticle);
    return this.interactionParticle;
  }

  bindUiActions() {
    // Mouse / touch event handling
    this.spawnQuantity = 3;
    this.mouseIsDown = false;
    this.touchIsMoving = false;

    this.onMouseMove = function (e) {
      if (!this.interactionParticle) {
        this.createInteractionParticle();
      }
      this.interactionParticle.x = e.offsetX;
      this.interactionParticle.y = e.offsetY;
    }.bind(this);

    this.onMouseDown = function (e) {
      this.mouseIsDown = true;
      var counter = 0;
      var quantity = this.spawnQuantity;
      var intervalId = setInterval(
        function () {
          if (this.mouseIsDown) {
            if (counter === 1) {
              quantity = 1;
            }
            for (var i = 0; i < quantity; i++) {
              if (this.interactionParticle) {
                this.particles.push(
                  new Particle(
                    this,
                    this.interactionParticle.x,
                    this.interactionParticle.y
                  )
                );
              }
            }
          } else {
            clearInterval(intervalId);
          }
          counter++;
        }.bind(this),
        50
      );
    }.bind(this);

    this.onMouseUp = function (e) {
      this.mouseIsDown = false;
    }.bind(this);

    this.onMouseOut = function (e) {
      this.removeInteractionParticle();
    }.bind(this);

    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
    this.canvas.addEventListener("mouseout", this.onMouseOut);
  }

  update() {
    if (this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.globalAlpha = 1;

      // Draw connections
      for (var i = 0; i < this.particles.length; i++) {
        for (var j = this.particles.length - 1; j > i; j--) {
          var distance,
            p1 = this.particles[i],
            p2 = this.particles[j];

          // check very simply if the two points are even a candidate for further measurements
          distance = Math.min(Math.abs(p1.x - p2.x), Math.abs(p1.y - p2.y));
          if (distance > this.options.netLineDistance) {
            continue;
          }

          // the two points seem close enough, now let's measure precisely
          distance = Math.sqrt(
            Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)
          );
          if (distance > this.options.netLineDistance) {
            continue;
          }

          this.ctx.beginPath();
          this.ctx.strokeStyle = this.options.netLineColor;
          this.ctx.globalAlpha =
            ((this.options.netLineDistance - distance) /
              this.options.netLineDistance) *
            p1.opacity *
            p2.opacity;
          this.ctx.lineWidth = 0.7;
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.stroke();
        }
      }

      // Draw particles
      for (let i = 0; i < this.particles.length; i++) {
        this.particles[i].update();
        this.particles[i].draw();
      }

      if (this.options.velocity !== 0) {
        this.animationFrame = requestAnimationFrame(this.update.bind(this));
      }
    } else {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  createParticles(isInitial) {
    // Initialise / reset particles
    var me = this;
    this.particles = [];
    var quantity =
      (this.canvas.width * this.canvas.height) / this.options.density;

    if (isInitial) {
      var counter = 0;
      clearInterval(this.createIntervalId);
      this.createIntervalId = setInterval(
        function () {
          if (counter < quantity - 1) {
            // Create particle object
            this.particles.push(new Particle(this));
          } else {
            clearInterval(me.createIntervalId);
          }
          counter++;
        }.bind(this),
        250
      );
    } else {
      // Create particle objects
      for (var i = 0; i < quantity; i++) {
        this.particles.push(new Particle(this));
      }
    }
  }
}