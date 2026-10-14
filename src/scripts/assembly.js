import { getAssemblyProgress } from './assembly-progress.js';

function createVantageBadge(THREE) {
	const canvas = document.createElement('canvas');
	canvas.width = 512;
	canvas.height = 128;
	const context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);
	context.fillStyle = '#f0f1f2';
	context.font = '500 58px Arial, sans-serif';
	context.textAlign = 'center';
	context.textBaseline = 'middle';
	context.fillText('VANTAGE', canvas.width / 2, canvas.height / 2 + 2);
	const texture = new THREE.CanvasTexture(canvas);
	texture.colorSpace = THREE.SRGBColorSpace;
	return texture;
}
export function setupAssembly() {
	const section = document.querySelector('[data-scroll-assembly]');
	if (!section) return () => {};

	const canvas = section.querySelector('[data-assembly-canvas]');
	const status = section.querySelector('[data-assembly-status]');
	const progressBar = section.querySelector('[data-assembly-progress]');
	const copy = section.querySelector('[data-assembly-copy]');
	const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	let loading = false;
	let loaded = false;
	let renderer;
	let scene;
	let camera;
	let assembledModel;
	let cameraFitDistance = 0;
	let parts = [];
	let frame = 0;
	let visible = false;
	let active = true;
	let observer;
	let resizeObserver;

	const getScrollProgress = () => {
		if (reducedMotion) return 1;
		const distance = Math.max(section.offsetHeight - window.innerHeight, 1);
		return Math.max(0, Math.min(1, -section.getBoundingClientRect().top / distance));
	};

	const renderAtScroll = () => {
		frame = 0;
		if (!loaded || !visible) return;

		const progress = getAssemblyProgress(getScrollProgress());
		assembledModel.rotation.y = progress * Math.PI * 2;
		const cameraDistance = cameraFitDistance * (1.35 - progress * 0.43);
		camera.position.set(cameraDistance * 0.32, cameraDistance * 0.18, cameraDistance * 0.92);
		camera.lookAt(0, 0, 0);
		for (const part of parts) {
			part.node.position.copy(part.home).addScaledVector(part.offset, 1 - progress);
		}
		progressBar.style.transform = `scaleX(${progress})`;
		copy.style.opacity = String(1 - progress * 0.45);
		copy.style.transform = `translateY(${progress * 14}px)`;
		renderer.render(scene, camera);
	};

	const scheduleRender = () => {
		if (!frame) frame = window.requestAnimationFrame(renderAtScroll);
	};

	const loadScene = async () => {
		if (loading || loaded) return;
		loading = true;
		status.textContent = 'Preparando o modelo 3D…';

		try {
			const [THREE, { GLTFLoader }, { RoomEnvironment }] = await Promise.all([
				import('three'),
				import('three/addons/loaders/GLTFLoader.js'),
				import('three/addons/environments/RoomEnvironment.js'),
			]);
			if (!active) return;
			renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: window.innerWidth > 760, powerPreference: 'low-power' });
			const pixelRatioLimit = window.matchMedia('(max-width: 760px)').matches ? 1.25 : 1.5;
		renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, pixelRatioLimit));
			renderer.outputColorSpace = THREE.SRGBColorSpace;
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1;

			scene = new THREE.Scene();
			scene.environmentIntensity = 0.65;
			const pmrem = new THREE.PMREMGenerator(renderer);
			const environment = new RoomEnvironment();
			scene.environment = pmrem.fromScene(environment).texture;
			environment.dispose();
			pmrem.dispose();
			scene.add(new THREE.HemisphereLight(0xe8edf2, 0x15191d, 1.6));
			const keyLight = new THREE.DirectionalLight(0xf2f4f6, 1.6);
			keyLight.position.set(-4, 7, 6);
			scene.add(keyLight);
			const rimLight = new THREE.DirectionalLight(0xd6b387, 1.8);
			rimLight.position.set(4, 3, -5);
			scene.add(rimLight);

			const loader = new GLTFLoader();
			const gltf = await loader.loadAsync('/lamborghini.glb', (event) => {
				const loadedMb = Math.round(event.loaded / (1024 * 1024));
				const progress = event.lengthComputable ? ` · ${Math.round((event.loaded / event.total) * 100)}%` : ` · ${loadedMb} MB`;
				status.textContent = `Carregando visualização 3D${progress}`;
			});
			if (!active) return;
			const modelRoot = gltf.scene.getObjectByName('GLTF_SceneRootNode') || gltf.scene;
			const paintTexture = await new THREE.TextureLoader().loadAsync('/images/vantage/titanium-metallic-paint.webp');
			if (!active) return;
			paintTexture.colorSpace = THREE.NoColorSpace;
			paintTexture.wrapS = THREE.RepeatWrapping;
			paintTexture.wrapT = THREE.RepeatWrapping;
			paintTexture.repeat.set(5, 5);
			const bodyPaint = new THREE.MeshPhysicalMaterial({
				name: 'VANTAGE obsidian metallic paint',
				color: '#090c10',
				metalness: 0.42,
				roughness: 0.23,
				roughnessMap: paintTexture,
				clearcoat: 0.78,
				clearcoatRoughness: 0.16,
				envMapIntensity: 0.62,
			});
			const preservedMaterials = new Set(['pneu.005', 'TIRE32', 'Display', 'Vents', 'Plastic_Dash', 'Seat_Belt', 'CUIR', 'PLAS', 'Glass', 'GLS_AR', 'LIGT_RED', 'LIGT_BLC', 'Carbon_M', 'CRBN_JANTE', 'chrome', 'Metal_C', 'LOGO', 'Steering_Wheel_Logo', 'CENTENARIO', 'Material.013', 'Material', 'material_24']);
			modelRoot.traverse((part) => {
				if (!part.isMesh) return;
				const materials = Array.isArray(part.material) ? part.material : [part.material];
				const refinished = materials.map((material) => {
					if (material?.name === 'material_31') {
						const glass = material.clone();
						glass.color.set('#0a0d11');
						glass.map = null;
						glass.transparent = true;
						glass.opacity = 0.68;
						return glass;
					}
					if (!preservedMaterials.has(material?.name)) return bodyPaint;
					if (['LOGO', 'Steering_Wheel_Logo', 'CENTENARIO', 'material_30'].includes(material?.name)) {
						const badge = material.clone();
						badge.color.set('#d7dadd');
						badge.metalness = 0.7;
						badge.roughness = 0.28;
						badge.map = null;
						badge.vertexColors = false;
						badge.emissive?.set('#000000');
						if (material.name === 'CENTENARIO') badge.color.set('#111418');
						if (material.name === 'Steering_Wheel_Logo') {
							badge.map = createVantageBadge(THREE);
							badge.transparent = true;
							badge.alphaTest = 0.05;
						}
						return badge;
					}
					if (!['Material.013', 'Material', 'TIRE32', 'material_24'].includes(material?.name)) return material;
					const accent = material.clone();
					accent.color.set('#24292e');
					accent.metalness = 0.56;
					accent.roughness = 0.3;
					return accent;
				});
				part.material = Array.isArray(part.material) ? refinished : refinished[0];
			});
			modelRoot.updateWorldMatrix(true, true);

			const bounds = new THREE.Box3().setFromObject(modelRoot);
			const modelCenter = bounds.getCenter(new THREE.Vector3());
			const modelSize = bounds.getSize(new THREE.Vector3());
			const localCenter = modelRoot.worldToLocal(modelCenter.clone());
			const maxDimension = Math.max(modelSize.x, modelSize.y, modelSize.z);
			if (!Number.isFinite(maxDimension) || maxDimension <= 0) throw new Error('O modelo 3D não contém geometria visível.');

			parts = modelRoot.children
				.filter((part) => {
					let hasMesh = false;
					part.traverse((child) => { if (child.isMesh) hasMesh = true; });
					return hasMesh;
				})
				.map((node, index) => {
					const partBounds = new THREE.Box3().setFromObject(node);
					const direction = modelRoot.worldToLocal(partBounds.getCenter(new THREE.Vector3())).sub(localCenter);
					if (direction.lengthSq() < 0.0001) direction.set(Math.cos(index * 2.4), 0.7, Math.sin(index * 2.4));
					direction.normalize();
					const distance = maxDimension * (0.27 + (index % 3) * 0.07);
					return { node, home: node.position.clone(), offset: direction.multiplyScalar(distance) };
				});
			if (!parts.length) throw new Error('Não foram encontradas partes animáveis no modelo.');

			const noseBadge = new THREE.Mesh(
				new THREE.PlaneGeometry(0.38, 0.09),
				new THREE.MeshBasicMaterial({ map: createVantageBadge(THREE), transparent: true, alphaTest: 0.05, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }),
			);
			noseBadge.name = 'VANTAGE nose wordmark';
			noseBadge.position.set(0, 0.54, 2.12);
			noseBadge.rotation.x = -Math.PI / 2;
			noseBadge.renderOrder = 2;
			modelRoot.add(noseBadge);

			gltf.scene.position.sub(modelCenter);
			assembledModel = gltf.scene;
			scene.add(gltf.scene);
			camera = new THREE.PerspectiveCamera(36, 1, 0.1, maxDimension * 30);
			const resize = () => {
				const { width, height } = canvas.getBoundingClientRect();
				if (!width || !height) return;
				const aspect = width / height;
				const fov = aspect < 0.9 ? 48 : 36;
				camera.fov = fov;
				camera.aspect = aspect;
				const horizontalFov = 2 * Math.atan(Math.tan((fov * Math.PI) / 360) * aspect);
				const zoom = aspect > 1 ? 0.92 : 1.18;
				cameraFitDistance = Math.max(modelSize.length() / (2 * Math.tan((fov * Math.PI) / 360)), modelSize.x / (2 * Math.tan(horizontalFov / 2))) * zoom;
				camera.updateProjectionMatrix();
				renderer.setSize(width, height, false);
				scheduleRender();
			};

			resizeObserver = new ResizeObserver(resize);
			resizeObserver.observe(canvas);
			document.documentElement.classList.add('assembly-motion');
			window.addEventListener('scroll', scheduleRender, { passive: true });
			window.addEventListener('resize', scheduleRender, { passive: true });
			loaded = true;
			status.textContent = reducedMotion ? 'Modelo 3D montado · movimento reduzido ativo' : 'Modelo 3D pronto';
			resize();
			scheduleRender();
		} catch (error) {
			if (!active) return;
			console.error('Não foi possível carregar o modelo 3D:', error);
			status.textContent = 'A visualização 3D não pôde ser carregada neste navegador.';
			section.classList.add('assembly-unavailable');
		}
	};

	if ('IntersectionObserver' in window) {
		observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible) loadScene();
			scheduleRender();
		}, { rootMargin: '800px 0px' });
		observer.observe(section);
	} else {
		visible = true;
		loadScene();
	}

	return () => {
		active = false;
		observer?.disconnect();
		resizeObserver?.disconnect();
		window.removeEventListener('scroll', scheduleRender);
		window.removeEventListener('resize', scheduleRender);
		if (frame) window.cancelAnimationFrame(frame);
		renderer?.dispose();
	};
}
