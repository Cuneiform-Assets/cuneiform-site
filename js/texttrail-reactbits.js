// ReactBits TextTrail adapted for vanilla JavaScript with Three.js
import * as THREE from '/node_modules/three/build/three.module.js';

const hexToRgb = (hex) => {
  let h = hex.replace("#", "");
  if (h.length === 3)
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const loadFont = async (fam) => {
  if ("fonts" in document) await document.fonts.load(`64px "${fam}"`);
};

const BASE_VERT = `
varying vec2 v_uv;
void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);v_uv=uv;}`;

const SIMPLEX = `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
float snoise3(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);
  const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=1./7.; vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;
  vec4 s1=floor(b1)*2.+1.;
  vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=inversesqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);
  m*=m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

const PERSIST_FRAG = `
uniform sampler2D sampler;
uniform float time;
uniform vec2 mousePos;
uniform float noiseFactor,noiseScale,rgbPersistFactor,alphaPersistFactor;
varying vec2 v_uv;
${SIMPLEX}
void main(){
  float a=snoise3(vec3(v_uv*noiseFactor,time*.1))*noiseScale;
  float b=snoise3(vec3(v_uv*noiseFactor,time*.1+100.))*noiseScale;
  vec4 t=texture2D(sampler,v_uv+vec2(a,b)+mousePos*.005);
  gl_FragColor=vec4(t.xyz*rgbPersistFactor,alphaPersistFactor);
}`;

const TEXT_FRAG = `
uniform sampler2D sampler;uniform vec3 color;varying vec2 v_uv;
void main(){
  vec4 t=texture2D(sampler,v_uv);
  float alpha=smoothstep(0.1,0.9,t.a);
  if(alpha<0.01)discard;
  gl_FragColor=vec4(color,alpha);
}`;

class ReactBitsTextTrail {
  constructor(options = {}) {
    this.text = options.text || "Vibe";
    this.fontFamily = options.fontFamily || "Figtree";
    this.fontWeight = options.fontWeight || "900";
    this.noiseFactor = options.noiseFactor || 1;
    this.noiseScale = options.noiseScale || 0.0005;
    this.rgbPersistFactor = options.rgbPersistFactor || 0.98;
    this.alphaPersistFactor = options.alphaPersistFactor || 0.95;
    this.animateColor = options.animateColor !== undefined ? options.animateColor : false;
    this.startColor = options.startColor || "#ffffff";
    this.textColor = options.textColor || "#ffffff";
    this.backgroundColor = options.backgroundColor || 0x271e37;
    this.colorCycleInterval = options.colorCycleInterval || 3000;
    this.supersample = options.supersample || 2;
    
    this.container = null;
    this.renderer = null;
    this.scene = null;
    this.fluidScene = null;
    this.camera = null;
    this.clock = null;
    this.animationId = null;
    
    this.persistColor = hexToRgb(this.textColor || this.startColor).map((c) => c / 255);
    this.targetColor = [...this.persistColor];
    this.mouse = [0, 0];
    this.target = [0, 0];
  }

  async init(container) {
    this.container = container;
    console.log('Initializing ReactBits TextTrail with Three.js...');
    
    const size = () => ({
      w: this.container.clientWidth || 800,
      h: this.container.clientHeight || 120,
    });
    let { w, h } = size();

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor(new THREE.Color(this.backgroundColor), 1);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.renderer.setSize(w, h);
    this.container.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.fluidScene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.camera = new THREE.OrthographicCamera(-w / 2, w / 2, h / 2, -h / 2, 0.1, 10);
    this.camera.position.z = 1;

    this.rt0 = new THREE.WebGLRenderTarget(w, h);
    this.rt1 = this.rt0.clone();

    this.setupShaders(w, h);
    await this.setupText();
    this.setupEventListeners();
    this.setupResize();
    this.startAnimation();
    
    console.log('ReactBits TextTrail initialized successfully');
  }

  setupShaders(w, h) {
    const quadMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sampler: { value: null },
        time: { value: 0 },
        mousePos: { value: new THREE.Vector2(-1, 1) },
        noiseFactor: { value: this.noiseFactor },
        noiseScale: { value: this.noiseScale },
        rgbPersistFactor: { value: this.rgbPersistFactor },
        alphaPersistFactor: { value: this.alphaPersistFactor },
      },
      vertexShader: BASE_VERT,
      fragmentShader: PERSIST_FRAG,
      transparent: true,
    });
    this.quad = new THREE.Mesh(new THREE.PlaneGeometry(w, h), quadMaterial);
    this.fluidScene.add(this.quad);

    const labelMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sampler: { value: null },
        color: { value: new THREE.Vector3(...this.persistColor) },
      },
      vertexShader: BASE_VERT,
      fragmentShader: TEXT_FRAG,
      transparent: true,
    });
    this.label = new THREE.Mesh(
      new THREE.PlaneGeometry(Math.min(w, h), Math.min(w, h)),
      labelMaterial
    );
    this.scene.add(this.label);
  }

  async setupText() {
    await loadFont(this.fontFamily);
    
    const texCanvas = document.createElement("canvas");
    const ctx = texCanvas.getContext("2d", {
      alpha: true,
      colorSpace: "srgb",
    });

    const max = Math.min(this.renderer.capabilities.maxTextureSize, 4096);
    const pixelRatio = (window.devicePixelRatio || 1) * this.supersample;
    const canvasSize = max * pixelRatio;
    texCanvas.width = canvasSize;
    texCanvas.height = canvasSize;
    texCanvas.style.width = `${max}px`;
    texCanvas.style.height = `${max}px`;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(pixelRatio, pixelRatio);
    ctx.clearRect(0, 0, max, max);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.shadowColor = "rgba(255,255,255,0.3)";
    ctx.shadowBlur = 2;
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const refSize = 250;
    ctx.font = `${this.fontWeight} ${refSize}px ${this.fontFamily}`;
    const width = ctx.measureText(this.text).width;
    ctx.font = `${this.fontWeight} ${(refSize * max) / width}px ${this.fontFamily}`;

    const cx = max / 2, cy = max / 2;
    const offs = [
      [0, 0],
      [0.1, 0],
      [-0.1, 0],
      [0, 0.1],
      [0, -0.1],
      [0.1, 0.1],
      [-0.1, -0.1],
      [0.1, -0.1],
      [-0.1, 0.1],
    ];
    ctx.globalAlpha = 1 / offs.length;
    offs.forEach(([dx, dy]) => ctx.fillText(this.text, cx + dx, cy + dy));
    ctx.globalAlpha = 1;

    const tex = new THREE.CanvasTexture(texCanvas);
    tex.generateMipmaps = true;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    this.label.material.uniforms.sampler.value = tex;
  }

  setupEventListeners() {
    const onMove = (e) => {
      const r = this.container.getBoundingClientRect();
      this.target[0] = ((e.clientX - r.left) / r.width) * 2 - 1;
      this.target[1] = ((r.top + r.height - e.clientY) / r.height) * 2 - 1;
    };
    this.container.addEventListener("pointermove", onMove);
    this.onMove = onMove;

    if (this.animateColor && !this.textColor) {
      this.colorTimer = setInterval(() => {
        this.targetColor = [Math.random(), Math.random(), Math.random()];
      }, this.colorCycleInterval);
    }
  }

  setupResize() {
    this.resizeObserver = new ResizeObserver(() => {
      const size = () => ({
        w: this.container.clientWidth || 800,
        h: this.container.clientHeight || 120,
      });
      const { w, h } = size();
      
      this.renderer.setSize(w, h);
      this.camera.left = -w / 2;
      this.camera.right = w / 2;
      this.camera.top = h / 2;
      this.camera.bottom = -h / 2;
      this.camera.updateProjectionMatrix();
      
      this.quad.geometry.dispose();
      this.quad.geometry = new THREE.PlaneGeometry(w, h);
      this.rt0.setSize(w, h);
      this.rt1.setSize(w, h);
      this.label.geometry.dispose();
      this.label.geometry = new THREE.PlaneGeometry(Math.min(w, h), Math.min(w, h));
    });
    this.resizeObserver.observe(this.container);
  }

  startAnimation() {
    const animate = () => {
      const dt = this.clock.getDelta();
      
      if (this.animateColor && !this.textColor) {
        for (let i = 0; i < 3; i++)
          this.persistColor[i] += (this.targetColor[i] - this.persistColor[i]) * dt;
      }
      
      const speed = dt * 5;
      this.mouse[0] += (this.target[0] - this.mouse[0]) * speed;
      this.mouse[1] += (this.target[1] - this.mouse[1]) * speed;

      this.quad.material.uniforms.mousePos.value.set(this.mouse[0], this.mouse[1]);
      this.quad.material.uniforms.sampler.value = this.rt1.texture;
      this.quad.material.uniforms.time.value = this.clock.getElapsedTime();
      this.label.material.uniforms.color.value.set(...this.persistColor);

      this.renderer.autoClearColor = false;
      this.renderer.setRenderTarget(this.rt0);
      this.renderer.clearColor();
      this.renderer.render(this.fluidScene, this.camera);
      this.renderer.render(this.scene, this.camera);
      this.renderer.setRenderTarget(null);
      this.renderer.render(this.fluidScene, this.camera);
      this.renderer.render(this.scene, this.camera);
      
      [this.rt0, this.rt1] = [this.rt1, this.rt0];
      
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    if (this.colorTimer) {
      clearInterval(this.colorTimer);
    }
    if (this.onMove && this.container) {
      this.container.removeEventListener("pointermove", this.onMove);
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    if (this.renderer && this.container) {
      this.container.removeChild(this.renderer.domElement);
      this.renderer.dispose();
    }
    if (this.rt0) this.rt0.dispose();
    if (this.rt1) this.rt1.dispose();
    if (this.quad) {
      this.quad.material.dispose();
      this.quad.geometry.dispose();
    }
    if (this.label) {
      this.label.material.dispose();
      this.label.geometry.dispose();
    }
  }
}

// Export for use
window.ReactBitsTextTrail = ReactBitsTextTrail;