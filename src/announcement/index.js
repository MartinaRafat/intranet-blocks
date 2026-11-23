import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
	URLInput,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { useEffect } from '@wordpress/element';

import metadata from './block.json';
import { Icon } from '../shared/icons';
import './style.scss';

const TONE_ICONS = {
	info: 'info',
	success: 'check',
	warning: 'alert',
	urgent: 'bell',
};

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const { message, linkText, linkUrl, tone, dismissible, dismissKey } =
			attributes;

		// Each bar gets its own key so closing one doesn't close the others.
		useEffect( () => {
			if ( ! dismissKey ) {
				setAttributes( { dismissKey: Math.random().toString( 36 ).slice( 2, 10 ) } );
			}
		}, [ dismissKey ] );

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Announcement', 'intranet-blocks' ) }>
						<SelectControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Type', 'intranet-blocks' ) }
							value={ tone }
							options={ [
								{ label: __( 'Information', 'intranet-blocks' ), value: 'info' },
								{ label: __( 'Good news', 'intranet-blocks' ), value: 'success' },
								{ label: __( 'Heads up', 'intranet-blocks' ), value: 'warning' },
								{ label: __( 'Urgent', 'intranet-blocks' ), value: 'urgent' },
							] }
							onChange={ ( value ) => setAttributes( { tone: value } ) }
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'People can close it', 'intranet-blocks' ) }
							help={ __( 'It stays closed in their browser until you change the message.', 'intranet-blocks' ) }
							checked={ dismissible }
							onChange={ ( value ) => setAttributes( { dismissible: value } ) }
						/>
						<URLInput
							__nextHasNoMarginBottom
							label={ __( 'Link', 'intranet-blocks' ) }
							value={ linkUrl }
							onChange={ ( value ) => setAttributes( { linkUrl: value } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...useBlockProps( { className: `is-tone-${ tone }` } ) }>
					<span className="ib-announce__icon">
						<Icon name={ TONE_ICONS[ tone ] } size={ 20 } />
					</span>
					<RichText
						tagName="p"
						className="ib-announce__text"
						placeholder={ __( 'Write the announcement…', 'intranet-blocks' ) }
						value={ message }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
						onChange={ ( value ) => setAttributes( { message: value } ) }
					/>
					<RichText
						tagName="span"
						className="ib-announce__link"
						placeholder={ __( 'Link text', 'intranet-blocks' ) }
						value={ linkText }
						allowedFormats={ [] }
						onChange={ ( value ) => setAttributes( { linkText: value } ) }
					/>
				</div>
			</>
		);
	},

	save( { attributes } ) {
		const { message, linkText, linkUrl, tone, dismissible, dismissKey } =
			attributes;

		return (
			<div
				{ ...useBlockProps.save( {
					className: `is-tone-${ tone }`,
					'data-dismiss': dismissible && dismissKey ? dismissKey : undefined,
				} ) }
			>
				<span className="ib-announce__icon">
					<Icon name={ TONE_ICONS[ tone ] } size={ 20 } />
				</span>
				<RichText.Content tagName="p" className="ib-announce__text" value={ message } />
				{ linkText && linkUrl && (
					<a className="ib-announce__link" href={ linkUrl }>
						{ linkText }
					</a>
				) }
			</div>
		);
	},
} );
