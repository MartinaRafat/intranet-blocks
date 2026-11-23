/**
 * Plays gallery videos in a <dialog> instead of leaving the page.
 * Without JS (or without <dialog> support) the links just open the video.
 */
import { __ } from '@wordpress/i18n';

let dialog;
let frame;
let lastLink;

function getDialog() {
	if ( dialog ) {
		return dialog;
	}

	dialog = document.createElement( 'dialog' );
	dialog.className = 'ib-video-dialog';

	const close = document.createElement( 'button' );
	close.type = 'button';
	close.className = 'ib-video-dialog__close';
	close.setAttribute( 'aria-label', __( 'Close video', 'intranet-blocks' ) );
	close.innerHTML =
		'<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6L6 18"/></svg>';
	close.addEventListener( 'click', () => dialog.close() );

	frame = document.createElement( 'div' );
	frame.className = 'ib-video-dialog__frame';

	dialog.append( close, frame );

	// Click on the dark backdrop closes it.
	dialog.addEventListener( 'click', ( event ) => {
		if ( event.target === dialog ) {
			dialog.close();
		}
	} );

	// Stop playback and give focus back to the thumbnail.
	dialog.addEventListener( 'close', () => {
		frame.replaceChildren();
		if ( lastLink ) {
			lastLink.focus();
		}
	} );

	document.body.appendChild( dialog );
	return dialog;
}

function open( link ) {
	const box = getDialog();
	const title = link.getAttribute( 'aria-label' ) || '';
	let player;

	if ( link.dataset.type === 'file' ) {
		player = document.createElement( 'video' );
		player.src = link.dataset.embed;
		player.controls = true;
		player.autoplay = true;
		player.playsInline = true;
	} else {
		player = document.createElement( 'iframe' );
		player.src = link.dataset.embed;
		player.title = title;
		player.allow = 'autoplay; fullscreen; picture-in-picture';
		player.allowFullscreen = true;
	}

	lastLink = link;
	frame.replaceChildren( player );
	box.setAttribute( 'aria-label', title );
	box.showModal();
}

if ( typeof window.HTMLDialogElement === 'function' ) {
	document.addEventListener( 'click', ( event ) => {
		const link = event.target.closest( '.wp-block-intranet-video a.ib-video__open[data-embed]' );
		if ( ! link || event.metaKey || event.ctrlKey || event.shiftKey ) {
			return;
		}
		event.preventDefault();
		open( link );
	} );
}
