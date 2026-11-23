import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

import metadata from './block.json';

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		return (
			<div { ...useBlockProps() }>
				<RichText
					tagName="span"
					className="ib-stat__value"
					placeholder={ __( '120+', 'intranet-blocks' ) }
					value={ attributes.value }
					allowedFormats={ [] }
					onChange={ ( value ) => setAttributes( { value } ) }
				/>
				<RichText
					tagName="span"
					className="ib-stat__label"
					placeholder={ __( 'What it counts', 'intranet-blocks' ) }
					value={ attributes.label }
					allowedFormats={ [] }
					onChange={ ( label ) => setAttributes( { label } ) }
				/>
			</div>
		);
	},

	save( { attributes } ) {
		return (
			<div { ...useBlockProps.save() }>
				<RichText.Content tagName="span" className="ib-stat__value" value={ attributes.value } />
				<RichText.Content tagName="span" className="ib-stat__label" value={ attributes.label } />
			</div>
		);
	},
} );
