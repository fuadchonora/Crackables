import React from 'react';
import { Box, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
	rootGrid: {
		textAlign: 'center',
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	itemGrid: {
		minHeight: '20vh',
	},
	section: {
		height: '20vh',
		backgroundColor: '#1de9b6',
		color: '#212121',
		borderRadius: '34px',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		position: 'relative',
	},
	center_text: {
		width: '100%',
		margin: 0,
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
	},
}));

export default function Home() {
	const classes = useStyles();

	return (
		<div>
			<h1>
				<IconButton aria-label="delete" color="secondary">
					<HomeIcon fontSize="large" />
				</IconButton>
				Crackables
			</h1>
			<div>
				<Grid container spacing={4} className={classes.rootGrid}>
					<Grid item xs={12} className={classes.itemGrid}>
						<Link to="/chainreaction">
							<div className={classes.section}>
								<div className={classes.center_text}>
									<Box m={1}>
										<Typography style={{ fontWeight: 800 }} variant="h4" component="h2" gutterBottom>
											Chain Reaction
										</Typography>
									</Box>
								</div>
							</div>
						</Link>
					</Grid>

					<Grid item xs={12} className={classes.itemGrid}>
						<Link to="/puzzle">
							<div className={classes.section}>
								<div className={classes.center_text}>
									<Box m={1}>
										<Typography style={{ fontWeight: 800 }} variant="h4" component="h2" gutterBottom>
											Puzzle
										</Typography>
									</Box>
								</div>
							</div>
						</Link>
					</Grid>
				</Grid>
			</div>
		</div>
	);
}
