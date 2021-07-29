import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

// import Header from './layouts/Header';

import ChainReaction from './pages/chain-reaction/ChainReaction';
import About from './pages/About';
import Home from './pages/Home';

export default function Router() {
	return (
		<BrowserRouter>
			{/* <Header /> */}
			<div>
				<Switch>
					<Route path="/chainreaction">
						<ChainReaction />
					</Route>
					<Route path="/about">
						<About />
					</Route>
					<Route path="/">
						<Home />
					</Route>
				</Switch>
			</div>
		</BrowserRouter>
	);
}
