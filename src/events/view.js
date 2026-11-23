import { initChipFilter, announce } from '../shared/filter';

document.querySelectorAll( '.wp-block-intranet-events' ).forEach( ( root ) => {
	initChipFilter( root, { onChange: ( count ) => announce( root, count ) } );
} );
