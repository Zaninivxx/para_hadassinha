
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function haptic(p=20){ if(navigator.vibrate) navigator.vibrate(p); }

const canvas = $("#petals");
let ctx,W,H,petals=[],raf=false;
if(canvas){
  ctx=canvas.getContext("2d");
  const resize=()=>{
    const d=Math.min(devicePixelRatio||1,2);
    canvas.width=innerWidth*d; canvas.height=innerHeight*d;
    canvas.style.width=innerWidth+"px"; canvas.style.height=innerHeight+"px";
    ctx.setTransform(d,0,0,d,0,0); W=innerWidth; H=innerHeight;
  };
  addEventListener("resize",resize); resize();
}
function makePetal(burst=false){
  return {
    x:burst?W/2+(Math.random()-.5)*100:Math.random()*W,
    y:burst?H*.42:-20,
    rx:3+Math.random()*5, ry:6+Math.random()*6,
    vx:(Math.random()-.5)*(burst?7:1.4),
    vy:burst?(-3+Math.random()*6):(1+Math.random()*1.7),
    r:Math.random()*6.28, vr:(Math.random()-.5)*.08,
    a:.5+Math.random()*.4,
    c:["#f1b6ca","#e99ab6","#f7d6e1","#d87f9f"][Math.floor(Math.random()*4)]
  }
}
function petalsBurst(n=38){
  if(!ctx)return;
  for(let i=0;i<n;i++)petals.push(makePetal(true));
  if(raf)return; raf=true;
  const draw=()=>{
    ctx.clearRect(0,0,W,H);
    petals.forEach(p=>{
      p.x+=p.vx+Math.sin(p.y*.014)*.25; p.y+=p.vy; p.r+=p.vr;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.r);ctx.globalAlpha=p.a;ctx.fillStyle=p.c;
      ctx.beginPath();ctx.ellipse(0,0,p.rx,p.ry,0,0,Math.PI*2);ctx.fill();ctx.restore();
    });
    petals=petals.filter(p=>p.y<H+35&&p.x>-60&&p.x<W+60);
    if(petals.length)requestAnimationFrame(draw);
    else{raf=false;ctx.clearRect(0,0,W,H);}
  };
  requestAnimationFrame(draw);
}

// Opening
$("#openStory")?.addEventListener("click", ()=>{
  haptic([25,35,25]); petalsBurst(50);
  setTimeout(()=>location.href="princesa.html",650);
});
$("#heartOpen")?.addEventListener("click", ()=>$("#openStory")?.click());

// Compliment reveals
$$(".reveal-card").forEach(card=>{
  card.addEventListener("click", ()=>{
    card.classList.add("open");
    const small=card.querySelector("small");
    if(small) small.textContent=card.dataset.reveal;
    haptic(18); petalsBurst(12);
  });
});

// Flower game
let found=0;
$$(".flower").forEach(f=>{
  f.addEventListener("click",()=>{
    if(f.classList.contains("found"))return;
    f.classList.add("found"); found++; haptic(15); petalsBurst(8);
    const c=$("#flowerCount"); if(c)c.textContent=`${found}/5 flores`;
    if(found===5){
      $("#bouquet")?.classList.add("show");
      $("#flowerNext")?.removeAttribute("hidden");
      setTimeout(()=>petalsBurst(55),220);
    }
  });
});

// Memory lights
let lights=0;
$$(".light-card").forEach(card=>{
  card.addEventListener("click",()=>{
    if(card.classList.contains("on"))return;
    card.classList.add("on"); lights++; haptic(16);
    if(lights===3){
      $("#historyNext")?.removeAttribute("hidden");
      petalsBurst(35);
    }
  });
});

// Shake detection
let shakeCount=0, motionReady=false, revealed=false, lastX=null,lastY=null,lastZ=null,lastShake=0;
function revealPrayer(){
  if(revealed)return;
  revealed=true;
  $("#prayer")?.classList.add("show");
  $("#directionNext")?.removeAttribute("hidden");
  $("#phone")?.classList.remove("shaking");
  haptic([25,35,25]); petalsBurst(50);
}
function motionHandler(e){
  const a=e.accelerationIncludingGravity;
  if(!a)return;
  if(lastX!==null){
    const delta=Math.abs(a.x-lastX)+Math.abs(a.y-lastY)+Math.abs(a.z-lastZ);
    const now=Date.now();
    if(delta>22 && now-lastShake>250){
      lastShake=now; shakeCount++;
      $("#phone")?.classList.add("shaking");
      setTimeout(()=>$("#phone")?.classList.remove("shaking"),420);
      if(shakeCount>=3)revealPrayer();
    }
  }
  lastX=a.x;lastY=a.y;lastZ=a.z;
}
async function enableMotion(){
  try{
    if(typeof DeviceMotionEvent!=="undefined" && typeof DeviceMotionEvent.requestPermission==="function"){
      const res=await DeviceMotionEvent.requestPermission();
      if(res!=="granted")throw new Error("permission");
    }
    addEventListener("devicemotion",motionHandler);
    motionReady=true;
    const b=$("#motionBtn"); if(b)b.textContent="agora chacoalhe o celular ♡";
    $("#phone")?.classList.add("shaking");
    setTimeout(()=>$("#phone")?.classList.remove("shaking"),650);
  }catch(err){
    const b=$("#motionBtn"); if(b)b.textContent="movimento não liberado";
  }
}
$("#motionBtn")?.addEventListener("click",enableMotion);
let fallbackTaps=0;
$("#fallback")?.addEventListener("click",()=>{
  fallbackTaps++;
  haptic(10);
  const f=$("#fallback"); if(f)f.textContent=`toque mais ${Math.max(0,5-fallbackTaps)} vezes`;
  if(fallbackTaps>=5)revealPrayer();
});

// Finale
$("#finalReveal")?.addEventListener("click",()=>{
  $("#finalHidden")?.classList.add("show");
  haptic([30,35,30]); petalsBurst(70);
});
