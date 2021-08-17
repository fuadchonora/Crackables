import React, { useRef, useEffect } from 'react';

import './css/style.css';
import CarLeft from './img/car-left.svg';
import CarRight from './img/car-right.svg';
import CircleLeft from './img/circle-left.svg';
import CircleRight from './img/circle-right.svg';
import SquareLeft from './img/square-left.svg';
import SquareRight from './img/square-right.svg';

//declare variables
let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight - 8;

let dpr = window.devicePixelRatio;
let dprWindowWidth = windowWidth * dpr;
let dprWindowHeight = windowHeight * dpr;

let rWidth;
let rWidthDouble;
let rWidthTriple;
let rWidthHalf;
let rWidthQrtr;
let obstacleWidth;

let UIEnabled = false;
let isRunning = false;

let point;
let speed;
let spawnSpeed;
let spawnInterval = 1000;

let fogSettings = {
	idx: 0,
	density: 20,
	minSize: 15,
	maxSize: 25,
	minSpeed: 0,
	maxSpeed: 0,
	gravity: 0.5,
	maxLife: 100,
};

let explosionSettions = {
	density: 40,
	minSize: 10,
	maxSize: 20,
	minSpeed: 20,
	maxSpeed: 40,
};

let cars = [];
let circles = {};
let squares = {};
let fogParticles = {};
let explosions = [];

