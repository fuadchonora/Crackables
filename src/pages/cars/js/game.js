//Game Settings
export const gs = {
	windowWidth: window.innerWidth,
	windowHeight: window.innerHeight - 8,

	dpr: window.devicePixelRatio,
	dprWindowWidth: window.innerWidth * window.devicePixelRatio,
	dprWindowHeight: (window.innerHeight - 8) * window.devicePixelRatio,

	rWidth: 0,
	rWidthDouble: 0,
	rWidthTriple: 0,
	rWidthHalf: 0,
	rWidthQrtr: 0,
	obstacleWidth: 0,

	UIEnabled: false,
	isRunning: false,

	point: 0,
	speed: 0,
	spawnSpeed: 0,
	spawnInterval: 1000,

	fogSettings: {
		idx: 0,
		density: 20,
		minSize: 15,
		maxSize: 20,
		minSpeed: 10,
		maxSpeed: 20,
		gravity: 1,
		maxLife: 100,
	},

	explosionSettions: {
		density: 40,
		minSize: 10,
		maxSize: 20,
		minSpeed: 20,
		maxSpeed: 40,
	},

	cars: [],
	circles: {},
	squares: {},
	fogParticles: {},
	explosions: [],
};

const updatePoint = () => {
	gs.point++;
	console.log('Point:' + gs.point);

	gs.speed += 0.2;
};

const gameOver = () => {
	pauseGame();
	disableUI();
	console.log('Game Over! Point:' + gs.point);
};

const distance = (x1, y1, x2, y2) => {
	const xDistance = x2 - x1;
	const yDistance = y2 - y1;

	return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
};

//Utiliy Controls
export const enableUI = () => (gs.UIEnabled = true);
export const disableUI = () => (gs.UIEnabled = false);
export const resumeGame = () => (gs.isRunning = true);
export const pauseGame = () => (gs.isRunning = false);

// Returns an random integer, positive or negative
// between the given value
export const randInt = (min, max, positive) => {
	let num;
	if (!positive) {
		num = Math.floor(Math.random() * max) - min;
		num *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
	} else {
		num = Math.floor(Math.random() * max) + min;
	}

	return num;
};

//Objects
export class Car {
	constructor(ctx, id, isLeft, img, x, y, width, height) {
		this.ctx = ctx;
		this.id = id;
		this.isLeft = isLeft;
		this.isMOving = false;
		this.x = x;
		this.y = y;
		this.velocity = {
			x: 0,
			y: 0,
			angle: 0,
		};
		this.width = width;
		this.height = height;
		this.angle = 0;
		this.img = img;
	}

	toggle() {
		if (!gs.isRunning) return;

		if (this.isLeft) {
			//move right
			this.isLeft = false;
			this.velocity.angle = gs.speed / 4;
			this.velocity.x = gs.speed;
		} else {
			//move left
			this.isLeft = true;
			this.velocity.angle = -gs.speed / 4;
			this.velocity.x = -gs.speed;
		}
	}

	update() {
		if (!gs.isRunning) return;

		if (this.id === 0 && (this.x < 0 || this.x > gs.rWidth)) {
			this.velocity.x = 0;
			this.x = this.isLeft === true ? 0 : gs.rWidth;
		}
		if (this.id === 1 && (this.x < gs.rWidthDouble || this.x > gs.rWidthTriple)) {
			this.velocity.x = 0;
			this.x = this.isLeft === true ? gs.rWidthDouble : gs.rWidthTriple;
		}

		this.x += this.velocity.x;
		this.y += this.velocity.y;
		this.angle += this.velocity.angle;

		if (this.angle < 1 && this.angle > -1) {
			this.velocity.angle = 0;
			this.angle = 0;
		} else if (this.angle > 30) {
			this.velocity.angle = -gs.speed / 4;
		} else if (this.angle < -30) {
			this.velocity.angle = gs.speed / 4;
		}
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
		this.ctx.rotate((this.angle * Math.PI) / 180);
		this.ctx.fillStyle = 'red';
		this.ctx.drawImage(this.img, -this.width / 2, -this.height / 2, this.width, this.height);
		this.ctx.restore();
		this.ctx.closePath();
	}
}

export class Circle {
	constructor(ctx, id, img, x, y, width, height) {
		this.ctx = ctx;
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;
		this.isVisible = true;
	}

	blink() {
		let count = 1;
		let intrvl = setInterval(() => {
			this.isVisible = !this.isVisible;
			count++;
			if (count >= 9) clearInterval(intrvl);
		}, 250);
	}

