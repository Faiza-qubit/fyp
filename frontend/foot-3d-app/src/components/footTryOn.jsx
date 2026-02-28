import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

/* ================= BACKEND ================= */
const INFER_URL = "http://192.168.100.34:8000/infer";

export default function FootTryOn() {

const videoRef = useRef(null);
const canvasRef = useRef(null);
const threeCanvasRef = useRef(null);
const statusRef = useRef(null);

/* ================= TRACK MEMORY ================= */
/* Snapchat-style temporal tracker */

const tracks = useRef([
  { pos:new THREE.Vector3(), scale:1, rot:0, lastSeen:0 },
  { pos:new THREE.Vector3(), scale:1, rot:0, lastSeen:0 }
]);

const shoes = useRef([null,null]);

/* ================================================= */

useEffect(()=>{

const video = videoRef.current;
const canvas = canvasRef.current;
const ctx = canvas.getContext("2d");

/* ================= THREE ================= */

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
60,1,0.1,3000
);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({
canvas:threeCanvasRef.current,
alpha:true,
antialias:true
});

renderer.setPixelRatio(window.devicePixelRatio);

scene.add(new THREE.AmbientLight(0xffffff,1.8));

const light=new THREE.DirectionalLight(0xffffff,1);
light.position.set(0,1000,1000);
scene.add(light);

/* ================= LOAD SHOES ================= */

const loader=new GLTFLoader();

for(let i=0;i<2;i++){

loader.load("/winter_shoe.glb",(gltf)=>{

const shoe=gltf.scene;

/* ✅ FIX PIVOT (HEEL BASE) */
const box=new THREE.Box3().setFromObject(shoe);
const center=box.getCenter(new THREE.Vector3());
shoe.position.sub(center);

const wrap=new THREE.Group();
wrap.add(shoe);
wrap.visible=false;

scene.add(wrap);
shoes.current[i]=wrap;

});
}

/* ================= PIXEL → WORLD ================= */

function worldFromPixel(x,y){

const nx=(x/video.videoWidth)*2-1;
const ny=-(y/video.videoHeight)*2+1;

const vec=new THREE.Vector3(nx,ny,0.5)
.unproject(camera);

const dir=vec.sub(camera.position)
.normalize();

return camera.position
.clone()
.add(dir.multiplyScalar(1000));
}

/* ================= SNAPCHAT TRACK UPDATE ================= */

function updateTrack(det,id){

const state=tracks.current[id];

const [x1,y1,x2,y2]=det.bbox;

const cx=(x1+x2)/2;
const cy=(y1+y2)/2;

const world=worldFromPixel(cx,cy);

/* ✅ POSITION SMOOTH */
state.pos.lerp(world,0.15);

/* ✅ SCALE FROM BBOX */
const width=x2-x1;
const targetScale=width/220;

state.scale=
THREE.MathUtils.lerp(
state.scale,
targetScale,
0.12
);

/* ✅ ROTATION FROM KEYPOINTS */
if(det.keypoints?.length>=2){

const ankle=det.keypoints[0];
const toe=det.keypoints.at(-1);

const dx=toe[0]-ankle[0];
const dy=toe[1]-ankle[1];

const angle=Math.atan2(dy,dx);

state.rot=
THREE.MathUtils.lerp(
state.rot,
angle,
0.15
);
}

state.lastSeen=performance.now();
}

/* ================= APPLY LOCKED SHOE ================= */

function applyShoe(id){

const shoe=shoes.current[id];
const state=tracks.current[id];

if(!shoe) return;

/* keep alive */
if(performance.now()-state.lastSeen>1200){
shoe.visible=false;
return;
}

shoe.visible=true;

shoe.position.copy(state.pos);

/* ✅ CORRECT ORIENTATION */
shoe.rotation.set(
-Math.PI/2,
-state.rot,
Math.PI
);

shoe.scale.setScalar(state.scale);
}

/* ================= DRAW BLACK BOX ================= */

function drawBoxes(dets){

ctx.strokeStyle="black";
ctx.lineWidth=5;

dets.forEach(det=>{
const[x1,y1,x2,y2]=det.bbox;
ctx.strokeRect(x1,y1,x2-x1,y2-y1);
});
}

/* ================= CAMERA ================= */

navigator.mediaDevices.getUserMedia({
video:{facingMode:"environment"}
})
.then(stream=>{
video.srcObject=stream;
video.onloadedmetadata=()=>video.play();
statusRef.current.innerText="Camera ready";
});

/* ================= MAIN LOOP ================= */

let busy=false;
let lastInfer=0;

async function loop(){

if(!video.videoWidth){
requestAnimationFrame(loop);
return;
}

/* resize */
canvas.width=video.videoWidth;
canvas.height=video.videoHeight;

renderer.setSize(
video.videoWidth,
video.videoHeight,
false
);

camera.aspect=
video.videoWidth/video.videoHeight;
camera.updateProjectionMatrix();

/* draw camera */
ctx.drawImage(video,0,0);

const now=performance.now();

/* ✅ slower inference = stable AR */
if(!busy && now-lastInfer>350){

busy=true;
lastInfer=now;

canvas.toBlob(async(blob)=>{

try{

const form=new FormData();
form.append("file",blob);

const res=await fetch(
INFER_URL,
{method:"POST",body:form}
);

const data=await res.json();

let dets=(data.detections||[])
.filter(d=>d.confidence>0.6);

/* LEFT → RIGHT FOOT LOCK */
dets.sort(
(a,b)=>
(a.bbox[0]+a.bbox[2])-
(b.bbox[0]+b.bbox[2])
);

dets=dets.slice(0,2);

drawBoxes(dets);

dets.forEach(
(det,i)=>updateTrack(det,i)
);

}catch{}

busy=false;

},"image/jpeg",0.6);
}

/* APPLY STABLE SHOES */
applyShoe(0);
applyShoe(1);

renderer.render(scene,camera);

requestAnimationFrame(loop);
}

loop();

},[]);

/* ================= UI ================= */

return(
<div style={{
background:"#000",
color:"#fff",
textAlign:"center",
minHeight:"100vh"
}}>

<h2>AR Foot Try-On PRO</h2>
<p ref={statusRef}>Initializing…</p>

<div style={{
position:"relative",
maxWidth:"500px",
margin:"auto"
}}>

<video
ref={videoRef}
muted
playsInline
style={{width:"100%"}}
/>

<canvas
ref={threeCanvasRef}
style={{
position:"absolute",
top:0,
left:0,
width:"100%",
height:"100%",
pointerEvents:"none"
}}
/>

<canvas
ref={canvasRef}
style={{display:"none"}}
/>

</div>
</div>
);
}