/**
 * @see https://github.com/EnotionZ/GpiO
 */
//const gpio = require("gpio");

const Gpio = require('onoff').Gpio;

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
		this.relays = [];

		/* error handling */
		if (!channelIos || !channelIos.length) {
			throw new Error(`invalid parameter "channelIos". Must be an array of numbers between [1..29], was "${JSON.stringify(channelIos)}"`);
		}
	
		/* initialize all gpio-pins as OUTOUT. */
		channelIos.forEach((io) => this.relays.push(new Gpio(io, 'out')) );

		/* "Destructor" */
		process.on('SIGINT', () => {
			this.unexport();
		});
	}

	/**
	 * Set the given relay to the given value.
	 * 
	 * @param {number} relayId 
	 * @param {boolean} value 
	 */
	set(relayId, value = true) {
		const relay = this.relays[relayId];
		relay.writeSync(value);
	}

	/**
	 * Resets the relay state
	 * Same as `set(<channelNumber>, false);`
	 * 
	 * @param {number} relayId
	 */
	reset(relayId) {
		return this.set(relayId, false);
	}

	/**
	 * Toogle the state of the value.
	 * TRUE becomes false and FALSE becomes TRUE;
	 * 
	 * @param {number} relayId 
	 */
	toggle(relayId) {
		const value = this.relays[relayId].value;
		return this.set(relayId, !value);
	}

	/**
	 * @see https://github.com/EnotionZ/GpiO#api-methods
	 */
	unexport() {
		this.relays.forEach((relay) => relay.unexport());
	}
}