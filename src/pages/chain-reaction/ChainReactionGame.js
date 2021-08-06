import React, { useRef, useEffect } from 'react';

const colors = ['red', 'blue', 'green', 'yellow', 'cyan', 'magenta', 'orange', 'gray'];

let players = [];
let grids = [];
let explosions = [];

let currentPlayer = null;
let isFirstPlayersCycle = false;
let clickable = true;
let isGameOver = false;

class Player {
	constructor(i) {
		this.id = Math.random();
		this.color = colors[i];
		this.circles = [];
	}
}

class Grid {
	constructor(index, column, row, x, y) {
		this.index = index;
		this.column = column;
		this.row = row;
		this.x = x;
		this.y = y;
		this.splitsTo = [];
		this.circles = [];
	}
}

class Circle {
	constructor(x, y, player) {
		this.x = x;
		this.y = y;
		this.player = player;
	}

	move(x, y) {
		this.x = x;
		this.y = y;
	}

	changePlayer(player) {
		this.player = player;
	}
}

const generateInitialGrids = (p, gw, gh, gameConfig) => {
	let grids = [];
	for (let i = 0; i < gameConfig.gridSize.x; i++) {
		for (let j = 0; j < gameConfig.gridSize.y; j++) {
			grids.push(new Grid(grids.length, i, j, (i + 1) * gw - 2 * p, (j + 1) * gh - 2 * p));
		}
	}

	for (let i = 0; i < grids.length; i++) {
		if (grids[i].column - 1 >= 0) {
			let splitsToIdx = grids.findIndex(
				(grid) => grid.column === grids[i].column - 1 && grid.row === grids[i].row
			);
			grids[i].splitsTo.push(splitsToIdx);
		}
		if (grids[i].column + 1 < gameConfig.gridSize.x) {
			let splitsToIdx = grids.findIndex(
				(grid) => grid.column === grids[i].column + 1 && grid.row === grids[i].row
			);
			grids[i].splitsTo.push(splitsToIdx);
		}
		if (grids[i].row - 1 >= 0) {
			let splitsToIdx = grids.findIndex(
				(grid) => grid.column === grids[i].column && grid.row === grids[i].row - 1
			);
			grids[i].splitsTo.push(splitsToIdx);
		}
		if (grids[i].row + 1 < gameConfig.gridSize.y) {
			let splitsToIdx = grids.findIndex(
				(grid) => grid.column === grids[i].column && grid.row === grids[i].row + 1
			);
			grids[i].splitsTo.push(splitsToIdx);
		}
	}

	return grids;
};

const generateInitialPlayers = (gameConfig) => {
	let players = [];
	for (let i = 0; i < gameConfig.players; i++) players.push(new Player(i));
	currentPlayer = players[0];
	return players;
};

