<?php
/**
 * Small inline icons for the server-rendered blocks.
 *
 * @package IntranetBlocks
 */

defined( 'ABSPATH' ) || exit;

class IB_Icons {

	const PATHS = array(
		'clock'         => '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
		'pin'           => '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
		'calendar-plus' => '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M12 13v5M9.5 15.5h5"/>',
	);

	/**
	 * Markup is built only from the constant above, so it is safe to echo.
	 */
	public static function svg( $name, $size = 16 ) {
		if ( ! isset( self::PATHS[ $name ] ) ) {
			return '';
		}

		return sprintf(
			'<svg viewBox="0 0 24 24" width="%1$d" height="%1$d" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">%2$s</svg>',
			(int) $size,
			self::PATHS[ $name ]
		);
	}
}
