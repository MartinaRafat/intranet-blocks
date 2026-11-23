import { __ } from '@wordpress/i18n';

const CLOSE =
	'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>';

// Small string hash, so editing the message shows the bar again.
function hash( text ) {
	let h = 5381;
	for ( let i = 0; i < text.length; i++ ) {
		h = ( ( h << 5 ) + h + text.charCodeAt( i ) ) | 0;
	}
	return ( h >>> 0 ).toString( 36 );
}

function storage( key, value ) {
	try {
		if ( value === undefined ) {
			return window.localStorage.getItem( key );
		}
		window.localStorage.setItem( key, value );
	} catch ( e ) {
		// Private mode or storage blocked: the bar just shows every time.
	}
	return null;
}

document.querySelectorAll( '.wp-block-intranet-announcement[data-dismiss]' ).forEach( ( bar ) => {
	const text = bar.querySelector( '.ib-announce__text' );
	const key = `ib-dismissed:${ bar.dataset.dismiss }:${ hash( text ? text.textContent : '' ) }`;

	if ( storage( key ) === '1' ) {
		bar.hidden = true;
		return;
	}

	const button = document.createElement( 'button' );
	button.type = 'button';
	button.className = 'ib-announce__close';
	button.setAttribute( 'aria-label', __( 'Dismiss announcement', 'intranet-blocks' ) );
	button.innerHTML = CLOSE;
	button.addEventListener( 'click', () => {
		storage( key, '1' );
		bar.hidden = true;
	} );

	bar.appendChild( button );
} );
