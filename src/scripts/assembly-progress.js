export function getAssemblyProgress(progress) {
	const normalized = Math.max(0, Math.min(1, (progress - 0.08) / 0.64));
	return normalized * normalized * (3 - 2 * normalized);
}
