import React, { useState } from 'react';

import ChainReactionStart from './ChainReactionStart';
import ChainReactionGame from './ChainReactionGame';

export default function ChainReaction() {
	const [isStarted, setIsStarted] = useState(false);
	const [gameConfig, setgameConfig] = useState({ players: 4, gridSize: { x: 6, y: 12 } });

	return (
		<div>
			{isStarted ? (
				<ChainReactionGame gameConfig={gameConfig} setIsStarted={setIsStarted} />
			) : (
				<ChainReactionStart setIsStarted={setIsStarted} setgameConfig={setgameConfig} />
			)}
		</div>
	);
}
