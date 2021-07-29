import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
	root: {
		flex: '1 1 auto',
		flexGrow: 1,
	},
	appBar: {
		background: 'transparent',
		boxShadow: 'none',
	},
	toolBar: {
		padding: '0px',
	},
	button: {
		margin: '10px',
		padding: theme.spacing(2),
		backgroundColor: '#444444',
		borderRadius: '15px',
		'&:hover': {
			backgroundColor: '#444444',
		},
	},
	menuButton: {},
	accountButton: {},
}));

export default function Header() {
	const classes = useStyles();
	return (
		<div className={classes.root}>
			<AppBar className={classes.appBar}>
				<Toolbar className={classes.toolBar}>
					<IconButton edge="start" className={classes.button} style={{ float: 'left' }} color="inherit">
						<MenuIcon />
					</IconButton>
					<IconButton edge="end" className={classes.button} style={{ float: 'right' }} color="inherit">
						<MenuIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
		</div>
	);
}
