const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");





//переменные и константы
let frames = 0;//кол-во кадров
const DEGREE = Math.PI / 180;
let soundOn = true;
let soundButton = document.getElementById('soundButton')

//Отключение и включение звука
soundButton.addEventListener("click", function () {
    SCORE_S.muted = !SCORE_S.muted;
    FLAP.muted = !FLAP.muted;
    HIT.muted = !HIT.muted;
    SWOOSHING.muted = !SWOOSHING.muted;
    DIE.muted = !DIE.muted;

    if (SCORE_S.muted) {
        soundButton.textContent = "Sound on";
    } else {
        soundButton.textContent = "Sound off";
    }

    update(); // вызываем функцию update() после изменения состояния звука
});


//загрузка спрайта
const sprite = new Image();
sprite.src = "img/sprite.png"

//загрузка звука
const SCORE_S = new Audio();
SCORE_S.src = "audio/sfx_point.wav";

const FLAP = new Audio();
FLAP.src = "audio/sfx_flap.wav";

const HIT = new Audio();
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav"


//стадия игры
const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2

}

//отслеживание стадии игры

cvs.addEventListener('click', moveUp);
document.addEventListener('keydown', function (event) {
    switch (state.current) {
        case state.game:
            bird.flap();
            FLAP.play();
            break;
    }
});

function moveUp() {
    switch (state.current) {
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            bird.flap();
            FLAP.play();
            break;
        case state.over:
            if (cvs) {
                pipes.reset();
                bird.speedReset();
                score.reset();
                state.current = state.getReady;
            }
            break;
    }
}


function vibrate() {
    if ("vibrate" in navigator) {
        navigator.vibrate([200]);
    }
}





//бэкграунд
const bg = {
    sX: 0,
    sY: 0,
    w: 275,
    h: 225,
    x: 0,
    y: cvs.height - 226,
    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    }
}
//передний фон
const fg = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,
    dx: 2,
    draw: function () {
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);

    },
    //В методе update объекта fg выполняем обновление его позиции на основе текущего состояния игры. Обновление позиции достигается путем уменьшения координаты x на dx и зацикливания ее относительно половины ширины объекта fg.
    update: function () {
        if (state.current == state.game) {
            this.x = (this.x - this.dx) % (this.w / 2)
        }

    }

}
//сама птичка
const bird = {
    animation: [
        { sX: 276, sY: 112 },
        { sX: 276, sY: 139 },
        { sX: 276, sY: 164 },
        { sX: 276, sY: 139 }
        //массив объектов с координатами для отрисовки птицы в каждом кадре анимации.
    ],
    x: 50,
    y: 150,
    w: 34,
    h: 26,

    radius: 12,//радиус окружности, которая охватывает птицу на игровом поле.

    frame: 0,// индекс текущего кадра анимации.

    gravity: 0.25,//значение гравитации, которая влияет на скорость падения птицы.
    jump: 4.5,// значение скорости при прыжке.
    speed: 0,//текущая скорость птицы.
    rotation: 0,//угол поворота птицы.



    draw: function () {
        // использует текущий кадр анимации птицы и устанавливает угол поворота, чтобы создать эффект взмаха крыльев птицы.
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h, - this.w / 2, - this.h / 2, this.w, this.h);
        ctx.restore();

    },
    flap: function () {
        this.speed = -this.jump;//устанавливает скорость птицы в противоположную сторону, чтобы создать эффект подскока.

    },
    //если состояние игры getReady , птица махает крыльями медлено 
    update: function () {
        this.period = state.current == state.getReady ? 10 : 5;
        //мы увеличиваем кадр на 1, каждый период
        this.frame += frames % this.period == 0 ? 1 : 0;
        // гарантируем, что значение номера кадра frame не превышает количество кадров в массиве animation 
        this.frame = this.frame % this.animation.length;

        //проверка на состояние игры 
        if (state.current == state.getReady) {
            this.y = 150;  //обновляем положение птицы после окончания игры
            this.rotation = 0 * DEGREE;
        }
        else {
            this.speed += this.gravity;// скорость птицы увеличивается на значение гравитации.
            this.y += this.speed;// птица перемещается по вертикали в соответствии со своей скоростью.
            //Далее проверяется, достигла ли птица земли. Если да, то её положение устанавливается на уровне земли, а  текущее состояние меняется на over.
            if (this.y + this.h / 2 >= cvs.height - fg.h) {
                this.y = cvs.height - fg.h - this.h / 2;
                if (state.current == state.game) {
                    state.current = state.over;
                    DIE.play();
                    vibrate();

                }
            }
            //Если скорость больше чем прыжок то птица падает и поворачивается на 90 градусов
            if (this.speed >= this.jump) {
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            } else {
                this.rotation = -25 * DEGREE;

            }

        }


    },
    speedReset: function () {
        this.speed = 0;//обнуляем скорость птицы 

    }

}

