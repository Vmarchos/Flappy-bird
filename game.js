const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");


//переменные и константы
frames = 0;

//загрузка спрайта
const sprite = new Image();
sprite.src = "img/sprite.png"


//бэкграунд
const bg = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 225,
    x: 0,
    y: cvs.height - 226,
    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h)
    }
}


//рисовка
function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);


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