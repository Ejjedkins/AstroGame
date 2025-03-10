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

}

class Projectile{
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.radius = 5
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        ctx.closePath()
        ctx.fillStyle = 'white'
        ctx.fill()
    }

    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}

class Asteroid{
    constructor({position, velocity, radius}) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
    }

    draw() {
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
        ctx.closePath()
        ctx.strokeStyle = 'white'
        ctx.stroke()
    }

    update() {
        this.draw()
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
const FRN = 0.95 //Created constant for plye friction
const PSD = 4 //Speed of projectile

const projectiles = []
const asteroids = []

window.setInterval(() => {
   const index = Math.floor(Math.random() * 4)
   let x, y
   let vx, vy
   let radius = 50 * Math.random() + 10

   switch(index) {
    case 0: //left side of the screen
        x = 0 - radius
        y = Math.random() * canvas.height
        vx = 1
        vy = 0
        break
    
    case 1: //top side of the screen
        x = Math.random() * canvas.width
        y = 0 - radius
        vx = 0
        vy = 1
        break
        
    case 2: //right side of the screen
        x = canvas.width + radius
        y = Math.random() * canvas.height
        vx = -1 
        vy = 0
        break    

    case 3: //bottom side of the screen
        x = Math.random() * canvas.width
        y = canvas.height+ radius
        vx = 0
        vy = -1
        break
    
 }
    
    asteroids.push(
        new Asteroid({
            position: {
                x:x, 
                y:y,
            },
            velocity: {
                x:vx, 
                y:vy,
            },
            radius
        })
    )

}, 3000)

//Adding in an animation loop
function animate() {
    window.requestAnimationFrame(animate)
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    player.update()

    //Rendering projectiles on screen through a for loop through the back of the array
    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i]
        projectile.update()

        //Making sure projectiles no longer exist when off screen
        if (projectile.position.x + projectile.radius < 0 || 
            projectile.position.x - projectile.radius > canvas.width ||
            projectile.position.y - projectile.radius > canvas.height ||
            projectile.position.y + projectile.radius < 0
         ) {
            projectiles.splice(i, 1)
        }

    }

    //Rendering in asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i]
        asteroid.update()
    }


    if (keys.ArrowUp.pressed) {
        
        //Allows player to rotate in the right direction based on the rotation of the player
        player.velocity.x = Math.cos(player.rotation) * MSD
        player.velocity.y = Math.sin(player.rotation) * MSD
    } 
    else if (!keys.ArrowUp.pressed) {
      
      //Adding some fraction to player so that they don't immediately stop
      player.velocity.x *= FRN
      player.velocity.y *= FRN
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
        case 'Space':
            projectiles.push(new Projectile({
                position : {
                    x: player.position.x + Math.cos(player.rotation) * 30,
                    y: player.position.y + Math.sin(player.rotation) * 30
            },
                velocity :{
                    x: Math.cos(player.rotation) * PSD,
                    y: Math.sin(player.rotation) * PSD
            },


        })) 
    
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
