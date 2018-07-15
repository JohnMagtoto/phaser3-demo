import { AUTO, Scene, Game, Physics, Input, GameObjects } from 'phaser';

const SKY = 'sky';
const GROUND = 'ground';
const STAR = 'star';
const BOMB = 'bomb';
const DUDE = 'dude';

export class MainScene extends Scene {
	private _platforms: Physics.Arcade.StaticGroup;
	private _player: Physics.Arcade.Sprite;
	private _cursors: any;
	private _stars: Physics.Arcade.Group;
	private _bombs: Physics.Arcade.Group;

	private _score = 0;
	private _scoreText: GameObjects.Text;

	private gameOver = false;

	constructor() {
		super({
			key: 'MainScene'
		});
	}

	preload() {
		// load resources
		this.load.image(SKY, './assets/sky.png');
		this.load.image(GROUND, './assets/platform.png');
		this.load.image(STAR, './assets/star.png');
		this.load.image(BOMB, './assets/bomb.png');
		this.load.spritesheet(DUDE, './assets/dude.png', {
			frameWidth: 32,
			frameHeight: 48
		});
	}

	create() {
		// Add the sky
		this.add.image(400, 300, SKY);

		// Create immovable platform elements
		this._platforms = this.physics.add.staticGroup();
		this._platforms
			.create(400, 568, GROUND)
			.setScale(2)
			.refreshBody();
		this._platforms.create(600, 400, GROUND);
		this._platforms.create(50, 250, GROUND);
		this._platforms.create(750, 220, GROUND);

		// Add the player sprite
		this._player = this.physics.add.sprite(100, 450, DUDE);
		this._player.setBounce(0.2);
		this._player.setCollideWorldBounds(true);
		// Set animation key frames
		// Left facing direction
		this.anims.create({
			key: 'left',
			frames: this.anims.generateFrameNumbers(DUDE, {
				start: 0,
				end: 3
			}),
			frameRate: 10,
			repeat: -1
		});
		// Front (turning) facing direction
		this.anims.create({
			key: 'turn',
			frames: [{ key: DUDE, frame: 4 }],
			frameRate: 20
		});
		// Right facing direction
		this.anims.create({
			key: 'right',
			frames: this.anims.generateFrameNumbers(DUDE, {
				start: 5,
				end: 8
			}),
			frameRate: 10,
			repeat: -1
		});

		// Add stars
		this._stars = this.physics.add.group({
			key: STAR,
			repeat: 10,
			setXY: { x: 12, y: 0, stepX: 70 }
		});
		this._stars.children.iterate((child) => {
			child.setBounce(Phaser.Math.FloatBetween(0.4, 0.8));
		}, null);

		// Add collision mechanism for player and platform
		this.physics.add.collider(this._player, this._platforms);

		// Add collistion mechanism for stars and platform
		this.physics.add.collider(this._stars, this._platforms);
		// Add overlap action
		this.physics.add.overlap(
			this._player,
			this._stars,
			this._collectStar,
			null,
			this
		);

		// Add keyboard controls
		this._cursors = this.input.keyboard.createCursorKeys();

		// Add Score text
		this._scoreText = this.add.text(16, 16, 'score: 0', {
			fontSize: '32px',
			fill: '#000'
		});

		// Add enemy bombs
		this._bombs = this.physics.add.group();

		this.physics.add.collider(this._bombs, this._platforms);

		this.physics.add.collider(
			this._player,
			this._bombs,
			this._hitBomb,
			null,
			this
		);
	}

	update() {
		if (this.gameOver) {
			return;
		}
		// Create keyboard bound actions
		if (this._cursors.left.isDown) {
			this._player.setVelocityX(-160);
			this._player.anims.play('left', true);
		} else if (this._cursors.right.isDown) {
			this._player.setVelocityX(160);
			this._player.anims.play('right', true);
		} else {
			this._player.setVelocityX(0);
			this._player.anims.play('turn');
		}

		if (this._cursors.up.isDown && this._player.body.touching.down) {
			this._player.setVelocityY(-330);
		}
	}

	private _collectStar(player: any, star: any) {
		star.disableBody(true, true);

		// Log score
		this._score += 10;
		this._scoreText.setText('score: '.concat(this._score.toString()));

		if (this._stars.countActive(true) === 0) {
			this._stars.children.iterate((child) => {
				child.enableBody(true, child.x, 0, true, true);
			}, null);

			var x =
				this._player.x < 400
					? Phaser.Math.Between(400, 800)
					: Phaser.Math.Between(0, 400);

			let bomb = this._bombs.create(x, 16, 'bomb');
			bomb.setBounce(1);
			bomb.setCollideWorldBounds(true);
			bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
			bomb.allowGravity = false;
		}
	}

	private _hitBomb(player: any, bom: any) {
		this.physics.pause();

		player.setTint(0xff0000);

		player.anims.play('turn');

		this.gameOver = true;
	}
}

const config: GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 300 },
			debug: false
		}
	},
	scene: [MainScene]
};

new Game(config);
