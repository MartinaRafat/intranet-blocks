import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, RangeControl, ToggleControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

import metadata from './block.json';
import './style.scss';

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const toggle = ( key, label, help ) => (
			<ToggleControl
				__nextHasNoMarginBottom
				label={ label }
				help={ help }
				checked={ attributes[ key ] }
				onChange={ ( value ) => setAttributes( { [ key ]: value } ) }
			/>
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Events', 'intranet-blocks' ) }>
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Number of events', 'intranet-blocks' ) }
							value={ attributes.count }
							min={ 1 }
							max={ 24 }
							onChange={ ( value ) => setAttributes( { count: value } ) }
						/>
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Columns', 'intranet-blocks' ) }
							value={ attributes.columns }
							min={ 1 }
							max={ 4 }
							onChange={ ( value ) => setAttributes( { columns: value } ) }
						/>
						{ toggle( 'showPast', __( 'Include past events', 'intranet-blocks' ) ) }
						{ toggle( 'showFilters', __( 'Region filter buttons', 'intranet-blocks' ), __( 'Shown when events come from more than one region.', 'intranet-blocks' ) ) }
						{ toggle( 'showExcerpt', __( 'Short description', 'intranet-blocks' ) ) }
					</PanelBody>
				</InspectorControls>
				<div { ...useBlockProps() }>
					<ServerSideRender
						block={ metadata.name }
						attributes={ attributes }
						skipBlockSupportAttributes
					/>
				</div>
			</>
		);
	},
	save: () => null,
} );
