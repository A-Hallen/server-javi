import { Component, createRef } from "react";
import { ParticleNetwork } from "./particleAnimation";

export default class ParticleAnimationDiv extends Component {
  canvasRef = createRef();
  divRef = createRef();

  componentDidMount() {
    // Se obtiene la referencia al canvas y se ajusta su tamaño
    const { canvasRef } = this;
    this.canvas = canvasRef.current;
    this.sizeCanvas();

    // Se obtiene el contexto del canvas para poder dibujar
    this.ctx = canvasRef.current.getContext("2d");

    // Se crea una nueva instancia de ParticleNetwork, que es la clase que maneja la animación de partículas
    this.particleNetwork = new ParticleNetwork(this);

    // Se agregan los event listeners para el resize del canvas
    this.bindUiActions();
  }

  // Función para ajustar el tamaño del canvas
  sizeCanvas() {
    const { canvasRef, divRef } = this;
    try {
      canvasRef.current.width = divRef.current.offsetWidth;
      canvasRef.current.height = divRef.current.offsetHeight;
    } catch (error) {
      console.error(error);
    }
  }

  // Función para agregar el event listener de resize al window
  bindUiActions = () => {
    window.addEventListener("resize", () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.sizeCanvas();
      this.particleNetwork.createParticles();
    });
  };

  // Función para renderizar el componente
  render() {
    return (
      <div className="particle-network-animation" ref={this.divRef}>
        <canvas
          style={{ height: "100%", width: "100%" }}
          ref={this.canvasRef}
        ></canvas>
      </div>
    );
  }
}
