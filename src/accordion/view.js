/**
 * Adds the search box and Expand all / Collapse all to the Document Accordion.
 * The sections themselves are <details>, so they already work without this.
 */
import { __, _n, sprintf } from '@wordpress/i18n';

function setup( root ) {
	const items = Array.from( root.querySelectorAll( ':scope > .wp-block-intranet-accordion-item' ) );
	const wantSearch = root.dataset.search === 'true';
	const wantToggle = root.dataset.toggleAll === 'true';

	if ( ! items.length || ( ! wantSearch && ! wantToggle ) ) {
		return;
	}

	const toolbar = document.createElement( 'div' );
	toolbar.className = 'ib-accordion__toolbar';

	const status = document.createElement( 'p' );
	status.className = 'ib-accordion__empty';
	status.setAttribute( 'role', 'status' );

	if ( wantSearch ) {
		const label = document.createElement( 'label' );
		label.className = 'ib-accordion__search';

		const text = document.createElement( 'span' );
		text.className = 'screen-reader-text';
		text.textContent = __( 'Search sections', 'intranet-blocks' );

		const input = document.createElement( 'input' );
		input.type = 'search';
		input.className = 'ib-accordion__input';
		input.placeholder = __( 'Search policies and documents', 'intranet-blocks' );

		input.addEventListener( 'input', () => {
			const term = input.value.trim().toLowerCase();
			let shown = 0;

			items.forEach( ( item ) => {
				const match = ! term || item.textContent.toLowerCase().includes( term );
				item.hidden = ! match;
				// Open matches so people see why they matched.
				item.open = Boolean( term ) && match;
				if ( match ) {
					shown++;
				}
			} );

			if ( ! term ) {
				status.textContent = '';
			} else if ( shown === 0 ) {
				status.textContent = __( 'Nothing matches that search.', 'intranet-blocks' );
			} else {
				/* translators: %d: number of sections. */
				status.textContent = sprintf( _n( '%d section found', '%d sections found', shown, 'intranet-blocks' ), shown );
			}
		} );

		label.append( text, input );
		toolbar.appendChild( label );
	}

	if ( wantToggle ) {
		const button = document.createElement( 'button' );
		button.type = 'button';
		button.className = 'ib-accordion__toggle';

		const sync = () => {
			const allOpen = items.filter( ( item ) => ! item.hidden ).every( ( item ) => item.open );
			button.textContent = allOpen
				? __( 'Collapse all', 'intranet-blocks' )
				: __( 'Expand all', 'intranet-blocks' );
			button.setAttribute( 'aria-expanded', String( allOpen ) );
		};

		button.addEventListener( 'click', () => {
			const open = button.getAttribute( 'aria-expanded' ) !== 'true';
			items.forEach( ( item ) => {
				if ( ! item.hidden ) {
					item.open = open;
				}
			} );
			sync();
		} );

		items.forEach( ( item ) => item.addEventListener( 'toggle', sync ) );
		sync();
		toolbar.appendChild( button );
	}

	root.prepend( toolbar );
	root.appendChild( status );
}

document.querySelectorAll( '.wp-block-intranet-accordion' ).forEach( setup );
