/**
 * Works out what kind of video a URL points to.
 */
export function parseVideo( url = '' ) {
	const youtube = url.match(
		/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
	);
	if ( youtube ) {
		return { type: 'youtube', id: youtube[ 1 ] };
	}

	const vimeo = url.match( /vimeo\.com\/(?:video\/)?(\d+)/ );
	if ( vimeo ) {
		return { type: 'vimeo', id: vimeo[ 1 ] };
	}

	if ( /\.(mp4|webm|ogv)(\?.*)?$/i.test( url ) ) {
		return { type: 'file', id: '' };
	}

	return null;
}

export function embedUrl( url ) {
	const video = parseVideo( url );
	if ( ! video ) {
		return '';
	}
	if ( video.type === 'youtube' ) {
		return `https://www.youtube-nocookie.com/embed/${ video.id }?autoplay=1&rel=0`;
	}
	if ( video.type === 'vimeo' ) {
		return `https://player.vimeo.com/video/${ video.id }?autoplay=1`;
	}
	return url;
}

export function autoPoster( url ) {
	const video = parseVideo( url );
	return video && video.type === 'youtube'
		? `https://i.ytimg.com/vi/${ video.id }/hqdefault.jpg`
		: '';
}
