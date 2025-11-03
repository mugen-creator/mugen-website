/**
 * Mugen LLC Luxury Interactive Background
 * =========================================
 * Advanced Three.js background animation with elegant particles
 * and interactive elements.
 */

class LuxuryBackground {
  constructor() {
    this.container = document.getElementById('webgl-canvas');
    if (!this.container) return;

    // Check for WebGL support
    if (!this.isWebGLSupported()) {
      this.fallbackBackground();
      return;
    }

    // Initialize properties
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.geometry = null;
    this.material = null;
    this.mesh = null;
    this.particles = null;
    this.clock = null;
    this.sizes = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Mouse tracking
    this.mouse = {
      x: 0,
      y: 0,
      prevX: 0,
      prevY: 0,
      velocityX: 0,
      velocityY: 0
    };

    // Scroll position
    this.scrollY = 0;
    this.targetScrollY = 0;

    // Camera position
    this.cameraPosition = {
      x: 0,
      y: 0,
      targetX: 0,
      targetY: 0
    };

    // Initialize and start animation
    this.init();
    this.setupEventListeners();
    this.animate();
  }

  isWebGLSupported() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  fallbackBackground() {
    console.warn('WebGL is not supported in this browser. Falling back to CSS background.');
    this.container.style.background = 'linear-gradient(45deg, #000000, #111111)';

    // Add some simple particle elements as fallback
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';

      // Set random size
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;

      // Random opacity
      particle.style.opacity = Math.random() * 0.5 + 0.1;

      this.container.appendChild(particle);
    }
  }

  init() {
    // Setup THREE.js scene
    this.setupScene();
    this.setupCamera();
    this.setupRenderer();
    this.createLights();
    this.createObjects();
    this.createParticles();

    // 【追加】背景配置の最終確認
    this.ensureBackgroundPosition();
  }

  // 新しいメソッドを追加
  ensureBackgroundPosition() {
    // コンテナが確実に背景に配置されるよう強制設定
    if (this.container) {
      this.container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      z-index: -100 !important;
      pointer-events: none !important;
    `;
    }

    // レンダラーのキャンバス要素も設定
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.style.cssText = `
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      z-index: -100 !important;
      pointer-events: none !important;
    `;
    }

    console.log('WebGL Background: Final positioning applied');
  }

  setupScene() {
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
  }

  setupCamera() {
    const fov = 75;
    const aspect = this.sizes.width / this.sizes.height;
    const near = 0.1;
    const far = 1000;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.set(0, 0, 30);
    this.scene.add(this.camera);
  }

  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });

    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    // Append to container
    this.container.appendChild(this.renderer.domElement);

    // 【重要】WebGLキャンバスを確実に背景に配置
    this.container.style.position = 'fixed';
    this.container.style.top = '0';
    this.container.style.left = '0';
    this.container.style.width = '100%';
    this.container.style.height = '100%';
    this.container.style.zIndex = '-100';
    this.container.style.pointerEvents = 'none';

    // レンダラーのDOMエレメントにも設定
    this.renderer.domElement.style.zIndex = '-100';
    this.renderer.domElement.style.pointerEvents = 'none';

    console.log('WebGL Background: Positioned behind content');
  }

  createLights() {
    // Ambient light - very subtle
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    this.scene.add(ambientLight);

    // Directional light - golden hue but reduced intensity
    const directionalLight = new THREE.DirectionalLight(0xd4af37, 0.4);
    directionalLight.position.set(1, 1, 1);
    this.scene.add(directionalLight);

    // Point light with subtle animation - reduced intensity
    const pointLight = new THREE.PointLight(0xd4af37, 0.2, 50);
    pointLight.position.set(-10, 5, 10);
    this.scene.add(pointLight);

    // Store animated light for updates
    this.pointLight = pointLight;
  }

  createObjects() {
    // TorusKnot - elegant complex shape
    this.geometry = new THREE.TorusKnotGeometry(10, 1.5, 200, 32, 2, 5);

    // Luxury gold material with wireframe - reduced opacity
    this.material = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.05  // 半分の透明度に減少
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    // Inner sphere for depth - barely visible
    const innerGeometry = new THREE.IcosahedronGeometry(6, 3);
    const innerMaterial = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.025  // 半分の透明度に減少
    });

    this.innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    this.scene.add(this.innerMesh);
  }

  createParticles() {
    // Particle system
    const particleCount = 2000;
    const particleGeometry = new THREE.BufferGeometry();

    // Create particle positions in 3D space
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    // Gold to bronze color palette
    const color1 = new THREE.Color(0xd4af37); // Gold
    const color2 = new THREE.Color(0xb87333); // Bronze

    for (let i = 0; i < particleCount; i++) {
      // Create a sphere distribution
      const radius = 15 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Random size between 0.5 and 2
      scales[i] = Math.random() * 1.5 + 0.5;

      // Mix colors between gold and bronze
      const mixedColor = color1.clone().lerp(color2, Math.random());
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom shader material for particles - reduced opacity
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        size: { value: 2.0 },
        opacity: { value: 0.3 }  // 全体の不透明度を下げる
      },
      vertexShader: `
        attribute float scale;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float size;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Subtle movement
          float noise = sin(pos.x * 0.1 + time) * cos(pos.y * 0.1 + time) * 0.5;
          pos.x += noise * 0.3;
          pos.y += noise * 0.2;
          pos.z += noise * 0.4;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = scale * size * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        uniform float opacity;
        
        void main() {
          // Circular particle
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          // Soft edge
          float particleOpacity = 1.0 - smoothstep(0.4, 0.5, dist);
          gl_FragColor = vec4(vColor, particleOpacity * opacity);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.scene.add(this.particles);
  }

  setupEventListeners() {
    // Resize event
    window.addEventListener('resize', this.onResize.bind(this));

    // Mouse move event
    window.addEventListener('mousemove', this.onMouseMove.bind(this));

    // Scroll event
    window.addEventListener('scroll', this.onScroll.bind(this));

    // Touch events for mobile
    window.addEventListener('touchstart', this.onTouchStart.bind(this), { passive: true });
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
  }

  onResize() {
    // Update sizes
    this.sizes.width = window.innerWidth;
    this.sizes.height = window.innerHeight;

    // Update camera
    this.camera.aspect = this.sizes.width / this.sizes.height;
    this.camera.updateProjectionMatrix();

    // Update renderer
    this.renderer.setSize(this.sizes.width, this.sizes.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  onMouseMove(event) {
    // Calculate mouse position and velocity
    const lastX = this.mouse.x;
    const lastY = this.mouse.y;

    // Normalize mouse coordinates (-1 to 1)
    this.mouse.x = (event.clientX / this.sizes.width) * 2 - 1;
    this.mouse.y = -(event.clientY / this.sizes.height) * 2 + 1;

    // Calculate velocity for dynamic effects
    this.mouse.velocityX = this.mouse.x - lastX;
    this.mouse.velocityY = this.mouse.y - lastY;

    // Set camera target position based on mouse position
    this.cameraPosition.targetX = this.mouse.x * 2;
    this.cameraPosition.targetY = this.mouse.y * 2;
  }

  onTouchStart(event) {
    if (event.touches.length > 0) {
      this.mouse.x = (event.touches[0].clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.touches[0].clientY / this.sizes.height) * 2 + 1;
    }
  }

  onTouchMove(event) {
    if (event.touches.length > 0) {
      const lastX = this.mouse.x;
      const lastY = this.mouse.y;

      this.mouse.x = (event.touches[0].clientX / this.sizes.width) * 2 - 1;
      this.mouse.y = -(event.touches[0].clientY / this.sizes.height) * 2 + 1;

      this.mouse.velocityX = this.mouse.x - lastX;
      this.mouse.velocityY = this.mouse.y - lastY;

      this.cameraPosition.targetX = this.mouse.x * 2;
      this.cameraPosition.targetY = this.mouse.y * 2;
    }
  }

  onScroll() {
    // Get scroll position as a percentage of page height
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    this.targetScrollY = window.scrollY / scrollHeight;
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  render() {
    const elapsedTime = this.clock.getElapsedTime();

    // Smooth camera movement
    this.cameraPosition.x += (this.cameraPosition.targetX - this.cameraPosition.x) * 0.05;
    this.cameraPosition.y += (this.cameraPosition.targetY - this.cameraPosition.y) * 0.05;

    // Apply camera position with damping
    this.camera.position.x = this.cameraPosition.x * 3;
    this.camera.position.y = this.cameraPosition.y * 2;
    this.camera.lookAt(0, 0, 0);

    // Smooth scroll
    this.scrollY += (this.targetScrollY - this.scrollY) * 0.1;

    // Rotate main mesh based on time and mouse movement
    if (this.mesh) {
      this.mesh.rotation.x = elapsedTime * 0.05;
      this.mesh.rotation.y = elapsedTime * 0.08;
      this.mesh.rotation.z = this.scrollY * Math.PI * 2;

      // Subtle distortion based on mouse velocity
      this.mesh.scale.x = 1 + Math.abs(this.mouse.velocityX) * 3;
      this.mesh.scale.y = 1 + Math.abs(this.mouse.velocityY) * 3;
    }

    // Inner mesh counter-rotation
    if (this.innerMesh) {
      this.innerMesh.rotation.x = -elapsedTime * 0.03;
      this.innerMesh.rotation.y = -elapsedTime * 0.05;
      this.innerMesh.rotation.z = -this.scrollY * Math.PI;
    }

    // Animate particles
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.03;
      this.particles.rotation.z = this.scrollY * Math.PI * 0.5;

      // Update shader time uniform
      this.particles.material.uniforms.time.value = elapsedTime;

      // Reduce particle opacity based on scroll to improve readability
      const scrollRatio = Math.min(window.scrollY / (document.body.scrollHeight - window.innerHeight), 1);
      this.particles.material.uniforms.opacity.value = 0.3 * (1 - scrollRatio * 0.5);
    }

    // Animate point light
    if (this.pointLight) {
      this.pointLight.position.x = Math.sin(elapsedTime * 0.3) * 15;
      this.pointLight.position.y = Math.cos(elapsedTime * 0.2) * 10;
      this.pointLight.position.z = Math.sin(elapsedTime * 0.5) * 10;

      // Subtle intensity variation - reduced intensity
      this.pointLight.intensity = 0.2 + Math.sin(elapsedTime) * 0.05;
    }

    // Reset mouse velocity
    this.mouse.velocityX *= 0.9;
    this.mouse.velocityY *= 0.9;

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
}

/**
 * Initialize the background when the DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check if THREE.js is available
  if (typeof THREE === 'undefined') {
    console.error('THREE.js is not loaded. Make sure the script is included before this file.');
    return;
  }

  // Initialize the luxury background
  const luxuryBackground = new LuxuryBackground();
});