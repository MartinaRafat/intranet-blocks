/**
 * "Event details" panel in the editor sidebar for the Event post type.
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginDocumentSettingPanel, store as editorStore } from '@wordpress/editor';
import { useSelect } from '@wordpress/data';
import { useEntityProp } from '@wordpress/core-data';
import { TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

function EventDetails() {
	const postType = useSelect(
		( select ) => select( editorStore ).getCurrentPostType(),
		[]
	);
	const [ meta, setMeta ] = useEntityProp( 'postType', 'intranet_event', 'meta' );

	if ( postType !== 'intranet_event' || ! meta ) {
		return null;
	}

	const field = ( key, label, props = {} ) => (
		<TextControl
			__nextHasNoMarginBottom
			__next40pxDefaultSize
			label={ label }
			value={ meta[ key ] || '' }
			onChange={ ( value ) => setMeta( { ...meta, [ key ]: value } ) }
			{ ...props }
		/>
	);

	return (
		<PluginDocumentSettingPanel
			name="ib-event-details"
			title={ __( 'Event details', 'intranet-blocks' ) }
		>
			<div style={ { display: 'grid', gap: '12px' } }>
				{ field( '_ib_event_start', __( 'Starts', 'intranet-blocks' ), { type: 'datetime-local' } ) }
				{ field( '_ib_event_end', __( 'Ends (optional)', 'intranet-blocks' ), { type: 'datetime-local' } ) }
				{ field( '_ib_event_location', __( 'Location', 'intranet-blocks' ), {
					placeholder: __( 'Room, building or Teams', 'intranet-blocks' ),
				} ) }
			</div>
		</PluginDocumentSettingPanel>
	);
}

registerPlugin( 'ib-event-details', { render: EventDetails } );
