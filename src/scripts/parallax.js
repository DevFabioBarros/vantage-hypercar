export function getParallaxOffset({ top, height, viewportHeight, maxOffset = 24 }) {
	if (height <= 0 || viewportHeight <= 0 || top >= viewportHeight || top + height <= 0) return 0;

	const progress = (top + height / 2 - viewportHeight / 2) / viewportHeight;
	return Math.max(-maxOffset, Math.min(maxOffset, -progress * 48)) || 0;
}

export function setupParallax() {
	const images = document.querySelectorAll('[data-parallax]');
	if (!images.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	let frame = 0;
	const update = () => {
		frame = 0;
		for (const image of images) {
			const rect = image.getBoundingClientRect();
			if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;

			const maxOffset = window.innerWidth < 720 ? 8 : 24;
			const offset = getParallaxOffset({ top: rect.top, height: rect.height, viewportHeight: window.innerHeight, maxOffset });
			image.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`);
		}
	};
	const scheduleUpdate = () => {
		if (!frame) frame = window.requestAnimationFrame(update);
	};

	window.addEventListener('scroll', scheduleUpdate, { passive: true });
	window.addEventListener('resize', scheduleUpdate, { passive: true });
	scheduleUpdate();
}
