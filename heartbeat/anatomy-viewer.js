import * as THREE from './vendor/three.module.min.js';

const host = document.querySelector('[data-anatomy-viewer]');
const heartHost = document.querySelector('[data-heart-viewer]');

if (host) {
  const phoneLayout = matchMedia('(max-width: 680px)');
  const systemColors = {
    skeletal: '#e2d9ba', muscular: '#a85b50', cardiac: '#b96760', sensory: '#b0c8ce',
    arterial: '#c05245', venous: '#527c9f', nervous: '#d8b565', respiratory: '#b98991',
    digestive: '#b8916b', urinary: '#b47961', lymphatic: '#879f7c', endocrine: '#c5a09a',
    reproductive: '#bda098', integumentary: '#ba9b7d', connective: '#aec3bb'
  };
  const systems = Object.keys(systemColors);
  const visibleSystems = new Set(systems.filter(system => system !== 'integumentary'));
  const status = host.querySelector('.anatomy-loading');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  } catch {
    status.textContent = '3D anatomy requires WebGL';
    status.classList.add('is-error');
  }

  if (renderer) {
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(29, 1, 0.01, 30);
    const bodyCenter = new THREE.Vector3(0, 0.86, 0);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x9eb3bd, 1.25));
    const key = new THREE.DirectionalLight(0xfffbf6, 2.4);
    key.position.set(-2, 4, 3);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd9f3ff, 1.9);
    rim.position.set(2.5, 2, -3);
    scene.add(rim);

    let atlas;
    let stateData;
    let stateTexture;
    let explode = 0;
    let focusHeart = 0;
    let scrollProgress = 0;
    let featuredHeartIndex = -1;
    let loaded = 0;
    let running = false;
    let loadStarted = false;
    let inventoryLayout;
    const meshes = [];
    const centers = [];
    let heartRenderer;
    let heartScene;
    let heartGroup;
    let heartCamera;
    let heartBounds;

    if (heartHost) {
      const heartCanvas = document.createElement('canvas');
      heartCanvas.setAttribute('aria-hidden', 'true');
      heartHost.prepend(heartCanvas);
      heartRenderer = new THREE.WebGLRenderer({ canvas: heartCanvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
      heartRenderer.setClearColor(0x000000, 0);
      heartRenderer.outputColorSpace = THREE.SRGBColorSpace;
      heartRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      heartRenderer.toneMappingExposure = 1.08;
      heartScene = new THREE.Scene();
      heartGroup = new THREE.Group();
      heartScene.add(heartGroup);
      heartCamera = new THREE.PerspectiveCamera(29, 1, 0.005, 10);
      heartScene.add(new THREE.HemisphereLight(0xffffff, 0x8b9faa, 1.35));
      const heartKey = new THREE.DirectionalLight(0xfff8f2, 2.7);
      heartKey.position.set(-2, 3, 3);
      heartScene.add(heartKey);
      const heartRim = new THREE.DirectionalLight(0xd9f3ff, 1.8);
      heartRim.position.set(2, 1, -2);
      heartScene.add(heartRim);
      heartBounds = new THREE.Box3();
    }

    const createInventoryLayout = parts => {
      const aspect = Math.max(0.65, Math.min(1.55, innerWidth / Math.max(1, innerHeight * 0.72)));
      const cells = parts.map(part => ({
        id: part.id,
        width: Math.max(0.035, part.bounds[1][0] - part.bounds[0][0]) + 0.04,
        height: Math.max(0.035, part.bounds[1][1] - part.bounds[0][1]) + 0.04
      }));
      const area = cells.reduce((total, cell) => total + cell.width * cell.height, 0);
      const targetWidth = Math.max(...cells.map(cell => cell.width), Math.sqrt(area * aspect) * 1.18);
      cells.sort((a, b) => b.height - a.height || a.id.localeCompare(b.id));
      const positions = new Map();
      let x = 0;
      let y = 0;
      let rowHeight = 0;
      let usedWidth = 0;
      cells.forEach(cell => {
        if (x > 0 && x + cell.width > targetWidth) {
          x = 0;
          y += rowHeight;
          rowHeight = 0;
        }
        positions.set(cell.id, { x: x + cell.width / 2, y: -y - cell.height / 2 });
        x += cell.width;
        usedWidth = Math.max(usedWidth, x);
        rowHeight = Math.max(rowHeight, cell.height);
      });
      const height = y + rowHeight;
      positions.forEach(position => {
        position.x -= usedWidth / 2;
        position.y += height / 2;
      });
      return { positions, width: usedWidth, height };
    };

    const decode = async (response, expectedBytes) => {
      if (!response.ok) throw new Error('An anatomy file could not be loaded.');
      const payload = await response.arrayBuffer();
      const signature = new Uint8Array(payload, 0, Math.min(2, payload.byteLength));
      const isGzip = signature[0] === 0x1f && signature[1] === 0x8b;
      const buffer = isGzip
        ? await new Response(new Blob([payload]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer()
        : payload;
      if (buffer.byteLength !== expectedBytes) throw new Error('An anatomy file was incomplete.');
      return buffer;
    };

    const materialFor = (system, width) => {
      const material = new THREE.MeshStandardMaterial({
        color: systemColors[system] || '#aebbb8', metalness: 0.05, roughness: 0.55,
        side: THREE.DoubleSide
      });
      material.onBeforeCompile = shader => {
        shader.uniforms.partState = { value: stateTexture };
        shader.uniforms.stateWidth = { value: width };
        shader.vertexShader = 'attribute float partIndex; uniform sampler2D partState; uniform float stateWidth; varying float partVisible;\n' + shader.vertexShader;
        shader.vertexShader = shader.vertexShader.replace(
          '#include <begin_vertex>',
          '#include <begin_vertex>\nvec4 state = texture2D(partState, vec2((partIndex + 0.5) / stateWidth, 0.5)); transformed += state.xyz; partVisible = state.w;'
        );
        shader.fragmentShader = 'varying float partVisible;\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <clipping_planes_fragment>',
          '#include <clipping_planes_fragment>\nif (partVisible < 0.01) discard;'
        );
        shader.fragmentShader = shader.fragmentShader.replace('#include <color_fragment>', '#include <color_fragment>\ndiffuseColor.a *= partVisible;');
      };
      material.transparent = true;
      return material;
    };

    const mergeSystemGeometry = (parts, buffer, partIndexes) => {
      let vertexCount = 0;
      let indexCount = 0;
      parts.forEach(part => { vertexCount += part.vertexCount; indexCount += part.indexCount; });
      const positions = new Float32Array(vertexCount * 3);
      const normals = new Int16Array(vertexCount * 3);
      const indices = new Uint32Array(indexCount);
      const partIndex = new Float32Array(vertexCount);
      let vertexOffset = 0;
      let indexOffset = 0;
      parts.forEach(part => {
        const atlasIndex = partIndexes.get(part.id);
        positions.set(new Float32Array(buffer, part.positions, part.vertexCount * 3), vertexOffset * 3);
        normals.set(new Int16Array(buffer, part.normals, part.vertexCount * 3), vertexOffset * 3);
        const sourceIndices = new Uint32Array(buffer, part.indices, part.indexCount);
        for (let index = 0; index < sourceIndices.length; index++) indices[indexOffset + index] = sourceIndices[index] + vertexOffset;
        partIndex.fill(atlasIndex, vertexOffset, vertexOffset + part.vertexCount);
        vertexOffset += part.vertexCount;
        indexOffset += part.indexCount;
      });
      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3, true));
      geometry.setAttribute('partIndex', new THREE.BufferAttribute(partIndex, 1));
      geometry.setIndex(new THREE.BufferAttribute(indices, 1));
      geometry.computeBoundingSphere();
      return geometry;
    };

    const renderHeart = () => {
      if (!heartRenderer || !heartScene || !heartCamera || heartBounds.isEmpty()) return;
      const center = heartBounds.getCenter(new THREE.Vector3());
      const size = heartBounds.getSize(new THREE.Vector3());
      // Frame against the canvas's real aspect ratio and leave enough breathing
      // room for the widest point of the heart as it revolves.
      const distance = Math.max(size.y, size.x / Math.max(0.25, heartCamera.aspect)) / (2 * Math.tan(THREE.MathUtils.degToRad(heartCamera.fov / 2))) * 1.82;
      heartCamera.position.set(center.x + distance * 0.26, center.y + size.y * 0.03, center.z + distance);
      heartCamera.lookAt(center);
      heartRenderer.render(heartScene, heartCamera);
      heartHost.classList.add('is-ready');
    };

    const smoothRange = (value, start, end) => {
      const progress = THREE.MathUtils.clamp((value - start) / (end - start), 0, 1);
      return progress * progress * (3 - 2 * progress);
    };
    const updateParts = amount => {
      if (!atlas || !stateData) return;
      // Let the anatomical separation and the inventory layout overlap gently.
      // Starting the second phase at zero velocity avoids the abrupt pull-back
      // that previously happened once the individual pieces became smaller.
      const systemAmount = smoothRange(amount, 0, 0.68);
      const inventoryAmount = smoothRange(amount, 0.2, 1);
      atlas.parts.forEach((part, index) => {
        const center = centers[index];
        const systemIndex = systems.indexOf(part.system);
        const angle = systemIndex / systems.length * Math.PI * 2;
        const systemX = Math.sin(angle) * 0.43 * systemAmount;
        const systemZ = Math.cos(angle) * 0.36 * systemAmount;
        const systemY = (center.y - bodyCenter.y) * 0.20 * systemAmount;
        const cell = inventoryLayout?.positions.get(part.id);
        const inventoryX = cell ? cell.x - center.x : 0;
        const inventoryY = cell ? cell.y + bodyCenter.y - center.y : 0;
        const inventoryZ = -center.z;
        const visibility = visibleSystems.has(part.system)
          ? (index === featuredHeartIndex ? 1 : 1 - focusHeart)
          : 0;
        stateData.set([
          THREE.MathUtils.lerp(systemX, inventoryX, inventoryAmount),
          THREE.MathUtils.lerp(systemY, inventoryY, inventoryAmount),
          THREE.MathUtils.lerp(systemZ, inventoryZ, inventoryAmount),
          visibility
        ], index * 4);
      });
      stateTexture.needsUpdate = true;
      const normalDistance = 5.2;
      const inventoryDistance = inventoryLayout
        ? Math.max(inventoryLayout.height, inventoryLayout.width / Math.max(0.5, camera.aspect)) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.08
        : 4.55;
      const featurePart = atlas.parts[featuredHeartIndex];
      const featureCell = featurePart ? inventoryLayout?.positions.get(featurePart.id) : null;
      const featureSize = featurePart
        ? new THREE.Vector3().fromArray(featurePart.bounds[1]).sub(new THREE.Vector3().fromArray(featurePart.bounds[0]))
        : new THREE.Vector3(0.5, 0.5, 0.5);
      const featureTarget = featureCell
        ? new THREE.Vector3(featureCell.x, featureCell.y + bodyCenter.y, 0)
        : bodyCenter;
      const cameraTarget = bodyCenter.clone().lerp(featureTarget, focusHeart);
      const featureDistance = Math.max(featureSize.y, featureSize.x / Math.max(0.3, camera.aspect))
        / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))) * 1.62;
      const distance = THREE.MathUtils.lerp(THREE.MathUtils.lerp(normalDistance, inventoryDistance, inventoryAmount), featureDistance, focusHeart);
      const orbit = performance.now() * 0.0001;
      camera.position.set(
        THREE.MathUtils.lerp(0.23, cameraTarget.x + Math.sin(orbit) * distance, focusHeart),
        THREE.MathUtils.lerp(0.94, cameraTarget.y + 0.018, focusHeart),
        THREE.MathUtils.lerp(distance, cameraTarget.z + Math.cos(orbit) * distance, focusHeart)
      );
      camera.lookAt(cameraTarget);
    };

    const load = async () => {
      try {
        atlas = await fetch('./models/atlas.json').then(response => {
          if (!response.ok) throw new Error('The anatomy catalogue could not be loaded.');
          return response.json();
        });
        const width = THREE.MathUtils.ceilPowerOfTwo(atlas.parts.length);
        stateData = new Float32Array(width * 4);
        stateTexture = new THREE.DataTexture(stateData, width, 1, THREE.RGBAFormat, THREE.FloatType);
        stateTexture.needsUpdate = true;
        const partIndexes = new Map(atlas.parts.map((part, index) => [part.id, index]));
        atlas.parts.forEach((part, index) => {
          const min = new THREE.Vector3().fromArray(part.bounds[0]);
          const max = new THREE.Vector3().fromArray(part.bounds[1]);
          const center = min.add(max).multiplyScalar(0.5);
          centers[index] = center;
        });
        inventoryLayout = createInventoryLayout(atlas.parts.filter(part => visibleSystems.has(part.system)));
        featuredHeartIndex = atlas.parts.findIndex(part => part.name === 'Wall of ventricle');
        updateParts(explode);

        let cursor = 0;
        const loadChunk = async chunkIndex => {
          const chunk = atlas.chunks[chunkIndex];
          const modelPath = `./models/${chunk.gzip.split('/').pop()}`;
          const buffer = await decode(await fetch(modelPath), chunk.bytes);
          const bySystem = new Map();
          atlas.parts.forEach(part => {
            if (part.chunk !== chunkIndex || !visibleSystems.has(part.system)) return;
            if (!bySystem.has(part.system)) bySystem.set(part.system, []);
            bySystem.get(part.system).push(part);
          });
          bySystem.forEach((parts, system) => {
            const geometry = mergeSystemGeometry(parts, buffer, partIndexes);
            const mesh = new THREE.Mesh(geometry, materialFor(system, width));
            mesh.frustumCulled = false;
            scene.add(mesh);
            meshes.push(mesh);
            if (system === 'cardiac' && heartScene && heartRenderer) {
              const heartParts = parts.filter(part => (part.bounds[0][1] + part.bounds[1][1]) / 2 < 1.5);
              if (heartParts.length) {
                const heartGeometry = mergeSystemGeometry(heartParts, buffer, partIndexes);
                heartGeometry.computeBoundingBox();
                heartBounds.union(heartGeometry.boundingBox);
                const heartMaterial = new THREE.MeshStandardMaterial({
                  color: systemColors.cardiac, metalness: 0.04, roughness: 0.48, side: THREE.DoubleSide
                });
                heartGroup.add(new THREE.Mesh(heartGeometry, heartMaterial));
              }
            }
          });
          loaded += 1;
          status.textContent = `Building anatomy · ${Math.round(loaded / atlas.chunks.length * 100)}%`;
        };
        const loaderCount = phoneLayout.matches ? 1 : 3;
        await Promise.all(Array.from({ length: loaderCount }, async () => {
          while (cursor < atlas.chunks.length) await loadChunk(cursor++);
        }));
        host.classList.add('is-ready');
        status.textContent = '';
      } catch (error) {
        status.textContent = error instanceof Error ? error.message : 'The anatomy could not be loaded.';
        status.classList.add('is-error');
      }
    };

    const resize = () => {
      const width = Math.max(1, host.clientWidth);
      const height = Math.max(1, host.clientHeight);
      renderer.setPixelRatio(Math.min(devicePixelRatio, phoneLayout.matches || width < 180 ? 1.5 : 2));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      if (heartRenderer && heartCamera && heartHost) {
        const heartWidth = Math.max(1, heartHost.clientWidth);
        const heartHeight = Math.max(1, heartHost.clientHeight);
        heartRenderer.setPixelRatio(Math.min(devicePixelRatio, 2));
        heartRenderer.setSize(heartWidth, heartHeight, false);
        heartCamera.aspect = heartWidth / heartHeight;
        heartCamera.updateProjectionMatrix();
        renderHeart();
      }
    };
    new ResizeObserver(resize).observe(host);
    resize();

    const seek = value => {
      scrollProgress = THREE.MathUtils.clamp(Number(value) || 0, 0, 1);
      explode = smoothRange(scrollProgress, 0, 0.42);
      focusHeart = smoothRange(scrollProgress, 0.42, 0.57);
      updateParts(explode);
    };
    window.n1AnatomyFilm = { seek };
    seek(parseFloat(getComputedStyle(host.closest('.insights-scene')).getPropertyValue('--insight')) || 0);
    const animate = (stamp = performance.now()) => {
      if (!running) return;
      requestAnimationFrame(animate);
      updateParts(explode);
      renderer.render(scene, camera);
      if (heartGroup) heartGroup.rotation.y = stamp * 0.00012;
      renderHeart();
    };
    const nearbyTargets = new Set();
    const beginLoad = () => {
      if (loadStarted) return;
      loadStarted = true;
      load();
    };
    const proximity = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) nearbyTargets.add(entry.target);
        else nearbyTargets.delete(entry.target);
      });
      const nearby = nearbyTargets.size > 0;
      if (nearby) beginLoad();
      if (nearby && !document.hidden && !running) {
        running = true;
        animate();
      } else if (!nearby) {
        running = false;
      }
    }, { rootMargin: '1000px 0px' });
    proximity.observe(host);
    if (heartHost) proximity.observe(heartHost);
    const warmAfterPageLoad = () => {
      const warm = () => beginLoad();
      if ('requestIdleCallback' in window) requestIdleCallback(warm, { timeout: 1500 });
      else setTimeout(warm, 300);
    };
    if (document.readyState === 'complete') warmAfterPageLoad();
    else addEventListener('load', warmAfterPageLoad, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        running = false;
      }
      else if (nearbyTargets.size && !running) {
        running = true;
        animate();
      }
    });
  }
}
