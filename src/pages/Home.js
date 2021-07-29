import React from 'react';
import { Button, Grid, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	gridContainer: {
		paddingTop: '100px',
	},
	gridItem: {
		textAlign: 'center',
		width: '60%',
	},
	btn: {
		marginTop: '20px',
		marginBottom: '20px',
	},
}));

export default function Home() {
	const classes = useStyles();

	return (
		<div>
			<h1>Crackables</h1>
			<div>
				<Grid container className={classes.gridContainer} justifyContent="center">
					<Grid item xs={4} className={classes.gridItem}>
						<Button className={classes.btn} color="inherit" fullWidth>
							<Link to="/chainreaction">Chain Reaction</Link>
						</Button>
						<Button className={classes.btn} color="inherit">
							<Link to="/25puzzle">25-Puzzle</Link>
						</Button>
					</Grid>
				</Grid>
			</div>
		</div>
	);
}
