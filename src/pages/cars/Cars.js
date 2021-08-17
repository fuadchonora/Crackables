import React, { useRef, useEffect } from 'react';

import './css/style.css';
import CarLeft from './img/car-left.svg';
import CarRight from './img/car-right.svg';
import CircleLeft from './img/circle-left.svg';
import CircleRight from './img/circle-right.svg';
import SquareLeft from './img/square-left.svg';
import SquareRight from './img/square-right.svg';

//variables
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight - 8;

let rWidth;
let obstacleWidth;

let UIEnabled = false;
let isRunning = false;
// let startTime = new Date();

let point = 0;
let speed;
let spawnInterval = 1000;
let spawnSpeed;

let cars = [];
let circles = {};
let squares = {};

export default function Cars() {
	const canvasRef = useRef(null);

	let cw = 400;
	let ch = window.innerHeight;

	useEffect(() => {
		const canvas = canvasRef.current;
		const c = canvas.getContext('2d');

		// c.translate(0.5, 0.5);

		//Elements
		const circleLeft = document.getElementById('circle-left');
		const circleRight = document.getElementById('circle-right');
		const squareLeft = document.getElementById('square-left');
		const squareRight = document.getElementById('square-right');
		const carLeft = document.getElementById('car-left');
		const carRight = document.getElementById('car-right');

		//Utiliy functions

		const enableUI = () => (UIEnabled = true);
		const disableUI = () => (UIEnabled = false);
		// const resumeGame = () => (isRunning = true);
		const pauseGame = () => (isRunning = false);

		const resetGame = () => {
			point = 0;
			speed = 5;
			spawnInterval = 1000;
			spawnSpeed = 5;
			// startTime = new Date();
			isRunning = true;
		};

		function updatePoint() {
			point++;
			console.log('Point:' + point);

			speed += 0.1;
		}

		function gameOver() {
			pauseGame();
			console.log('Game Over! Point:' + point);
		}

		function distance(x1, y1, x2, y2) {
			const xDistance = x2 - x1;
			const yDistance = y2 - y1;

			return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
		}

		function randomIntFromRange(min, max) {
			return Math.floor(Math.random() * (max - min + 1) + min);
		}

		function randomObstacle() {
			const idx = randomIntFromRange(0, 8);

			if ([0, 1, 2, 3].includes(idx))
				return {
					isCircle: true,
					obst: [0, 1].includes(idx) ? circleLeft : circleRight,
					x: rWidth * idx,
				};
			if ([4, 5, 6, 7].includes(idx))
				return {
					isCircle: false,
					obst: [4, 5].includes(idx) ? squareLeft : squareRight,
					x: rWidth * (idx - 4),
				};

			return null;
		}

		function touchXY(e) {
			if (!UIEnabled) return;

			let { pageX } = e.targetTouches[0];
			let canX = pageX - canvas.offsetLeft;

			if (e.targetTouches.length > 1) {
				pageX = e.targetTouches[1].pageX;
				canX = pageX - canvas.offsetLeft;
			}

			canX < rWidth * 2 ? cars[0].toggle() : cars[1].toggle();
		}

		//Objects
		function Car(id, isLeft, img, x, y, width, height) {
			this.id = id;
			this.isLeft = isLeft;
			this.isMOving = false;
			this.x = x;
			this.y = y;
			this.velocity = {
				x: 0,
				y: 0,
				angle: 0,
			};
			this.mass = 1;
			this.width = width;
			this.height = height;
			this.radious = height / 2;
			this.angle = 0;
			this.img = img;

			this.toggle = () => {
				if (this.isLeft) {
					//move right
					this.isLeft = false;
					this.velocity.angle = speed / 2;
					this.velocity.x = speed;
				} else {
					//move left
					this.isLeft = true;
					this.velocity.angle = -speed / 2;
					this.velocity.x = -speed;
				}
			};

			this.update = () => {
				if (this.id === 0 && (this.x < 0 || this.x > rWidth)) {
					this.velocity.x = 0;
					this.x = this.isLeft ? 0 : rWidth;
				}
				if (this.id === 1 && (this.x < rWidth * 2 || this.x > rWidth * 3)) {
					this.velocity.x = 0;
					this.x = this.isLeft ? rWidth * 2 : rWidth * 3;
				}

				this.x += this.velocity.x;
				this.y += this.velocity.y;
				this.angle += this.velocity.angle;

				if (this.angle < 1 && this.angle > -1) {
					this.velocity.angle = 0;
					this.angle = 0;
				} else if (this.angle > 30) {
					this.velocity.angle = -speed / 2;
				} else if (this.angle < -30) {
					this.velocity.angle = speed / 2;
				}
			};

			this.draw = () => {
				c.beginPath();
				c.save();
				c.translate(this.x + this.width / 2, this.y + this.height / 2);
				c.rotate((this.angle * Math.PI) / 180);
				c.fillStyle = 'red';
				c.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
				c.restore();
				c.closePath();
			};
		}

		function Circle(id, img, x, y, width, height) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.mass = 1;
			this.width = width;
			this.height = height;
			this.radious = height / 2;
			this.img = img;

			this.update = (cars) => {
				for (let i in cars) {
					if (
						distance(this.x, this.y, cars[i].x, cars[i].y) -
							(this.height / 2 + cars[i].height / 2) +
							this.height * 0.2 <
						0
					) {
						updatePoint();
						delete circles[this.id];
						delete this;
					}
				}

				if (windowHeight - (windowHeight - cars[1].y - 100) - this.y <= 0) {
					console.log('Circle Missed');
					gameOver();
					delete this;
				}

				this.y += speed;
			};

			this.draw = () => {
				c.beginPath();
				c.save();
				c.drawImage(this.img, this.x, this.y, this.width, this.height);
				c.restore();
				c.closePath();
			};
		}
		function Square(id, img, x, y, width, height) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.mass = 1;
			this.width = width;
			this.height = height;
			this.radious = height / 2;
			this.img = img;

			this.update = (cars) => {
				for (let i in cars) {
					if (
						distance(this.x, this.y, cars[i].x, cars[i].y) -
							(this.height / 2 + cars[i].height / 2) +
							this.height * 0.2 <
						0
					) {
						console.log('Square Collided');
						gameOver();
					}
				}

				if (windowHeight - this.y <= 0) {
					//remove this obstacle from the squares-object and delete it
					delete squares[this.id];
					delete this;
				}

				this.y += speed;
			};

			this.draw = () => {
				c.save();
				c.beginPath();
				c.drawImage(this.img, this.x, this.y, this.width, this.height);
				c.restore();
				c.closePath();
			};
		}

		//Implimentation

		function addObstacle() {
			let id = Math.random();
			let obstacle = randomObstacle();

			if (spawnInterval > 400) spawnInterval -= spawnSpeed;
			setTimeout(() => {
				if (isRunning) addObstacle();
			}, spawnInterval);

			if (!obstacle) {
				return;
			} else if (obstacle.isCircle) {
				circles[id] = new Circle(
					id,
					obstacle.obst,
					obstacle.x + rWidth / 4,
					-obstacleWidth,
					obstacleWidth,
					obstacleWidth
				);
			} else {
				squares[id] = new Square(
					id,
					obstacle.obst,
					obstacle.x + rWidth / 4,
					-obstacleWidth,
					obstacleWidth,
					obstacleWidth
				);
			}
		}

		function init() {
			if (windowWidth > 700) {
				windowWidth = 400;
			}

			canvas.width = windowWidth;
			canvas.height = windowHeight;

			rWidth = parseInt(canvas.width / 4); //single road width
			obstacleWidth = parseInt(rWidth / 2);

			cars.push(new Car(0, true, carLeft, 0, windowHeight - rWidth * 2, rWidth, rWidth));
			cars.push(new Car(1, false, carRight, rWidth * 3, windowHeight - rWidth * 2, rWidth, rWidth));

			addObstacle();
		}

		//Animation Loop
		function update() {
			requestAnimationFrame(update);
			if (!isRunning) return;

			c.clearRect(0, 0, canvas.width, canvas.height);

			for (let i in cars) {
				cars[i].update();
			}

			for (let i in circles) {
				circles[i].update(cars);
			}
			for (let i in squares) {
				squares[i].update(cars);
			}
		}
		function animate() {
			// if(!isRunning) return;

			requestAnimationFrame(animate);
			c.clearRect(0, 0, canvas.width, canvas.height);

			c.beginPath();
			c.fillStyle = '#25337a';
			c.fillRect(0, 0, canvas.width, canvas.height);

			c.moveTo(rWidth, 0);
			c.lineTo(rWidth, windowHeight);
			c.moveTo(rWidth * 2, 0);
			c.lineTo(rWidth * 2, windowHeight);

			c.moveTo(rWidth * 3, 0);
			c.lineTo(rWidth * 3, windowHeight);

			c.strokeStyle = '#839bf3';
			c.lineWidth = 2;
			c.stroke();

			c.font = '50px Arial';
			c.fillStyle = 'white';
			c.textAlign = 'center';
			c.fillText(point, canvas.width - 50, 50);

			c.closePath();

			cars.forEach(function (car) {
				car.draw();
			});
			for (let i in circles) {
				circles[i].draw();
			}
			for (let i in squares) {
				squares[i].draw();
			}
		}

		function startGame() {
			init();
			disableUI();
			resetGame();
			update();
			animate();
			enableUI();
		}

		//start
		startGame();

		//add event Listeners
		canvas.addEventListener('touchstart', touchXY, false);
	});

	return (
		<div>
			<div id="elemnts" style={{ display: 'none' }}>
				<img className="obstacle" id="circle-left" src={CircleLeft} alt="Circle Left" />
				<img className="obstacle" id="circle-right" src={CircleRight} alt="Circe Right" />
				<img className="obstacle" id="square-left" src={SquareLeft} alt="Square Left" />
				<img className="obstacle" id="square-right" src={SquareRight} alt="square Right" />
				<img className="car" id="car-left" src={CarLeft} alt="Car Left" />
				<img className="car" id="car-right" src={CarRight} alt="Car Right" />
			</div>

			<canvas ref={canvasRef} width={cw} height={ch}></canvas>
		</div>
	);
}
