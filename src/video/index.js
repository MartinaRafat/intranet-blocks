import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from '@wordpress/block-editor';
import { Button, PanelBody, TextControl } from '@wordpress/components';

import metadata from './block.json';
import { Icon } from '../shared/icons';
import { autoPoster, embedUrl, parseVideo } from '../shared/video';

function Thumb( { url, posterUrl, duration } ) {
	const poster = posterUrl || autoPoster( url );

	return (
		<>
			{ poster ? (
				<img className="ib-video__poster" src={ poster } alt="" loading="lazy" decoding="async" />
			) : (
				<span className="ib-video__placeholder" />
			) }
			<span className="ib-video__play" aria-hidden="true">
				<Icon name="play" size={ 22 } />
			</span>
			{ duration && <span className="ib-video__duration">{ duration }</span> }
		</>
	);
}

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const { url, title, duration, posterId, posterUrl } = attributes;
		const known = parseVideo( url );

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Video', 'intranet-blocks' ) }>
						<TextControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							type="url"
							label={ __( 'Video link', 'intranet-blocks' ) }
							help={
								url && ! known
									? __( 'This doesn\'t look like a YouTube, Vimeo or MP4 link. It will open as a normal link.', 'intranet-blocks' )
									: __( 'YouTube, Vimeo or a link to an .mp4 file.', 'intranet-blocks' )
							}
							value={ url }
							onChange={ ( value ) => setAttributes( { url: value.trim() } ) }
						/>
						<TextControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Length', 'intranet-blocks' ) }
							placeholder="3:45"
							value={ duration }
							onChange={ ( value ) => setAttributes( { duration: value } ) }
						/>
					</PanelBody>
					<PanelBody title={ __( 'Thumbnail', 'intranet-blocks' ) } initialOpen={ false }>
						<p>{ __( 'YouTube thumbnails are used automatically. Pick an image to use your own.', 'intranet-blocks' ) }</p>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={ [ 'image' ] }
								value={ posterId }
								onSelect={ ( media ) =>
									setAttributes( {
										posterId: media.id,
										posterUrl: media.sizes?.large?.url || media.url,
									} )
								}
								render={ ( { open } ) => (
									<div style={ { display: 'flex', gap: '8px' } }>
										<Button variant="secondary" onClick={ open }>
											{ posterUrl ? __( 'Replace image', 'intranet-blocks' ) : __( 'Choose image', 'intranet-blocks' ) }
										</Button>
										{ posterUrl && (
											<Button
												variant="tertiary"
												isDestructive
												onClick={ () => setAttributes( { posterId: 0, posterUrl: '' } ) }
											>
												{ __( 'Remove', 'intranet-blocks' ) }
											</Button>
										) }
									</div>
								) }
							/>
						</MediaUploadCheck>
					</PanelBody>
				</InspectorControls>

				<figure { ...useBlockProps() }>
					<div className="ib-video__open">
						<Thumb url={ url } posterUrl={ posterUrl } duration={ duration } />
						{ ! url && (
							<span className="ib-video__empty">
								{ __( 'Add the video link in the sidebar', 'intranet-blocks' ) }
							</span>
						) }
					</div>
					<RichText
						tagName="figcaption"
						className="ib-video__title"
						placeholder={ __( 'Video title', 'intranet-blocks' ) }
						value={ title }
						allowedFormats={ [] }
						onChange={ ( value ) => setAttributes( { title: value } ) }
					/>
				</figure>
			</>
		);
	},

	save( { attributes } ) {
		const { url, title, duration, posterUrl } = attributes;
		const video = parseVideo( url );

		return (
			<figure { ...useBlockProps.save() }>
				<a
					className="ib-video__open"
					href={ url || undefined }
					data-embed={ video ? embedUrl( url ) : undefined }
					data-type={ video ? video.type : undefined }
					aria-label={ title || undefined }
				>
					<Thumb url={ url } posterUrl={ posterUrl } duration={ duration } />
				</a>
				{ title && (
					<RichText.Content tagName="figcaption" className="ib-video__title" value={ title } />
				) }
			</figure>
		);
	},
} );
