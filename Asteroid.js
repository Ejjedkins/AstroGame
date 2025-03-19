const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')


export class Asteroid {
  constructor({position, velocity, radius}) {
      this.position = position;
      this.velocity = velocity;
      this.radius = radius;
      this.vertices = this.createVertices(); // Calculate vertices once
      this.rotation = 0; // Initialize the rotation
      this.rotationSpeed = (Math.random() - 0.5) * 0.005; 
  }

  createVertices() {
      const sides = Math.floor(Math.random() * 8) + 5;
      const vertices = [];
      for (let i = 0; i < sides; i++) {
          const angle = (i / sides) * Math.PI * 2;
          const variation = 0.8 + Math.random() * 0.4;
          const x = this.radius * Math.cos(angle) * variation;
          const y = this.radius * Math.sin(angle) * variation;
          vertices.push({ x, y });
      }
      return vertices;
  }

  draw() {
      ctx.save();
      ctx.translate(this.position.x, this.position.y);
      ctx.rotate(this.rotation); 

      ctx.beginPath();
      for (let i = 0; i < this.vertices.length; i++) {
          const vertex = this.vertices[i];
          if (i === 0) {
              ctx.moveTo(vertex.x, vertex.y);
          } else {
              ctx.lineTo(vertex.x, vertex.y);
          }
      }
      ctx.closePath();
      ctx.fillStyle = 'gray';
      ctx.fill();

      ctx.restore();
  }

  update() {
      this.draw();
      this.rotation += this.rotationSpeed;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
  }
}
