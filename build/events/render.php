<?php
/**
 * @package IntranetBlocks
 *
 * @var array $attributes
 */

defined( 'ABSPATH' ) || exit;

$ib_args = array(
	'post_type'      => IB_Events::POST_TYPE,
	'post_status'    => 'publish',
	'posts_per_page' => max( 1, min( 24, (int) $attributes['count'] ) ),
	'meta_key'       => '_ib_event_start', // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_key
	'orderby'        => 'meta_value',
	'order'          => 'ASC',
	'no_found_rows'  => true,
);

if ( empty( $attributes['showPast'] ) ) {
	// Stored as Y-m-dTH:i in site time, so a string compare is enough.
	$ib_args['meta_query'] = array( // phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
		array(
			'key'     => '_ib_event_start',
			'value'   => current_time( 'Y-m-d\TH:i' ),
			'compare' => '>=',
		),
	);
}

$ib_query   = new WP_Query( $ib_args );
$ib_regions = array();

foreach ( $ib_query->posts as $ib_post ) {
	foreach ( (array) get_the_terms( $ib_post->ID, IB_Events::TAXONOMY ) as $ib_term ) {
		if ( $ib_term instanceof WP_Term ) {
			$ib_regions[ $ib_term->slug ] = $ib_term->name;
		}
	}
}

$ib_wrapper = get_block_wrapper_attributes(
	array( 'style' => '--ib-columns:' . max( 1, min( 4, (int) $attributes['columns'] ) ) )
);
?>
<div <?php echo $ib_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! $ib_query->have_posts() ) : ?>
		<p class="ib-events__empty">
			<?php
			echo esc_html(
				current_user_can( 'edit_posts' )
					? __( 'No upcoming events. Add some under Events in the dashboard.', 'intranet-blocks' )
					: __( 'No upcoming events right now.', 'intranet-blocks' )
			);
			?>
		</p>
	<?php else : ?>

		<?php if ( $attributes['showFilters'] && count( $ib_regions ) > 1 ) : ?>
			<div class="ib-chips" role="group" aria-label="<?php esc_attr_e( 'Filter events by region', 'intranet-blocks' ); ?>" hidden>
				<button type="button" class="ib-chip" data-ib-filter="all" aria-pressed="true"><?php esc_html_e( 'All regions', 'intranet-blocks' ); ?></button>
				<?php foreach ( $ib_regions as $ib_slug => $ib_name ) : ?>
					<button type="button" class="ib-chip" data-ib-filter="<?php echo esc_attr( $ib_slug ); ?>" aria-pressed="false"><?php echo esc_html( $ib_name ); ?></button>
				<?php endforeach; ?>
			</div>
			<?php /* translators: %d: number of events. */ ?>
			<p class="ib-status" role="status" data-one="<?php esc_attr_e( '%d event shown', 'intranet-blocks' ); ?>" data-many="<?php esc_attr_e( '%d events shown', 'intranet-blocks' ); ?>"></p>
		<?php endif; ?>

		<ul class="ib-events__list" role="list">
			<?php
			while ( $ib_query->have_posts() ) :
				$ib_query->the_post();
				$ib_start    = IB_Events::datetime( get_the_ID() );
				$ib_location = get_post_meta( get_the_ID(), '_ib_event_location', true );
				$ib_terms    = get_the_terms( get_the_ID(), IB_Events::TAXONOMY );
				$ib_terms    = is_array( $ib_terms ) ? $ib_terms : array();
				$ib_ts       = $ib_start ? $ib_start->getTimestamp() : 0;
				?>
				<li class="ib-event" data-ib-tags="<?php echo esc_attr( implode( ' ', wp_list_pluck( $ib_terms, 'slug' ) ) ); ?>">
					<?php if ( $ib_ts ) : ?>
						<time class="ib-event__date" datetime="<?php echo esc_attr( $ib_start->format( 'c' ) ); ?>">
							<span class="ib-event__month"><?php echo esc_html( wp_date( 'M', $ib_ts ) ); ?></span>
							<span class="ib-event__day"><?php echo esc_html( wp_date( 'j', $ib_ts ) ); ?></span>
						</time>
					<?php endif; ?>

					<div class="ib-event__body">
						<?php if ( $ib_terms ) : ?>
							<span class="ib-event__region"><?php echo esc_html( $ib_terms[0]->name ); ?></span>
						<?php endif; ?>

						<h3 class="ib-event__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>

						<ul class="ib-event__meta" role="list">
							<?php if ( $ib_ts ) : ?>
								<li>
									<?php echo IB_Icons::svg( 'clock' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									<?php echo esc_html( wp_date( 'l', $ib_ts ) . ', ' . wp_date( get_option( 'time_format' ), $ib_ts ) ); ?>
								</li>
							<?php endif; ?>
							<?php if ( $ib_location ) : ?>
								<li>
									<?php echo IB_Icons::svg( 'pin' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									<?php echo esc_html( $ib_location ); ?>
								</li>
							<?php endif; ?>
						</ul>

						<?php if ( $attributes['showExcerpt'] && has_excerpt() ) : ?>
							<p class="ib-event__excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p>
						<?php endif; ?>

						<?php if ( $ib_ts ) : ?>
							<a class="ib-event__ics" href="<?php echo esc_url( IB_Events::ics_url( get_the_ID() ) ); ?>">
								<?php echo IB_Icons::svg( 'calendar-plus' ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
								<?php esc_html_e( 'Add to calendar', 'intranet-blocks' ); ?>
								<span class="screen-reader-text">
									<?php
									/* translators: %s: event title. */
									echo esc_html( sprintf( __( 'for %s', 'intranet-blocks' ), get_the_title() ) );
									?>
								</span>
							</a>
						<?php endif; ?>
					</div>
				</li>
			<?php endwhile; ?>
			<?php wp_reset_postdata(); ?>
		</ul>
	<?php endif; ?>
</div>
