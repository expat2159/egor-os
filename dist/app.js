const photos = [
  [5,'Егор. Заводские настройки','БАЗОВЫЙ ЕГОР'],[19,'Егор видит все VLAN','ОПТИЧЕСКОЕ ПРЕВОСХОДСТВО'],[13,'Егор под прикрытием','ИНКОГНИТО'],[3,'Два метра без кепки','ПОЛНЫЙ РОСТ'],[17,'Егор после настройки сети','СИСАДМИН'],[7,'Егор смотрит в светлое ALT','ВИЗИОНЕР'],[11,'Егор на торжественном релизе','СТАБИЛЬНАЯ ВЕРСИЯ'],[9,'Егор одобряет','ПРОВЕРКА ПРОЙДЕНА'],[14,'Егор занял серверный трон','ROOT ACCESS'],[4,'Егор ждёт, пока пинганётся','ОЖИДАНИЕ ОТВЕТА'],[6,'Егор на утренней паре','ЭНЕРГОСБЕРЕЖЕНИЕ'],[2,'Карманный егорик','PORTABLE EDITION'],[15,'Егор в минимальной сборке','MINIMAL INSTALL'],[0,'Егор обнаружил Windows','НЕОЖИДАННОЕ ИСКЛЮЧЕНИЕ']
];
const path = n => typeof n === 'string' ? `assets/${n}.jpg` : n === 0 ? 'assets/1.jpg' : `assets/photo_${n}_2026-10-10_11-00-54.jpg`;
const viewer = document.querySelector('#viewer');
photos.forEach(([n,title,tag],i) => {
  const button = document.createElement('button');
  button.className='egor-card';
  const img=document.createElement('img');img.src=path(n);img.alt=title;img.loading='lazy';
  const info=document.createElement('span');info.className='card-info';
  const small=document.createElement('small');small.textContent=`EGOR_${String(i+1).padStart(2,'0')} / ${tag}`;
  const name=document.createElement('b');name.textContent=title+' ↗';info.append(small,name);button.append(img,info);
  button.addEventListener('click',()=>{const full=document.querySelector('#viewer-image');full.src=img.src;full.alt=title;document.querySelector('#viewer-caption').textContent=title;viewer.showModal()});
  document.querySelector('#gallery').append(button);
});
document.querySelector('.close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close()}});
let count=0;
function spawn(){
  const host=document.querySelector('#clones');
  const amount=5;
  const pool=photos.slice();
  for(let i=0;i<amount;i++){const [photo]=pool.splice(Math.floor(Math.random()*pool.length),1);const img=document.createElement('img');img.src=path(photo[0]);img.alt='';img.className='clone';img.style.left=`${Math.random()*Math.max(0,window.innerWidth-95)}px`;img.style.animationDelay=`${i*.09}s`;host.append(img);setTimeout(()=>img.remove(),5000)}
  count+=amount;document.querySelector('#count').textContent=count;document.querySelector('#announcement').textContent=`Запущено ${count} егориков. Кластер растёт!`;
}
document.querySelector('#spawn').addEventListener('click',spawn);document.querySelector('#spawn-more').addEventListener('click',spawn);
let contacts=0;document.querySelector('#switch-button').addEventListener('click',()=>{contacts++;document.querySelector('#switch-status').textContent=['Контакт установлен. Коммутатор смущён. Пакеты пошли.','Вкус: гигабитный. Послевкусие: витая пара.','Все 24 порта передают Егору привет.','Диагноз: коммутатор любит Егора в ответ.'][(contacts-1)%4];document.querySelector('#switch-button').firstChild.textContent='КОНТАКТ ЕСТЬ ✓ '});
let studying=false;const original=document.querySelector('.game-content').innerHTML;
document.querySelector('#teacher').addEventListener('click',()=>{studying=!studying;document.querySelector('#game-title').textContent=studying?'ACTIVE PROCESS: midnight-commander':'ACTIVE PROCESS: STALKER.exe';document.querySelector('.game-content').innerHTML=studying?'<h3 style="color:#a7ccff">MIDNIGHT COMMANDER</h3><p>┌ /home/egor ────────────────┐<br>│ ..　　　　　　　　　　　│<br>│ lab_01.txt　　　　　　　 │<br>│ definitely_not_stalker　　│<br>└──────────────────────────┘</p><span class="tag">УЧУСЬ. ОЧЕНЬ УСЕРДНО УЧУСЬ.</span>':original;document.querySelector('#teacher').textContent=studying?'✓ ПРЕПОД УШЁЛ':'⚠ ПРЕПОД ИДЁТ!';document.querySelector('#teacher-status').textContent=studying?'Маскировка активна. Alt+Tab спасает жизни.':'Режим: свободный сталкер'});
