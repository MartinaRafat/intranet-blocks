/**
 * Chip filters for server-rendered lists (news, events).
 *
 * Markup: chips with data-ib-filter="slug" (or "all"), items with
 * data-ib-tags="slug-a slug-b". The chip bar ships with `hidden`, so
 * without JS the list just shows everything.
 */
export function initChipFilter( root, { onChange } = {} ) {
	const bar = root.querySelector( '.ib-chips' );
	if ( ! bar ) {
		return;
	}

	const chips = bar.querySelectorAll( '[data-ib-filter]' );
	const items = root.querySelectorAll( '[data-ib-tags]' );

	bar.hidden = false;

	chips.forEach( ( chip ) => {
		chip.addEventListener( 'click', () => {
			const value = chip.dataset.ibFilter;
			let shown = 0;

			chips.forEach( ( other ) =>
				other.setAttribute( 'aria-pressed', String( other === chip ) )
			);

			items.forEach( ( item ) => {
				const tags = ( item.dataset.ibTags || '' ).split( ' ' );
				const match = value === 'all' || tags.includes( value );
				item.hidden = ! match;
				if ( match ) {
					shown++;
				}
			} );

			if ( onChange ) {
				onChange( shown );
			}
		} );
	} );
}

export function announce( root, count ) {
	const status = root.querySelector( '.ib-status' );
	if ( ! status ) {
		return;
	}
	const template =
		count === 1 ? status.dataset.one || '%d' : status.dataset.many || '%d';
	status.textContent = template.replace( '%d', count );
}
