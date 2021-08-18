import React from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
	title: {
		paddingLeft: theme.spacing(2),
		paddingRight: theme.spacing(2),
	},
}));

export default function Title({ title, Icon, to }) {
	const classes = useStyles();

	return (
		<div className={classes.title}>
			<h1 className="noselect">
				<IconButton aria-label="delete" color="secondary" component={to && Link} to={to && to}>
					<Icon fontSize="large" />
				</IconButton>
				{title}
			</h1>
		</div>
	);
}
