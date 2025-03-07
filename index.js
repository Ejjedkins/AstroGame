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
    }
    //Designing the player
    shape() {
        //Preventing a snail trail from player
        ctx.beginPath()
        ctx.moveTo(this.position.x + 30, this.position.y)
        ctx.lineTo(this.position.x - 10, this.position.y - 10)
        ctx.lineTo(this.position.x - 10, this.position.y + 10)
        ctx.closePath()

        ctx.strokeStyle = 'white'
        ctx.stroke()
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
    }
}

//Adding in an animation loop
function animate() {
    window.requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    player.update()


    if (keys.ArrowUp.pressed) player.velocity.x = 1

}

animate()

window.addEventListener('keydown', (evt) =>  {
    switch (evt.code){
        //Prints out when up, left, and right arrows are pressed on cosole log
        case 'ArrowUp':
            console.log('up arrow was pressed') 
            keys.ArrowUp.pressed = true 
            break
        case 'ArrowLeft':
            console.log('left arrow was pressed')   
            break
        case 'ArrowRight':
            console.log('right arrow was pressed')   
            break
    }

} )
