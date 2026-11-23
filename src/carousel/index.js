import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	useInnerBlocksProps,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { Notice, PanelBody, RangeControl, ToggleControl } from '@wordpress/components';

import metadata from './block.json';
import './style.scss';
import './editor.scss';

const TEMPLATE = [
	[ 'intranet/slide', { heading: 'Quarterly town hall', text: 'Join the leadership team for results, plans and open Q&A.', buttonText: 'Register', buttonUrl: '#' } ],
	[ 'intranet/slide', { heading: 'New expense system', text: 'Submit and track expenses from your phone from 1 November.', buttonText: 'Learn more', buttonUrl: '#' } ],
];

registerBlockType( metadata.name, {
	edit( { attributes, setAttributes } ) {
		const { autoplay, interval, showArrows, showDots, height } = attributes;
		const blockProps = useBlockProps( {
			style: { '--ib-carousel-height': `${ height }px` },
		} );
		const innerBlocksProps = useInnerBlocksProps(
			{ className: 'ib-carousel__track' },
			{ allowedBlocks: [ 'intranet/slide' ], template: TEMPLATE }
		);

		return (
			<>
				<InspectorControls>
					<PanelBody title={ __( 'Playback', 'intranet-blocks' ) }>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Autoplay', 'intranet-blocks' ) }
							help={ __( 'Visitors always get a pause button. Autoplay is skipped for people who prefer reduced motion.', 'intranet-blocks' ) }
							checked={ autoplay }
							onChange={ ( value ) => setAttributes( { autoplay: value } ) }
						/>
						{ autoplay && (
							<RangeControl
								__nextHasNoMarginBottom
								__next40pxDefaultSize
								label={ __( 'Seconds per slide', 'intranet-blocks' ) }
								value={ interval }
								min={ 3 }
								max={ 15 }
								onChange={ ( value ) => setAttributes( { interval: value } ) }
							/>
						) }
					</PanelBody>
					<PanelBody title={ __( 'Layout', 'intranet-blocks' ) }>
						<RangeControl
							__nextHasNoMarginBottom
							__next40pxDefaultSize
							label={ __( 'Height (px)', 'intranet-blocks' ) }
							value={ height }
							min={ 240 }
							max={ 720 }
							step={ 20 }
							onChange={ ( value ) => setAttributes( { height: value } ) }
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Arrows', 'intranet-blocks' ) }
							checked={ showArrows }
							onChange={ ( value ) => setAttributes( { showArrows: value } ) }
						/>
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __( 'Dots', 'intranet-blocks' ) }
							checked={ showDots }
							onChange={ ( value ) => setAttributes( { showDots: value } ) }
						/>
					</PanelBody>
				</InspectorControls>
				<div { ...blockProps }>
					<Notice status="info" isDismissible={ false } className="ib-carousel__hint">
						{ __( 'Slides are stacked here so they are easy to edit. On the page they slide.', 'intranet-blocks' ) }
					</Notice>
					<div { ...innerBlocksProps } />
				</div>
			</>
		);
	},

	save( { attributes } ) {
		const { autoplay, interval, showArrows, showDots, height } = attributes;

		return (
			<div
				{ ...useBlockProps.save( {
					style: { '--ib-carousel-height': `${ height }px` },
					'data-autoplay': autoplay ? 'true' : 'false',
					'data-interval': String( interval ),
					'data-arrows': showArrows ? 'true' : 'false',
					'data-dots': showDots ? 'true' : 'false',
				} ) }
			>
				<div className="ib-carousel__track">
					<InnerBlocks.Content />
				</div>
			</div>
		);
	},
} );
