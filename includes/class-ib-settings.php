<?php
/**
 * Settings > Intranet Blocks: brand color, font and text size for all blocks,
 * plus buttons to add or remove sample content.
 *
 * @package IntranetBlocks
 */

defined( 'ABSPATH' ) || exit;

class IB_Settings {

	const OPTION = 'ib_settings';
	const PAGE   = 'intranet-blocks';

	public static function init() {
		add_action( 'admin_menu', array( __CLASS__, 'menu' ) );
		add_action( 'admin_init', array( __CLASS__, 'register' ) );
		add_action( 'enqueue_block_assets', array( __CLASS__, 'print_vars' ) );
	}

	public static function colors() {
		return array(
			'#0f766e' => __( 'Teal', 'intranet-blocks' ),
			'#1e3a8a' => __( 'Navy', 'intranet-blocks' ),
			'#4338ca' => __( 'Indigo', 'intranet-blocks' ),
			'#047857' => __( 'Emerald', 'intranet-blocks' ),
			'#9f1239' => __( 'Burgundy', 'intranet-blocks' ),
			'#b45309' => __( 'Amber', 'intranet-blocks' ),
			'#334155' => __( 'Slate', 'intranet-blocks' ),
		);
	}

	public static function fonts() {
		return array(
			'plex'    => array(
				'label'  => 'IBM Plex Sans Arabic',
				'stack'  => "'IBM Plex Sans Arabic', system-ui, sans-serif",
				'google' => 'IBM+Plex+Sans+Arabic:wght@400;500;600;700',
			),
			'inter'   => array(
				'label'  => 'Inter',
				'stack'  => "'Inter', system-ui, sans-serif",
				'google' => 'Inter:wght@400;500;600;700',
			),
			'cairo'   => array(
				'label'  => 'Cairo',
				'stack'  => "'Cairo', system-ui, sans-serif",
				'google' => 'Cairo:wght@400;500;600;700',
			),
			'tajawal' => array(
				'label'  => 'Tajawal',
				'stack'  => "'Tajawal', system-ui, sans-serif",
				'google' => 'Tajawal:wght@400;500;700',
			),
			'theme'   => array(
				'label'  => __( 'Same as the theme', 'intranet-blocks' ),
				'stack'  => '',
				'google' => '',
			),
		);
	}

	public static function sizes() {
		return array(
			'small'   => array( __( 'Small', 'intranet-blocks' ), '0.94' ),
			'default' => array( __( 'Default', 'intranet-blocks' ), '1' ),
			'large'   => array( __( 'Large', 'intranet-blocks' ), '1.08' ),
		);
	}

	public static function get() {
		return wp_parse_args(
			(array) get_option( self::OPTION, array() ),
			array(
				'brand' => '#0f766e',
				'font'  => 'plex',
				'size'  => 'default',
			)
		);
	}

	public static function register() {
		register_setting(
			'ib_settings',
			self::OPTION,
			array(
				'type'              => 'array',
				'sanitize_callback' => array( __CLASS__, 'sanitize' ),
			)
		);
	}

	public static function sanitize( $input ) {
		$input = is_array( $input ) ? $input : array();
		$brand = sanitize_hex_color( $input['brand'] ?? '' );

		return array(
			'brand' => $brand ? $brand : '#0f766e',
			'font'  => array_key_exists( $input['font'] ?? '', self::fonts() ) ? $input['font'] : 'plex',
			'size'  => array_key_exists( $input['size'] ?? '', self::sizes() ) ? $input['size'] : 'default',
		);
	}

	/**
	 * Runs on the front end and inside the editor, so both look the same.
	 */
	public static function print_vars() {
		$s     = self::get();
		$font  = self::fonts()[ $s['font'] ] ?? self::fonts()['plex'];
		$scale = self::sizes()[ $s['size'] ][1] ?? '1';

		$css = ':root{--ib-brand:' . $s['brand'] . ';--ib-scale:' . $scale . ';';
		if ( $font['stack'] ) {
			$css .= '--ib-font-family:' . $font['stack'] . ';';
		}
		$css .= '}';

		wp_register_style( 'intranet-blocks-settings', false, array(), IB_VERSION );
		wp_enqueue_style( 'intranet-blocks-settings' );
		wp_add_inline_style( 'intranet-blocks-settings', $css );

		if ( $font['google'] ) {
			wp_enqueue_style(
				'intranet-blocks-font',
				'https://fonts.googleapis.com/css2?family=' . $font['google'] . '&display=swap',
				array(),
				null // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion -- Google Fonts handles versions.
			);
		}
	}

	public static function menu() {
		add_options_page(
			__( 'Intranet Blocks', 'intranet-blocks' ),
			__( 'Intranet Blocks', 'intranet-blocks' ),
			'manage_options',
			self::PAGE,
			array( __CLASS__, 'render' )
		);
	}

	public static function url( $args = array() ) {
		return add_query_arg( $args, admin_url( 'options-general.php?page=' . self::PAGE ) );
	}

	public static function render() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$s    = self::get();
		$name = self::OPTION;
		?>
		<div class="wrap">
			<h1><?php esc_html_e( 'Intranet Blocks', 'intranet-blocks' ); ?></h1>

			<?php self::render_notice(); ?>

