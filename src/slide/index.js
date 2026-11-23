import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInput,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	ToggleControl,
} from '@wordpress/components';

import metadata from './block.json';

function slideProps( attributes ) {
	return {
		className: attributes.mediaUrl ? 'has-image' : undefined,
		style: { '--ib-overlay': String( attributes.overlay / 100 ) },
	};
}

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const {
			mediaId,
			mediaUrl,
			overlay,
			heading,
			text,
			buttonText,
			buttonUrl,
			opensInNewTab,
		} = attributes;

		const onSelectImage = ( media ) =>
			setAttributes( {
				mediaId: media.id,
				mediaUrl: media.sizes?.large?.url || media.url,
			} );

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Background', 'intranet-blocks' ) }>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelectImage }
								allowedTypes={ [ 'image' ] }
								value={ mediaId }
								render={ ( { open } ) => (
									<div style={ { display: 'flex', gap: '8px', marginBottom: '16px' } }>
										<Button variant="secondary" onClick={ open }>
											{ mediaUrl
												? __( 'Replace image', 'intranet-blocks' )
												: __( 'Choose image', 'intranet-blocks' ) }
										</Button>
										{ mediaUrl && (
											<Button
												variant="tertiary"
												isDestructive
												onClick={ () => setAttributes( { mediaId: 0, mediaUrl: '' } ) }
											>
												{ __( 'Remove', 'intranet-blocks' ) }
											</Button>
										) }
									</div>
								) }
							/>
						</MediaUploadCheck>
						{ mediaUrl && (
							<RangeControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={ __( 'Darken image (%)', 'intranet-blocks' ) }
								help={ __( 'Keeps the white text readable on bright photos.', 'intranet-blocks' ) }
								value={ overlay }
								min={ 0 }
								max={ 90 }
								step={ 5 }
								onChange={ ( value ) => setAttributes( { overlay: value } ) }
							/>
						) }
					</PanelBody>
					<PanelBody title={ __( 'Button', 'intranet-blocks' ) }>
						<URLInput
							__nextHasNoMarginBottom
							label={ __( 'Button link', 'intranet-blocks' ) }
							value={ buttonUrl }
							onChange={ ( value ) => setAttributes( { buttonUrl: value } ) }
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Open in a new tab', 'intranet-blocks' ) }
							checked={ opensInNewTab }
							onChange={ ( value ) => setAttributes( { opensInNewTab: value } ) }
						/>
					</PanelBody>
				</InspectorControls>

				<div { ...useBlockProps( slideProps( attributes ) ) }>
					{ mediaUrl && <img className="ib-slide__image" src={ mediaUrl } alt="" /> }
					<div className="ib-slide__content">
						<RichText
							tagName="h2"
							className="ib-slide__heading"
							placeholder={ __( 'Slide heading', 'intranet-blocks' ) }
							value={ heading }
							allowedFormats={ [] }
							onChange={ ( value ) => setAttributes( { heading: value } ) }
						/>
						<RichText
							tagName="p"
							className="ib-slide__text"
							placeholder={ __( 'A short line about it', 'intranet-blocks' ) }
							value={ text }
							allowedFormats={ [ 'core/bold', 'core/italic' ] }
							onChange={ ( value ) => setAttributes( { text: value } ) }
						/>
						<RichText
							tagName="span"
							className="ib-slide__button"
							placeholder={ __( 'Button text', 'intranet-blocks' ) }
							value={ buttonText }
							allowedFormats={ [] }
							onChange={ ( value ) => setAttributes( { buttonText: value } ) }
						/>
						{ buttonText && ! buttonUrl && (
							<p className="ib-slide__hint">
								{ __( 'Add a button link in the sidebar, otherwise the button is hidden on the page.', 'intranet-blocks' ) }
							</p>
						) }
					</div>
				</div>
			</>
		);
	},

	save( { attributes } ) {
		const { mediaUrl, heading, text, buttonText, buttonUrl, opensInNewTab } =
			attributes;

		return (
			<div { ...useBlockProps.save( slideProps( attributes ) ) }>
				{ mediaUrl && (
					<img className="ib-slide__image" src={ mediaUrl } alt="" loading="lazy" decoding="async" />
				) }
				<div className="ib-slide__content">
					{ heading && (
						<RichText.Content tagName="h2" className="ib-slide__heading" value={ heading } />
					) }
					{ text && (
						<RichText.Content tagName="p" className="ib-slide__text" value={ text } />
					) }
					{ buttonText && buttonUrl && (
						<a
							className="ib-slide__button"
							href={ buttonUrl }
							target={ opensInNewTab ? '_blank' : undefined }
							rel={ opensInNewTab ? 'noopener' : undefined }
						>
							{ buttonText }
						</a>
					) }
				</div>
			</div>
		);
	},
} );
