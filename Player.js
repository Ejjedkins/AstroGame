
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

export class Player {
  constructor ({position, velocity}) {
      this.position = position // Position is a x, y object
      this.velocity = velocity
      this.rotation = 0
  }
  //Designing the player
  shape() {
      ctx.save()
      
      ctx.translate(this.position.x, this.position.y)
      ctx.rotate(this.rotation)
      ctx.translate(-this.position.x, -this.position.y)
      
      ctx.beginPath() // Preventing a snail trail from player
      ctx.moveTo(this.position.x + 30, this.position.y)
      ctx.lineTo(this.position.x - 10, this.position.y - 10)
      ctx.lineTo(this.position.x - 10, this.position.y + 10)
      ctx.closePath()

      ctx.strokeStyle = 'white'
      ctx.fillStyle = 'blue'
      ctx.stroke()
      ctx.fill()
      ctx.restore()
  }

  //Update the position for every frame based on the velocity of x & y
  update() {
      this.shape()
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
  }

  getVertices() {
      const cos = Math.cos(this.rotation)
      const sin = Math.sin(this.rotation)
  
      return [
        {
          x: this.position.x + cos * 30 - sin * 0,
          y: this.position.y + sin * 30 + cos * 0,
        },
        {
          x: this.position.x + cos * -10 - sin * 10,
          y: this.position.y + sin * -10 + cos * 10,
        },
        {
          x: this.position.x + cos * -10 - sin * -10,
          y: this.position.y + sin * -10 + cos * -10,
        },
      ]
    }

}