export default function Cars() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext('2d');

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
		const resumeGame = () => (isRunning = true);
		const pauseGame = () => (isRunning = false);

		function updatePoint() {
			point++;
			console.log('Point:' + point);

			speed += 0.1;
		}

		function gameOver() {
			pauseGame();
			disableUI();
			console.log('Game Over! Point:' + point);
		}

		function distance(x1, y1, x2, y2) {
			const xDistance = x2 - x1;
			const yDistance = y2 - y1;

			return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
		}

		// Returns an random integer, positive or negative
		// between the given value
		function randInt(min, max, positive) {
			let num;
			if (!positive) {
				num = Math.floor(Math.random() * max) - min;
				num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
			} else {
				num = Math.floor(Math.random() * max) + min;
			}

			return num;
		}

		function randomObstacle() {
			const idx = randInt(0, 8, true);

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

			let { pageX, pageY } = e.targetTouches[0];
			let touchX = pageX - canvas.offsetLeft;
			let touchY = pageY - canvas.offsetTop;

			if (e.targetTouches.length > 1) {
				pageX = e.targetTouches[1].pageX;
				touchX = pageX - canvas.offsetLeft;
				touchY = pageY - canvas.offsetTop;
			}

			// console.log(`${touchX * dpr} < ${rWidthDouble}`);
			touchY && touchX * dpr < rWidthDouble ? cars[0].toggle() : cars[1].toggle();
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
			this.width = width;
			this.height = height;
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
				if (this.id === 1 && (this.x < rWidthDouble || this.x > rWidthTriple)) {
					this.velocity.x = 0;
					this.x = this.isLeft ? rWidthDouble : rWidthTriple;
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
				ctx.beginPath();
				ctx.save();
				ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
				ctx.rotate((this.angle * Math.PI) / 180);
				ctx.fillStyle = 'red';
				ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
				ctx.restore();
				ctx.closePath();
			};
		}

		function Circle(id, img, x, y, width, height) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.img = img;
			this.isVisible = true;

			this.blink = () => {
				let count = 1;
				let intrvl = setInterval(() => {
					this.isVisible = !this.isVisible;
					count++;
					if (count >= 9) clearInterval(intrvl);
				}, 250);
			};

			this.update = (cars) => {
				for (let i in cars) {
					let dist = distance(this.x, this.y, cars[i].x, cars[i].y);
					if (dist - (this.height / 2 + cars[i].height / 2) <= 0) {
						//circle collided with a car, add point
						updatePoint();
						delete circles[this.id];
						delete this;
					}
				}

				if (this.y >= cars[1].y + 100 * dpr) {
					console.log('Circle Missed');
					gameOver();
					this.blink();
				}

				this.y += speed;
			};

			this.draw = () => {
				if (!this.isVisible) return;

				ctx.beginPath();
				ctx.save();
				ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
				ctx.restore();
				ctx.closePath();
			};
		}
		function Square(id, img, x, y, width, height) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			this.img = img;

			this.update = (cars) => {
				for (let i in cars) {
					let dist = distance(this.x, this.y, cars[i].x, cars[i].y);

					if (dist - (this.height / 2 + cars[i].height / 2) + 50 <= 0) {
						console.log('Square Collided');
						//create explosion
						let isL = this.x < rWidthDouble ? true : false;
						let expl = new Explosion(this.x, this.y, isL);
						explosions.push(expl);
						gameOver();
						delete squares[this.id];
						delete this;
					}
				}

				if (dprWindowHeight - this.y <= 0) {
					//remove this obstacle from the squares-object and delete it
					delete squares[this.id];
					delete this;
				}

				this.y += speed;
			};

			this.draw = () => {
				ctx.save();
				ctx.beginPath();
				ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
				ctx.restore();
				ctx.closePath();
			};
		}
		//fog particle
		function FogParticle(id, x, y) {
			this.id = id;
			this.x = x;
			this.y = y;
			this.xv = randInt(fogSettings.minSpeed, fogSettings.maxSpeed, false);
			this.yv = randInt(fogSettings.minSpeed, fogSettings.maxSpeed, false);
			this.size = randInt(fogSettings.minSize, fogSettings.maxSize, true);

			this.update = () => {
				this.x += this.xv;
				this.y += this.yv;

				// Adjust for gravity
				this.yv += fogSettings.gravity;

				// Age the particle
				this.life++;

				// If Particle is old, remove it
				if (this.life >= fogSettings.maxLife) {
					delete fogParticles[this.id];
				}
			};

			this.draw = () => {
				ctx.beginPath();
				ctx.fillStyle = '#ffffff';
				ctx.rect(this.x, this.y, fogSettings.particleSize, fogSettings.particleSize);
				// ctx.arc(this.x, this.y, fogSettings.particleSize, 0, Math.PI * 2, true);
				ctx.closePath();
				ctx.fill();
			};
		}
		// Particle
		function ExplosionParticle(x, y, isL, isWhite) {
			this.x = x + rWidthQrtr;
			this.y = y + rWidthQrtr;
			this.xv = randInt(explosionSettions.minSpeed, explosionSettions.maxSpeed, false);
			this.yv = randInt(explosionSettions.minSpeed, explosionSettions.maxSpeed, false);
			this.size = randInt(explosionSettions.minSize, explosionSettions.maxSize, true);
			this.r = isWhite ? 255 : isL ? 240 : 0;
			this.g = isWhite ? 255 : isL ? 58 : 170;
			this.b = isWhite ? 255 : isL ? 98 : 195;
		}
		// Explosion
		function Explosion(x, y, isL) {
			this.particles = [];

			for (let i = 0; i < explosionSettions.density; i++) {
				this.particles.push(new ExplosionParticle(x, y, isL, i % 3 === 0 ? true : false));
			}
		}

		//Implimentations
		function addObstacle() {
			if (spawnInterval > 400) spawnInterval -= spawnSpeed;
			setTimeout(() => {
				addObstacle();
			}, spawnInterval);

			let id = Math.random();
			let obstacle = randomObstacle();

			if (!isRunning || !obstacle) {
				return;
			} else if (obstacle.isCircle) {
				circles[id] = new Circle(
					id,
					obstacle.obst,
					obstacle.x + rWidthQrtr,
					-obstacleWidth,
					obstacleWidth,
					obstacleWidth
				);
			} else {
				squares[id] = new Square(
					id,
					obstacle.obst,
					obstacle.x + rWidthQrtr,
					-obstacleWidth,
					obstacleWidth,
					obstacleWidth
				);
			}
		}
		function addFogParticle() {
			setTimeout(() => {
				addFogParticle();
			}, 100);

			if (!isRunning) return;

			let particleL = new FogParticle(fogSettings.idx, cars[0].x + rWidthHalf, cars[0].y + cars[0].height);
			let particleR = new FogParticle(
				fogSettings.idx + 1,
				cars[1].x + rWidthHalf,
				cars[1].y + cars[1].height
			);

			fogParticles[particleL.id] = particleL;
			fogParticles[particleR.id] = particleR;

			fogSettings.idx += 2;
		}

		// Draw explosions
		function drawExplosion() {
			if (explosions.length === 0) {
				return;
			}

			for (let i = 0; i < explosions.length; i++) {
				const explosion = explosions[i];
				const particles = explosion.particles;

				if (particles.length === 0) {
					explosions.splice(i, 1);
					return;
				}

				const particlesAfterRemoval = particles.slice();
				for (let ii = 0; ii < particles.length; ii++) {
					const particle = particles[ii];

					// Check particle size
					// If 0, remove
					if (particle.size <= 0) {
						particlesAfterRemoval.splice(ii, 1);
						continue;
					}

					ctx.beginPath();
					ctx.rect(particle.x, particle.y, particle.size, particle.size);
					// ctx.arc(particle.x, particle.y, particle.size, Math.PI * 2, 0, false);
					ctx.closePath();
					ctx.fillStyle = 'rgb(' + particle.r + ',' + particle.g + ',' + particle.b + ')';
					ctx.fill();

					// Update
					particle.x += particle.xv;
					particle.y += particle.yv;
					particle.size -= 0.1;
				}

				explosion.particles = particlesAfterRemoval;
			}
		}

		function init() {
			if (windowWidth > 700) {
				windowWidth = 400;
			}

			canvas.width = dprWindowWidth;
			canvas.height = dprWindowHeight;

			canvas.style.width = `${windowWidth}px`;
			canvas.style.height = `${windowHeight}px`;

			rWidth = parseInt(dprWindowWidth / 4); //single road width

			rWidthDouble = parseInt(dprWindowWidth / 2); //double road width
			rWidthTriple = rWidthDouble + rWidth; //tripple road width

			rWidthHalf = rWidth / 2; //half road width
			rWidthQrtr = rWidth / 4; //quarter road width

			obstacleWidth = parseInt(rWidthHalf);

			point = 0;
			speed = 20;
			spawnSpeed = 5;

			cars = [];
			circles = {};
			squares = {};
			fogParticles = {};
			explosions = [];

			cars.push(new Car(0, true, carLeft, 0, dprWindowHeight - rWidthDouble, rWidth, rWidth));
			cars.push(new Car(1, false, carRight, rWidthTriple, dprWindowHeight - rWidthDouble, rWidth, rWidth));

			isRunning = true;

			setTimeout(() => {
				addObstacle();
				addFogParticle();
			}, 1000);
		}

		//Animation Loop
		function update() {
			requestAnimationFrame(update);

			if (!isRunning) return;

			for (let i in cars) {
				cars[i].update();
			}

			for (let i in circles) {
				circles[i].update(cars);
			}
			for (let i in squares) {
				squares[i].update(cars);
			}
			for (let i in fogParticles) {
				fogParticles[i].update();
			}
		}
		function animate() {
			requestAnimationFrame(animate);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.beginPath();
			ctx.fillStyle = '#25337a';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.moveTo(rWidth, 0);
			ctx.lineTo(rWidth, canvas.height);
			ctx.moveTo(rWidthDouble, 0);
			ctx.lineTo(rWidthDouble, canvas.height);

			ctx.moveTo(rWidthTriple, 0);
			ctx.lineTo(rWidthTriple, canvas.height);

			ctx.strokeStyle = '#839bf3';
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = '100px Arial';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.fillText(point, canvas.width - 100, 100);

			ctx.closePath();

			cars.forEach(function (car) {
				car.draw();
			});
			for (let i in circles) {
				circles[i].draw();
			}
			for (let i in squares) {
				squares[i].draw();
			}
			for (let i in fogParticles) {
				fogParticles[i].draw();
			}

			//draw explosion animation
			drawExplosion();
		}

		function startOrRestartGame() {
			disableUI();
			init();
			update();
			animate();
			enableUI();
		}

		//start
		startOrRestartGame();

		//add event Listeners
		canvas.addEventListener('touchstart', touchXY, false);
		window.addEventListener('blur', pauseGame, false);
		window.addEventListener('focus', resumeGame, false);
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

			<canvas ref={canvasRef}></canvas>
		</div>
	);
}
