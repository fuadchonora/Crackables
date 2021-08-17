import { IconButton, makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	head: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	body: {
		paddingLeft: theme.spacing(4),
		paddingRight: theme.spacing(4),
	},
}));

export default function ChainReactionStart({ setIsStarted, setgameConfig }) {
	const classes = useStyles();

	const [gridSize, setGridSize] = useState({ x: 6, y: 12 });
	const [players, setPlayers] = useState(2);

	const handleStartClick = (e) => {
		setgameConfig({ players, gridSize });
		setIsStarted(true);
	};

	const handleGridSizeChange = (e) => {
		setGridSize(JSON.parse(e.target.value));
	};

	const handlePlayersChange = (e) => {
		setPlayers(parseInt(e.target.value));
	};

	return (
		<div>
			<div className={classes.head}>
				<h1>
					<IconButton aria-label="delete" color="secondary" component={Link} to="/">
						<ArrowBackIcon fontSize="large" />
					</IconButton>
					Chain Reaction
				</h1>
			</div>

			<div className={classes.body}>
				<label>Grid Size</label>
				<select type="number" defaultValue="{ x: 6, y: 12 }" onChange={handleGridSizeChange}>
					<option value="{ x: 6, y: 12 }">6 X 12</option>
				</select>

				<br></br>

				<label>Players</label>
				<select type="number" defaultValue="2" onChange={handlePlayersChange}>
					<option value="2">2</option>
					<option value="3">3</option>
					<option value="4">4</option>
					<option value="5">5</option>
					<option value="6">6</option>
					<option value="7">7</option>
					<option value="8">8</option>
				</select>

				<br></br>

				<button onClick={handleStartClick}>Start</button>
			</div>
		</div>
	);
}
