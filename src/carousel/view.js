/**
 * Front-end behaviour for the Portal Carousel.
 *
 * Sliding itself is CSS scroll-snap, so swipe and trackpad work natively.
 * This adds arrows, dots, keyboard support, autoplay and a pause button.
 */
import { __, sprintf } from '@wordpress/i18n';

const ICON_CHEVRON =
	'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"/></svg>';
const ICON_PAUSE =
	'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>';
const ICON_PLAY =
	'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true" focusable="false"><path d="M8 5l11 7-11 7z"/></svg>';

const reduceMotion = window.matchMedia( '(prefers-reduced-motion: reduce)' );

function makeButton( className, label, html ) {
	const button = document.createElement( 'button' );
	button.type = 'button';
	button.className = `ib-carousel__button ${ className }`;
	button.setAttribute( 'aria-label', label );
	button.innerHTML = html;
	return button;
}

function setup( root ) {
	const track = root.querySelector( '.ib-carousel__track' );
	const slides = track ? Array.from( track.children ) : [];

	if ( slides.length === 0 ) {
		return;
	}

	const isRtl = getComputedStyle( root ).direction === 'rtl';
	let current = 0;
	let timer = null;
	let paused = false;
	let hovering = false;

	root.setAttribute( 'role', 'region' );
	root.setAttribute( 'aria-roledescription', __( 'carousel', 'intranet-blocks' ) );
	if ( ! root.hasAttribute( 'aria-label' ) ) {
		root.setAttribute( 'aria-label', __( 'Announcements', 'intranet-blocks' ) );
	}
	track.setAttribute( 'tabindex', '0' );

	slides.forEach( ( slide, i ) => {
		slide.setAttribute( 'role', 'group' );
		slide.setAttribute( 'aria-roledescription', __( 'slide', 'intranet-blocks' ) );
		/* translators: 1: slide number, 2: total slides. */
		slide.setAttribute( 'aria-label', sprintf( __( '%1$d of %2$d', 'intranet-blocks' ), i + 1, slides.length ) );
	} );

	if ( slides.length === 1 ) {
		return;
	}

	const controls = document.createElement( 'div' );
	controls.className = 'ib-carousel__controls';

	const dots = [];
	if ( root.dataset.dots !== 'false' ) {
		const dotWrap = document.createElement( 'div' );
		dotWrap.className = 'ib-carousel__dots';
		slides.forEach( ( slide, i ) => {
			const dot = document.createElement( 'button' );
			dot.type = 'button';
			dot.className = 'ib-carousel__dot';
			/* translators: %d: slide number. */
			dot.setAttribute( 'aria-label', sprintf( __( 'Go to slide %d', 'intranet-blocks' ), i + 1 ) );
			dot.addEventListener( 'click', () => go( i, true ) );
			dots.push( dot );
			dotWrap.appendChild( dot );
		} );
		controls.appendChild( dotWrap );
	}

	const autoplay = root.dataset.autoplay === 'true' && ! reduceMotion.matches;
	let pauseButton = null;
	if ( autoplay ) {
		pauseButton = makeButton( 'ib-carousel__pause', __( 'Pause slides', 'intranet-blocks' ), ICON_PAUSE );
		pauseButton.addEventListener( 'click', () => {
			paused = ! paused;
			pauseButton.setAttribute( 'aria-label', paused ? __( 'Play slides', 'intranet-blocks' ) : __( 'Pause slides', 'intranet-blocks' ) );
			pauseButton.innerHTML = paused ? ICON_PLAY : ICON_PAUSE;
			schedule();
		} );
		controls.appendChild( pauseButton );
	}

	if ( root.dataset.arrows !== 'false' ) {
		const prev = makeButton( 'ib-carousel__prev', __( 'Previous slide', 'intranet-blocks' ), ICON_CHEVRON );
		const next = makeButton( 'ib-carousel__next', __( 'Next slide', 'intranet-blocks' ), ICON_CHEVRON );
		prev.addEventListener( 'click', () => go( current - 1, true ) );
		next.addEventListener( 'click', () => go( current + 1, true ) );
		controls.append( prev, next );
	}

	root.appendChild( controls );

	function render() {
		dots.forEach( ( dot, i ) =>
			dot.setAttribute( 'aria-current', String( i === current ) )
		);
		slides.forEach( ( slide, i ) => slide.toggleAttribute( 'inert', i !== current ) );
	}

	function go( index, byUser ) {
		current = ( index + slides.length ) % slides.length;
		// Scroll only the track, never the page.
		track.scrollTo( {
			left: slides[ current ].offsetLeft - slides[ 0 ].offsetLeft,
			behavior: reduceMotion.matches ? 'auto' : 'smooth',
		} );
		render();
		if ( byUser ) {
			schedule();
		}
	}

	function schedule() {
		window.clearInterval( timer );
		if ( ! autoplay || paused || hovering || document.hidden ) {
			return;
		}
		const seconds = Math.max( 3, parseInt( root.dataset.interval, 10 ) || 6 );
		timer = window.setInterval( () => go( current + 1, false ), seconds * 1000 );
	}

	// Keep "current" in sync when people swipe or scroll the track themselves.
	const observer = new window.IntersectionObserver(
		( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting && entry.intersectionRatio > 0.6 ) {
					current = slides.indexOf( entry.target );
					render();
				}
			} );
		},
		{ root: track, threshold: [ 0.6 ] }
	);
	slides.forEach( ( slide ) => observer.observe( slide ) );

	track.addEventListener( 'keydown', ( event ) => {
		const forward = isRtl ? 'ArrowLeft' : 'ArrowRight';
		const back = isRtl ? 'ArrowRight' : 'ArrowLeft';
		if ( event.key === forward ) {
			event.preventDefault();
			go( current + 1, true );
		} else if ( event.key === back ) {
			event.preventDefault();
			go( current - 1, true );
		}
	} );

	root.addEventListener( 'mouseenter', () => {
		hovering = true;
		schedule();
	} );
	root.addEventListener( 'mouseleave', () => {
		hovering = false;
		schedule();
	} );
	root.addEventListener( 'focusin', () => {
		hovering = true;
		schedule();
	} );
	root.addEventListener( 'focusout', ( event ) => {
		if ( ! root.contains( event.relatedTarget ) ) {
			hovering = false;
			schedule();
		}
	} );
	document.addEventListener( 'visibilitychange', schedule );

	render();
	schedule();
}

document
	.querySelectorAll( '.wp-block-intranet-carousel' )
	.forEach( setup );
