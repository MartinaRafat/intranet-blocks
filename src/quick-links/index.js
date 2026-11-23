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
	[ 'intranet/quick-link', { label: 'Leave request', description: 'Annual, sick or remote day', icon: 'calendar' } ],
	[ 'intranet/quick-link', { label: 'IT help desk', description: 'Report a problem or request access', icon: 'laptop' } ],
	[ 'intranet/quick-link', { label: 'Payslips', description: 'Download your monthly payslip', icon: 'wallet' } ],
	[ 'intranet/quick-link', { label: 'Policies', description: 'HR, IT and travel policies', icon: 'book', badge: 'Updated' } ],
];

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const blockProps = useBlockProps( {
			style: { '--ib-columns': String( attributes.columns ) },
		} );
		const innerBlocksProps = useInnerBlocksProps( blockProps, {
			allowedBlocks: [ 'intranet/quick-link' ],
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
