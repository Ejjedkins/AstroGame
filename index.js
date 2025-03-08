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

const MSD = 3 //Created constant to apply to the spped of the player movement
const RSD = 0.03 //Created constant to apply to the spped of the player movement


//Adding in an animation loop
function animate() {
    window.requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    player.update()

    // Allows the player to stop if key is released
    player.velocity.x = 0
    player.velocity.y = 0 

    if (keys.ArrowUp.pressed) {
        
        //Allows player to rotate in the right direction based on the rotation of the player
        player.velocity.x = Math.cos(player.rotation) * MSD
        player.velocity.y = Math.sin(player.rotation) * MSD
    }
        
    if (keys.ArrowRight.pressed) player.rotation += RSD
        else if (keys.ArrowLeft.pressed) player.rotation -= RSD //Will rotate player the opposite way of right key

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
