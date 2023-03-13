const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');
//переменные и константы игры
let frames = 0;
const sprite = new Image();
sprite.src = "img/sprite.png"


//рисовка
function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, cvs.width, cvs.heigth);

}

//обновление
function update() {

}

//цикл
function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);

}
loop();

