<?php
/**
 * Plugin Name:       Intranet Blocks
 * Description:       Gutenberg blocks for an employee intranet: portal carousel, announcement bar, quick links, key numbers, events with region filters, news, video gallery and a searchable document accordion.
 * Version:           2.1.0
 * Requires at least: 6.6
 * Requires PHP:      7.4
 * Author:            Martina Rafat
 * License:           GPL-2.0-or-later
 * Text Domain:       intranet-blocks
 *
 * @package IntranetBlocks
 */

defined( 'ABSPATH' ) || exit;

define( 'IB_VERSION', '2.1.0' );
define( 'IB_FILE', __FILE__ );
define( 'IB_DIR', plugin_dir_path( __FILE__ ) );

require IB_DIR . 'includes/class-ib-icons.php';
require IB_DIR . 'includes/class-ib-events.php';
require IB_DIR . 'includes/class-ib-settings.php';
require IB_DIR . 'includes/class-ib-samples.php';

IB_Events::init();
IB_Settings::init();
IB_Samples::init();

add_action(
	'init',
	function () {
		foreach ( glob( IB_DIR . 'build/*/block.json' ) as $file ) {
			register_block_type( dirname( $file ) );
		}
	}
);

add_filter(
	'block_categories_all',
	function ( $categories ) {
		array_unshift(
			$categories,
			array(
				'slug'  => 'intranet',
				'title' => __( 'Intranet', 'intranet-blocks' ),
			)
		);
		return $categories;
	}
);

// The Events post type adds /events/ URLs.
register_activation_hook(
	__FILE__,
	function () {
		IB_Events::register();
		flush_rewrite_rules();
	}
);

register_deactivation_hook( __FILE__, 'flush_rewrite_rules' );
