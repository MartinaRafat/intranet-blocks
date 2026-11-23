import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InnerBlocks,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

import metadata from './block.json';

const ALLOWED = [
	'core/paragraph',
	'core/list',
	'core/file',
	'core/buttons',
	'core/image',
	'core/table',
];

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const { title, meta, isOpen } = attributes;
		const innerBlocksProps = useInnerBlocksProps(
			{ className: 'ib-accordion-item__content' },
			{ allowedBlocks: ALLOWED, template: [ [ 'core/paragraph' ] ] }
		);

		// Always expanded in the editor so the content stays editable.
		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Section', 'intranet-blocks' ) }>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Open when the page loads', 'intranet-blocks' ) }
							checked={ isOpen }
							onChange={ ( value ) => setAttributes( { isOpen: value } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...useBlockProps() }>
					<div className="ib-accordion-item__head">
						<RichText
							tagName="span"
							className="ib-accordion-item__title"
							placeholder={ __( 'Section title', 'intranet-blocks' ) }
							value={ title }
							allowedFormats={ [] }
							onChange={ ( value ) => setAttributes( { title: value } ) }
						/>
						<RichText
							tagName="span"
							className="ib-accordion-item__meta"
							placeholder={ __( 'Tag, e.g. 3 files', 'intranet-blocks' ) }
							value={ meta }
							allowedFormats={ [] }
							onChange={ ( value ) => setAttributes( { meta: value } ) }
						/>
					</div>
					<div { ...innerBlocksProps } />
				</div>
			</>
		);
	},

	save( { attributes } ) {
		const { title, meta, isOpen } = attributes;

		return (
			<details { ...useBlockProps.save() } open={ isOpen || undefined }>
				<summary>
					<RichText.Content tagName="span" className="ib-accordion-item__title" value={ title } />
					{ meta && (
						<RichText.Content tagName="span" className="ib-accordion-item__meta" value={ meta } />
					) }
				</summary>
				<div className="ib-accordion-item__content">
					<InnerBlocks.Content />
				</div>
			</details>
		);
	},
} );
