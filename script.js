const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const canvas=$("#petals"),ctx=canvas.getContext("2d"); let W,H,petals=[],animating=false;

function resize(){
  const d=Math.min(devicePixelRatio||1,2);
  canvas.width=innerWidth*d; canvas.height=innerHeight*d;
  canvas.style.width=innerWidth+"px"; canvas.style.height=innerHeight+"px";
  ctx.setTransform(d,0,0,d,0,0); W=innerWidth; H=innerHeight;
}
addEventListener("resize",resize); resize();

function petal(burst=false){
  return {
    x:burst?W/2+(Math.random()-.5)*90:Math.random()*W,
    y:burst?H*.45:-20,
    rx:4+Math.random()*5, ry:7+Math.random()*7,
    vx:(Math.random()-.5)*(burst?7:1.2),
    vy:burst?(-3+Math.random()*6):(1+Math.random()*1.5),
    rot:Math.random()*Math.PI, vr:(Math.random()-.5)*.08,
    a:.48+Math.random()*.42, shade:Math.floor(Math.random()*4)
  };
}
function addPetals(n,burst=false){for(let i=0;i<n;i++)petals.push(petal(burst));animate()}
function animate(){
  if(animating)return; animating=true;
  const loop=()=>{
    ctx.clearRect(0,0,W,H);
    petals.forEach(p=>{
      p.x+=p.vx+Math.sin(p.y*.014)*.22; p.y+=p.vy; p.rot+=p.vr;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rot); ctx.globalAlpha=p.a;
      ctx.fillStyle=["#f4bfd0","#e99ab5","#f8dce5","#d982a1"][p.shade];
      ctx.beginPath(); ctx.ellipse(0,0,p.rx,p.ry,0,0,Math.PI*2); ctx.fill(); ctx.restore();
    });
    petals=petals.filter(p=>p.y<H+40&&p.x>-60&&p.x<W+60);
    if(petals.length) requestAnimationFrame(loop); else {animating=false;ctx.clearRect(0,0,W,H);}
  }; requestAnimationFrame(loop);
}

function haptic(pattern=20){if(navigator.vibrate)navigator.vibrate(pattern)}
let audioCtx;
function chime(freq=660,dur=.18){
  try{
    audioCtx ||= new (window.AudioContext||window.webkitAudioContext)();
    const osc=audioCtx.createOscillator(),gain=audioCtx.createGain();
    osc.type="sine"; osc.frequency.value=freq;
    gain.gain.setValueAtTime(.0001,audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.055,audioCtx.currentTime+.02);
    gain.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+dur);
    osc.connect(gain);gain.connect(audioCtx.destination);osc.start();osc.stop(audioCtx.currentTime+dur+.03);
  }catch(e){}
}

function ignite(){
  const wrap=$("#flameWrap");
  if(wrap.classList.contains("lit"))return;
  wrap.classList.add("lit"); haptic([25,35,25]); chime(523,.2);
  setTimeout(()=>chime(659,.22),120); setTimeout(()=>chime(784,.3),240);
  addPetals(48,true);
  const main=$("#story");
  main.classList.remove("locked"); main.setAttribute("aria-hidden","false");
  setTimeout(()=>{ main.querySelector(".opening").scrollIntoView({behavior:"smooth"});},900);
}
$("#igniteBtn").addEventListener("click",ignite);
$("#flameWrap").addEventListener("click",ignite);
$("#flameWrap").addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();ignite()}});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){e.target.classList.add("visible");observer.unobserve(e.target)}
  });
},{threshold:.13});
$$(".reveal").forEach(el=>observer.observe(el));

$("#heartBtn").addEventListener("click",()=>{
  $("#whisper").classList.toggle("show"); addPetals(22,true); haptic(18); chime(700,.2);
});

const modal=$("#modal"), modalText=$("#modalText");
$$(".quality-card").forEach(card=>card.addEventListener("click",()=>{
  modalText.textContent=card.dataset.message; modal.classList.add("show"); modal.setAttribute("aria-hidden","false");
  addPetals(18,true); haptic(16); chime(620,.16);
}));
function closeModal(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true")}
$("#modalClose").onclick=closeModal;
modal.addEventListener("click",e=>{if(e.target===modal)closeModal()});

$("#envelope").addEventListener("click",()=>{
  const el=$("#envelope"); if(el.classList.contains("open"))return;
  el.classList.add("open"); addPetals(38,true); haptic([18,40,18]); chime(587,.18); setTimeout(()=>chime(740,.22),140);
});

$("#finalBtn").addEventListener("click",()=>{
  $("#lastMessage").classList.add("show"); addPetals(75,true); haptic([30,40,30,50,45]);
  chime(523,.18); setTimeout(()=>chime(659,.18),120); setTimeout(()=>chime(784,.3),240);
  for(let i=0;i<14;i++)setTimeout(()=>addPetals(4,false),i*250);
});
