/**
 * Counts each number up from zero the first time it scrolls into view.
 * Anything that isn't a plain number (like "24/7") is left alone.
 */
const reduceMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' );

function parse( text ) {
	// The suffix can't contain digits, so things like "24/7" are skipped.
	const match = text.trim().match( /^([^\d-]*)(-?[\d,]*\.?\d+)(\D*)$/ );
	if ( ! match ) {
		return null;
	}
	const [ , prefix, number, suffix ] = match;
	return {
		prefix,
		suffix,
		target: parseFloat( number.replace( /,/g, '' ) ),
		decimals: ( number.split( '.' )[ 1 ] || '' ).length,
		grouping: number.includes( ',' ),
	};
}

function animate( el ) {
	const original = el.textContent;
	const value = parse( original );

	if ( ! value || ! isFinite( value.target ) ) {
		return;
	}

	const format = new Intl.NumberFormat( 'en', {
		minimumFractionDigits: value.decimals,
		maximumFractionDigits: value.decimals,
		useGrouping: value.grouping,
	} );
	const duration = 1200;
	const start = performance.now();

	const tick = ( now ) => {
		const progress = Math.min( 1, ( now - start ) / duration );
		const eased = 1 - Math.pow( 1 - progress, 3 );

		if ( progress < 1 ) {
			el.textContent = value.prefix + format.format( value.target * eased ) + value.suffix;
			window.requestAnimationFrame( tick );
		} else {
			el.textContent = original;
		}
	};

	window.requestAnimationFrame( tick );
}

if ( ! reduceMotion.matches && 'IntersectionObserver' in window ) {
	const observer = new window.IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					observer.unobserve( entry.target );
					animate( entry.target );
				}
			} );
		},
		{ threshold: 0.6 }
	);

	document
		.querySelectorAll( '.wp-block-intranet-stats .ib-stat__value' )
		.forEach( ( el ) => observer.observe( el ) );
}
