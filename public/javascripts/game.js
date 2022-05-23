let canvas = document.querySelector("canvas");
let socket = io();

let ctx = canvas.getContext("2d");
let go = "down";
let go2 = "right";

class Bat {
    constructor(xPos, yPos, width, height) {
        this.width = width;
        this.position = {
            x: xPos,
            y: yPos,
        };
        this.height = height;
        this.draw();
    }

    setPosition(x, y) {
        this.position = {
            x,
            y,
        };
    }

    draw = () => {
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        ctx.stroke();
    };
}
class Ball {
    constructor(xPos, yPos, width, height) {
        this.position = {
            x: xPos,
            y: yPos,
        };

        this.draw();
    }

    setPosition(x, y) {
        this.position = {
            x,
            y,
        };
    }


    move() {
        if (this.position.x > canvas.width - 10) {
            go2 = "left";
        }
        if (this.position.x < 10) {
            go2 = "right";
        }

        if (go2 === "left") {
            this.position.x -= 2;
        }
        if (go2 === "right") {
            this.position.x += 2;
        }
        if (this.position.y > canvas.height - 30) {
            go = "up";
        }
        if (this.position.y < 25) {
            go = "down";
        }
        if (go === "up") {
            this.position.y -= 3;
        } else this.position.y += 3;
    }

    draw = (position1, position2, width) => {
        if (position1 && position2) {
            if (this.position.y < 25) {
                if (
                    this.position.x < position1.x - 4 ||
                    this.position.x > position1.x + width + 4
                ) {
                    return 0;
                }
            }
            if (this.position.y > canvas.height - 30) {
                if (
                    this.position.x < position2.x - 4 ||
                    this.position.x > position2.x + width + 4
                ) {
                    return 0;
                }
            }
        }
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 5, 0, 360, false);
        ctx.stroke();
        this.move();
        return 1;
    };
}
class Game {
    constructor() {
        this.keyconstraints = {
            a: {
                pressed: false,

                do: () => {
                    this.bat2.setPosition(
                        this.bat2.position.x - 3,
                        this.bat2.position.y
                    );
                },
            },
            d: {
                pressed: false,
                do: () => {
                    this.bat2.setPosition(
                        this.bat2.position.x + 4,
                        this.bat2.position.y
                    );
                },
            },
            ArrowLeft: {
                pressed: false,
                do: () => {
                    this.bat.setPosition(
                        this.bat.position.x - 3,
                        this.bat.position.y
                    );
                },
            },

            ArrowRight: {
                pressed: false,
                do: () => {
                    this.bat.setPosition(
                        this.bat.position.x + 4,
                        this.bat.position.y
                    );
                },
            },
        };
        this.bat = new Bat(10, 10, 50, 10);
        this.bat2 = new Bat(10, canvas.height - 30, 50, 10);
        this.ball = new Ball(40, 40);
        this.moveBat();
        this.animate();
    }

    animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Object.keys(this.keyconstraints).forEach((key) => {
            if (this.keyconstraints[key].pressed) {
                this.keyconstraints[key].do();
                // socket.emit('pos', {
                //     this.keyconstraints.
                // })
            }
        });
        const gameRunning = this.ball.draw(
            this.bat.position,
            this.bat2.position,
            this.bat.width
        );

        if (!gameRunning) {
            window.cancelAnimationFrame(this.animate);
            ctx.font = '30px Arial';
            ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2)
            return;
        }
        this.bat.draw();
        this.bat2.draw();
        window.requestAnimationFrame(this.animate);
    };

    moveBat = () => {
        window.addEventListener("keydown", (e) => {
            if (
                e.key === "a" ||
                e.key === "d" ||
                e.key == "ArrowLeft" ||
                e.key === "ArrowRight"
            ) {
                this.keyconstraints[e.key].pressed = true;
            }
        });
        window.addEventListener("keyup", (e) => {
            if (
                e.key === "a" ||
                e.key === "d" ||
                e.key == "ArrowLeft" ||
                e.key === "ArrowRight"
            ) {
                this.keyconstraints[e.key].pressed = false;
            }
        });
    };
}

const game = new Game();

