import { setupAssembly } from './assembly.js';
import { setupParallax } from './parallax.js';

const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
if (finePointer.matches) {
	document.documentElement.classList.add('custom-cursor-ready');
	document.addEventListener('pointermove', (event) => {
		const cursor = document.querySelector('[data-custom-cursor]');
		if (cursor) {
			cursor.style.left = String(event.clientX) + 'px';
			cursor.style.top = String(event.clientY) + 'px';
		}
	});
	document.addEventListener('pointerover', (event) => {
		const target = event.target instanceof Element ? event.target : null;
		const cursor = document.querySelector('[data-custom-cursor]');
		cursor?.classList.toggle('is-active', Boolean(target?.closest('a, button, summary')));
		cursor?.classList.toggle('is-hidden', Boolean(target?.closest('input, textarea, select, [contenteditable="true"]')));
	});
	document.addEventListener('pointerout', (event) => {
		if (!event.relatedTarget) document.querySelector('[data-custom-cursor]')?.classList.add('is-hidden');
	});
}

let cleanupPage = () => {};

function setupPage() {
	cleanupPage();
	const controller = new AbortController();
	const observers = [];
	const cleanups = [setupParallax(), setupAssembly()];
	const { signal } = controller;

	const bespokeSection = document.querySelector('[data-bespoke]');
	if (bespokeSection) {
		const bespokeTitle = bespokeSection.querySelector('[data-bespoke-title]');
		const bespokeCopy = bespokeSection.querySelector('[data-bespoke-copy]');
		const bespokeOptions = bespokeSection.querySelectorAll('[data-theme][data-title]');

		bespokeOptions.forEach((option) => {
			option.addEventListener('click', () => {
				bespokeSection.dataset.theme = option.dataset.theme;
				bespokeTitle.textContent = option.dataset.title;
				bespokeCopy.textContent = option.dataset.description;
				bespokeOptions.forEach((item) => item.setAttribute('aria-pressed', String(item === option)));
			}, { signal });
		});
	}

	const filmSection = document.querySelector('[data-scroll-film]');
	const filmVideo = filmSection?.querySelector('[data-scroll-video]');
	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (filmSection && filmVideo && !prefersReducedMotion && 'IntersectionObserver' in window) {
		document.documentElement.classList.add('film-motion');
		const updateFilm = () => {
			const distance = Math.max(filmSection.offsetHeight - window.innerHeight, 1);
			const progress = Math.max(0, Math.min(1, -filmSection.getBoundingClientRect().top / distance));
			const inset = 1 - progress;
			filmSection.style.setProperty('--film-inset-y', String(13 * inset) + '%');
			filmSection.style.setProperty('--film-inset-x', String(10 * inset) + '%');
			filmSection.style.setProperty('--film-radius', String(18 * inset) + 'px');
		};
		let filmFrame = 0;
		cleanups.push(() => {
			if (filmFrame) window.cancelAnimationFrame(filmFrame);
			filmVideo.pause();
		});
		const scheduleFilmUpdate = () => {
			if (filmFrame) return;
			filmFrame = window.requestAnimationFrame(() => {
				filmFrame = 0;
				updateFilm();
			});
		};
		const filmObserver = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) filmVideo.play().catch(() => {});
			else filmVideo.pause();
		}, { rootMargin: '100px 0px' });
		observers.push(filmObserver);
		filmObserver.observe(filmSection);
		window.addEventListener('scroll', scheduleFilmUpdate, { passive: true, signal });
		window.addEventListener('resize', scheduleFilmUpdate, { passive: true, signal });
		updateFilm();
	} else {
		filmVideo?.pause();
	}

	const revealItems = document.querySelectorAll('[data-reveal]');
	if (revealItems.length && !prefersReducedMotion && 'IntersectionObserver' in window) {
		document.documentElement.classList.add('motion-ready');
		const revealObserver = new IntersectionObserver((entries) => {
			for (const entry of entries) entry.target.classList.toggle('is-visible', entry.isIntersecting);
		}, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
		observers.push(revealObserver);
		revealItems.forEach((item) => revealObserver.observe(item));
	}

	return () => {
		controller.abort();
		observers.forEach((observer) => observer.disconnect());
		cleanups.forEach((cleanup) => cleanup?.());
	};
}

document.addEventListener('astro:before-swap', () => cleanupPage());
document.addEventListener('astro:page-load', () => {
	cleanupPage = setupPage();
});
