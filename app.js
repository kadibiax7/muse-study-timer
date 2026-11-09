'use strict';
const $=id=>document.getElementById(id);
const defaults={mode:'auto',focus:25,short:5,long:15,cycles:4,goal:120,color:'#1f2937',scale:100,sound:true,notify:false,autoStart:true};
const KEY='muse-v2';
function load(){try{const x=JSON.parse(localStorage.getItem(KEY));return x&&typeof x==='object'?x:{}}catch{return {}}}
const saved=load();
const settings={...defaults,...(saved.settings||{})};
let history=Array.isArray(saved.history)?saved.history.filter(x=>x&&Number.isFinite(x.at)&&Number.isFinite(x.minutes)).slice(-500):[];
let state=saved.state&&typeof saved.state==='object'?saved.state:{phase:'focus',completed:0,remaining:settings.focus*60,running:false,deadline:null};
if(!['focus','short','long'].includes(state.phase))state.phase='focus';
if(!Number.isFinite(state.remaining)||state.remaining<0)state.remaining=settings.focus*60;
if(!Number.isFinite(state.completed)||state.completed<0)state.completed=0;
function duration(phase){return settings[phase==='focus'?'focus':phase]*60}
function persist(){try{localStorage.setItem(KEY,JSON.stringify({settings,history,state}))}catch(e){$('status').textContent='Storage unavailable: progress may not be saved'}}
function pad(n){return String(n).padStart(2,'0')}
function fmt(s){s=Math.max(0,Math.ceil(s));return pad(Math.floor(s/60))+':'+pad(s%60)}
function dayKey(at){const d=new Date(at);return [d.getFullYear(),pad(d.getMonth()+1),pad(d.getDate())].join('-')}
function startOfWeek(){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(d.getDay()+6)%7);return d.getTime()}
function renderHistory(){
 const today=dayKey(Date.now()),weekStart=startOfWeek();
 const todays=history.filter(x=>dayKey(x.at)===today),weekly=history.filter(x=>x.at>=weekStart);
 const sum=a=>Math.round(a.reduce((s,x)=>s+x.minutes,0));
 const minutes=sum(todays);
 $('today').textContent=minutes+' min';
 $('week').textContent=sum(weekly)+' min';
 $('goalStatus').textContent=minutes+'/'+settings.goal+' min ('+Math.min(100,Math.round(minutes/settings.goal*100))+'%)';
 $('sessions').textContent=todays.length;
 $('history').replaceChildren();
 if(!history.length){$('history').textContent='No completed sessions yet.';return}
 for(const h of history.slice(-30).reverse()){
  const row=document.createElement('div');row.textContent=new Date(h.at).toLocaleString()+' · '+h.minutes+' min';$('history').append(row);
 }
}
function render(){
 $('time').textContent=fmt(state.remaining);
 $('time').style.color=settings.color;
 $('start').textContent=state.running?'Pause':state.remaining===0?'Start':'Start / Resume';
 $('status').textContent=(state.phase==='focus'?'Focus':state.phase==='short'?'Short break':'Long break')+' · '+(state.completed+1)+' focus session'+(settings.mode==='manual'?' · manual':'');
 $('date').textContent=new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric'});
 renderHistory();
}
function beep(){
 if(!settings.sound)return;
 try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator(),g=ctx.createGain();o.connect(g);g.connect(ctx.destination);o.frequency.value=660;g.gain.value=.06;o.start();o.stop(ctx.currentTime+.25);o.onended=()=>ctx.close()}catch{}
}
function notification(message){
 if(!settings.notify||!('Notification'in window)||Notification.permission!=='granted')return;
 try{new Notification('Muse Study Companion',{body:message})}catch{}
}
function finish(){
 const phase=state.phase;
 if(phase==='focus'){
  history.push({at:Date.now(),minutes:settings.focus});history=history.slice(-500);
  state.completed++;
 }
 beep();notification(phase==='focus'?'Focus complete. Time for a break!':'Break complete. Ready to focus?');
 state.running=false;state.deadline=null;
 if(settings.mode==='auto'){
  state.phase=phase==='focus'?(state.completed%settings.cycles===0?'long':'short'):'focus';
  state.remaining=duration(state.phase);
  if(settings.autoStart){state.running=true;state.deadline=Date.now()+state.remaining*1000}
 }else{state.remaining=duration('focus')}
 persist();render();
}
function tick(){
 if(state.running&&Number.isFinite(state.deadline)){
  state.remaining=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));
  if(state.remaining===0){finish();return}
 }
 render();
}
function start(){
 if(state.running){state.remaining=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));state.running=false;state.deadline=null}
 else{if(state.remaining<=0)state.remaining=duration(state.phase);state.running=true;state.deadline=Date.now()+state.remaining*1000}
 persist();render();
}
function reset(){state.running=false;state.deadline=null;state.remaining=duration(state.phase);persist();render()}
function skip(){state.running=false;state.deadline=null;if(settings.mode==='auto'){state.phase=state.phase==='focus'?'short':'focus'}else{state.phase='focus'}state.remaining=duration(state.phase);persist();render()}
function fillForm(){for(const key of ['mode','focus','short','long','cycles','goal','color','scale','sound','notify','autoStart']){$(key).type==='checkbox'?$(key).checked=!!settings[key]:$(key).value=settings[key]}$('scaleValue').textContent=settings.scale+'%'}
function clamp(value,min,max,fallback){const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,Math.round(n))):fallback}
function apply(){
 const wasRunning=state.running;
 if(wasRunning){state.remaining=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));state.running=false;state.deadline=null}
 settings.mode=$('mode').value==='manual'?'manual':'auto';
 for(const [key,min,max] of [['focus',1,240],['short',1,120],['long',1,120],['cycles',1,12],['goal',1,1440],['scale',40,200]])settings[key]=clamp($(key).value,min,max,defaults[key]);
 settings.color=/^#[0-9a-f]{6}$/i.test($('color').value)?$('color').value:defaults.color;
 for(const key of ['sound','notify','autoStart'])settings[key]=$(key).checked;
 state={phase:'focus',completed:0,remaining:duration('focus'),running:false,deadline:null};
 if(settings.notify&&'Notification'in window&&Notification.permission==='default')Notification.requestPermission();
 window.museWindow?.resize(settings.scale);
 fillForm();persist();render();
}
$('start').addEventListener('click',start);
$('reset').addEventListener('click',reset);
$('skip').addEventListener('click',skip);
$('settingsToggle').addEventListener('click',()=>{$('settings').hidden=!$('settings').hidden});
$('apply').addEventListener('click',apply);
$('scale').addEventListener('input',()=>{$('scaleValue').textContent=$('scale').value+'%'});
$('resetSettings').addEventListener('click',()=>{Object.assign(settings,defaults);fillForm();apply()});
$('clearHistory').addEventListener('click',()=>{if(confirm('Delete all locally saved study history?')){history=[];persist();render()}});
$('hide').addEventListener('click',()=>window.museWindow?.hide());
$('close').addEventListener('click',()=>window.museWindow?.close());
window.addEventListener('beforeunload',persist);
fillForm();window.museWindow?.resize(settings.scale);tick();setInterval(tick,1000);setInterval(persist,10000);