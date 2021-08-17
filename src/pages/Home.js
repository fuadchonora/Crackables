import React from 'react';
import { Box, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';
import HomeIcon from '@material-ui/icons/Home';

const useStyles = makeStyles((theme) => ({
	head: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
	rootGrid: {
		textAlign: 'center',
		padding: theme.spacing(4),
	},
	itemGrid: {
		minHeight: '20vh',
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
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

const games = [
	{ title: 'Chain Reaction', to: '/chainreaction' },
	{ title: 'Puzzle', to: '/puzzle' },
	{ title: 'Cars', to: '/cars' },
];

export default function Home() {
	const classes = useStyles();

	return (
		<div>
			<div className={classes.head}>
				<h1>
					<IconButton aria-label="delete" color="secondary">
						<HomeIcon fontSize="large" />
					</IconButton>
					Crackables
				</h1>
			</div>
			<div>
				<Grid container spacing={0} className={classes.rootGrid}>
					{games.map((game) => (
						<Grid item xs={12} className={classes.itemGrid} key={game.to}>
							<Link to={game.to}>
								<div className={classes.section}>
									<div className={classes.center_text}>
										<Box m={1}>
											<Typography style={{ fontWeight: 800 }} variant="h4" component="h2" gutterBottom>
												{game.title}
											</Typography>
										</Box>
									</div>
								</div>
							</Link>
						</Grid>
					))}
				</Grid>
			</div>
		</div>
	);
}
