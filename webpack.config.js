// Default @wordpress/scripts setup (one entry per block.json) plus the
// editor panel for events, which isn't a block.
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const blockEntries =
	typeof defaultConfig.entry === 'function'
		? defaultConfig.entry()
		: defaultConfig.entry;

module.exports = {
	...defaultConfig,
	entry: {
		...blockEntries,
		'event-fields/index': './src/event-fields/index.js',
	},
};
