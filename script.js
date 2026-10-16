const Q=[
 {q:"Which Italian inventor is linked to wireless telegraphy, the foundation of radio?",
  a:"MARCONI",o:["Marconi","Edison","Bell"],
  f:"The story of radio starts with wireless signals in the late 1800s."},
 {q:"What do we call audio episodes you can listen to online whenever you want?",
  a:"PODCASTS",o:["Podcasts","Telegrams","Jingles"],
  f:"Podcasts and online audio are growing fast."},
 {q:"When an earthquake or a storm knocks out power and the internet, why is radio seen as one of the safest and fastest ways to communicate?",
  a:"ACCESSIBLE",
  o:["Because it runs on batteries and reaches lots of people at once, with no internet needed",
     "Because only trained technicians can tune in, which stops fake news",
     "Because it records messages and only plays them days later, once things calm down"],
  f:"Simple, cheap and accessible, radio keeps people informed when other media fail."},
 {q:"What's the main difference between AM and FM radio?",
  a:"MODULATION",
  o:["AM changes the wave's amplitude, while FM changes its frequency","AM is digital and FM is analog","AM only plays music and FM only plays news"],
  f:"AM = Amplitude Modulation, FM = Frequency Modulation. FM usually sounds better."},
 {q:"Which one has a longer range?",
  a:"AM",o:["AM","FM","They have exactly the same range"],
  f:"AM waves travel farther (especially at night), but the sound quality is worse than FM."}
];
const TOTAL=Q.length, MAX_WRONG=6;
const $=id=>document.getElementById(id);
let r=0,wrong=0,locked=false;
const parts=()=>document.querySelectorAll('#game .part');

function show(id){['start','game','over','end'].forEach(s=>$(s).classList.toggle('hidden',s!==id))}
function shuffle(a){return a.map(x=>[Math.random(),x]).sort((x,y)=>x[0]-y[0]).map(x=>x[1])}

function load(){
  locked=false; const d=Q[r];
  $('rnd').textContent=`Round ${r+1} of ${TOTAL}`;
  $('dots').innerHTML=Q.map((_,i)=>`<span class="${i<r?'done':i===r?'now':''}"></span>`).join('');
  $('q').textContent=d.q; $('msg').textContent=''; $('next').classList.add('hidden');
  $('word').innerHTML=[...d.a].map(()=>'<span></span>').join('');
  $('opts').innerHTML='';
  shuffle(d.o).forEach(t=>{
    const b=document.createElement('button'); b.className='opt'; b.textContent=t;
    b.onclick=()=>pick(b,t); $('opts').appendChild(b);
  });
  lives();
}
function lives(){$('lives').textContent=`Mistakes: ${wrong} / ${MAX_WRONG}`}

function pick(b,t){
  if(locked)return; const d=Q[r];
  if(t===d.o[0]){ // the right answer is always first in the list (options get shuffled)
    locked=true; b.classList.add('right');
    document.querySelectorAll('.opt').forEach(x=>x.disabled=true);
    $('word').innerHTML=[...d.a].map(c=>`<span>${c}</span>`).join('');
    $('msg').innerHTML=`🎉 Correct!<div class="fact">${d.f}</div>`;
    confetti();
    $('next').textContent=r===TOTAL-1?'See results →':'Next round →';
    $('next').classList.remove('hidden');
  }else{
    b.classList.add('wrong'); b.disabled=true;
    if(wrong<MAX_WRONG){parts()[wrong].classList.add('show');wrong++}
    lives();
    if(wrong>=MAX_WRONG){ // figure complete → game over
      locked=true; document.querySelectorAll('.opt').forEach(x=>x.disabled=true);
      $('msg').textContent='Oh no... the little guy is complete!';
      setTimeout(()=>{ $('overFig').innerHTML=$('game').querySelector('svg').innerHTML; show('over'); },1400);
    }else $('msg').textContent='Oops! Try again. The little guy just got a new body part...';
  }
}

$('next').onclick=()=>{ if(r<TOTAL-1){r++;load()}else finish() };
function finish(){
  show('end');
  $('finalFig').innerHTML=$('game').querySelector('svg').innerHTML;
  const perfect=wrong===0;
  $('endTitle').textContent=perfect?'Perfect!':'Finished!';
  $('endTxt').textContent=perfect?'You saved the little guy without a single mistake. You\'re a radio pro! 📻':`You finished with ${wrong} mistake(s). Want to try for zero?`;
  if(perfect)confetti();
}
$('go').onclick=start; $('again').onclick=start;
function home(){r=0;wrong=0;parts().forEach(p=>p.classList.remove('show'));show('start')}
$('home').onclick=home; $('home2').onclick=home;
function start(){
  r=0;wrong=0;parts().forEach(p=>p.classList.remove('show'));
  show('game');load();
}

/* confetti */
const cv=$('confetti'),cx=cv.getContext('2d');let P=[],run=false;
function size(){cv.width=innerWidth;cv.height=innerHeight}addEventListener('resize',size);size();
function confetti(){
  const cols=['#c0392b','#e0a526','#2f7d3a','#2a6fb0','#8e44ad','#f4efdf'];
  for(let i=0;i<160;i++)P.push({x:Math.random()*cv.width,y:-20-Math.random()*cv.height*.5,w:6+Math.random()*7,h:10+Math.random()*8,
    vy:2+Math.random()*3.5,vx:-1.5+Math.random()*3,a:Math.random()*6,va:-.2+Math.random()*.4,c:cols[i%cols.length]});
  if(!run){run=true;requestAnimationFrame(tick)}
}
function tick(){
  cx.clearRect(0,0,cv.width,cv.height);
  P.forEach(p=>{p.y+=p.vy;p.x+=p.vx+Math.sin(p.a);p.a+=p.va;
    cx.save();cx.translate(p.x,p.y);cx.rotate(p.a);cx.fillStyle=p.c;cx.fillRect(-p.w/2,-p.h/2,p.w,p.h);cx.restore()});
  P=P.filter(p=>p.y<cv.height+30);
  if(P.length)requestAnimationFrame(tick);else{run=false;cx.clearRect(0,0,cv.width,cv.height)}
}
