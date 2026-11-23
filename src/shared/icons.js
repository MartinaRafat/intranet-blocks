/**
 * Simple 24px stroke icons used by the blocks. Drawn for this plugin.
 */
const PATHS = {
	calendar: (
		<>
			<rect x="3" y="5" width="18" height="16" rx="2" />
			<path d="M16 3v4M8 3v4M3 10h18" />
		</>
	),
	laptop: (
		<>
			<rect x="4" y="5" width="16" height="11" rx="1.5" />
			<path d="M2 19h20" />
		</>
	),
	wallet: (
		<>
			<rect x="3" y="6" width="18" height="14" rx="2" />
			<path d="M3 10h18M16 15h1" />
		</>
	),
	file: (
		<>
			<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
			<path d="M14 3v5h5M9 13h6M9 17h4" />
		</>
	),
	users: (
		<>
			<circle cx="9" cy="8" r="3.5" />
			<path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3a6.5 6.5 0 0 1 3.5 5.7" />
		</>
	),
	announcement: (
		<>
			<path d="M4 10v4h3l6 4V6L7 10z" />
			<path d="M17 9.5a3.5 3.5 0 0 1 0 5" />
		</>
	),
	help: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M9.5 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.4V14M12 17h.01" />
		</>
	),
	shield: (
		<>
			<path d="M12 3l8 3v6c0 4.4-3.3 8.2-8 9-4.7-.8-8-4.6-8-9V6z" />
			<path d="M9 12l2 2 4-4" />
		</>
	),
	book: (
		<>
			<path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3z" />
			<path d="M5 17a3 3 0 0 1 3-3h11M9 8h6" />
		</>
	),
	clock: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 7v5l3 2" />
		</>
	),
	chat: <path d="M4 5h16v11H10l-6 4z" />,
	link: (
		<>
			<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
			<path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
		</>
	),
	info: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M12 11v5M12 8h.01" />
		</>
	),
	check: (
		<>
			<circle cx="12" cy="12" r="9" />
			<path d="M8 12.5l2.5 2.5L16 9.5" />
		</>
	),
	alert: (
		<>
			<path d="M12 4l9 16H3z" />
			<path d="M12 10v4M12 17h.01" />
		</>
	),
	bell: (
		<>
			<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z" />
			<path d="M10 20a2 2 0 0 0 4 0" />
		</>
	),
	play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" />,
	arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
	chevron: <path d="M9 6l6 6-6 6" />,
};

export const ICON_NAMES = [
	'calendar',
	'laptop',
	'wallet',
	'file',
	'users',
	'announcement',
	'help',
	'shield',
	'book',
	'clock',
	'chat',
	'link',
	'bell',
	'info',
];

export function Icon( { name, size = 24 } ) {
	return (
		<svg
			viewBox="0 0 24 24"
			width={ size }
			height={ size }
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			focusable="false"
		>
			{ PATHS[ name ] || PATHS.link }
		</svg>
	);
}
