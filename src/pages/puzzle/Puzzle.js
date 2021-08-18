import React, { useState, useEffect } from 'react';
import { IconButton } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import RestartIcon from '@material-ui/icons/Replay';
import './Puzzle.css';
import Title from '../../components/Title';

let tileSize = 100;
let size = 5;
let matrix = [];
let uiEnabled = false;

let freeTilePos = { x: 0, y: 0 };
let posSet = [];
let tiles = [];

let startTime = new Date();
let timeRunning = true;

const Tile = ({ no }) => (
	<div id={'tile-' + no} className="tile flex-center flex-column">
		{no}
	</div>
);

export default function Puzzle() {
	const [isInited, setIsInited] = useState(false);
	const [title, setTitle] = useState('Slide It & Win');

	useEffect(() => {
		console.log('rendering');

		const timeDOM = document.getElementById('timeDOM');
		const gameContainer = document.getElementById('gameContainer');
		const restartGameBtn = document.getElementById('restartGame');

		tileSize = 100;
		size = 5;
		matrix = [];
		uiEnabled = false;

		freeTilePos = { x: 0, y: 0 };
		posSet = [];
		tiles = [];

		startTime = new Date();
		timeRunning = true;

		if (window.innerWidth < 700) {
			tileSize = 50;

			gameContainer.style.width = tileSize * size;
			gameContainer.style.height = tileSize * size;
		}

		const initPosSet = () => {
			for (let i = 0; i < size; i++) {
				for (let j = 0; j < size; j++) {
					let set = {
						x: j * tileSize,
						y: i * tileSize,
					};
					posSet.push(set);
				}
			}
		};

		const initMatrix = () => {
			let tileNo = 1;
			for (let idR = 0; idR < size; idR++) {
				matrix[idR] = [];
				for (let idC = 0; idC < size; idC++) {
					if (idR === size - 1 && idC === size - 1) {
						matrix[idR][idC] = null;
						return;
					}
					matrix[idR][idC] = tileNo;
					tileNo++;
				}
			}
		};

		const setTiles = () => {
			let tileNo = 1;

			for (let idR in matrix) {
				let row = matrix[idR];
				for (let idC in row) {
					if (matrix[idR][idC] === null) {
						freeTilePos.x = idC * tileSize;
						freeTilePos.y = idR * tileSize;
					} else {
						let x = idC * tileSize;
						let y = idR * tileSize;

						tiles.push({ no: tileNo, x, y });
						tileNo++;
					}
				}
			}
		};

		const shufleTiles = () => {
			disableUI();
			resetTime();

			let posSetTemp = [...posSet];

			tiles.map((tile) => {
				let idX = Math.floor(Math.random() * posSetTemp.length);

				let x = posSetTemp[idX]['x'];
				let y = posSetTemp[idX]['y'];

				tile.x = x;
				tile.y = y;

				posSetTemp.splice(idX, 1);
				document.getElementById('tile-' + tile.no).style.transform = `translate(${x}px, ${y}px)`;

				return true;
			});

			freeTilePos.x = posSetTemp[0]['x'];
			freeTilePos.y = posSetTemp[0]['y'];

			setTitle('Slide It & Win');
			enableUI();
		};

		const moveTile = (tile) => {
			let tileNo = parseInt(tile.innerHTML);
			let { no, x, y } = tiles.find((tile) => tile.no === tileNo);

			if (
				((x === freeTilePos.x - tileSize || x === freeTilePos.x + tileSize) && y === freeTilePos.y) ||
				((y === freeTilePos.y - tileSize || y === freeTilePos.y + tileSize) && x === freeTilePos.x)
			) {
				console.log('moving tile ' + tileNo + ' to ', freeTilePos.x, freeTilePos.y);
				document.getElementById(
					'tile-' + tileNo
				).style.transform = `translate(${freeTilePos.x}px, ${freeTilePos.y}px)`;

				let tileIndex = tiles.findIndex((tile) => tile.no === no);
				tiles[tileIndex].x = freeTilePos.x;
				tiles[tileIndex].y = freeTilePos.y;

				freeTilePos.x = x;
				freeTilePos.y = y;

				setTimeout(function () {
					checkStatus();
				}, 500);
			}
		};

		const enableUI = () => {
			// console.log('enabling ui');
			uiEnabled = true;
		};

		const disableUI = () => {
			// console.log('disabling ui');
			uiEnabled = false;
		};

		const checkStatus = () => {
			let status = false;

			for (let i = 0; i < tiles.length; i++) {
				let tile = tiles[i];

				if (tile.x === posSet[i]['x'] && tile.y === posSet[i]['y']) {
					// console.log(`${tile.no}  ${tile.x} === ${posSet[i]['x']} && ${tile.y} === ${posSet[i]['y']}`);
					status = true;
				} else {
					status = false;
					break;
				}
			}

			if (status === true) {
				disableUI();
				pauseTime();
				setTitle('SYou Won It.');
				console.log('-----------------Game Over-----------------');
			} else {
				enableUI();
			}
		};

		const pauseTime = () => {
			console.log('pausing time');
			timeRunning = false;
		};

		const resetTime = () => {
			startTime = new Date();
			timeRunning = true;
		};

		setInterval(() => {
			if (timeRunning) {
				let time = new Date() - startTime;
				// winTime = time;
				time = new Date(time).toISOString().slice(11, -1);
				timeDOM.innerHTML = time;
			}
		}, 102);

		// gameContainer.addEventListener('mousedown', function (event) {
		// 	if (event.target.className.includes('tile')) {
		// 		// console.log('tile clicked');
		// 		if (uiEnabled === true) {
		// 			moveTile(event.target);
		// 		}
		// 	}
		// });

		gameContainer.addEventListener('touchstart', function (event) {
			if (event.target.className.includes('tile')) {
				console.log('tile touched');
				if (uiEnabled === true) {
					moveTile(event.target);
				}
			}
		});

		restartGameBtn.addEventListener('click', function (event) {
			shufleTiles();
		});

		disableUI();
		initMatrix();
		initPosSet();
		setTiles();

		setIsInited(true);

		setTimeout(() => {
			shufleTiles();
		}, 0);
	}, []);

	return (
		<>
			<Title title={title} Icon={ArrowBackIcon} to={'/'} />

			<div style={{ height: '70vh' }}>
				<div className="flex-center flex-column">
					<h5 id="timeDOM" className="time noselect">
						00:00:00.000
					</h5>

					<div className="main-container flex-center flex-column">
						<div id="gameContainer" className="game-container noselect">
							{isInited && tiles.map((tile) => <Tile no={tile.no} key={tile.no} />)}
						</div>
					</div>

					<div>
						<IconButton aria-label="delete" color="secondary" id="restartGame">
							<RestartIcon fontSize="large" />
						</IconButton>
					</div>
				</div>
			</div>
		</>
	);
}