//сообщение о готовности 
const getReady = {
    sX: 0,
    sY: 228,
    w: 173,
    h: 152,
    x: cvs.width / 2 - 173 / 2,
    y: 80,

    draw: function () {
        if (state.current == state.getReady) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }

    }

}

//сообщение о пройгрыше
const gameOver = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: cvs.width / 2 - 225 / 2,
    y: 90,

    draw: function () {
        if (state.current === state.over) {
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }

    },


}

//препятствия 
const pipes = {
    position: [],
    top: {
        sX: 553,
        sY: 0

    },
    bottom: {
        sX: 502,
        sY: 0

    },
    w: 53,
    h: 400,
    gap: 85,
    maxYPos: -150,
    dx: 2,

    draw: function () {
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];
            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;
            //верхняя труба
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);
            //нижняя труба
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);

        }

    },
    update: function () {
        if (state.current !== state.game) return;
        if (frames % 100 == 0) {      //добавляем новые трубы в массив position    каждые 100 кадров с помощью метода push(), где x - это ширина канваса, а y - случайное значение от -150 до 0 умноженное на случайное значение.
            this.position.push({
                x: cvs.width,
                y: this.maxYPos * (Math.random() + 1),
            });
        }
        for (let i = 0; i < this.position.length; i++) {
            let p = this.position[i];

            let bottomPipeYPos = p.y + this.h + this.gap;
            //если птица врезается в трубы
            //верхнюю
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
                bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
                state.current = state.over;
                HIT.play();
                vibrate();
            }
            //нижнюю
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w &&
                bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h) {
                state.current = state.over;
                HIT.play();
                vibrate();
            }

            //движение труб влево 
            p.x -= this.dx;
            //если трубы выходят за пределы канваса удаляем их из массива
            if (p.x + this.w <= 0) {
                this.position.shift();
                score.value += 1;//Увеличивает значение переменной score.value на единицу при прохождении каждой трубы и обновляем значение переменной score.best, если текущий результат лучше предыдущего, а также сохраняем лучший результат в локальном хранилище браузера с помощью метода localStorage.setItem().
                SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem('best', score.best)

            }
        }

    },
    reset: function () {
        this.position = [];//очищаем массив что бы начать новую игру
    }

}

//Очки 
const score = {
    best: parseInt(localStorage.getItem('best')) || 0,// Если в локальном хранилище ничего не найдено, то переменной score.best присваивается значение 0.
    value: 0,

    draw: function () {
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if (state.current == state.game) {
            ctx.lineWidth = 2;
            ctx.font = "35px Teko"
            ctx.fillText(this.value, cvs.width / 2, 50)
            ctx.strokeText(this.value, cvs.width / 2, 50)

        } else if (state.current == state.over) {
            //Результат 
            ctx.font = "25px Teko"
            ctx.fillText(this.value, 225, 186)
            ctx.strokeText(this.value, 225, 186)

            //Лучший результат 
            ctx.fillText(this.best, 225, 225)
            ctx.strokeText(this.best, 225, 225)


        }

    },
    reset: function () {
        this.value = 0;//cбрасываем текущий результат


    }
}


//отрисовка всех элементов на канвасе.
function draw() {
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();



}

//обновление состояния игры на каждом кадре.
function update() {
    bird.update();
    fg.update();
    pipes.update();


}
//цикл
function loop() {
    update();
    draw();
    frames++;

    requestAnimationFrame(loop);//вызываем loop() снова для запуска следующего кадра, и таким образом происходит бесконечный цикл обновления и отображения состояния игры на каждый кадр.
}
function start() {//прячет экран загрузки и показывает канвас.
    const startDiv = document.getElementById("startdiv")
    startDiv.style.display = "none"
    cvs.style.display = "block"

}

function showRules() {//показывает правила игры.
    const rules = document.getElementById("rules");
    rules.style.display = "flex"
}
function hideRules() {//скрывает правила игры.
    const hideRules = document.getElementById("rules");
    rules.style.display = "none"

}
function backToMenu() {//скрывает канвас и показывает экран загрузки.
    cvs.style.display = 'none';
    const startDiv = document.getElementById("startdiv")
    startDiv.style.display = "block"


}
loop();