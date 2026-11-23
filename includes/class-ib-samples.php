<?php
/**
 * Sample news posts and events. Everything gets the _ib_sample meta so it
 * can be removed again from Settings > Intranet Blocks.
 *
 * @package IntranetBlocks
 */

defined( 'ABSPATH' ) || exit;

class IB_Samples {

	const META = '_ib_sample';

	public static function init() {
		add_action( 'admin_post_ib_sample_posts', array( __CLASS__, 'handle_posts' ) );
		add_action( 'admin_post_ib_sample_events', array( __CLASS__, 'handle_events' ) );
		add_action( 'admin_post_ib_remove_samples', array( __CLASS__, 'handle_remove' ) );
	}

	private static function check( $action, $cap ) {
		if ( ! current_user_can( $cap ) ) {
			wp_die( esc_html__( 'You are not allowed to do this.', 'intranet-blocks' ), 403 );
		}
		check_admin_referer( $action );
	}

	private static function done( $what, $count ) {
		// The Events screen has its own button, send people back there.
		$back = isset( $_POST['ib_back'] ) && 'events' === $_POST['ib_back'] // phpcs:ignore WordPress.Security.NonceVerification.Missing -- Checked in check().
			? admin_url( 'edit.php?post_type=' . IB_Events::POST_TYPE )
			: IB_Settings::url(
				array(
					'ib_done'  => $what,
					'ib_count' => $count,
				)
			);

		wp_safe_redirect( $back );
		exit;
	}

	public static function handle_posts() {
		self::check( 'ib_sample_posts', 'publish_posts' );
		self::done( 'posts', self::create_posts() );
	}

	public static function handle_events() {
		self::check( 'ib_sample_events', 'publish_posts' );
		self::done( 'events', self::create_events() );
	}

	public static function handle_remove() {
		self::check( 'ib_remove_samples', 'delete_others_posts' );
		self::done( 'removed', self::remove() );
	}

	public static function create_posts() {
		$categories = array(
			'HR'            => array( '#0f766e', '#134e4a' ),
			'IT'            => array( '#1e40af', '#0f172a' ),
			'Company news'  => array( '#9a3412', '#431407' ),
			'Announcements' => array( '#6d28d9', '#2e1065' ),
		);

		$posts = array(
			array(
				'Welcome to our new joiners',
				'HR',
				1,
				'Eight people joined us this month across Finance, IT and Customer Care.',
				array(
					'Eight people joined us this month across Finance, IT and Customer Care. Say hello when you see them around, and look them up in the people directory to see their teams.',
					'If you are one of them: your first-week checklist is in the HR policies section, and your buddy will reach out on Teams.',
				),
			),
			array(
				'New VPN app from Sunday',
				'IT',
				3,
				'The new VPN signs you in with your Microsoft account. Install it before Sunday.',
				array(
					'We are moving to a new VPN app this weekend. It signs you in with your Microsoft account, so there is no separate VPN password anymore.',
					'Install it from the Company Portal before Sunday morning. The old app stops working at 8 am.',
				),
			),
			array(
				'Wellness allowance is now in the benefits portal',
				'HR',
				6,
				'Claim gym memberships, sports classes and health apps through the benefits portal.',
				array(
					'You can now claim gym memberships, sports classes and health apps through the benefits portal. Keep your receipts and submit them by the 25th of each month.',
					'Questions? The HR team runs a short Q&A session next week, see Events.',
				),
			),
			array(
				'Office closed next Thursday for maintenance',
				'Announcements',
				8,
				'The building is closed for electrical work. Please work from home that day.',
				array(
					'The building will be closed next Thursday for electrical work. Please work from home that day.',
					'Meetings booked in the office are moved to Teams automatically. Reception will be back on Sunday.',
				),
			),
			array(
				'Q3 results: what they mean for us',
				'Company news',
				12,
				'Revenue grew compared to last quarter and two new client projects start in November.',
				array(
					'Revenue grew compared to last quarter, and two new client projects start in November. The leadership team went through the details at the town hall.',
					'The recording and slides are on the intranet under Company news.',
				),
			),
			array(
				'Watch out for fake invoice emails',
				'IT',
				15,
				'Several people received fake supplier invoices. Do not open the link, report the email instead.',
				array(
					'Several people received emails that look like supplier invoices with a link to view the PDF. The link asks for your Microsoft password.',
					'Do not open it. Use the Report button in Outlook, or forward the email to the IT help desk.',
				),
			),
		);

		$term_ids = array();
		foreach ( array_keys( $categories ) as $name ) {
			$term = term_exists( $name, 'category' );
			if ( ! $term ) {
				$term = wp_insert_term( $name, 'category' );
			}
			if ( ! is_wp_error( $term ) ) {
				$term_ids[ $name ] = (int) $term['term_id'];
			}
		}

		$created = 0;

		foreach ( $posts as $post ) {
			list( $title, $category, $days_ago, $excerpt, $paragraphs ) = $post;

			$content = '';
			foreach ( $paragraphs as $paragraph ) {
				$content .= "<!-- wp:paragraph -->\n<p>" . esc_html( $paragraph ) . "</p>\n<!-- /wp:paragraph -->\n\n";
			}

			$id = wp_insert_post(
				array(
					'post_status'   => 'publish',
					'post_title'    => $title,
					'post_excerpt'  => $excerpt,
					'post_content'  => $content,
					'post_date'     => wp_date( 'Y-m-d H:i:s', time() - $days_ago * DAY_IN_SECONDS ),
					'post_category' => isset( $term_ids[ $category ] ) ? array( $term_ids[ $category ] ) : array(),
					'meta_input'    => array( self::META => 1 ),
				)
			);

			if ( ! $id || is_wp_error( $id ) ) {
				continue;
			}

			$image = self::make_image( $id, $title, $categories[ $category ] );
			if ( $image ) {
				set_post_thumbnail( $id, $image );
			}

			$created++;
		}

		return $created;
	}

