/**
 * @see https://github.com/EnotionZ/GpiO
 */
const gpio = require("gpio");

module.exports = class RealyBoard {
	
	/**
	 * The RelayBoard class gives acceess th a relay boary extension 
	 * for the raspberry pi simgle board computer.
	 * 
	 * @example ```js
	 *   let relayBoard = new RelayBoard()
	 *     .then((id, value) => {
	 *       console.log("Relay Board initialized!")
	 *     })
	 *     .catch(console.error);
	 * ```
	 * 
	 * @param {array<number>} channelIos array of pins. See the configuration of the Relays Board
	 * 
	 * @returns {Promise} Promise object represents the sum of a and b
	 */
	constructor(channelIos = [ 24, 25, 28, 29 ]) {
		this.channels = [];
		this.promises = [];

		/* error handling */
		if (!channelIos || typeof(channelIos) !== 'array') {
			throw new Error(`invalid parameter "channelIos". Must be an array of numbers between [1..29], was "${JSON.stringify(channelIos)}"`);
		}
	
		/* initialize all gpio-pins as OUTOUT. */
		channelIos.forEach((io) => {
			let promise = new Promise((resolve, reject) => {
				try {
					let channel = gpio.export(io, {
						direction: 'out',
						ready: resolve
					});
					this.channels.push(channel);
				} catch(e) {
					reject(e);
				}
			});
			this.promises.push(promise);
		});
		return Promise.all(this.promises);
	}

	/**
	 * Set the given channel to the given value.
	 * 
	 * @param {number} channelId 
	 * @param {boolean} value 
	 */
	set(channelId, value = true) {
		return new Promise((resolve, reject) => {
			const channel = this.channels[channelId];
			try {
				channel.set(value, resolve);
			} catch(e) {
				reject(e);
			}
		});
	}

	/**
	 * Resets the relay state
	 * Same as `set(<channelNumber>, false);`
	 * @param {number} channelId
	 */
	reset(channelId) {
		return this.set(channelId, false);
	}

	/**
	 * Toogle the state of the value.
	 * TRUE becomes false and FALSE becomes TRUE;
	 * @param {number} channelId 
	 */
	toggle(channelId) {
		const value = this.channels[channelId].value;
		return this.set(channelId, !value);
	}

	/**
	 * @see https://github.com/EnotionZ/GpiO#api-methods
	 */
	unexport() {
		this.channels.forEach((channel) => channel.unexport());
	}
}