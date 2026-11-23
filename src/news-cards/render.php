<?php
/**
 * @package IntranetBlocks
 *
 * @var array $attributes
 */

defined( 'ABSPATH' ) || exit;

$ib_args = array(
	'post_type'           => 'post',
	'post_status'         => 'publish',
	'posts_per_page'      => max( 1, min( 12, (int) $attributes['count'] ) ),
	'ignore_sticky_posts' => true,
	'no_found_rows'       => true,
);

if ( ! empty( $attributes['categoryId'] ) ) {
	$ib_args['cat'] = (int) $attributes['categoryId'];
}

$ib_query    = new WP_Query( $ib_args );
$ib_featured = 'featured' === $attributes['layout'];
$ib_cats     = array();

// Collect categories first so the filter only shows ones that have posts here.
foreach ( $ib_query->posts as $ib_post ) {
	foreach ( get_the_category( $ib_post->ID ) as $ib_cat ) {
		$ib_cats[ $ib_cat->slug ] = $ib_cat->name;
	}
}

$ib_wrapper = get_block_wrapper_attributes(
	array(
		'class' => $ib_featured ? 'ib-news--featured' : '',
		'style' => '--ib-columns:' . max( 1, min( 4, (int) $attributes['columns'] ) ),
	)
);
?>
<div <?php echo $ib_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( ! $ib_query->have_posts() ) : ?>
		<p><?php esc_html_e( 'No news yet.', 'intranet-blocks' ); ?></p>
	<?php else : ?>

		<?php if ( $attributes['showFilters'] && count( $ib_cats ) > 1 && empty( $attributes['categoryId'] ) ) : ?>
			<div class="ib-chips" role="group" aria-label="<?php esc_attr_e( 'Filter news', 'intranet-blocks' ); ?>" hidden>
				<button type="button" class="ib-chip" data-ib-filter="all" aria-pressed="true"><?php esc_html_e( 'All', 'intranet-blocks' ); ?></button>
				<?php foreach ( $ib_cats as $ib_slug => $ib_name ) : ?>
					<button type="button" class="ib-chip" data-ib-filter="<?php echo esc_attr( $ib_slug ); ?>" aria-pressed="false"><?php echo esc_html( $ib_name ); ?></button>
				<?php endforeach; ?>
			</div>
			<?php /* translators: %d: number of posts. */ ?>
			<p class="ib-status" role="status" data-one="<?php esc_attr_e( '%d post shown', 'intranet-blocks' ); ?>" data-many="<?php esc_attr_e( '%d posts shown', 'intranet-blocks' ); ?>"></p>
		<?php endif; ?>

		<div class="ib-news__grid">
			<?php
			while ( $ib_query->have_posts() ) :
				$ib_query->the_post();
				$ib_post_cats = get_the_category();
				$ib_minutes   = max( 1, (int) ceil( str_word_count( wp_strip_all_tags( get_the_content() ) ) / 200 ) );
				?>
				<article class="ib-news-card" data-ib-tags="<?php echo esc_attr( implode( ' ', wp_list_pluck( $ib_post_cats, 'slug' ) ) ); ?>">
					<?php if ( $attributes['showImage'] && has_post_thumbnail() ) : ?>
						<a class="ib-news-card__image" href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
							<?php the_post_thumbnail( 'large', array( 'alt' => '' ) ); ?>
						</a>
					<?php endif; ?>

					<div class="ib-news-card__body">
						<?php if ( $ib_post_cats ) : ?>
							<span class="ib-news-card__category"><?php echo esc_html( $ib_post_cats[0]->name ); ?></span>
						<?php endif; ?>

						<h3 class="ib-news-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>

						<?php if ( $attributes['showExcerpt'] ) : ?>
							<p class="ib-news-card__excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?></p>
						<?php endif; ?>

						<?php if ( $attributes['showDate'] || $attributes['showReadingTime'] ) : ?>
							<p class="ib-news-card__meta">
								<?php if ( $attributes['showDate'] ) : ?>
									<time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( get_the_date() ); ?></time>
								<?php endif; ?>
								<?php if ( $attributes['showReadingTime'] ) : ?>
									<span>
										<?php
										/* translators: %d: minutes. */
										echo esc_html( sprintf( _n( '%d min read', '%d min read', $ib_minutes, 'intranet-blocks' ), $ib_minutes ) );
										?>
									</span>
								<?php endif; ?>
							</p>
						<?php endif; ?>
					</div>
				</article>
			<?php endwhile; ?>
			<?php wp_reset_postdata(); ?>
		</div>
	<?php endif; ?>
</div>
