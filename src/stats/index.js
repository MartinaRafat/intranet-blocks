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
	[ 'intranet/stat', { value: '1,250', label: 'Colleagues across the group' } ],
	[ 'intranet/stat', { value: '6', label: 'Offices in the region' } ],
	[ 'intranet/stat', { value: '94%', label: 'IT tickets solved within a day' } ],
	[ 'intranet/stat', { value: '4.6', label: 'Engagement score out of 5' } ],
];

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const blockProps = useBlockProps( {
			style: { '--ib-columns': String( attributes.columns ) },
		} );
		const innerBlocksProps = useInnerBlocksProps( blockProps, {
			allowedBlocks: [ 'intranet/stat' ],
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
							max={ 6 }
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
