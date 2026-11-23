import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	URLInput,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

import metadata from './block.json';
import { Icon, ICON_NAMES } from '../shared/icons';

function IconPicker( { value, onChange } ) {
	return (
		<BaseControl
			__nextHasNoMarginBottom
			label={ __( 'Icon', 'intranet-blocks' ) }
			id="ib-icon-picker"
		>
			<div
				style={ {
					display: 'grid',
					gridTemplateColumns: 'repeat(6, 1fr)',
					gap: '4px',
				} }
			>
				{ ICON_NAMES.map( ( name ) => (
					<Button
						key={ name }
						label={ name }
						isPressed={ value === name }
						onClick={ () => onChange( name ) }
						style={ { justifyContent: 'center' } }
					>
						<Icon name={ name } size={ 20 } />
					</Button>
				) ) }
			</div>
		</BaseControl>
	);
}

function Tile( { attributes, children } ) {
	const { icon, badge } = attributes;
	return (
		<>
			<span className="ib-ql__icon">
				<Icon name={ icon } />
			</span>
			<span className="ib-ql__text">{ children }</span>
			<span className="ib-ql__arrow" aria-hidden="true">
				<Icon name="arrow" size={ 18 } />
			</span>
			{ badge && <span className="ib-ql__badge">{ badge }</span> }
		</>
	);
}

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const { label, description, url, opensInNewTab, icon, badge } =
			attributes;

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Link', 'intranet-blocks' ) }>
						<URLInput
							__nextHasNoMarginBottom
							label={ __( 'URL', 'intranet-blocks' ) }
							value={ url }
							onChange={ ( value ) => setAttributes( { url: value } ) }
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Open in a new tab', 'intranet-blocks' ) }
							checked={ opensInNewTab }
							onChange={ ( value ) =>
								setAttributes( { opensInNewTab: value } )
							}
						/>
					</PanelBody>
					<PanelBody title={ __( 'Look', 'intranet-blocks' ) }>
						<IconPicker
							value={ icon }
							onChange={ ( value ) => setAttributes( { icon: value } ) }
						/>
						<TextControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Badge', 'intranet-blocks' ) }
							help={ __( 'Short tag like "New" or "Updated". Leave empty to hide.', 'intranet-blocks' ) }
							value={ badge }
							onChange={ ( value ) => setAttributes( { badge: value } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...useBlockProps() }>
					<Tile attributes={ attributes }>
						<RichText
							tagName="span"
							className="ib-ql__label"
							placeholder={ __( 'Label', 'intranet-blocks' ) }
							value={ label }
							allowedFormats={ [] }
							onChange={ ( value ) => setAttributes( { label: value } ) }
						/>
						<RichText
							tagName="span"
							className="ib-ql__desc"
							placeholder={ __( 'Short description (optional)', 'intranet-blocks' ) }
							value={ description }
							allowedFormats={ [] }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
						/>
					</Tile>
				</div>
			</>
		);
	},

	save( { attributes } ) {
		const { label, description, url, opensInNewTab } = attributes;
		const Tag = url ? 'a' : 'div';
		const linkProps = url
			? {
					href: url,
					target: opensInNewTab ? '_blank' : undefined,
					rel: opensInNewTab ? 'noopener' : undefined,
			  }
			: {};

		return (
			<Tag { ...useBlockProps.save( linkProps ) }>
				<Tile attributes={ attributes }>
					<RichText.Content tagName="span" className="ib-ql__label" value={ label } />
					{ description && (
						<RichText.Content tagName="span" className="ib-ql__desc" value={ description } />
					) }
				</Tile>
			</Tag>
		);
	},
} );
