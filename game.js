const c=document.getElementById('game');
const ctx=c.getContext('2d');
const S=8,CELL=64;
const colors=['#ff4d4d','#ffd84d','#4dff88','#4da6ff','#b84dff','#ff944d'];
const board=[];
let selected=null;
for(let y=0;y<S;y++){board[y]=[];for(let x=0;x<S;x++)board[y][x]=Math.floor(Math.random()*6);}
function draw(){
ctx.clearRect(0,0,c.width,c.height);
for(let y=0;y<S;y++)for(let x=0;x<S;x++){
ctx.fillStyle=colors[board[y][x]];
ctx.fillRect(x*CELL+4,y*CELL+4,CELL-8,CELL-8);
if(selected&&selected.x===x&&selected.y===y){
ctx.strokeStyle="#ffffff";ctx.lineWidth=4;
ctx.strokeRect(x*CELL+2,y*CELL+2,CELL-4,CELL-4);}
}}
c.addEventListener('click',e=>{
const r=c.getBoundingClientRect();
const x=Math.floor((e.clientX-r.left)/(r.width/S));
const y=Math.floor((e.clientY-r.top)/(r.height/S));
selected={x,y};draw();
});
draw();