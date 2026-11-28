"use client";
import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

const vertex = `attribute vec2 position;attribute vec2 uv;varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`;
const fragment = `precision mediump float;varying vec2 vUv;uniform float uTime;uniform vec3 uColor;uniform vec2 uAspect;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p*=2.02;a*=.5;}return v;}
void main(){vec2 p=vUv*uAspect*1.6;float t=uTime*.035;
 float q=fbm(p+vec2(t,-t*.7));float r=fbm(p*1.3+q*1.8+vec2(-t*.6,t));
 float ink=smoothstep(.55,.82,r);float a=ink*.16*smoothstep(1.,.2,vUv.x*.8+(1.-vUv.y)*.2);
 gl_FragColor=vec4(uColor,a);}`;

/** Faint drifting ink behind the hero. Loaded lazily, paused offscreen or when the tab is hidden, fully disposed on unmount. */
export default function InkField({ color = [0.56, 0.65, 1] }: { color?: [number, number, number] }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = host.current;
    if (!node) return;
    let renderer: Renderer;
    try { renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(window.devicePixelRatio, 1.5), antialias: false }); } catch { return; }
    const gl = renderer.gl;
    if (!gl) return;
    node.appendChild(gl.canvas);
    gl.canvas.setAttribute("aria-hidden", "true");
    const program = new Program(gl, { vertex, fragment, transparent: true, uniforms: { uTime: { value: 0 }, uColor: { value: color }, uAspect: { value: [1, 1] } } });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => {
      const w = node.clientWidth, h = node.clientHeight;
      renderer.setSize(w, h);
      program.uniforms.uAspect.value = [w / Math.max(h, 1), 1];
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(node);
    let visible = true, raf = 0;
    const loop = (time: number) => {
      raf = 0;
      if (!visible || document.hidden) return;
      program.uniforms.uTime.value = time / 1000;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    const kick = () => { if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; kick(); });
    io.observe(node);
    document.addEventListener("visibilitychange", kick);
    kick();
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect(); ro.disconnect();
      document.removeEventListener("visibilitychange", kick);
      gl.canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [color]);
  return <div ref={host} className="tech-ink-field" aria-hidden="true"/>;
}
