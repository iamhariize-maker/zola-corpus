(function(){
'use strict';
var d=document,root=d.documentElement,brief=d.getElementById('p-brief'),stats=d.getElementById('briefStats');
// Refresh a saved explicit theme after the final surface tokens have been applied.
if(root.getAttribute('data-theme')==='dark'||root.getAttribute('data-theme')==='light'){
 var sheet=getComputedStyle(root).getPropertyValue('--sheet').trim();
 [].forEach.call(d.querySelectorAll('meta[name="theme-color"]:not(#zboot-meta)'),function(m){m.content=sheet});
}
if(brief&&stats&&!d.querySelector('.zbrief-hero')){
 var intro=brief.querySelector('.read'),hero=d.createElement('div');hero.className='zbrief-hero';
 if(intro){brief.insertBefore(hero,intro);hero.appendChild(intro);hero.appendChild(stats);
  var kicker=d.createElement('p');kicker.className='z-kicker';kicker.textContent='The daily brief · Prelims 2027';intro.insertBefore(kicker,intro.firstChild);
  var actions=d.createElement('div');actions.className='zbrief-actions';
  actions.innerHTML='<a class="btn" href="#forecast/tracker">Open the tracker <span aria-hidden="true">↗</span></a><a class="btn ghost" href="#hacking/review">Review progress <span aria-hidden="true">→</span></a>';
  intro.appendChild(actions);
 }
}
// Small section labels give long documents a consistent orientation cue.
var names={tracker:'Forecast / Current affairs',watch:'Forecast / Dates to watch',evidence:'Forecast / Evidence',papers:'Forecast / Past papers',lab:'Forecast / Model lab',sources:'Forecast / Sources'};
Object.keys(names).forEach(function(k){var panel=d.getElementById('p-'+k);if(!panel)return;var p=d.createElement('p');p.className='z-kicker';p.textContent=names[k];panel.insertBefore(p,panel.firstChild)});

// Apply the studio tokens inside the independent CSAT document after its existing dress layer.
var frame=d.getElementById('frC'),frameBound=null;
function dress(){try{
 var fd=frame.contentDocument;if(!fd||!fd.head)return;
 var st=fd.getElementById('zstudio-frame');if(!st){st=fd.createElement('style');st.id='zstudio-frame';fd.head.appendChild(st)}
 var tokens=d.getElementById('zstudio').textContent.split('/* shared-surface-end:')[0];
 st.textContent=tokens+'\n'+d.getElementById('zstudio-frame-source').textContent;
 if(frameBound!==fd){frameBound=fd;frame.contentWindow.addEventListener('scroll',queue,{passive:true});frame.contentWindow.addEventListener('resize',queue)}
 queue();
}catch(e){}}
if(frame){frame.addEventListener('load',dress);dress()}

// A return-to-top control works in every section, including the scrollable CSAT frame.
var top=d.createElement('button');top.type='button';top.className='z-top';top.hidden=true;top.setAttribute('aria-label','Back to top');
top.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 12 6-6 6 6M12 6v13"/></svg><span>Back to top</span>';d.body.appendChild(top);
function target(){try{if(frame&&!frame.hidden&&frame.contentDocument)return frame.contentWindow}catch(e){}return window}
var scheduled=false;
function update(){scheduled=false;var w=target(),s=w.document.scrollingElement||w.document.documentElement,y=s.scrollTop;top.hidden=y<650;
 if(w!==window){var h=d.querySelector('.hdr'),max=s.scrollHeight-w.innerHeight;if(h)h.style.setProperty('--zprog',max>60?Math.min(1,y/max).toFixed(4):'0')}
}
function queue(){if(!scheduled){scheduled=true;requestAnimationFrame(update)}}
top.addEventListener('click',function(){var w=target(),calm=matchMedia('(prefers-reduced-motion: reduce)').matches;w.scrollTo({top:0,behavior:calm?'auto':'smooth'});root.classList.remove('zcollapse')});
addEventListener('scroll',queue,{passive:true});addEventListener('hashchange',function(){setTimeout(queue,100)});addEventListener('resize',queue);
queue();
// Vivid: the active app sets the accent hue, and tab indicators glide to the chosen tab.
var omr=d.querySelector('.omr'),strip=d.querySelector('.sub .in'),bnav=d.querySelector('#frB .b-nav-in'),sliders=[];
function syncApp(){if(!omr)return;var tabs=omr.querySelectorAll('[role="tab"]'),i=0,k;
 for(k=0;k<tabs.length;k++)if(tabs[k].getAttribute('aria-selected')==='true')i=k;
 var cat=tabs[i]&&tabs[i].getAttribute('data-cat')||'forecast';
 if(root.getAttribute('data-zapp')!==cat)root.setAttribute('data-zapp',cat);
 omr.style.setProperty('--zi',i);
 if(!omr.classList.contains('zready'))requestAnimationFrame(function(){requestAnimationFrame(function(){omr.classList.add('zready')})});
}
function slider(box,sel,inset){if(!box)return;var shown=false;box.classList.add('zslide');
 function place(){var a=box.querySelector(sel);
  if(!a||!a.offsetWidth||!box.offsetWidth){shown=false;box.classList.remove('zready');return}
  var n=typeof inset==='function'?inset():inset;
  box.style.setProperty('--zx',a.offsetLeft+n);box.style.setProperty('--zy',a.offsetTop);
  box.style.setProperty('--zw',Math.max(0,a.offsetWidth-2*n));box.style.setProperty('--zh',a.offsetHeight);
  // A tab bar that has just appeared jumps into place; only later changes glide.
  if(!shown){shown=true;box.classList.remove('zready');requestAnimationFrame(function(){requestAnimationFrame(function(){if(shown)box.classList.add('zready')})})}
 }
 sliders.push(place);
 if(window.ResizeObserver)new ResizeObserver(function(){place()}).observe(box);
}
if(omr){omr.classList.add('zslide');syncApp()}
slider(strip,'[aria-selected="true"]',function(){return innerWidth<=600?12:15});
slider(bnav,'[aria-current="page"]',0);
var placing=false;
function placeAll(){if(placing)return;placing=true;requestAnimationFrame(function(){placing=false;syncApp();sliders.forEach(function(f){f()})})}
if(window.MutationObserver){var watch=new MutationObserver(placeAll);
 [omr,strip,bnav].forEach(function(el){if(el)watch.observe(el,{attributes:true,subtree:true,attributeFilter:['aria-selected','aria-current']})})}
addEventListener('hashchange',placeAll);addEventListener('resize',placeAll);
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(placeAll);
placeAll();
})();
