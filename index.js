const canvas = document.querySelector('canvas') //Moving canvas element from html to javascript
const ctx = canvas.getContext('2d')


//Insuring that the canvas matches with the height and width of the browser
canvas.width = window.innerWidth 
canvas.height = window.innerHeight

canvas.fillStyle = 'black'
ctx.fillRect(0, 0, canvas.width, canvas.height)

class Player {
    constructor ({position, velocity}) {
        this.position = position // Position is a x, y object
        this.velocity = velocity
    }
    //Designing the player
    shape() {

        ctx.moveTo(this.position.x + 30, this.position.y)
        ctx.lineTo(this.position.x - 10, this.position.y - 10)
        ctx.lineTo(this.position.x - 10, this.position.y + 10)
        ctx.closePath()

        ctx.strokeStyle = 'white'
        ctx.stroke()
    }

}

const player  = new Player( {
    position: {x:canvas.width / 2 , y :canvas.height / 2}, //Will place charater in the middle of the screen
    velocity:{x:0 , y :0}
})

player.shape()

console.log(player)
