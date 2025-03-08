const canvas = document.querySelector('canvas') //Moving canvas element from html to javascript
const ctx = canvas.getContext('2d')


//Insuring that the canvas matches with the height and width of the browser
canvas.width = window.innerWidth 
canvas.height = window.innerHeight

ctx.fillStyle = 'black'
ctx.fillRect(0, 0, canvas.width, canvas.height)

class Player {
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
        
        ctx.beginPath() // This wreventing a snail trail from player
        ctx.moveTo(this.position.x + 30, this.position.y)
        ctx.lineTo(this.position.x - 10, this.position.y - 10)
        ctx.lineTo(this.position.x - 10, this.position.y + 10)
        ctx.closePath()

        ctx.strokeStyle = 'white'
        ctx.stroke()
        ctx.restore()
    }

    //Update the position for every frame based on the velocity of x & y
    update() {
        this.shape()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }

}

const player  = new Player( {
    position: {x:canvas.width / 2 , y :canvas.height / 2}, //Will place charater in the middle of the screen
    velocity:{x:0 , y :0}
})

player.shape()

const keys = {
    ArrowUp: {
        pressed: false
    },

    ArrowRight: {
        pressed: false
    },

    ArrowLeft: {
        pressed: false
    }
}

//Adding in an animation loop
function animate() {
    window.requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    player.update()

    player.velocity.x = 0 // Allows the player to stop if key is released
    if (keys.ArrowUp.pressed) player.velocity.x = 1
        
    if (keys.ArrowRight.pressed) player.rotation += 0.01
        else if (keys.ArrowLeft.pressed) player.rotation -= 0.01 //Will rotate player the opposite way of right key

}

animate()

window.addEventListener('keydown', (evt) =>  {
    switch (evt.code){
        case 'ArrowUp':
            keys.ArrowUp.pressed = true 
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true 
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true   
            break
    }

} )

//Creating an event listener for when the player releases a key
window.addEventListener('keyup', (evt) =>  {
    switch (evt.code){
        case 'ArrowUp':
            keys.ArrowUp.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false  
            break
    }

} )
