import React, { useRef, useEffect } from 'react';

import './css/style.css';
import CarLeft from './img/car-left.svg';
import CarRight from './img/car-right.svg';
import CircleLeft from './img/circle-left.svg';
import CircleRight from './img/circle-right.svg';
import SquareLeft from './img/square-left.svg';
import SquareRight from './img/square-right.svg';

import { gs, Car, Circle, Square, FogParticle } from './js/game';
import { enableUI, disableUI, resumeGame, pauseGame, randInt } from './js/game';

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

		//Utiliy Controls

		const randomObstacle = () => {
			const idx = randInt(0, 8, true);

			if ([0, 1, 2, 3].includes(idx))
				return {
					isCircle: true,
					obst: [0, 1].includes(idx) ? circleLeft : circleRight,
					x: gs.rWidth * idx,
				};
			if ([4, 5, 6, 7].includes(idx))
				return {
					isCircle: false,
					obst: [4, 5].includes(idx) ? squareLeft : squareRight,
					x: gs.rWidth * (idx - 4),
				};

			return null;
		};

		const touchXY = (e) => {
			if (!gs.UIEnabled) return;

			let { pageX, pageY } = e.targetTouches[0];
			let touchX = pageX - canvas.offsetLeft;
			let touchY = pageY - canvas.offsetTop;

			if (e.targetTouches.length > 1) {
				pageX = e.targetTouches[1].pageX;
				touchX = pageX - canvas.offsetLeft;
				touchY = pageY - canvas.offsetTop;
			}

			// console.log(`${touchX * dpr} < ${rWidthDouble}`);
			touchY && touchX * gs.dpr < gs.rWidthDouble ? gs.cars[0].toggle() : gs.cars[1].toggle();
		};

		//Implimentations
		const addObstacle = () => {
			if (gs.spawnInterval > 400) gs.spawnInterval -= gs.spawnSpeed;
			setTimeout(() => {
				addObstacle();
			}, gs.spawnInterval);

			let id = Math.random();
			let obstacle = randomObstacle();

			if (!gs.isRunning || !obstacle) {
				return;
			} else if (obstacle.isCircle) {
				gs.circles[id] = new Circle(
					ctx,
					id,
					obstacle.obst,
					obstacle.x + gs.rWidthQrtr,
					-gs.obstacleWidth,
					gs.obstacleWidth,
					gs.obstacleWidth
				);
			} else {
				gs.squares[id] = new Square(
					ctx,
					id,
					obstacle.obst,
					obstacle.x + gs.rWidthQrtr,
					-gs.obstacleWidth,
					gs.obstacleWidth,
					gs.obstacleWidth
				);
			}
		};
		const addFogParticle = () => {
			setTimeout(() => {
				addFogParticle();
			}, 1000 / gs.fogSettings.density);

			if (!gs.isRunning) return;

			let particleL = new FogParticle(
				ctx,
				gs.fogSettings.idx,
				gs.cars[0].x + gs.rWidthHalf,
				gs.cars[0].y + gs.cars[0].height
			);
			let particleR = new FogParticle(
				ctx,
				gs.fogSettings.idx + 1,
				gs.cars[1].x + gs.rWidthHalf,
				gs.cars[1].y + gs.cars[1].height
			);

			gs.fogParticles[particleL.id] = particleL;
			gs.fogParticles[particleR.id] = particleR;

			gs.fogSettings.idx += 2;
		};

		const init = () => {
			if (gs.windowWidth > 700) {
				gs.windowWidth = 400;
			}

			canvas.width = gs.dprWindowWidth;
			canvas.height = gs.dprWindowHeight;

			canvas.style.width = `${gs.windowWidth}px`;
			canvas.style.height = `${gs.windowHeight}px`;

			gs.rWidth = parseInt(gs.dprWindowWidth / 4); //single road width

			gs.rWidthDouble = parseInt(gs.dprWindowWidth / 2); //double road width
			gs.rWidthTriple = gs.rWidthDouble + gs.rWidth; //tripple road width

			gs.rWidthHalf = gs.rWidth / 2; //half road width
			gs.rWidthQrtr = gs.rWidth / 4; //quarter road width

			gs.obstacleWidth = parseInt(gs.rWidthHalf);

			gs.point = 0;
			gs.speed = 20;
			gs.spawnSpeed = 5;

			gs.cars = [];
			gs.circles = {};
			gs.squares = {};
			gs.fogParticles = {};
			gs.explosions = [];

			gs.cars.push(
				new Car(ctx, 0, true, carLeft, 0, gs.dprWindowHeight - gs.rWidthDouble, gs.rWidth, gs.rWidth)
			);
			gs.cars.push(
				new Car(
					ctx,
					1,
					false,
					carRight,
					gs.rWidthTriple,
					gs.dprWindowHeight - gs.rWidthDouble,
					gs.rWidth,
					gs.rWidth
				)
			);

			gs.isRunning = true;

			setTimeout(() => {
				addObstacle();
				addFogParticle();
			}, 1000);
		};

		//Animation Loop
		const update = () => {
			requestAnimationFrame(update);

			for (let i in gs.cars) {
				gs.cars[i].update();
			}
			for (let i in gs.circles) {
				gs.circles[i].update();
			}
			for (let i in gs.squares) {
				gs.squares[i].update();
			}
			for (let i in gs.fogParticles) {
				gs.fogParticles[i].update();
			}
			gs.explosions.forEach((explosion) => {
				explosion.update();
			});
		};
		const animate = () => {
			requestAnimationFrame(animate);

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			ctx.beginPath();
			ctx.fillStyle = '#25337a';
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			ctx.moveTo(gs.rWidth, 0);
			ctx.lineTo(gs.rWidth, canvas.height);
			ctx.moveTo(gs.rWidthDouble, 0);
			ctx.lineTo(gs.rWidthDouble, canvas.height);

			ctx.moveTo(gs.rWidthTriple, 0);
			ctx.lineTo(gs.rWidthTriple, canvas.height);

			ctx.strokeStyle = '#839bf3';
			ctx.lineWidth = 2;
			ctx.stroke();

			ctx.font = '100px Arial';
			ctx.fillStyle = 'white';
			ctx.textAlign = 'center';
			ctx.fillText(gs.point, canvas.width - 100, 100);

			ctx.closePath();

			gs.cars.forEach((car) => {
				car.draw();
			});
			for (let i in gs.circles) {
				gs.circles[i].draw();
			}
			for (let i in gs.squares) {
				gs.squares[i].draw();
			}
			for (let i in gs.fogParticles) {
				gs.fogParticles[i].draw();
			}
			gs.explosions.forEach((explosion) => {
				explosion.draw();
			});
		};

		const startOrRestartGame = () => {
			disableUI();
			init();
			update();
			animate();
			enableUI();
		};

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
