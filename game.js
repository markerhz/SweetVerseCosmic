
const cv=document.getElementById('game');
const ctx=cv.getContext('2d');
const N=8,C=64;
const cols=['#ff4d4d','#ffd84d','#5cff5c','#4db8ff','#b46cff','#ff9c3a'];
const b=[];
let sel=null;
for(let y=0;y<N;y++){b[y]=[];for(let x=0;x<N;x++)b[y][x]=Math.floor(Math.random()*6);}
function draw(){
ctx.clearRect(0,0,512,512);
for(let y=0;y<N;y++)for(let x=0;x<N;x++){
ctx.fillStyle=cols[b[y][x]];
ctx.fillRect(x*C+4,y*C+4,C-8,C-8);
if(sel&&sel.x==x&&sel.y==y){
ctx.strokeStyle="white";ctx.lineWidth=4;
ctx.strokeRect(x*C+2,y*C+2,C-4,C-4);
}
}
}
function adj(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y)==1;}
cv.onclick=e=>{
const r=cv.getBoundingClientRect();
const x=Math.floor((e.clientX-r.left)/(r.width/N));
const y=Math.floor((e.clientY-r.top)/(r.height/N));
if(!sel){sel={x,y};draw();return;}
if(adj(sel,{x,y})){
let t=b[sel.y][sel.x];
b[sel.y][sel.x]=b[y][x];
b[y][x]=t;
}
sel=null;
draw();
}
draw();
