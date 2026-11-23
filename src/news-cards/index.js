import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import ServerSideRender from '@wordpress/server-side-render';

import metadata from './block.json';
import './style.scss';

function Edit( { attributes, setAttributes } ) {
	const {
		categoryId,
		count,
		columns,
		layout,
		showFilters,
		showImage,
		showDate,
		showExcerpt,
		showReadingTime,
	} = attributes;

	const categories = useSelect(
		( select ) =>
			select( coreStore ).getEntityRecords( 'taxonomy', 'category', {
				per_page: -1,
				_fields: 'id,name',
			} ),
		[]
	);

	const toggle = ( key, label ) => (
		<ToggleControl
			__nextHasNoMarginBottom
			label={ label }
			checked={ attributes[ key ] }
			onChange={ ( value ) => setAttributes( { [ key ]: value } ) }
		/>
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Posts', 'intranet-blocks' ) }>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Category', 'intranet-blocks' ) }
						value={ categoryId }
						options={ [
							{ label: __( 'All categories', 'intranet-blocks' ), value: 0 },
							...( categories || [] ).map( ( cat ) => ( {
								label: cat.name,
								value: cat.id,
							} ) ),
						] }
						onChange={ ( value ) => setAttributes( { categoryId: Number( value ) } ) }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Number of posts', 'intranet-blocks' ) }
						value={ count }
						min={ 1 }
						max={ 12 }
						onChange={ ( value ) => setAttributes( { count: value } ) }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Layout', 'intranet-blocks' ) }>
					<SelectControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Layout', 'intranet-blocks' ) }
						value={ layout }
						options={ [
							{ label: __( 'Featured first post', 'intranet-blocks' ), value: 'featured' },
							{ label: __( 'Even grid', 'intranet-blocks' ), value: 'grid' },
						] }
						onChange={ ( value ) => setAttributes( { layout: value } ) }
					/>
					<RangeControl
						__nextHasNoMarginBottom
						__next40pxDefaultSize
						label={ __( 'Columns', 'intranet-blocks' ) }
						value={ columns }
						min={ 1 }
						max={ 4 }
						onChange={ ( value ) => setAttributes( { columns: value } ) }
					/>
					{ toggle( 'showFilters', __( 'Category filter buttons', 'intranet-blocks' ) ) }
				</PanelBody>
				<PanelBody title={ __( 'Card details', 'intranet-blocks' ) }>
					{ toggle( 'showImage', __( 'Featured image', 'intranet-blocks' ) ) }
					{ toggle( 'showDate', __( 'Date', 'intranet-blocks' ) ) }
					{ toggle( 'showReadingTime', __( 'Reading time', 'intranet-blocks' ) ) }
					{ toggle( 'showExcerpt', __( 'Excerpt', 'intranet-blocks' ) ) }
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<ServerSideRender
					block={ metadata.name }
					attributes={ {
						categoryId,
						count,
						columns,
						layout,
						showFilters,
						showImage,
						showDate,
						showExcerpt,
						showReadingTime,
					} }
					skipBlockSupportAttributes
				/>
			</div>
		</>
	);
}

registerBlockType( metadata.name, {
	edit: Edit,
	save: () => null,
} );
