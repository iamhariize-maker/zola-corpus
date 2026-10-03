(function(){
'use strict';
// Anonymous usage counts with GoatCounter (no cookies, no names, no third-party script: one small request per count).
// Set CODE to the GoatCounter site code (https://CODE.goatcounter.com). Empty means counting is off everywhere.
var CODE='zolacorpus';
var HOST='iamhariize-maker.github.io';
var cfg=window.__zolaStatsConfig||{code:CODE,host:HOST};   // tests point this at a fake counter
var d=document,OFF='zola.stat.off',SEEN='zola.stat.appSeen';
function get(k){try{return localStorage.getItem(k)}catch(e){return null}}
function put(k,v){try{if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}}

var standalone=false;try{standalone=matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: minimal-ui)').matches||navigator.standalone===true}catch(e){}
// Where this visit came from: ?s=qr on the QR code, ?s=link on shared text links. Removed from the address at once,
// so a reload, a bookmark or a link copied from the address bar is not counted as another scan.
var src=null;
try{var sp=new URLSearchParams(location.search);src=sp.get('s');
 if(src!==null&&history.replaceState){sp.delete('s');var qs=sp.toString();history.replaceState(history.state,'',location.pathname+(qs?'?'+qs:'')+location.hash)}
}catch(e){}

var enabled=!!cfg.code&&location.hostname===cfg.host;
function active(){return enabled&&get(OFF)!=='1'&&navigator.doNotTrack!=='1'&&!navigator.globalPrivacyControl}
function hit(path,title,event){
 if(!active()||navigator.onLine===false)return;
 var u='https://'+cfg.code+'.goatcounter.com/count?p='+encodeURIComponent(path)+'&t='+encodeURIComponent(title)+(event?'&e=true':'')+
  (!event&&d.referrer?'&r='+encodeURIComponent(d.referrer):'')+'&s='+encodeURIComponent(screen.width+','+screen.height+','+(window.devicePixelRatio||1))+
  '&rnd='+Math.random().toString(36).slice(2);
 try{if(!(navigator.sendBeacon&&navigator.sendBeacon(u)))(new Image()).src=u}catch(e){}
}

// One view per launch, then how the person arrived, then installs.
hit(standalone?'/app':'/web',standalone?'Opened the installed app':'Opened in a browser',false);
if(src==='qr')hit('scan-qr','Opened from the QR code',true);
else if(src==='link')hit('open-link','Opened from a shared link',true);
if(standalone&&!get(SEEN)){put(SEEN,'1');hit('first-app-launch','First launch of the installed app (any phone)',true)}
addEventListener('appinstalled',function(){hit('installed','Installed (Android, desktop)',true)});

// Keep the app's privacy statements true while counting is on, and let anyone turn it off on their device.
function swap(root,from,to){if(!root)return;var w=d.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;
 while((n=w.nextNode()))if(n.nodeValue.indexOf(from)>=0)n.nodeValue=n.nodeValue.replace(from,to)}
function claims(){if(!active())return;
 swap(d.querySelector('.foot'),'nothing leaves your device.','your answers and progress never leave your device.');
 swap(d.getElementById('zl-dlg'),'No account, no tracking, nothing sent except that request.','No account and no cookies. Besides that request, the app sends only an anonymous visit count (see the page footer).');
}
if(enabled){
 var foot=d.querySelector('.foot'),note=d.createElement('p');note.className='zstat';
 var why=d.createElement('span'),btn=d.createElement('button');btn.type='button';btn.className='zstat-btn';
 note.appendChild(why);note.appendChild(d.createTextNode(' '));note.appendChild(btn);
 function render(){var on=get(OFF)!=='1';
  why.textContent=on?'Visits, QR scans and installs are counted anonymously with GoatCounter: no cookies, no names, nothing you enter.':'Anonymous visit counting is off on this device.';
  btn.textContent=on?'Turn off counting':'Turn counting back on';btn.setAttribute('aria-pressed',on?'false':'true')}
 btn.addEventListener('click',function(){put(OFF,get(OFF)==='1'?null:'1');render()});
 render();if(foot)foot.parentNode.insertBefore(note,foot.nextSibling);
 claims();d.addEventListener('click',function(){setTimeout(claims,0)},true);
}
})();
