
import {Player} from './Player.js'
import {Projectile} from './Projectile.js'
import {Asteroid} from './Asteroid.js'


const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const backgroundImage = new Image();
backgroundImage.src = './assets/Space.png';

let gameOver = false;
let gameStarted = true; // Game starts immediately
let animationId;
let intervalId;
let player;
const keys = { ArrowUp: { pressed: false }, 
ArrowRight: { pressed: false }, 
ArrowLeft: { pressed: false } };
const MSD = 5; // Player Movement Speed
const RSD = 0.05; //Rotation Speed
const FRN = 0.95; //Friction Speed
const PSD = 4; //Projectile Speed
let projectiles = [];
let asteroids = [];
let score = 0; // Initialize the score
let lives = 3;

//Adding sound effects
const projSound = new Audio('./assets/retro-laser-1-236669.mp3'); 
const destroySound = new Audio('./assets/retro-explode-1-236678.mp3'); 
const gameOverSound = new Audio('./assets/game-over-arcade-6435.mp3');

function init() {
    player = new Player({ position: { x: canvas.width / 2, y: canvas.height / 2 }, velocity: { x: 0, y: 0 } });
    player.rotation = 0;
    projectiles = [];
    asteroids = [];
    gameOver = false;
}

function spawnAsteroid() {
    let x, y, vx, vy, radius = 50 * Math.random() + 10;
    const side = Math.floor(Math.random() * 4);
    switch (side) {
        case 0: x = 0 - radius; y = Math.random() * canvas.height; break;
        case 1: x = Math.random() * canvas.width; y = 0 - radius; break;
        case 2: x = canvas.width + radius; y = Math.random() * canvas.height; break;
        case 3: x = Math.random() * canvas.width; y = canvas.height + radius; break;
    }
    const angle = Math.random() * 2 * Math.PI;
    vx = Math.cos(angle);
    vy = Math.sin(angle);
    const speed = 1;
    const magnitude = Math.sqrt(vx * vx + vy * vy);
    vx = (vx / magnitude) * speed;
    vy = (vy / magnitude) * speed;
    asteroids.push(new Asteroid({ position: { x, y }, velocity: { x: vx, y: vy }, radius }));
}

function animate() {
    if (gameOver) {
        ctx.font = '48px Silkscreen';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
        gameOverSound.play(); 
        return;
    }

    animationId = requestAnimationFrame(animate);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height); // Clear the canvas


    player.update();

    for (let i = projectiles.length - 1; i >= 0; i--) {
        const projectile = projectiles[i];
        projectile.update();
        if (projectile.position.x + projectile.radius < 0 || projectile.position.x - projectile.radius > canvas.width ||
            projectile.position.y - projectile.radius > canvas.height || projectile.position.y + projectile.radius < 0) {
            projectiles.splice(i, 1);
        }
    }

    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        asteroid.update();

        if (circlePlayerCollision(asteroid, player.getVertices())) {
            lives--;
            if (lives <= 0) {
                console.log('Game Over - No Lives Left');
                gameOver = true;
                return; // Stop the animation loop
            } else {
                console.log(`Life Lost! Lives remaining: ${lives}`);
                // Reset player position
                player.position.x = canvas.width / 2;
                player.position.y = canvas.height / 2;
                player.velocity.x = 0;
                player.velocity.y = 0;
                player.rotation = 0; // Optionally reset rotation
                // Optionally add a brief invulnerability period here
            }
            return; // Exit the asteroid collision check for this frame
        }

        if (asteroid.position.x + asteroid.radius < 0 || asteroid.position.x - asteroid.radius > canvas.width ||
            asteroid.position.y - asteroid.radius > canvas.height || asteroid.position.y + asteroid.radius < 0) {
            asteroids.splice(i, 1);
        }

        for (let j = projectiles.length - 1; j >= 0; j--) {
            const projectile = projectiles[j];
            if (collision(asteroid, projectile)) {
                score += 10; // Increment the score by 10
                console.log(score)
                asteroids.splice(i, 1);
                projectiles.splice(j, 1);
                destroySound.play();
                break;
            }
        }
    }

    if (keys.ArrowUp.pressed) {
        player.velocity.x = Math.cos(player.rotation) * MSD;
        player.velocity.y = Math.sin(player.rotation) * MSD;
    } else if (!keys.ArrowUp.pressed) {
        player.velocity.x *= FRN;
        player.velocity.y *= FRN;
    }

    if (keys.ArrowRight.pressed) player.rotation += RSD;
    else if (keys.ArrowLeft.pressed) player.rotation -= RSD;

    //Setting up scoreboard
    ctx.font = '30px Silkscreen';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score: ${score}`, canvas.width/1.7, 35);
    ctx.fillText(`Lives: ${lives}`, canvas.width/3.4, 35);
}

function collision(circle1, circle2) {
    const xDifference = circle2.position.x - circle1.position.x;
    const yDifference = circle2.position.y - circle1.position.y;
    const distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference);
    return distance <= circle1.radius + circle2.radius;
}

function circlePlayerCollision(circle, triangle) {
    for (let i = 0; i < 3; i++) {
        let start = triangle[i];
        let end = triangle[(i + 1) % 3];
        let dx = end.x - start.x;
        let dy = end.y - start.y;
        let length = Math.sqrt(dx * dx + dy * dy);
        let dot = ((circle.position.x - start.x) * dx + (circle.position.y - start.y) * dy) / Math.pow(length, 2);
        let closestX = start.x + dot * dx;
        let closestY = start.y + dot * dy;
        if (!isPointOnLineSegment(closestX, closestY, start, end)) {
            closestX = closestX < start.x ? start.x : end.x;
            closestY = closestY < start.y ? start.y : end.y;
        }
        dx = closestX - circle.position.x;
        dy = closestY - circle.position.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= circle.radius) return true;
    }
    return false;
}

function isPointOnLineSegment(x, y, start, end) {
    return (x >= Math.min(start.x, end.x) && x <= Math.max(start.x, end.x) &&
            y >= Math.min(start.y, end.y) && y <= Math.max(start.y, end.y));
}

init();
animate();
intervalId = setInterval(spawnAsteroid, 3000);

window.addEventListener('keydown', (evt) => {
    if (!gameStarted || gameOver) return;
    switch (evt.code) {
        case 'ArrowUp': keys.ArrowUp.pressed = true; break;
        case 'ArrowLeft': keys.ArrowLeft.pressed = true; break;
        case 'ArrowRight': keys.ArrowRight.pressed = true; break;
        case 'Space':
            projectiles.push(new Projectile({
                position: { x: player.position.x + Math.cos(player.rotation) * 30, y: player.position.y + Math.sin(player.rotation) * 30 },
                velocity: { x: Math.cos(player.rotation) * PSD, y: Math.sin(player.rotation) * PSD }
            }));
            projSound.play();
            break;
    }
});

window.addEventListener('keyup', (evt) => {
    if (!gameStarted || gameOver) return;
    switch (evt.code) {
        case 'ArrowUp': keys.ArrowUp.pressed = false; break;
        case 'ArrowLeft': keys.ArrowLeft.pressed = false; break;
        case 'ArrowRight': keys.ArrowRight.pressed = false; break;
    }
});
