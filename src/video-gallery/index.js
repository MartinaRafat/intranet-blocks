import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';

import metadata from './block.json';
import './style.scss';

const TEMPLATE = [
	[ 'intranet/video', { title: 'A message from the CEO' } ],
	[ 'intranet/video', { title: 'How to book a meeting room' } ],
	[ 'intranet/video', { title: 'Your first week with us' } ],
];

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const blockProps = useBlockProps( {
			style: { '--ib-columns': String( attributes.columns ) },
		} );
		const innerBlocksProps = useInnerBlocksProps( blockProps, {
			allowedBlocks: [ 'intranet/video' ],
			template: TEMPLATE,
			orientation: 'horizontal',
		} );

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Layout', 'intranet-blocks' ) }>
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Columns', 'intranet-blocks' ) }
							value={ attributes.columns }
							min={ 1 }
							max={ 4 }
							onChange={ ( columns ) => setAttributes( { columns } ) }
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
					style: { '--ib-columns': String( attributes.columns ) },
				} ) }
			>
				<InnerBlocks.Content />
			</div>
		);
	},
} );