export default function ChainReactionGame({ gameConfig, setIsStarted }) {
	//one grid's width and height
	let smallestLength = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
	let gw = Math.round((smallestLength - 60) / gameConfig.gridSize.x);
	let gh = Math.round((smallestLength - 60) / gameConfig.gridSize.x);
	//grid width and height
	let bw = gameConfig.gridSize.x * gw;
	let bh = gameConfig.gridSize.y * gh;
	//padding around grid
	let p = Math.round(gw / 6);
	//size of canvas
	let cw = bw + p * 2 + 1;
	let ch = bh + p * 2 + 1;

	grids = generateInitialGrids(p, gw, gh, gameConfig);
	players = generateInitialPlayers(gameConfig);

	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		context.translate(0.5, 0.5);

		let frameCount = 0;
		let animationFrameId;
		isGameOver = false;

		const drawGrids = (ctx) => {
			for (let x = 0; x <= bw; x += gw) {
				ctx.moveTo(x + p, p);
				ctx.lineTo(x + p, bh + p);
			}

			for (let x = 0; x <= bh; x += gh) {
				ctx.moveTo(p, x + p);
				ctx.lineTo(bw + p, x + p);
			}

			ctx.strokeStyle = players.find((player) => player === currentPlayer).color;
			ctx.stroke();
		};

		const draw = (ctx, frameCount) => {
			let explodedToIds = [];

			explosions.map((explosion) =>
				explosion.arcs.map((arc) => {
					ctx.fillStyle = explosion.color;
					ctx.beginPath();
					ctx.arc(arc.curX, arc.curY, p, 0, 2 * Math.PI);
					ctx.fill();

					explodedToIds.push(arc.tarGridIdx);

					if (arc.tarX > arc.curX) arc.curX += 3;
					else if (arc.tarX < arc.curX) arc.curX -= 3;

					if (arc.tarY > arc.curY) arc.curY += 3;
					else if (arc.tarY < arc.curY) arc.curY -= 3;

					return true;
				})
			);

			grids.map((grid) =>
				grid.circles.map((circle, index) => {
					if (explodedToIds.includes(grid.index) && index === grid.circles.length - 1) return true;

					ctx.fillStyle = circle.player.color;
					ctx.beginPath();
					ctx.arc(
						grid.x + p * Math.sin(frameCount * 0.02 * grid.circles.length) * (index % 2),
						grid.y + p * Math.sin(frameCount * 0.02 * grid.circles.length) * (index + (1 % 2)),
						p,
						0,
						2 * Math.PI
					);
					ctx.fill();
					// ctx.font = '24px serif';
					// ctx.fillText(grid.circles.length, grid.x + p, grid.y + 2 * p);
					return true;
				})
			);
		};

		const refineGrids = (gridIdx) => {
			return new Promise((resolve, reject) => {
				console.log('refine started for gridIdx ' + gridIdx);

				if (isGameOver) return resolve();

				let grid = grids[gridIdx];
				let toRefineIds = [];

				createExplosion(grid);

				grid.splitsTo.forEach(function (splitsToIdx) {
					grids[splitsToIdx].circles.push(grid.circles[0]);
					grids[splitsToIdx].circles.map((circle) => circle.changePlayer(grid.circles[0].player));
					if (grids[gridIdx].circles.length > 0) grids[gridIdx].circles.shift();

					if (grids[splitsToIdx].circles.length === grids[splitsToIdx].splitsTo.length) {
						toRefineIds.push(splitsToIdx);
					}
				});

				checkGameStatus();

				let promises = [];
				if (toRefineIds.length > 0) {
					setTimeout(() => {
						toRefineIds.forEach((splitsToIdx) => {
							promises.push(refineGrids(splitsToIdx));
							return true;
						});
					}, 500);

					setTimeout(() => {
						Promise.all(promises).then(resolve).catch(reject);
					}, 500 * toRefineIds.length + 500);
				} else {
					resolve();
				}
			});
		};

		const createExplosion = (grid) => {
			let explosion = {
				id: grid.index,
				color: grid.circles[0].player.color,
				startX: grid.x,
				startY: grid.y,
				arcs: [],
			};
			grid.splitsTo.map((splitsToIdx) =>
				explosion.arcs.push({
					curX: grid.x,
					curY: grid.y,
					tarX: grids[splitsToIdx].x,
					tarY: grids[splitsToIdx].y,
					tarGridIdx: grids[splitsToIdx].index,
				})
			);
			explosions.push(explosion);
			setTimeout(() => {
				explosions.splice(
					explosions.findIndex((exp) => exp.id === explosion.id),
					1
				);
			}, 500);
		};

		const checkGameStatus = () => {
			if (isFirstPlayersCycle) return false;

			let foundPlayers = [];

			grids.map((grid) =>
				grid.circles.map((circle) => {
					if (!foundPlayers.includes(circle.player)) foundPlayers.push(circle.player);
					return true;
				})
			);

			let newPlayers = [...players];
			players.map((player) => {
				if (!foundPlayers.includes(player)) {
					let playerIdx = newPlayers.findIndex((pl) => pl === player);
					newPlayers.splice(playerIdx, 1);
					console.log('removed player ', player);
					if (player.color === currentPlayer.color) changeCurrentPlayer();
					if (newPlayers.length === 1) {
						console.log('GameOver GameOver GameOver GameOver GameOver GameOver');
						setTimeout(() => {
							isGameOver = true;
						}, 1000);
					}
				}
				return true;
			});
			players = newPlayers;
		};

		const changeCurrentPlayer = () => {
			let currentPlayerIdx = players.findIndex((player) => player === currentPlayer);

			if (currentPlayerIdx !== 0 && !currentPlayerIdx) {
				return console.error('player is undefined');
			} else if (currentPlayerIdx === players.length - 1) {
				currentPlayer = players[0];
				isFirstPlayersCycle = false;
			} else {
				currentPlayer = players[currentPlayerIdx + 1];
			}
		};

		//Our draw came here
		const render = () => {
			frameCount++;
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
			if (!isGameOver) {
				drawGrids(context);
				draw(context, frameCount);
			} else {
				//render game over
				context.fillStyle = players[0].color;
				context.textAlign = 'center';
				context.font = '48px Poppins';
				context.fillText(
					`${players[0].color.toUpperCase()} Wins!`,
					context.canvas.width / 2,
					context.canvas.height / 2
				);
			}
			animationFrameId = window.requestAnimationFrame(render);
		};
		render();

		//Events
		canvas.addEventListener(
			'click',
			(e) => {
				console.log('(' + clickable + ') clicked ' + e.pageX, +' ' + e.pageY);
				if (isGameOver) {
					//go home
					setIsStarted(false);
				} else if (clickable) {
					clickable = false;
					let player = players.find((player) => player === currentPlayer);
					let clickedX = e.pageX - 2 * p;
					let clickedY = e.pageY - 2 * p;

					let gridIdx = 0;
					for (let i = 0; i < grids.length; i++) {
						let grid = grids[i];
						if (clickedX <= grid.x + 2 * p && clickedY <= grid.y + 2 * p) {
							if (grids[i].circles.length > 0) {
								if (grids[i].circles[0].player !== player) {
									console.log('clicked on wrong grid');
									clickable = true;
									return;
								}
							}

							grids[i].circles.push(new Circle(grid.x, grid.y, player));
							gridIdx = i;
							break;
						} else if (i === grids.length - 1) {
							console.log('clicked outside the grid');
							clickable = true;
							return;
						}
					}

					let clickedGrid = grids[gridIdx];
					if (clickedGrid.circles.length === clickedGrid.splitsTo.length) {
						//split circles
						refineGrids(gridIdx)
							.then(() => {
								console.log('All Grids Refined');
								changeCurrentPlayer();
								clickable = true;
							})
							.catch(console.error);
					} else {
						changeCurrentPlayer();
						clickable = true;
					}
				}
			},
			false
		);

		return () => {
			window.cancelAnimationFrame(animationFrameId);
		};
	});

	return (
		<div>
			<canvas ref={canvasRef} width={cw} height={ch}></canvas>
		</div>
	);
}