	public static function create_events() {
		$now = new DateTimeImmutable( 'now', wp_timezone() );

		$events = array(
			array( 'Quarterly town hall', 3, '10:00', 'Main auditorium, 2nd floor', 'Kuwait City', 'Results for the quarter, plans for the next one, and open Q&A with the leadership team.' ),
			array( 'Phishing awareness workshop', 6, '13:00', 'Microsoft Teams', 'Online', 'How to spot fake emails and what to do when you get one. 45 minutes, cameras optional.' ),
			array( 'New joiners breakfast', 8, '09:00', 'Cafeteria', 'Cairo', 'Meet everyone who joined this quarter and the people you will work with.' ),
			array( 'SharePoint training: document libraries', 12, '11:00', 'Training room B', 'Kuwait City', 'Hands-on session on versions, permissions and sharing files the right way.' ),
			array( 'Benefits Q&A with HR', 17, '14:00', 'Microsoft Teams', 'Online', 'Medical cover, leave balances and the new wellness allowance. Send questions in advance.' ),
			array( 'Family day', 26, '16:00', 'Green Plaza Park', 'Cairo', 'Games, food and activities for kids. Families welcome.' ),
		);

		$created = 0;

		foreach ( $events as $event ) {
			list( $title, $days, $time, $location, $region, $excerpt ) = $event;
			list( $hour, $minute ) = array_map( 'intval', explode( ':', $time ) );

			$start = $now->modify( "+{$days} days" )->setTime( $hour, $minute );

			$id = wp_insert_post(
				array(
					'post_type'    => IB_Events::POST_TYPE,
					'post_status'  => 'publish',
					'post_title'   => $title,
					'post_excerpt' => $excerpt,
					'post_content' => "<!-- wp:paragraph -->\n<p>" . esc_html( $excerpt ) . "</p>\n<!-- /wp:paragraph -->",
					'meta_input'   => array(
						'_ib_event_start'    => $start->format( IB_Events::DATE_FMT ),
						'_ib_event_end'      => $start->modify( '+90 minutes' )->format( IB_Events::DATE_FMT ),
						'_ib_event_location' => $location,
						self::META           => 1,
					),
				)
			);

			if ( $id && ! is_wp_error( $id ) ) {
				wp_set_object_terms( $id, $region, IB_Events::TAXONOMY );
				$created++;
			}
		}

		return $created;
	}

	public static function remove() {
		$ids = get_posts(
			array(
				'post_type'      => array( 'post', IB_Events::POST_TYPE, 'attachment' ),
				'post_status'    => 'any',
				'posts_per_page' => -1,
				'fields'         => 'ids',
				'meta_key'       => self::META, // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
			)
		);

		foreach ( $ids as $id ) {
			if ( 'attachment' === get_post_type( $id ) ) {
				wp_delete_attachment( $id, true );
			} else {
				wp_delete_post( $id, true );
			}
		}

		return count( $ids );
	}

	/**
	 * A simple gradient cover image made with GD, so the samples don't depend
	 * on any outside image service. Returns the attachment ID, or 0.
	 */
	private static function make_image( $post_id, $title, array $colors ) {
		if ( ! function_exists( 'imagecreatetruecolor' ) ) {
			return 0;
		}

		$width  = 1200;
		$height = 750;
		$image  = imagecreatetruecolor( $width, $height );

		list( $r1, $g1, $b1 ) = sscanf( $colors[0], '#%02x%02x%02x' );
		list( $r2, $g2, $b2 ) = sscanf( $colors[1], '#%02x%02x%02x' );

		for ( $y = 0; $y < $height; $y++ ) {
			$t     = $y / ( $height - 1 );
			$color = imagecolorallocate(
				$image,
				(int) round( $r1 + ( $r2 - $r1 ) * $t ),
				(int) round( $g1 + ( $g2 - $g1 ) * $t ),
				(int) round( $b1 + ( $b2 - $b1 ) * $t )
			);
			imageline( $image, 0, $y, $width, $y, $color );
		}

		// A few soft circles so it doesn't look flat. Positions come from the
		// title, so each post gets a slightly different image.
		imagealphablending( $image, true );
		$light = imagecolorallocatealpha( $image, 255, 255, 255, 116 );
		$seed  = crc32( $title );
		imagefilledellipse( $image, 860 + $seed % 240, 60 + ( $seed >> 4 ) % 160, 560, 560, $light );
		imagefilledellipse( $image, 60 + ( $seed >> 8 ) % 220, 640 + ( $seed >> 12 ) % 120, 420, 420, $light );
		imagefilledellipse( $image, 480 + ( $seed >> 16 ) % 300, 300 + ( $seed >> 20 ) % 200, 160, 160, $light );

		ob_start();
		imagejpeg( $image, null, 86 );
		$data = ob_get_clean();

		$upload = wp_upload_bits( sanitize_title( $title ) . '.jpg', null, $data );
		if ( ! empty( $upload['error'] ) ) {
			return 0;
		}

		$attachment_id = wp_insert_attachment(
			array(
				'post_mime_type' => 'image/jpeg',
				'post_title'     => $title,
				'post_status'    => 'inherit',
			),
			$upload['file'],
			$post_id
		);

		if ( ! $attachment_id || is_wp_error( $attachment_id ) ) {
			return 0;
		}

		require_once ABSPATH . 'wp-admin/includes/image.php';
		wp_update_attachment_metadata( $attachment_id, wp_generate_attachment_metadata( $attachment_id, $upload['file'] ) );
		update_post_meta( $attachment_id, self::META, 1 );

		return $attachment_id;
	}
}
