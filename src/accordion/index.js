import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

import metadata from './block.json';
import './style.scss';

const TEMPLATE = [
	[ 'intranet/accordion-item', { title: 'HR policies', meta: '4 documents' }, [ [ 'core/paragraph', { content: 'Leave, code of conduct, benefits and remote work.' } ] ] ],
	[ 'intranet/accordion-item', { title: 'IT and security', meta: '3 documents' }, [ [ 'core/paragraph', { content: 'Password rules, VPN access and how to report a phishing email.' } ] ] ],
	[ 'intranet/accordion-item', { title: 'Travel and expenses', meta: '2 documents' }, [ [ 'core/paragraph', { content: 'Booking rules, per diem rates and how to submit a claim.' } ] ] ],
];

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const innerBlocksProps = useInnerBlocksProps( useBlockProps(), {
			allowedBlocks: [ 'intranet/accordion-item' ],
			template: TEMPLATE,
		} );

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Tools', 'intranet-blocks' ) }>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Search box', 'intranet-blocks' ) }
							help={ __( 'Filters sections by title and content as people type.', 'intranet-blocks' ) }
							checked={ attributes.showSearch }
							onChange={ ( value ) => setAttributes( { showSearch: value } ) }
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Expand all / Collapse all', 'intranet-blocks' ) }
							checked={ attributes.showToggleAll }
							onChange={ ( value ) => setAttributes( { showToggleAll: value } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...innerBlocksProps } />
			</>
		);
	},

	save( { attributes } ) {
		return (
			<div
				{ ...useBlockProps.save( {
					'data-search': attributes.showSearch ? 'true' : 'false',
					'data-toggle-all': attributes.showToggleAll ? 'true' : 'false',
				} ) }
			>
				<InnerBlocks.Content />
			</div>
		);
	},
} );