			<form method="post" action="options.php">
				<?php settings_fields( 'ib_settings' ); ?>

				<table class="form-table" role="presentation">
					<tr>
						<th scope="row"><label for="ib-brand"><?php esc_html_e( 'Main color', 'intranet-blocks' ); ?></label></th>
						<td>
							<div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
								<?php foreach ( self::colors() as $hex => $label ) : ?>
									<button type="button" class="button ib-swatch" data-color="<?php echo esc_attr( $hex ); ?>" title="<?php echo esc_attr( $label ); ?>" style="width:36px;min-width:0;height:36px;padding:0;border-radius:50%;background:<?php echo esc_attr( $hex ); ?>;border:2px solid #fff;box-shadow:0 0 0 1px #c3c4c7">
										<span class="screen-reader-text"><?php echo esc_html( $label ); ?></span>
									</button>
								<?php endforeach; ?>
								<input type="color" id="ib-brand" name="<?php echo esc_attr( $name ); ?>[brand]" value="<?php echo esc_attr( $s['brand'] ); ?>" style="width:56px;height:36px;padding:2px">
							</div>
							<p class="description"><?php esc_html_e( 'Pick one of the colors or your own. Used for buttons, tags, dates and the carousel background.', 'intranet-blocks' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="ib-font"><?php esc_html_e( 'Font', 'intranet-blocks' ); ?></label></th>
						<td>
							<select id="ib-font" name="<?php echo esc_attr( $name ); ?>[font]">
								<?php foreach ( self::fonts() as $key => $font ) : ?>
									<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $s['font'], $key ); ?>><?php echo esc_html( $font['label'] ); ?></option>
								<?php endforeach; ?>
							</select>
							<p class="description"><?php esc_html_e( 'IBM Plex Sans Arabic, Cairo and Tajawal cover Arabic and English.', 'intranet-blocks' ); ?></p>
						</td>
					</tr>
					<tr>
						<th scope="row"><label for="ib-size"><?php esc_html_e( 'Text size', 'intranet-blocks' ); ?></label></th>
						<td>
							<select id="ib-size" name="<?php echo esc_attr( $name ); ?>[size]">
								<?php foreach ( self::sizes() as $key => $size ) : ?>
									<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $s['size'], $key ); ?>><?php echo esc_html( $size[0] ); ?></option>
								<?php endforeach; ?>
							</select>
						</td>
					</tr>
				</table>

				<?php submit_button(); ?>
			</form>

			<hr>

			<h2><?php esc_html_e( 'Sample content', 'intranet-blocks' ); ?></h2>
			<p><?php esc_html_e( 'Fill the site with realistic intranet content to try the blocks. Everything added here can be removed with one click.', 'intranet-blocks' ); ?></p>

			<div style="display:flex;flex-wrap:wrap;gap:8px">
				<?php
				self::action_button( 'ib_sample_posts', __( 'Add 6 sample news posts', 'intranet-blocks' ), 'primary' );
				self::action_button( 'ib_sample_events', __( 'Add 6 sample events', 'intranet-blocks' ), 'secondary' );
				self::action_button( 'ib_remove_samples', __( 'Remove all sample content', 'intranet-blocks' ), 'link-delete', __( 'Delete all sample posts, events and their images?', 'intranet-blocks' ) );
				?>
			</div>
		</div>

		<script>
			document.querySelectorAll( '.ib-swatch' ).forEach( function ( swatch ) {
				swatch.addEventListener( 'click', function () {
					document.getElementById( 'ib-brand' ).value = swatch.dataset.color;
				} );
			} );
		</script>
		<?php
	}

	public static function action_button( $action, $label, $style, $confirm = '' ) {
		?>
		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" <?php echo $confirm ? 'onsubmit="return confirm(' . esc_attr( wp_json_encode( $confirm ) ) . ')"' : ''; ?>>
			<input type="hidden" name="action" value="<?php echo esc_attr( $action ); ?>">
			<?php wp_nonce_field( $action ); ?>
			<button class="button <?php echo 'link-delete' === $style ? 'button-link-delete' : 'button-' . esc_attr( $style ); ?>"><?php echo esc_html( $label ); ?></button>
		</form>
		<?php
	}

	private static function render_notice() {
		// phpcs:disable WordPress.Security.NonceVerification.Recommended -- Display only.
		$done  = isset( $_GET['ib_done'] ) ? sanitize_key( $_GET['ib_done'] ) : '';
		$count = isset( $_GET['ib_count'] ) ? absint( $_GET['ib_count'] ) : 0;
		// phpcs:enable

		$messages = array(
			/* translators: %d: number of posts. */
			'posts'   => _n( '%d sample post added.', '%d sample posts added.', $count, 'intranet-blocks' ),
			/* translators: %d: number of events. */
			'events'  => _n( '%d sample event added.', '%d sample events added.', $count, 'intranet-blocks' ),
			/* translators: %d: number of items. */
			'removed' => _n( '%d sample item removed.', '%d sample items removed.', $count, 'intranet-blocks' ),
		);

		if ( isset( $messages[ $done ] ) ) {
			printf( '<div class="notice notice-success is-dismissible"><p>%s</p></div>', esc_html( sprintf( $messages[ $done ], $count ) ) );
		}
	}
}
