<?php
/**
 * Events: post type, Region taxonomy, date/location meta and the
 * "Add to calendar" (.ics) download.
 *
 * @package IntranetBlocks
 */

defined( 'ABSPATH' ) || exit;

class IB_Events {

	const POST_TYPE = 'intranet_event';
	const TAXONOMY  = 'event_region';
	const DATE_FMT  = 'Y-m-d\TH:i'; // Same format as <input type="datetime-local">.

	public static function init() {
		add_action( 'init', array( __CLASS__, 'register' ) );
		add_action( 'enqueue_block_editor_assets', array( __CLASS__, 'editor_assets' ) );
		add_action( 'template_redirect', array( __CLASS__, 'maybe_send_ics' ) );
		add_action( 'admin_notices', array( __CLASS__, 'sample_notice' ) );
	}

	public static function register() {
		register_post_type(
			self::POST_TYPE,
			array(
				'labels'       => array(
					'name'          => __( 'Events', 'intranet-blocks' ),
					'singular_name' => __( 'Event', 'intranet-blocks' ),
					'add_new_item'  => __( 'Add New Event', 'intranet-blocks' ),
					'edit_item'     => __( 'Edit Event', 'intranet-blocks' ),
					'all_items'     => __( 'All Events', 'intranet-blocks' ),
				),
				'public'       => true,
				'show_in_rest' => true,
				'has_archive'  => true,
				'rewrite'      => array( 'slug' => 'events' ),
				'menu_icon'    => 'dashicons-calendar-alt',
				'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ),
			)
		);

		register_taxonomy(
			self::TAXONOMY,
			self::POST_TYPE,
			array(
				'labels'            => array(
					'name'          => __( 'Regions', 'intranet-blocks' ),
					'singular_name' => __( 'Region', 'intranet-blocks' ),
				),
				'hierarchical'      => true,
				'show_in_rest'      => true,
				'show_admin_column' => true,
			)
		);

		foreach ( array( '_ib_event_start', '_ib_event_end', '_ib_event_location' ) as $key ) {
			register_post_meta(
				self::POST_TYPE,
				$key,
				array(
					'type'              => 'string',
					'single'            => true,
					'show_in_rest'      => true,
					'sanitize_callback' => 'sanitize_text_field',
					'auth_callback'     => function () {
						return current_user_can( 'edit_posts' );
					},
				)
			);
		}
	}

	/**
	 * The "Event details" panel in the editor sidebar.
	 */
	public static function editor_assets() {
		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		$asset  = IB_DIR . 'build/event-fields/index.asset.php';

		if ( ! $screen || self::POST_TYPE !== $screen->post_type || ! file_exists( $asset ) ) {
			return;
		}

		$asset = include $asset;

		wp_enqueue_script(
			'ib-event-fields',
			plugins_url( 'build/event-fields/index.js', IB_FILE ),
			$asset['dependencies'],
			$asset['version'],
			true
		);
		wp_set_script_translations( 'ib-event-fields', 'intranet-blocks' );
	}

	/**
	 * @return DateTimeImmutable|null In the site timezone.
	 */
	public static function datetime( $post_id, $key = '_ib_event_start' ) {
		$value = get_post_meta( $post_id, $key, true );
		if ( ! $value ) {
			return null;
		}

		$date = DateTimeImmutable::createFromFormat( self::DATE_FMT, $value, wp_timezone() );

		return $date ? $date : null;
	}

	public static function ics_url( $post_id ) {
		return add_query_arg( 'ib_ics', (int) $post_id, home_url( '/' ) );
	}

	public static function maybe_send_ics() {
		if ( empty( $_GET['ib_ics'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
			return;
		}

		$post  = get_post( absint( $_GET['ib_ics'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		$start = $post ? self::datetime( $post->ID ) : null;

		if ( ! $post || self::POST_TYPE !== $post->post_type || 'publish' !== $post->post_status || ! $start ) {
			wp_die( esc_html__( 'Event not found.', 'intranet-blocks' ), '', array( 'response' => 404 ) );
		}

		$end = self::datetime( $post->ID, '_ib_event_end' );
		if ( ! $end || $end <= $start ) {
			$end = $start->modify( '+1 hour' );
		}

		$utc  = new DateTimeZone( 'UTC' );
		$host = wp_parse_url( home_url(), PHP_URL_HOST );

		$lines = array(
			'BEGIN:VCALENDAR',
			'VERSION:2.0',
			'PRODID:-//Intranet Blocks//EN',
			'CALSCALE:GREGORIAN',
			'METHOD:PUBLISH',
			'BEGIN:VEVENT',
			'UID:event-' . $post->ID . '@' . $host,
			'DTSTAMP:' . gmdate( 'Ymd\THis\Z' ),
			'DTSTART:' . $start->setTimezone( $utc )->format( 'Ymd\THis\Z' ),
			'DTEND:' . $end->setTimezone( $utc )->format( 'Ymd\THis\Z' ),
			'SUMMARY:' . self::ics_text( get_the_title( $post ) ),
			'LOCATION:' . self::ics_text( get_post_meta( $post->ID, '_ib_event_location', true ) ),
			'DESCRIPTION:' . self::ics_text( get_the_excerpt( $post ) ),
			'URL:' . get_permalink( $post ),
			'END:VEVENT',
			'END:VCALENDAR',
		);

		nocache_headers();
		header( 'Content-Type: text/calendar; charset=utf-8' );
		header( 'Content-Disposition: attachment; filename="' . sanitize_file_name( $post->post_name ) . '.ics"' );

		echo implode( "\r\n", $lines ) . "\r\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Plain text calendar file, escaped by ics_text().
		exit;
	}

	private static function ics_text( $text ) {
		$text = html_entity_decode( wp_strip_all_tags( (string) $text ), ENT_QUOTES, 'UTF-8' );
		return str_replace( array( '\\', ';', ',', "\r\n", "\n" ), array( '\\\\', '\;', '\,', '\n', '\n' ), $text );
	}

	/**
	 * Offer sample events while the Events list is still empty.
	 */
	public static function sample_notice() {
		$screen = get_current_screen();
		if ( ! $screen || 'edit-' . self::POST_TYPE !== $screen->id || ! current_user_can( 'publish_posts' ) ) {
			return;
		}

		$counts = wp_count_posts( self::POST_TYPE );
		if ( ( $counts->publish + $counts->draft + $counts->future ) > 0 ) {
			return;
		}
		?>
		<div class="notice notice-info">
			<p><?php esc_html_e( 'No events yet. Want a few sample events to see the Events block in action?', 'intranet-blocks' ); ?></p>
			<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
				<input type="hidden" name="action" value="ib_sample_events">
				<input type="hidden" name="ib_back" value="events">
				<?php wp_nonce_field( 'ib_sample_events' ); ?>
				<p><button class="button button-primary"><?php esc_html_e( 'Add 6 sample events', 'intranet-blocks' ); ?></button></p>
			</form>
		</div>
		<?php
	}
}