	update() {
		if (!gs.isRunning) return;

		for (let i in gs.cars) {
			let dist = distance(this.x, this.y, gs.cars[i].x, gs.cars[i].y);
			if (dist - (this.height / 2 + gs.cars[i].height / 2) <= 0) {
				//circle collided with a car, add point
				updatePoint();
				delete gs.circles[this.id];
				delete this;
			}
		}

		if (this.y >= gs.cars[1].y + 100 * gs.dpr) {
			console.log('Circle Missed');
			gameOver();
			this.blink();
		}

		this.y += gs.speed;
	}

	draw() {
		if (!this.isVisible) return;

		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		this.ctx.restore();
		this.ctx.closePath();
	}
}
export class Square {
	constructor(ctx, id, img, x, y, width, height) {
		this.ctx = ctx;
		this.id = id;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.img = img;
	}

	update() {
		if (!gs.isRunning) return;

		for (let i in gs.cars) {
			let dist = distance(this.x, this.y, gs.cars[i].x, gs.cars[i].y);

			if (dist - (this.height / 2 + gs.cars[i].height / 2) + 50 <= 0) {
				console.log('Square Collided');
				//create explosion
				let isL = this.x < gs.rWidthDouble ? true : false;
				let expl = new Explosion(this.ctx, this.x, this.y, isL);
				gs.explosions.push(expl);
				gameOver();
				delete gs.squares[this.id];
				delete this;
			}
		}

		if (gs.dprWindowHeight - this.y <= 0) {
			//remove this obstacle from the squares-object and delete it
			delete gs.squares[this.id];
			delete this;
		}

		this.y += gs.speed;
	}

	draw() {
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		this.ctx.restore();
		this.ctx.closePath();
	}
}
//fog particle
export class FogParticle {
	constructor(ctx, id, x, y) {
		this.ctx = ctx;
		this.id = id;
		this.x = x;
		this.y = y;
		this.xv = randInt(gs.fogSettings.minSpeed, gs.fogSettings.maxSpeed, false);
		this.yv = randInt(gs.fogSettings.minSpeed, gs.fogSettings.maxSpeed, true);
		this.size = randInt(gs.fogSettings.minSize, gs.fogSettings.maxSize, true);
	}

	update() {
		this.x += this.xv;
		this.y += this.yv;

		// Adjust for gravity
		this.yv += gs.fogSettings.gravity;

		// Age the particle
		this.life++;

		// If Particle is old, remove it
		if (this.life >= gs.fogSettings.maxLife) {
			delete gs.fogParticles[this.id];
		}
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.fillStyle = '#ffffff';
		this.ctx.rect(this.x, this.y, this.size, this.size);
		this.ctx.closePath();
		this.ctx.fill();
	}
}
// Particle
export class ExplosionParticle {
	constructor(x, y, isL, isWhite) {
		this.x = x + gs.rWidthQrtr;
		this.y = y + gs.rWidthQrtr;
		this.xv = randInt(gs.explosionSettions.minSpeed, gs.explosionSettions.maxSpeed, false);
		this.yv = randInt(gs.explosionSettions.minSpeed, gs.explosionSettions.maxSpeed, false);
		this.size = randInt(gs.explosionSettions.minSize, gs.explosionSettions.maxSize, true);
		this.r = isWhite === false ? (isL === true ? 240 : 0) : 255;
		this.g = isWhite === false ? (isL === true ? 58 : 170) : 255;
		this.b = isWhite === false ? (isL === true ? 98 : 195) : 255;
	}
}
// Explosion
export class Explosion {
	constructor(ctx, x, y, isL) {
		this.ctx = ctx;
		this.particles = [];
		for (let i = 0; i < gs.explosionSettions.density; i++) {
			let isWhite = i % 3 === 0 ? true : false;
			this.particles.push(new ExplosionParticle(x, y, isL, isWhite));
		}
	}

	update() {
		if (this.particles.length === 0) return;

		const particlesAfterRemoval = this.particles.slice();
		for (let ii = 0; ii < this.particles.length; ii++) {
			const particle = this.particles[ii];

			// Check particle size
			// If 0, remove
			if (particle.size <= 0) {
				particlesAfterRemoval.splice(ii, 1);
				continue;
			}

			// Update
			particle.x += particle.xv;
			particle.y += particle.yv;
			particle.size -= 0.1;
		}

		this.particles = particlesAfterRemoval;
	}

	draw() {
		if (this.particles.length === 0) return;

		for (let ii = 0; ii < this.particles.length; ii++) {
			const particle = this.particles[ii];

			if (particle.size <= 0) continue;

			this.ctx.beginPath();
			this.ctx.rect(particle.x, particle.y, particle.size, particle.size);
			this.ctx.closePath();
			this.ctx.fillStyle = `rgb(${particle.r},${particle.g},${particle.b})`;
			this.ctx.fill();
		}
	}
}
