"use strict"

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;

const playerImage = new Image();
playerImage.src = 'images/ship.png';
const aimImage = new Image();
aimImage.src = 'images/Aim.png';
const bulletImage = new Image();
bulletImage.src = 'images/bullet.png'

let bg, player, start, anim, aim;
// let laser;
const stars = [], bullets = [];

function playGame() {
    start = true;
    init(); // иннициализация переменных
    game(); // запуск анимации
};

function render() {
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // star
    for (let star of stars) {
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    
        ctx.save(); 
        ctx.beginPath();
        ctx.arc(star.x + star.radius, star.y + star.radius, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();       
        ctx.arc(star.x + star.radius, star.y - star.radius, star.radius, 0, Math.PI * 2);
        ctx.fill(); 
        ctx.beginPath(); 
        ctx.arc(star.x - star.radius, star.y + star.radius, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(star.x - star.radius, star.y - star.radius, star.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    // player
    ctx.save();
    ctx.translate(player.x + player.w / 2, player.y + player.h / 2);
    ctx.rotate(player.r);
    ctx.translate(-player.x - player.w / 2, -player.y - player.h / 2);
    ctx.drawImage(playerImage, player.x, player.y, player.w, player.h);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = 'rgba(219, 20, 20, 1)';
    ctx.strokeStyle = 'rgba(219, 20, 20, 1)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.arc(aim.x, aim.y, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.arc(aim.x, aim.y, 15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(aim.x + 5, aim.y);
    ctx.lineTo(aim.x + 40, aim.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(aim.x - 5, aim.y);
    ctx.lineTo(aim.x - 40, aim.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(aim.x, aim.y + 5);
    ctx.lineTo(aim.x, aim.y + 40);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(aim.x, aim.y - 5);
    ctx.lineTo(aim.x, aim.y - 40);
    ctx.stroke();
    ctx.restore();

    
    // laser
/*     if (laser.time > 0){
        ctx.save();
        ctx.strokeStyle = 'rgba(219, 20, 20, .7)';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(laser.x_1, laser.y_1);
        ctx.lineTo(laser.x_2, laser.y_2);
        ctx.stroke();
        ctx.restore();
    } */

    // bullets
    for (let bullet of bullets){
        ctx.save();
        ctx.translate(bullet.x + bullet.w / 2, bullet.y + bullet.h / 2);
        ctx.rotate(bullet.r);
        ctx.translate(-bullet.x - bullet.w / 2, -bullet.y - bullet.h / 2);
        ctx.drawImage(bulletImage, bullet.x, bullet.y, bullet.w, bullet.h);
        ctx.restore();
    }

}

function update() {
    /*     // console.log(Date.now() - then);
        let now = Date.now() * 0.001;
        const deltaTime = now - then;
        then = Date.now(); */

    for (let star of stars){
        star.setOpacity();
    }
        
/*     if (laser.time > 0){
        laser.time--;
    } */
    
    for (let bullet of bullets){
        bullet.x += bullet.dx * bullet.dv[0];
        bullet.y += bullet.dx / bullet.dv[1];
    }

};

function game() {
    update();
    render();
    anim = requestAnimationFrame(game);
}

function init() {
    player = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        w: 156,
        h: 103,
        d: 5,
        r: 0
    };
    aim = {
        x: canvas.width / 2 + 100,
        y: canvas.height / 2 + 100,
        w: 50,
        h: 42
    }

    for (let i = 0; i <= 500; i++){
        stars.push(new CreateStar());
    }

/*     laser = {
        x_1: 0,
        y_1: 0,
        x_2: 0,
        y_2: 0,
        len: 10,
        time: 0
    } */

    document.addEventListener('keydown', playerMove);
    document.addEventListener('mousemove', playerRotate);
    document.addEventListener('mousemove', drawAim);
    // document.addEventListener('click', drawLaser);
    document.addEventListener('click', drawBullets);


};
function playerMove() { 
    if (player.y <= canvas.height / 2 - 100) {
        player.y = canvas.height / 2 - 100;
        for (let star of stars){
            star.y += player.d;
            if (star.y > canvas.height){
                star.y = 0;
            }          
        };
    }
    if (player.y >= canvas.height / 2 + 100) {
        player.y = canvas.height / 2 + 100;
        for (let star of stars){
            star.y -= player.d;
            if (star.y < 0){
                star.y = canvas.height;
            }          
        };
    }
    if (player.x <= canvas.width / 2 - 100) {
        player.x = canvas.width / 2 - 100;
        for (let star of stars){
            star.x += player.d;
            if (star.x > canvas.width){
                star.x = 0;
            }          
        };
    }
    if (player.x >= canvas.width / 2 + 100) {
        player.x = canvas.width / 2 + 100;
        for (let star of stars){
            star.x -= player.d;
            if (star.x < 0){
                star.x = canvas.width;
            }          
        };
    }


    if (player.x <= 0) player.x = 0;
    if (player.x + player.w >= canvas.width) player.x = canvas.width - player.w;
    if (player.y <= 0) player.y = 0;
    if (player.y + player.h >= canvas.height) player.y = canvas.height - player.h;

    switch (event.code) {
        case 'KeyD':
        case 'ArrowRight':
            player.x += player.d;
            break;
        case 'KeyA':
        case 'ArrowLeft':
            player.x -= player.d;
            break;
        case 'KeyW':
        case 'ArrowUp':
            player.y -= player.d;
            break;
        case 'KeyS':
        case 'ArrowDown':
            player.y += player.d;
            break;
    }

};

function playerRotate() {
    player.r = getAngle();
}

function getAngle(){
    const deltaX = event.clientX - (player.x + player.w / 2);
    const deltaY = event.clientY - (player.y + player.h / 2);
    let angle = Math.acos(deltaX / Math.sqrt(deltaX ** 2 + deltaY ** 2));
    if (deltaY < 0){
        angle = -angle;
    }
    return angle;
}

function calculateBulletWay(){
    const dv = [1, 0];
    const deltaX = event.clientX - (player.x + player.w / 2);
    const deltaY = event.clientY - (player.y + player.h / 2);
    const ctg = deltaX / deltaY;
    dv[1] = ctg;
    if (deltaX < 0){   
        dv[0] = -1;
    }
    return dv;
}

function drawAim() {
    aim.x = event.clientX;
    aim.y = event.clientY;
}

function CreateStar() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.radius = Math.random() * 6;
    this.opacity = Math.random() * 0.3 + 0.6;
    this.coefOpacity = 0.004;
    this.setOpacity = function () {           
        if (this.opacity <= 0.4 || this.opacity >= 1.0){
            this.coefOpacity = -this.coefOpacity;
        } 
        this.opacity += this.coefOpacity;   
    }
}

/* function drawLaser(){
    laser.time = 4;
    laser.x_1 = player.x + player.w / 2;
    laser.y_1 = player.y  + player.h / 2;

    laser.x_2 = event.clientX;
    laser.y_2 = event.clientY;
} */

function drawBullets(){
    bullets.push({
        x: player.x + player.w / 2,
        y: player.y + player.h / 2,
        w: 25,
        h: 16,
        r: getAngle(), 
        dx: 30,
        // dy: this.dx / calculateBulletWay()
        dy: 0,
        dv: calculateBulletWay()
    })
}
window.onload = () => playGame();  