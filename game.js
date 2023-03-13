const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");


//переменные и константы
frames = 0;

//загрузка спрайта
const sprite = new Image();
sprite.src = "img/sprite.png"


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