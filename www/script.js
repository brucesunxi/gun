const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const W = 900, H = 650;
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const killsEl = document.getElementById('kills');
const remainingEl = document.getElementById('remaining');
const totalEl = document.getElementById('total');
const weaponInfo = document.getElementById('weaponInfo');
const waveInfo = document.getElementById('waveInfo');
const startScreen = document.getElementById('startScreen');
const gameOverScreen = document.getElementById('gameOver');
const victoryScreen = document.getElementById('victoryScreen');
const finalScore = document.getElementById('finalScore');
const finalKills = document.getElementById('finalKills');
const finalTotal = document.getElementById('finalTotal');
const vicScore = document.getElementById('vicScore');
const vicTotal = document.getElementById('vicTotal');
const soundToggle = document.getElementById('soundToggle');
let audioCtx = null;
let soundEnabled = true;

function initAudio() { if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function playSound(type) {
  if (!soundEnabled) return;
  try {
    initAudio(); if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    if (type === 'pistol') {
      const len = audioCtx.sampleRate * 0.08;
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) { const t = i/len; d[i] = (Math.random()*2-1)*Math.exp(-t*25)*0.4 + Math.sin(t*800)*Math.exp(-t*15)*0.3; }
      const s = audioCtx.createBufferSource(); s.buffer = buf;
      const g = audioCtx.createGain(); g.gain.setValueAtTime(0.6,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.08);
      s.connect(g).connect(audioCtx.destination); s.start(now); s.stop(now+0.1);
    } else if (type === 'rifle') {
      const len = audioCtx.sampleRate * 0.06;
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) { const t = i/len; d[i] = (Math.random()*2-1)*Math.exp(-t*35)*0.35 + Math.sin(t*1200)*Math.exp(-t*20)*0.25; }
      const s = audioCtx.createBufferSource(); s.buffer = buf;
      const g = audioCtx.createGain(); g.gain.setValueAtTime(0.5,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.06);
      s.connect(g).connect(audioCtx.destination); s.start(now); s.stop(now+0.08);
    } else if (type === 'shotgun') {
      const len = audioCtx.sampleRate * 0.15;
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) { const t = i/len; d[i] = (Math.random()*2-1)*Math.exp(-t*12)*0.5 + Math.sin(t*400+Math.random()*0.5)*Math.exp(-t*8)*0.3; }
      const s = audioCtx.createBufferSource(); s.buffer = buf;
      const g = audioCtx.createGain(); g.gain.setValueAtTime(0.7,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.15);
      s.connect(g).connect(audioCtx.destination); s.start(now); s.stop(now+0.18);
    } else if (type === 'sniper') {
      const len = audioCtx.sampleRate * 0.2;
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) { const t = i/len; d[i] = (Math.random()*2-1)*Math.exp(-t*20)*0.6 + Math.sin(t*1500)*Math.exp(-t*10)*0.3; }
      const s = audioCtx.createBufferSource(); s.buffer = buf;
      const g = audioCtx.createGain(); g.gain.setValueAtTime(0.8,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.2);
      s.connect(g).connect(audioCtx.destination); s.start(now); s.stop(now+0.25);
    } else if (type === 'explosion') {
      const len = audioCtx.sampleRate * 0.4;
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) { const t = i/len; d[i] = (Math.random()*2-1)*Math.exp(-t*6)*0.5 + Math.sin(t*150)*Math.exp(-t*4)*0.4 + Math.sin(t*60)*Math.exp(-t*3)*0.3; }
      const s = audioCtx.createBufferSource(); s.buffer = buf;
      const g = audioCtx.createGain(); g.gain.setValueAtTime(0.6,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.4);
      s.connect(g).connect(audioCtx.destination); s.start(now); s.stop(now+0.5);
    } else if (type === 'hit') {
      const len = audioCtx.sampleRate * 0.05;
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) { const t = i/len; d[i] = (Math.random()*2-1)*Math.exp(-t*30)*0.3 + Math.sin(t*300)*Math.exp(-t*20)*0.2; }
      const s = audioCtx.createBufferSource(); s.buffer = buf;
      const g = audioCtx.createGain(); g.gain.setValueAtTime(0.4,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.05);
      s.connect(g).connect(audioCtx.destination); s.start(now); s.stop(now+0.07);
    } else if (type === 'pickup') {
      const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.type='sine'; o.frequency.setValueAtTime(500,now); o.frequency.exponentialRampToValueAtTime(1000,now+0.15);
      g.gain.setValueAtTime(0.3,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.25);
      o.connect(g).connect(audioCtx.destination); o.start(now); o.stop(now+0.3);
    } else if (type === 'victory') {
      [523,659,784,1047].forEach((f,i)=>{ const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.type='sine'; o.frequency.value=f; g.gain.setValueAtTime(0,now+i*0.12); g.gain.linearRampToValueAtTime(0.2,now+i*0.12+0.05); g.gain.exponentialRampToValueAtTime(0.001,now+1.0); o.connect(g).connect(audioCtx.destination); o.start(now+i*0.12); o.stop(now+1.2); });
    } else if (type === 'gameover') {
      const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.type='sawtooth'; o.frequency.setValueAtTime(400,now); o.frequency.exponentialRampToValueAtTime(100,now+0.8); g.gain.setValueAtTime(0.2,now); g.gain.exponentialRampToValueAtTime(0.001,now+1.0); o.connect(g).connect(audioCtx.destination); o.start(now); o.stop(now+1.2);
    } else if (type === 'enemy_hit') {
      const len = audioCtx.sampleRate * 0.04;
      const buf = audioCtx.createBuffer(1, len, audioCtx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random()*2-1)*Math.exp(-i/len*40)*0.25;
      const s = audioCtx.createBufferSource(); s.buffer = buf;
      const g = audioCtx.createGain(); g.gain.setValueAtTime(0.3,now); g.gain.exponentialRampToValueAtTime(0.001,now+0.04);
      s.connect(g).connect(audioCtx.destination); s.start(now); s.stop(now+0.06);
    }
  } catch(e) {}
}
function shootSound() {
  if (player.weapon === 'pistol') playSound('pistol');
  else if (player.weapon === 'rifle') playSound('rifle');
  else if (player.weapon === 'shotgun') playSound('shotgun');
  else playSound('sniper');
}
soundToggle.addEventListener('click', () => { soundEnabled=!soundEnabled; soundToggle.textContent=soundEnabled?'\u{1F50A} 音效':'\u{1F507} 静音'; });

// BGM
let bgmEnabled = true;
const bgm = {
  active: false, nodes: [], seqTimer: null,
  start() {
    if (this.active || !audioCtx) return;
    this.active = true; this.nodes = [];
    try {
      const d = audioCtx.createOscillator(); d.type='triangle'; d.frequency.value=65.4;
      const dg = audioCtx.createGain(); dg.gain.value=0.06;
      d.connect(dg).connect(audioCtx.destination); d.start(); this.nodes.push(d,dg);
      [130.8,164.8,196,261.6].forEach(f=>{ const o=audioCtx.createOscillator(); o.type='sine'; o.frequency.value=f; const g=audioCtx.createGain(); g.gain.value=0.015; o.connect(g).connect(audioCtx.destination); o.start(); this.nodes.push(o,g); });
      this.scheduleSequence(); syncBgmToggleUI();
    } catch(e) { this.active = false; }
  },
  stop() {
    this.active = false; if (this.seqTimer) { clearTimeout(this.seqTimer); this.seqTimer = null; }
    this.nodes.forEach(n => { try { if (n.stop) n.stop(); else if (n.disconnect) n.disconnect(); } catch(e) {} }); this.nodes = [];
    syncBgmToggleUI();
  },
  toggle() { if (this.active) this.stop(); else this.start(); },
  scheduleSequence() {
    if (!this.active) return;
    const now = audioCtx.currentTime, beat = 60 / 112, C=262,D=294,E=330,G=392,A=440,C2=65,G2=98;
    const phrases = [
      [C,C,C,E,C,C,C,E,C,D,E,G,G,0,0,0],
      [E,E,E,E,E,E,E,C,G,E,D,C,C,0,0,0],
      [G,G,G,G,G,G,G,E,D,D,D,D,D,D,D,C],
      [E,E,E,G,A,G,E,D,C,E,D,C,C,0,C,C]
    ];
    for (let p = 0; p < phrases.length; p++) {
      const ph = phrases[p];
      for (let i = 0; i < 16; i++) {
        const t = now + (p*16+i)*beat*0.5, bg = i%4;
        if (bg===1||bg===3) {
          const snLen = audioCtx.sampleRate*0.05, snBuf = audioCtx.createBuffer(1,snLen,audioCtx.sampleRate), sd = snBuf.getChannelData(0);
          for (let j = 0; j < snLen; j++) sd[j] = (Math.random()*2-1)*Math.exp(-j/snLen*12);
          const snSrc = audioCtx.createBufferSource(); snSrc.buffer = snBuf;
          const sg = audioCtx.createGain(); sg.gain.setValueAtTime(0.08,t); sg.gain.exponentialRampToValueAtTime(0.001,t+0.05);
          snSrc.connect(sg).connect(audioCtx.destination); snSrc.start(t); snSrc.stop(t+0.07); this.nodes.push(snSrc,sg);
        }
        if (bg===0) {
          const br = Math.floor(i/4)%2===0?C2:G2;
          const bd = audioCtx.createOscillator(); bd.type='triangle'; bd.frequency.setValueAtTime(br,t); bd.frequency.exponentialRampToValueAtTime(55,t+0.15);
          const bdg = audioCtx.createGain(); bdg.gain.setValueAtTime(0.2,t); bdg.gain.exponentialRampToValueAtTime(0.001,t+0.25);
          bd.connect(bdg).connect(audioCtx.destination); bd.start(t); bd.stop(t+0.3); this.nodes.push(bd,bdg);
        }
        const nf = ph[i];
        if (nf > 0) {
          const mel = audioCtx.createOscillator(); mel.type='square'; mel.frequency.value=nf;
          const mg = audioCtx.createGain(), dur = (i%4===3)?beat*1.8:beat*0.4;
          mg.gain.setValueAtTime(0,t); mg.gain.linearRampToValueAtTime(0.06,t+0.02);
          if (i%4===3) { mg.gain.setValueAtTime(0.06,t+beat*0.8); mg.gain.exponentialRampToValueAtTime(0.001,t+dur); }
          else mg.gain.exponentialRampToValueAtTime(0.001,t+dur);
          mel.connect(mg).connect(audioCtx.destination); mel.start(t); mel.stop(t+dur+0.05); this.nodes.push(mel,mg);
          const harm = audioCtx.createOscillator(); harm.type='triangle'; harm.frequency.value=nf*1.5;
          const hg = audioCtx.createGain(); hg.gain.setValueAtTime(0,t); hg.gain.linearRampToValueAtTime(0.025,t+0.02);
          if (i%4===3) { hg.gain.setValueAtTime(0.025,t+beat*0.8); hg.gain.exponentialRampToValueAtTime(0.001,t+dur); }
          else hg.gain.exponentialRampToValueAtTime(0.001,t+dur);
          harm.connect(hg).connect(audioCtx.destination); harm.start(t); harm.stop(t+dur+0.05); this.nodes.push(harm,hg);
        }
      }
    }
    this.seqTimer = setTimeout(()=>this.scheduleSequence(),17000);
  }
};
function syncBgmToggleUI() {
  const btn = document.getElementById('bgmToggle');
  btn.textContent = bgm.active?'\u{1F3B5} BGM 开':'\u{1F3B5} BGM 关';
  if (bgm.active) btn.classList.add('on'); else btn.classList.remove('on');
  document.getElementById('startBgmBtn').textContent = bgmEnabled?'\u{1F3B5} 开启':'\u{1F3B5} 关闭';
  document.getElementById('startBgmBtn').classList.toggle('on',bgmEnabled);
}
document.getElementById('bgmToggle').addEventListener('click',()=>bgm.toggle());
document.getElementById('startBgmBtn').addEventListener('click',()=>{bgmEnabled=!bgmEnabled;syncBgmToggleUI();});

// State
const game = {
  score:0,lives:3,kills:0,totalEnemies:0,enemiesSpawned:0,
  trainingMode:false,shotsFired:0,hits:0,combo:0,maxCombo:0,
  running:false,over:false,won:false,started:false,zoomed:false,shopOpen:false,
  frame:0,enemySpawnTimer:0,enemySpawnInterval:90,maxEnemiesOnScreen:4,screenShake:0,
  particles:[],bullets:[],enemies:[],supplies:[],stars:[],
  shellCasings:[],muzzleFlashes:[],boss:null,bossActive:false,
  aiTeammateEnabled:null,aiTeammate:null,aiTeammateLevel:'mid',
  rank:'bronze',rankScore:0,
  currentLevel:1,unlockedLevel:1,
};

// 8关系统
const levelSystem = {
  levels: [
    {level:1,name:'新兵训练',enemies:5,spawnInterval:100,enemyHp:15,enemySpeed:0.8,hasBoss:false,desc:'5名敌人，慢速刷新'},
    {level:2,name:'初上战场',enemies:8,spawnInterval:90,enemyHp:20,enemySpeed:1.0,hasBoss:false,desc:'8名敌人，基础难度'},
    {level:3,name:'激烈交火',enemies:12,spawnInterval:80,enemyHp:25,enemySpeed:1.1,hasBoss:false,desc:'12名敌人，速度提升'},
    {level:4,name:'重围突破',enemies:16,spawnInterval:70,enemyHp:30,enemySpeed:1.2,hasBoss:false,desc:'16名敌人，快速刷新'},
    {level:5,name:'精英对决',enemies:20,spawnInterval:65,enemyHp:35,enemySpeed:1.3,hasBoss:true,bossHp:200,bossCount:1,desc:'20名敌人+小BOSS'},
    {level:6,name:'血腥战场',enemies:25,spawnInterval:60,enemyHp:40,enemySpeed:1.4,hasBoss:true,bossHp:300,bossCount:1,desc:'25名敌人+强化BOSS'},
    {level:7,name:'死亡峡谷',enemies:30,spawnInterval:55,enemyHp:45,enemySpeed:1.5,hasBoss:true,bossHp:350,bossCount:2,desc:'30名敌人+双BOSS'},
    {level:8,name:'终极决战',enemies:35,spawnInterval:50,enemyHp:50,enemySpeed:1.6,hasBoss:true,bossHp:400,bossCount:3,desc:'35名敌人+三BOSS'}
  ],
  getCurrent(){return this.levels[game.currentLevel-1]||this.levels[0];},
  getConfig(lvl){return this.levels[Math.min(lvl-1,this.levels.length-1)];}
};

// 等级系统
const rankSystem = {
  levels: [
    {name:'bronze',title:'🥉 青铜',color:'#cd7f32',next:100,bonus:1},
    {name:'silver',title:'🥈 白银',color:'#c0c0c0',next:300,bonus:1.1},
    {name:'gold',title:'🥇 黄金',color:'#ffd700',next:600,bonus:1.2},
    {name:'platinum',title:'💠 铂金',color:'#e5e4e2',next:1000,bonus:1.3},
    {name:'diamond',title:'💎 钻石',color:'#00ffff',next:1500,bonus:1.4},
    {name:'master',title:'👑 大师',color:'#9d00ff',next:2200,bonus:1.5},
    {name:'legend',title:'🔥 传奇',color:'#ff6600',next:3000,bonus:1.7},
    {name:'god',title:'⭐ 战神',color:'#ff0000',next:7000,bonus:2}
  ],
  getCurrent(){return this.levels.find(l=>l.name===game.rank)||this.levels[0];},
  getNext(){const idx=this.levels.findIndex(l=>l.name===game.rank);return this.levels[Math.min(idx+1,this.levels.length-1)];},
  checkUpgrade(){
    const idx=this.levels.findIndex(l=>l.name===game.rank);
    const next=this.levels[idx+1];
    if(next&&game.rankScore>=next.next){
      game.rank=next.name;
      return next;
    }
    return null;
  },
  getBonus(){return this.getCurrent().bonus;}
};

// 关卡进度保存/加载
const LEVEL_KEY = 'battle_shooter_progress';
function loadProgress(){
  const saved=localStorage.getItem(LEVEL_KEY);
  if(saved){
    const data=JSON.parse(saved);
    game.unlockedLevel=data.unlockedLevel||1;
    game.currentLevel=data.currentLevel||1;
  }
}
function saveProgress(){
  localStorage.setItem(LEVEL_KEY,JSON.stringify({unlockedLevel:game.unlockedLevel,currentLevel:game.currentLevel}));
}
function unlockNextLevel(){
  // 先解锁下一关
  if(game.currentLevel>=game.unlockedLevel&&game.currentLevel<8){
    game.unlockedLevel=game.currentLevel+1;
    saveProgress();
  }
  // 然后自动选择下一关（如果不是最后一关）
  if(game.currentLevel<8){
    game.currentLevel=game.currentLevel+1;
  }
}
function selectLevel(lvl){
  game.currentLevel=Math.min(lvl,game.unlockedLevel);
  updateLevelUI();
}

const player = {
  x:W/2,y:H-70,w:32,h:44,speed:4,hp:100,maxHp:100,shootCooldown:0,weapon:'pistol',
  invincible:0,dir:0,moving:false,damageMult:1,fireRateMult:1,armor:0,
};
const aiTeammate = {
  x:W/2-60,y:H-70,w:32,h:44,speed:0.9,hp:160,maxHp:160,shootCooldown:0,
  invincible:0,dir:0,moving:false,active:false,targetEnemy:null,shootTimer:0,
};
const keys = {left:false,right:false,space:false,zoom:false};

const shopItems = [
  {id:'rifle',name:'\u{1F52B} 步枪',desc:'伤害 25 · 高速连发',price:40,max:1,bought:false,apply() { if (player.weapon==='pistol') { player.weapon='rifle'; weaponInfo.textContent='\u{1F52B} 步枪 (25·连发)'; }}},
  {id:'shotgun',name:'\u{1F52B} 霰弹枪',desc:'15×6 散射 · 近战爆发',price:80,max:1,bought:false,apply() { if (player.weapon!=='shotgun') { player.weapon='shotgun'; weaponInfo.textContent='\u{1F52B} 霰弹枪 (15×6·散射)'; }}},
  {id:'sniper',name:'\u{1F3AF} 狙击枪',desc:'伤害 60 · 远程穿透',price:120,max:1,bought:false,apply() { player.weapon='sniper'; weaponInfo.textContent='\u{1F3AF} 狙击枪 (60·远程)'; }},
  {id:'dmg1',name:'⚡ 伤害 Lv1',desc:'伤害 +25%',price:50,max:99,bought:0,apply() { player.damageMult*=1.25; }},
  {id:'dmg2',name:'⚡ 伤害 Lv2',desc:'伤害再 +30%',price:80,max:99,bought:0,prereq:()=>shopItems.find(i=>i.id==='dmg1').bought,apply() { player.damageMult*=1.3; }},
  {id:'rate',name:'\u{1F504} 射速提升',desc:'射击间隔 -20%',price:60,max:99,bought:0,apply() { player.fireRateMult*=0.8; }},
  {id:'heal',name:'❤️ 医疗包',desc:'恢复 50 HP',price:30,max:99,bought:0,apply() { player.hp=Math.min(player.maxHp,player.hp+50); }},
  {id:'armor',name:'\u{1F6E1}️ 护甲',desc:'伤害减免 15%',price:70,max:99,bought:0,apply() { player.armor=Math.min(0.6,player.armor+0.15); }},
];
function openShop() { if (game.trainingMode||game.over||game.won||!game.running) return; game.shopOpen=true; game.running=false; document.getElementById('shopOverlay').classList.add('open'); renderShopItems(); }
function closeShop() { game.shopOpen=false; game.running=true; document.getElementById('shopOverlay').classList.remove('open'); }
function renderShopItems() {
  document.getElementById('shopCoin').textContent=game.score;
  const c=document.getElementById('shopItems'); c.innerHTML='';
  shopItems.forEach(item => {
    const ok=!item.prereq||item.prereq();
    // 武器类只能买一次，其他可以重复购买
    const isWeapon=item.id==='rifle'||item.id==='shotgun'||item.id==='sniper';
    const bought=item.bought===true||item.bought>0;
    const canBuy=!isWeapon||!bought;
    const canAfford=game.score>=item.price&&canBuy&&ok;
    const div=document.createElement('div'); div.className='shop-item'+(bought&&isWeapon?' bought':'');
    const ns=document.createElement('span'); ns.className='name'; ns.textContent=item.name;
    const ds=document.createElement('span'); ds.className='desc'; ds.textContent=item.desc+(bought&&isWeapon?' (已购)':item.bought>0?' x'+item.bought:'');
    const ps=document.createElement('span'); ps.className='price'+(canAfford?' afford':''); ps.textContent=!canBuy?'✓':'$'+item.price;
    div.appendChild(ns); div.appendChild(ds); div.appendChild(ps);
    if (canAfford) div.addEventListener('click',()=>{ if(game.score<item.price)return; game.score-=item.price; item.apply(); if(isWeapon) item.bought=true; else item.bought=(item.bought||0)+1; updateUI(); renderShopItems(); });
    c.appendChild(div);
  });
}
document.getElementById('shopBtn').addEventListener('click',openShop);
document.getElementById('shopCloseBtn').addEventListener('click',closeShop);

for (let i=0;i<60;i++) game.stars.push({x:Math.random()*W,y:Math.random()*H*0.6,size:Math.random()*2+0.5,speed:Math.random()*0.3+0.1,alpha:Math.random()*0.5+0.2});
function rand(m,M){return Math.random()*(M-m)+m;}
function randInt(m,M){return Math.floor(rand(m,M+1));}
function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
function clamp(v,mn,mx){return Math.max(mn,Math.min(mx,v));}

function spawnEnemy() {
  if (game.enemiesSpawned>=game.totalEnemies) return;
  game.enemiesSpawned++;
  const cfg=game.levelConfig||levelSystem.getCurrent();
  const hp=randInt(Math.round(cfg.enemyHp*0.8),Math.round(cfg.enemyHp*1.2));
  const speed=rand(cfg.enemySpeed*0.8,cfg.enemySpeed*1.2);
  game.enemies.push({x:rand(40,W-40),y:-40,w:28,h:40,hp,maxHp:hp,speed:clamp(speed,0.3,2.0),dir:1,shootTimer:randInt(20,80),canShoot:true,animFrame:0,animTimer:0});
}
function spawnTarget() {
  const types=[{w:30,h:50,hp:1,points:10},{w:40,h:60,hp:1,points:5},{w:24,h:36,hp:1,points:20}];
  const t=types[randInt(0,2)];
  game.enemies.push({x:rand(60,W-60),y:rand(60,H*0.65),w:t.w,h:t.h,hp:t.hp,maxHp:t.hp,speed:rand(0.2,0.6),dir:1,isTarget:true,points:t.points,label:t.w<30?'小':'靶',lifetime:randInt(300,500),animFrame:0,animTimer:0,vx:rand(-0.3,0.3),vy:rand(-0.2,0.2),moveTimer:randInt(30,80)});
}
function spawnSupply() { game.supplies.push({x:rand(50,W-50),y:-20,type:'ammo',speed:rand(0.5,1.2),bobPhase:rand(0,Math.PI*2)}); }
function createExplosion(x,y,color,count) {
  color=color||'#ff6600'; count=count||20;
  for(let i=0;i<count;i++){const a=rand(0,Math.PI*2),s=rand(1,5);game.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:randInt(20,50),maxLife:50,size:rand(2,6),color:Math.random()<0.5?color:'#ffcc00'});}
  if (count >= 15) game.screenShake=Math.max(game.screenShake,5);
}
function createMuzzleFlash(x,y){game.muzzleFlashes.push({x,y,life:6,maxLife:6,size:rand(4,10)});}

function shoot() {
  if(player.shootCooldown>0||game.over||!game.running)return;
  const cx=player.x,cy=player.y-player.h/2, dmg=player.damageMult, cd=Math.round(player.fireRateMult*10)/10;
  if(player.weapon==='pistol') {
    game.bullets.push({x:cx,y:cy-10,vx:rand(-0.5,0.5),vy:-7,damage:Math.round(18*dmg),w:4,h:10,color:'#ffdd44',trail:[]});
    player.shootCooldown=Math.round(12*cd);
  } else if(player.weapon==='rifle') {
    game.bullets.push({x:cx,y:cy-10,vx:rand(-0.2,0.2),vy:-10,damage:Math.round(25*dmg),w:3,h:14,color:'#88ffff',trail:[]});
    player.shootCooldown=Math.round(7*cd);
  } else if(player.weapon==='shotgun') {
    for(let i=0;i<6;i++) game.bullets.push({x:cx,y:cy-8,vx:rand(-2.5,2.5),vy:rand(-9,-5),damage:Math.round(15*dmg),w:4,h:5,color:'#ffaa44',trail:[]});
    player.shootCooldown=Math.round(32*cd);
  } else if(player.weapon==='sniper') {
    game.bullets.push({x:cx,y:cy-10,vx:rand(-0.1,0.1),vy:-14,damage:Math.round(60*dmg),w:4,h:18,color:'#ff6666',trail:[]});
    player.shootCooldown=Math.round(35*cd);
  }
  shootSound(); createMuzzleFlash(cx,cy-8);
  game.shellCasings.push({x:cx,y:cy,vx:rand(-1,1),vy:rand(-2,-1),life:40,rotation:0});
}
function enemyShoot(enemy) {
  const a=Math.atan2(player.y-enemy.y,player.x-enemy.x)+rand(-0.35,0.35);
  game.bullets.push({x:enemy.x,y:enemy.y+10,vx:Math.cos(a)*rand(2.5,4),vy:Math.sin(a)*rand(2.5,4),damage:10,w:6,h:6,color:'#ff2222',enemyBullet:true,trail:[]});
}
function triggerBoss() {
  if(game.bossActive||game.trainingMode)return;
  const cfg=game.levelConfig||levelSystem.getCurrent();
  if(!cfg.hasBoss){
    game.running=false;game.won=true;game.zoomed=false;
    vicScore.textContent=game.score;vicTotal.textContent=game.totalEnemies;
    victoryScreen.style.display='flex';
    createExplosion(W/2,H/3,'#ffd700',50);
    playSound('victory');
    recordGameResult(game.score, true, game.currentLevel);
    unlockNextLevel();
    return;
  }
  game.bossActive=true;
  const bossCount=cfg.bossCount||1;
  const remainingBosses=bossCount-game.bossesDefeated;
  if(remainingBosses<=0){
    // 所有BOSS都被击败
    game.running=false;game.won=true;game.zoomed=false;game.bossActive=false;
    vicScore.textContent=game.score;vicTotal.textContent=game.totalEnemies+bossCount;
    victoryScreen.style.display='flex';
    createExplosion(W/2,H/3,'#ff4400',60);createExplosion(W/2-50,H/3+30,'#ff8800',40);createExplosion(W/2+50,H/3-20,'#ffcc00',30);
    game.screenShake=0;playSound('victory');
    recordGameResult(game.score, true, game.currentLevel);
    unlockNextLevel();
    return;
  }
  waveInfo.textContent='\u{1F480} BOSS '+game.bossesDefeated+'/'+bossCount+' 登场！';waveInfo.style.opacity='1';waveInfo.style.color='#ff4444';waveInfo.style.fontSize='42px';
  setTimeout(()=>{waveInfo.style.opacity='0';waveInfo.style.color='#ffd700';waveInfo.style.fontSize='36px';},2000);
  game.screenShake=15;
  const bossHp=Math.round(cfg.bossHp||250);
  // 多个BOSS时位置分散
  const offsetX=remainingBosses>1?(game.bossesDefeated%2===0?-80:80):0;
  game.boss={x:W/2+offsetX,y:-80,w:60,h:70,hp:bossHp,maxHp:bossHp,speed:0.8,dir:1,shootTimer:0,shootInterval:Math.max(25,55-game.currentLevel*3),phase:1,state:'enter',enterTimer:120,animFrame:0,animTimer:0};
}
function checkBossDefeated() {
  if(!game.bossActive||!game.boss||game.boss.hp>0)return;
  game.bossActive=false;game.boss=null;
  game.bossesDefeated++;
  const cfg=game.levelConfig||levelSystem.getCurrent();
  const bossCount=cfg.bossCount||1;
  if(game.bossesDefeated>=bossCount){
    // 所有BOSS击败，胜利
    game.running=false;game.won=true;game.zoomed=false;game.screenShake=0;
    vicScore.textContent=game.score;vicTotal.textContent=game.totalEnemies+bossCount;
    victoryScreen.style.display='flex';
    createExplosion(W/2,H/3,'#ff4400',60);createExplosion(W/2-50,H/3+30,'#ff8800',40);createExplosion(W/2+50,H/3-20,'#ffcc00',30);
    game.screenShake=0;playSound('victory');
    recordGameResult(game.score, true, game.currentLevel);
    unlockNextLevel();
  } else {
    // 还有BOSS，继续召唤
    setTimeout(()=>{triggerBoss();},2000);
  }
}
function gameOver() {
  game.running=false;game.over=true;
  finalScore.textContent=game.score;finalKills.textContent=game.kills;finalTotal.textContent=game.totalEnemies;
  gameOverScreen.style.display='flex';createExplosion(player.x,player.y,'#ff0000',40);game.screenShake=0;playSound('gameover');
  recordGameResult(game.score, false, game.currentLevel);
}
function playerTakeDamage(dmg) {
  if(player.invincible>0||game.trainingMode)return;
  dmg=Math.round(dmg*(1-player.armor));player.hp-=dmg;player.invincible=20;game.screenShake=8;playSound('hit');
  if(player.hp<=0){player.hp=0;gameOver();}
  updateUI();
}
function addScore(points){
  const bonus=rankSystem.getBonus();
  const finalPoints=Math.round(points*bonus);
  game.score+=finalPoints;
  game.rankScore+=finalPoints;
  // 检查升级
  const upgraded=rankSystem.checkUpgrade();
  if(upgraded){
    waveInfo.textContent='🎉 升级！'+upgraded.title;
    waveInfo.style.color=upgraded.color;
    waveInfo.style.opacity='1';
    setTimeout(()=>{waveInfo.style.opacity='0';waveInfo.style.color='#ffd700';},2000);
  }
}
function updateUI() {
  scoreEl.textContent=game.score;livesEl.textContent=game.lives;killsEl.textContent=game.kills;
  remainingEl.textContent=Math.max(0,game.totalEnemies-game.kills);totalEl.textContent=game.totalEnemies;
  document.getElementById('uiCenter').style.display=game.trainingMode?'none':'';
  // 更新等级显示
  const rank=rankSystem.getCurrent();
  const rankEl=document.getElementById('rankDisplay');
  rankEl.textContent=rank.title;
  rankEl.className='rank-badge '+rank.name;
  rankEl.style.color=rank.color;
  rankEl.style.display=game.running?'none':'block';
  // 更新主页面等级显示
  const startRankEl=document.getElementById('startScreenRank');
  if(startRankEl){
    startRankEl.textContent=rank.title;
    startRankEl.className='start-rank '+rank.name;
  }
}
function updateTrainingStats() {
  const acc=game.shotsFired>0?Math.round(game.hits/game.shotsFired*100):0;
  document.getElementById('trainStats').innerHTML='\u{1F3AF} 命中率: '+acc+'%<br>命中: '+game.hits+'/'+game.shotsFired+'<br>\u{1F525} 连击: '+game.combo+' (最高: '+game.maxCombo+')';
}
function initAITeammate(level) {
  level=level||'mid';
  game.aiTeammateLevel=level;
  aiTeammate.active=true;
  aiTeammate.x=player.x-60;
  aiTeammate.y=player.y;
  aiTeammate.invincible=60;
  aiTeammate.dir=1;
  aiTeammate.targetEnemy=null;
  aiTeammate.shootTimer=0;
  aiTeammate.weapon='rifle';
  // 根据级别设置属性
  if(level==='low'){
    aiTeammate.maxHp=80;aiTeammate.hp=80;aiTeammate.speed=0.55;aiTeammate.damageMult=0.35;
  }else if(level==='high'){
    aiTeammate.maxHp=250;aiTeammate.hp=250;aiTeammate.speed=1.3;aiTeammate.damageMult=0.85;
  }else{
    aiTeammate.maxHp=160;aiTeammate.hp=160;aiTeammate.speed=0.9;aiTeammate.damageMult=0.55;
  }
}

function aiTeammateShoot(targetX,targetY) {
  if(aiTeammate.shootCooldown>0)return;
  const cx=aiTeammate.x,cy=aiTeammate.y-aiTeammate.h/2;
  const dmg=aiTeammate.damageMult;
  const angle=Math.atan2(targetY-aiTeammate.y,targetX-aiTeammate.x);
  // 根据级别有不同的射击精度
  let spread=0;
  if(game.aiTeammateLevel==='low'){spread=rand(-1.8,1.8);}else if(game.aiTeammateLevel==='high'){spread=rand(-0.3,0.3);}else{spread=rand(-1.2,1.2);}
  const cosA=Math.cos(angle+spread),sinA=Math.sin(angle+spread);
  if(aiTeammate.weapon==='rifle') {
    game.bullets.push({x:cx,y:cy-10,vx:cosA*10+rand(-1.2,1.2),vy:sinA*10+rand(-0.8,0.8),damage:Math.round(16*dmg),w:3,h:14,color:'#88ff88',trail:[],fromAI:true});
    aiTeammate.shootCooldown=game.aiTeammateLevel==='high'?8:(game.aiTeammateLevel==='low'?12:10);
    playSound('rifle');
  }
  createMuzzleFlash(cx,cy-8);
  game.shellCasings.push({x:cx,y:cy,vx:rand(-1,1),vy:rand(-2,-1),life:40,rotation:0});
}

function updateAITeammate() {
  if(!aiTeammate.active||game.over||!game.running)return;
  aiTeammate.moving=false;
  // 根据级别设置攻击范围和跟随距离
  let attackRange=350,idealDist=180,reactDelay=14;
  if(game.aiTeammateLevel==='low'){attackRange=280;idealDist=150;reactDelay=18;}else if(game.aiTeammateLevel==='high'){attackRange=450;idealDist=220;reactDelay=10;}
  // 寻找最近的敌人
  let nearest=null,nearestDist=Infinity;
  for(const e of game.enemies){const d=Math.hypot(e.x-aiTeammate.x,e.y-aiTeammate.y);if(d<nearestDist){nearestDist=d;nearest=e;}}
  if(game.bossActive&&game.boss){nearest=game.boss;nearestDist=Math.hypot(game.boss.x-aiTeammate.x,game.boss.y-aiTeammate.y);}
  aiTeammate.targetEnemy=nearest;
  // 移动逻辑
  if(nearest&&nearestDist<attackRange+100){
    const curIdeal=game.bossActive&&game.boss?250:idealDist;
    const angle=Math.atan2(nearest.y-aiTeammate.y,nearest.x-aiTeammate.x);
    if(nearestDist>curIdeal+80){aiTeammate.x+=Math.cos(angle)*aiTeammate.speed;aiTeammate.y+=Math.sin(angle)*aiTeammate.speed*0.5;aiTeammate.moving=true;}
    else if(nearestDist<curIdeal-50){aiTeammate.x-=Math.cos(angle)*aiTeammate.speed*0.6;aiTeammate.y-=Math.sin(angle)*aiTeammate.speed*0.3;aiTeammate.moving=true;}
    else{aiTeammate.x+=Math.sin(game.frame*0.15)*aiTeammate.speed*0.6;aiTeammate.moving=true;}
    aiTeammate.dir=nearest.x>aiTeammate.x?1:-1;
  }else{
    const followDist=80,dx=player.x-aiTeammate.x,dy=player.y-aiTeammate.y,distToPlayer=Math.hypot(dx,dy);
    if(distToPlayer>followDist+30){aiTeammate.x+=Math.sign(dx)*aiTeammate.speed*0.6;aiTeammate.moving=true;aiTeammate.dir=dx>0?1:-1;}
    if(!aiTeammate.moving&&game.frame%60<30){aiTeammate.x+=Math.sin(game.frame*0.05)*2;aiTeammate.moving=true;aiTeammate.dir=Math.sin(game.frame*0.05)>0?1:-1;}
  }
  aiTeammate.x=clamp(aiTeammate.x,40,W-40);aiTeammate.y=clamp(aiTeammate.y,H*0.5,H-50);
  // 射击逻辑 - 根据级别调整射速
  const burstPos=aiTeammate.shootTimer%(game.aiTeammateLevel==='high'?150:(game.aiTeammateLevel==='low'?220:180));
  aiTeammate.shootTimer++;
  if(nearest&&nearestDist<attackRange&&burstPos<50&&burstPos%reactDelay===1){
    // 高级AI会预测目标移动
    let aimX=nearest.x,aimY=nearest.y;
    if(game.aiTeammateLevel==='high'&&nearest.vx){aimX+=nearest.vx*8;aimY+=nearest.vy*5;}
    else if(game.aiTeammateLevel==='mid'&&nearest.vx){aimX+=nearest.vx*5;aimY+=nearest.vy*3;}
    aiTeammate.dir=aimX>aiTeammate.x?1:-1;aiTeammate.shootCooldown=0;aiTeammateShoot(aimX,aimY);
  }
  if(aiTeammate.invincible>0)aiTeammate.invincible--;
}

function aiTeammateTakeDamage(dmg){
  if(aiTeammate.invincible>0||game.trainingMode)return;
  aiTeammate.hp-=dmg;aiTeammate.invincible=20;game.screenShake=5;playSound('hit');
  if(aiTeammate.hp<=0){
    aiTeammate.hp=0;aiTeammate.active=false;
    createExplosion(aiTeammate.x,aiTeammate.y,'#ff4444',30);
    playSound('explosion');
  }
}

function drawAITeammateHpBar(){
  if(!aiTeammate.active)return;
  const barW=100,barH=6,bx=W-130,by=H-38;
  ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(bx-1,by-1,barW+2,barH+2);
  const r=aiTeammate.hp/aiTeammate.maxHp;
  ctx.fillStyle=r>0.5?'#44cc44':r>0.25?'#cccc44':'#ff4444';
  ctx.fillRect(bx,by,barW*r,barH);
  ctx.fillStyle='#fff';ctx.font='9px sans-serif';ctx.textAlign='center';
  ctx.fillText('🤖 '+Math.ceil(aiTeammate.hp),bx+barW/2,by+7);
}

function resetGame() {
  const cfg=levelSystem.getCurrent();
  game.trainingMode=document.getElementById('modeTrainBtn').classList.contains('active');
  game.aiTeammateEnabled=document.getElementById('aiTeammateLow').classList.contains('active')?'low':(document.getElementById('aiTeammateHigh').classList.contains('active')?'high':(document.getElementById('aiTeammateMid').classList.contains('active')?'mid':null));
  game.totalEnemies=game.trainingMode?20:cfg.enemies;
  game.score=0;game.lives=3;game.kills=0;game.enemiesSpawned=0;game.shotsFired=0;game.hits=0;game.combo=0;game.maxCombo=0;
  game.rank='bronze';game.rankScore=0;
  game.frame=0;game.particles=[];game.bullets=[];game.enemies=[];game.supplies=[];game.shellCasings=[];game.muzzleFlashes=[];
  game.screenShake=0;game.enemySpawnTimer=0;game.enemySpawnInterval=game.trainingMode?90:cfg.spawnInterval;
  game.maxEnemiesOnScreen=game.trainingMode?6:Math.min(4,Math.ceil(cfg.enemies/3));
  game.over=false;game.won=false;game.zoomed=false;game.bossActive=false;game.boss=null;game.bosses=[];game.bossesDefeated=0;
  game.levelConfig=cfg;
  keys.zoom=false;game.running=true;
  // 血量部分恢复：恢复30%最大血量（最少20点），难度越高恢复越少
  const hpRestore=Math.max(10,Math.round(player.maxHp*0.3));
  player.x=W/2;player.hp=Math.min(player.maxHp,player.hp+hpRestore);player.weapon='pistol';player.damageMult=1;player.fireRateMult=1;player.armor=0;
  player.invincible=game.trainingMode?9999:60;player.shootCooldown=0;
  if(game.aiTeammateEnabled){initAITeammate(game.aiTeammateEnabled);}
  else{aiTeammate.active=false;}
  // 每关只重置武器购买状态，其他升级保留
  shopItems.forEach(i=>{if(i.id==='rifle'||i.id==='shotgun'||i.id==='sniper')i.bought=false;});
  document.getElementById('trainStats').style.display=game.trainingMode?'block':'none';
  document.getElementById('trainExitBtn').style.display=game.trainingMode?'':'none';
  document.getElementById('shopBtn').style.display=game.trainingMode?'none':'';
  updateUI();weaponInfo.textContent='\u{1F52B} 手枪 (18伤害)';
  if(game.trainingMode){waveInfo.textContent='\u{1F3AF} 训练场 — 射击移动靶练习！';waveInfo.style.opacity='1';setTimeout(()=>{waveInfo.style.opacity='0';},2500);}
  else{waveInfo.textContent='\u{1F3AF} 第'+cfg.level+'关: '+cfg.name+' — '+cfg.desc;waveInfo.style.opacity='1';setTimeout(()=>{waveInfo.style.opacity='0';},2500);}
}

// Drawing
function drawBackground() {
  const g=ctx.createLinearGradient(0,0,0,H*0.6); g.addColorStop(0,'#0a0a1a');g.addColorStop(0.5,'#1a1a2e');g.addColorStop(1,'#2a1a0a');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  for(const s of game.stars){ctx.globalAlpha=s.alpha+Math.sin(game.frame*0.02+s.x)*0.15;ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.x,s.y,s.size,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;ctx.fillStyle='#1a1a0a';ctx.beginPath();ctx.moveTo(0,H*0.55);
  for(let x=0;x<=W;x+=30){const y=H*0.55+Math.sin(x*0.008)*30+Math.sin(x*0.015)*15;ctx.lineTo(x,y);}
  ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.closePath();ctx.fill();
  for(let i=0;i<3;i++){const sx=100+i*350+Math.sin(game.frame*0.01+i)*40,sy=H*0.45+Math.sin(game.frame*0.02+i*2)*5;ctx.globalAlpha=0.1+Math.sin(game.frame*0.03+i)*0.05;ctx.fillStyle='#ff6600';ctx.beginPath();ctx.arc(sx,sy,20+Math.sin(game.frame*0.05+i*3)*8,0,Math.PI*2);ctx.fill();ctx.fillStyle='#333';ctx.beginPath();ctx.arc(sx,sy+10,25+Math.sin(game.frame*0.04+i*2)*5,0,Math.PI*2);ctx.fill();}
  ctx.globalAlpha=1;ctx.fillStyle='#3a2a1a';ctx.fillRect(0,H*0.72,W,H*0.28);
  ctx.strokeStyle='#4a3a2a';ctx.lineWidth=1;
  for(let i=0;i<20;i++){const gy=H*0.73+i*10+Math.sin(i)*3;ctx.globalAlpha=0.3;ctx.beginPath();ctx.moveTo(0,gy);for(let x=0;x<=W;x+=20)ctx.lineTo(x,gy+Math.sin(x*0.05+i)*2);ctx.stroke();}
  ctx.globalAlpha=1;ctx.fillStyle='#2a1a0a';
  for(let i=0;i<4;i++){const tx=80+i*220;ctx.beginPath();ctx.ellipse(tx,H*0.78,60,12,0,0,Math.PI*2);ctx.fill();}
  ctx.strokeStyle='#666';ctx.lineWidth=1.5;
  for(let i=0;i<5;i++){const bx=i*200+20;ctx.beginPath();ctx.moveTo(bx,H*0.74);for(let t=0;t<4;t++){const nx=bx+t*8+Math.sin(game.frame*0.02+i+t)*1,ny=H*0.74+Math.sin(t*1.5)*5;ctx.lineTo(nx,ny);}ctx.stroke();}
  ctx.fillStyle='#5a4a3a';ctx.fillRect(0,H-20,W,20);ctx.fillStyle='#6a5a4a';
  for(let i=0;i<W;i+=25){ctx.fillRect(i,H-20,23,8);ctx.fillRect(i+4,H-12,23,8);}
  ctx.fillStyle='#4a3a2a';ctx.fillRect(0,H-22,W,2);
}

function drawSoldier(px,py,w,h,dir,isPlayer,hp,maxHp,moving,invincible,isAITeammate) {
  const cx=px,cy=py;ctx.save();
  if(isPlayer&&invincible>0&&Math.floor(invincible/3)%2===0)ctx.globalAlpha=0.5;
  if(isAITeammate&&invincible>0&&Math.floor(invincible/3)%2===0)ctx.globalAlpha=0.5;
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.beginPath();ctx.ellipse(cx,cy+h/2+2,18,4,0,0,Math.PI*2);ctx.fill();
  const lo=moving?Math.sin(game.frame*0.15)*4:0;
  ctx.fillStyle=isPlayer?'#3a5a2a':isAITeammate?'#3a5a8a':'#5a3a2a';ctx.fillRect(cx-8,cy+6+lo,6,14);ctx.fillRect(cx+2,cy+6-lo,6,14);
  ctx.fillStyle='#2a2a1a';ctx.fillRect(cx-9,cy+18+lo,8,4);ctx.fillRect(cx+1,cy+18-lo,8,4);
  ctx.fillStyle=isPlayer?'#4a6a3a':isAITeammate?'#4a7aaa':'#6a4a3a';ctx.beginPath();ctx.roundRect(cx-12,cy-10,24,22,3);ctx.fill();
  ctx.fillStyle='#3a2a1a';ctx.fillRect(cx-12,cy+6,24,3);
  ctx.fillStyle=isPlayer?'#d4a574':isAITeammate?'#74a5d4':'#c49464';ctx.beginPath();ctx.arc(cx,cy-16,9,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=isPlayer?'#3a5a2a':isAITeammate?'#3a5a9a':'#5a3a2a';ctx.beginPath();ctx.ellipse(cx,cy-20,11,5,0,Math.PI,Math.PI*2);ctx.fill();
  ctx.fillRect(cx-3,cy-25,6,5);
  ctx.save();ctx.translate(cx+(dir>=0?12:-12),cy-2);ctx.fillStyle='#333';ctx.fillRect(-2,-2,16,4);ctx.fillStyle='#555';ctx.fillRect(12,-3,4,6);ctx.restore();
  ctx.fillStyle=isPlayer?'#4a6a3a':isAITeammate?'#4a7aaa':'#6a4a3a';ctx.fillRect(cx+(dir>=0?8:-14),cy-4,6,10);
  if(!isPlayer&&hp<maxHp){ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(cx-13,cy-32,26,3);ctx.fillStyle=hp/maxHp>0.5?'#44cc44':hp/maxHp>0.25?'#cccc44':'#cc4444';ctx.fillRect(cx-13,cy-32,26*(hp/maxHp),3);}
  ctx.restore();
}

function drawTarget(t) {
  const cx=t.x,cy=t.y;ctx.save();
  ctx.fillStyle='rgba(0,0,0,0.2)';ctx.beginPath();ctx.ellipse(cx,cy+t.h/2+2,t.w/2,4,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#8a6a4a';ctx.fillRect(cx-t.w/2,cy-t.h/2,t.w,t.h);
  ctx.strokeStyle='#fff';ctx.lineWidth=1.5;[0.4,0.3,0.2,0.1].forEach(r=>{ctx.beginPath();ctx.arc(cx,cy,t.w*r,0,Math.PI*2);ctx.stroke();});
  ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(cx,cy,t.w*0.08,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#6a5a3a';ctx.fillRect(cx-2,cy+t.h/2,4,20);
  ctx.fillStyle='#ffd700';ctx.font='bold 14px "Courier New",monospace';ctx.textAlign='center';ctx.textBaseline='bottom';
  ctx.fillText(t.label,cx,cy-t.h/2-4);ctx.restore();
}

function drawBoss(b) {
  const cx=b.x,cy=b.y;ctx.save();
  ctx.fillStyle='rgba(0,0,0,0.3)';ctx.beginPath();ctx.ellipse(cx,cy+b.h/2+5,35,8,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=b.phase===2?'#8a2a2a':'#4a3a2a';ctx.beginPath();ctx.roundRect(cx-b.w/2,cy-b.h/4,b.w,b.h*0.6,8);ctx.fill();
  ctx.fillStyle='#5a4a3a';ctx.fillRect(cx-b.w/2+4,cy-b.h/4+4,8,b.h*0.4);ctx.fillRect(cx+b.w/2-12,cy-b.h/4+4,8,b.h*0.4);
  ctx.fillStyle='#3a3a2a';ctx.beginPath();ctx.roundRect(cx-18,cy-b.h/2+4,36,24,4);ctx.fill();
  ctx.fillStyle='#333';ctx.fillRect(cx-3,cy-b.h/2-12,6,18);
  ctx.fillStyle=b.phase===2?'#ff2200':'#ffaa00';ctx.shadowBlur=b.phase===2?12:6;ctx.shadowColor=b.phase===2?'#ff0000':'#ffaa00';
  ctx.beginPath();ctx.arc(cx-10,cy-b.h/4+4,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(cx+10,cy-b.h/4+4,4,0,Math.PI*2);ctx.fill();
  ctx.shadowBlur=0;ctx.fillStyle='#2a2a1a';
  for(let i=0;i<4;i++){const wy=cy-b.h/6+i*8;ctx.fillRect(cx-b.w/2-4,wy,6,6);ctx.fillRect(cx+b.w/2-2,wy,6,6);}
  ctx.fillStyle='#ffd700';ctx.font='20px sans-serif';ctx.textAlign='center';ctx.textBaseline='bottom';ctx.fillText('\u{1F451}',cx,cy-b.h/2-4);
  ctx.restore();
}

function drawBossHpBar() {
  if(!game.boss||!game.bossActive)return;
  const b=game.boss,barW=400,barH=14,bx=(W-barW)/2,by=32;
  ctx.fillStyle=b.phase===2?'#ff4444':'#ffaa00';ctx.font='bold 11px "Courier New",monospace';ctx.textAlign='center';
  ctx.fillText(b.phase===2?'⚡ BOSS 暴走模式 ⚡':'\u{1F451} BOSS',W/2,by-4);
  ctx.fillStyle='rgba(0,0,0,0.6)';ctx.beginPath();ctx.roundRect(bx-2,by+2,barW+4,barH+4,4);ctx.fill();
  const r=b.hp/b.maxHp,grad=ctx.createLinearGradient(bx,by+4,bx+barW*r,by+4);
  grad.addColorStop(0,'#ff4444');grad.addColorStop(0.5,'#ff8800');grad.addColorStop(1,'#ffcc00');
  ctx.fillStyle=grad;ctx.beginPath();ctx.roundRect(bx,by+4,barW*r,barH,3);ctx.fill();
  ctx.fillStyle='#fff';ctx.font='10px "Courier New",monospace';ctx.textAlign='center';ctx.fillText(Math.ceil(b.hp)+' / '+b.maxHp,W/2,by+15);
}

function drawExplosions() { for(const p of game.particles){ctx.globalAlpha=p.life/p.maxLife;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(p.x,p.y,p.size*(p.life/p.maxLife),0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1; }
function drawMuzzleFlashes() { for(const f of game.muzzleFlashes){const a=f.life/f.maxLife;ctx.globalAlpha=a;ctx.fillStyle='#ffff88';ctx.beginPath();ctx.arc(f.x,f.y,f.size*a,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ffaa44';ctx.beginPath();ctx.arc(f.x,f.y,f.size*a*0.6,0,Math.PI*2);ctx.fill();}ctx.globalAlpha=1; }
function drawBullets() {
  for(const b of game.bullets){for(let i=0;i<b.trail.length;i++){ctx.globalAlpha=(i/b.trail.length)*0.5;ctx.fillStyle=b.color;ctx.fillRect(b.trail[i].x,b.trail[i].y,b.w,b.h);}ctx.globalAlpha=1;ctx.fillStyle=b.color;ctx.shadowBlur=8;ctx.shadowColor=b.color;if(b.enemyBullet){ctx.beginPath();ctx.arc(b.x,b.y,3,0,Math.PI*2);ctx.fill();}else{ctx.fillRect(b.x-b.w/2,b.y-b.h/2,b.w,b.h);}ctx.shadowBlur=0;}
}
function drawSupplies() {
  for(const s of game.supplies){const bob=Math.sin(game.frame*0.05+s.bobPhase)*3;ctx.shadowBlur=15;ctx.shadowColor='#ffd700';ctx.fillStyle='#8a6a2a';ctx.fillRect(s.x-14,s.y+bob-10,28,20);ctx.fillStyle='#6a4a1a';ctx.fillRect(s.x-14,s.y+bob-10,28,4);ctx.fillRect(s.x-14,s.y+bob+6,28,4);ctx.fillStyle='#ffd700';ctx.font='16px sans-serif';ctx.textAlign='center';ctx.fillText('\u{1F4E6}',s.x,s.y+bob+6);ctx.shadowBlur=0;}
}
function drawShellCasings() { for(const s of game.shellCasings){ctx.globalAlpha=s.life/40;ctx.fillStyle='#ccaa44';ctx.save();ctx.translate(s.x,s.y);ctx.rotate(s.rotation);ctx.fillRect(-2,-4,4,8);ctx.restore();}ctx.globalAlpha=1; }
function drawHpBar() {
  const barW=160,barH=8,bx=20,by=H-38;ctx.fillStyle='rgba(0,0,0,0.5)';ctx.fillRect(bx-1,by-1,barW+2,barH+2);
  const r=player.hp/player.maxHp,grad=ctx.createLinearGradient(bx,by,bx+barW,by);
  grad.addColorStop(0,'#ff4444');grad.addColorStop(0.5,'#ffaa44');grad.addColorStop(1,'#44cc44');
  ctx.fillStyle=grad;ctx.fillRect(bx,by,barW*r,barH);ctx.fillStyle='#fff';ctx.font='10px sans-serif';ctx.textAlign='center';ctx.fillText('HP '+Math.ceil(player.hp)+'/'+player.maxHp,bx+barW/2,by+7);
}
function drawScopeOverlay() {
  const cx=W/2,cy=H/2,g=ctx.createRadialGradient(cx,cy,W*0.18,cx,cy,W*0.55);
  g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(0.6,'rgba(0,0,0,0)');g.addColorStop(0.85,'rgba(0,0,0,0.4)');g.addColorStop(1,'rgba(0,0,0,0.8)');
  ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(0,0,0,0.6)';ctx.lineWidth=4;ctx.beginPath();ctx.arc(cx,cy,W*0.18,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(cx,cy,W*0.18+3,0,Math.PI*2);ctx.stroke();
  const ch=18;ctx.strokeStyle='rgba(255,50,50,0.7)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.moveTo(cx-W*0.18+6,cy);ctx.lineTo(cx-ch,cy);ctx.moveTo(cx+ch,cy);ctx.lineTo(cx+W*0.18-6,cy);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx,cy-W*0.18+6);ctx.lineTo(cx,cy-ch);ctx.moveTo(cx,cy+ch);ctx.lineTo(cx,cy+W*0.18-6);ctx.stroke();
  ctx.fillStyle='rgba(255,50,50,0.9)';ctx.beginPath();ctx.arc(cx,cy,1.5,0,Math.PI*2);ctx.fill();
  ctx.save();const gx=cx,gy=H-20;ctx.fillStyle='#333';ctx.fillRect(gx-12,gy-30,24,36);ctx.fillStyle='#444';ctx.fillRect(gx-8,gy-34,16,8);
  ctx.fillStyle='#222';ctx.fillRect(gx-1,gy-42,2,10);ctx.fillStyle='#555';ctx.fillRect(gx-4,gy-44,8,3);ctx.restore();
  ctx.fillStyle='rgba(0,0,0,0.4)';ctx.fillRect(0,0,W,24);ctx.fillStyle='#ffd700';ctx.font='11px "Courier New",monospace';ctx.textAlign='center';
  ctx.fillText('\u{1F50D} 瞄准镜  |  Shift/右键退出  |  移动减速',cx,17);
}

// Update
function update() {
  if(!game.running)return;
  game.frame++;
  player.moving=false;const sm=game.zoomed?0.35:1;
  if(keys.left){player.x-=player.speed*sm;player.dir=-1;player.moving=true;}
  if(keys.right){player.x+=player.speed*sm;player.dir=1;player.moving=true;}
  if(touchTargetX!==null){const cv=document.getElementById('gameCanvas'),rect=cv.getBoundingClientRect(),gx=(touchTargetX-rect.left)/rect.width*W,dx=gx-player.x;if(Math.abs(dx)>2){player.x+=Math.sign(dx)*player.speed*1.5*sm;player.dir=dx>0?1:-1;player.moving=true;}}
  player.x=clamp(player.x,30,W-30);
  if(player.shootCooldown>0)player.shootCooldown--;
  if(player.invincible>0)player.invincible--;
  if(keys.space){if(game.trainingMode&&player.shootCooldown<=1)game.shotsFired++;shoot();}
  // 更新AI队友
  updateAITeammate();
  game.enemySpawnTimer++;
  if(game.trainingMode){if(game.enemySpawnTimer>=randInt(40,90)&&game.enemies.length<game.maxEnemiesOnScreen){game.enemySpawnTimer=0;spawnTarget();}}
  else{if(game.enemySpawnTimer>=game.enemySpawnInterval&&game.enemies.length<game.maxEnemiesOnScreen){if(game.enemiesSpawned<game.totalEnemies){game.enemySpawnTimer=0;spawnEnemy();}}}
  for(let i=game.enemies.length-1;i>=0;i--){
    const e=game.enemies[i];
    if(e.isTarget){e.animTimer++;if(e.moveTimer>0){e.x+=e.vx;e.y+=e.vy;e.moveTimer--;}e.lifetime--;if(e.lifetime<=0||e.x<-40||e.x>W+40||e.y<-40||e.y>H+40){game.enemies.splice(i,1);game.combo=0;}continue;}
    const dx=player.x-e.x,dy=(player.y-50)-e.y,ang=Math.atan2(dy,dx);
    e.x+=Math.cos(ang)*e.speed;e.y+=Math.sin(ang)*e.speed;e.dir=dx>0?1:-1;
    e.animTimer++;if(e.animTimer>10){e.animTimer=0;e.animFrame=(e.animFrame+1)%4;}
    if(e.canShoot&&dist(e,player)<550){e.shootTimer++;if(e.shootTimer>randInt(30,60)){e.shootTimer=0;enemyShoot(e);}}
    if(dist(e,player)<20){playerTakeDamage(20);createExplosion(e.x,e.y,'#ff4444',10);game.enemies.splice(i,1);continue;}
    if(aiTeammate.active&&dist(e,aiTeammate)<20){aiTeammateTakeDamage(15);createExplosion(e.x,e.y,'#ff4444',10);game.enemies.splice(i,1);continue;}
    if(e.y>H+50)game.enemies.splice(i,1);
  }
  if(game.bossActive&&game.boss){
    const b=game.boss;
    if(b.state==='enter'){b.y+=0.8;b.enterTimer--;if(b.enterTimer<=0)b.state='fight';}
    else{b.x+=b.speed*b.dir;if(b.x>W-50)b.dir=-1;if(b.x<50)b.dir=1;b.phase=b.hp<b.maxHp*0.5?2:1;b.shootTimer++;const iv=b.phase===2?35:55;if(b.shootTimer>=iv){b.shootTimer=0;const a=Math.atan2(player.y-b.y,player.x-b.x);if(b.phase===1){game.bullets.push({x:b.x,y:b.y+30,vx:Math.cos(a)*4,vy:Math.sin(a)*4,damage:20,w:8,h:8,color:'#ff6622',enemyBullet:true,trail:[]});}else{for(let j=-1;j<=1;j++){const ag=a+j*0.25;game.bullets.push({x:b.x+j*10,y:b.y+30,vx:Math.cos(ag)*3.5,vy:Math.sin(ag)*3.5,damage:15,w:6,h:6,color:'#ff4444',enemyBullet:true,trail:[]});}}playSound('shotgun');}}
  }
  for(let i=game.bullets.length-1;i>=0;i--){
    const b=game.bullets[i];b.trail.push({x:b.x,y:b.y});if(b.trail.length>5)b.trail.shift();b.x+=b.vx;b.y+=b.vy;
    if(b.x<-20||b.x>W+20||b.y<-20||b.y>H+20){game.bullets.splice(i,1);continue;}
    if(b.enemyBullet){if(dist(b,player)<15){playerTakeDamage(b.damage);game.bullets.splice(i,1);createExplosion(b.x,b.y,'#ff4444',5);continue;}if(aiTeammate.active&&dist(b,aiTeammate)<15){aiTeammateTakeDamage(b.damage);game.bullets.splice(i,1);createExplosion(b.x,b.y,'#ff4444',5);continue;}}
    else if(game.bossActive&&game.boss&&Math.abs(b.x-game.boss.x)<game.boss.w*0.5&&Math.abs(b.y-game.boss.y)<game.boss.h*0.5){game.boss.hp-=b.damage*0.8;game.bullets.splice(i,1);createExplosion(b.x,b.y,'#ff8800',8);playSound('enemy_hit');if(game.boss.hp<=0){game.boss.hp=0;addScore(50);checkBossDefeated();}}
    else{for(let j=game.enemies.length-1;j>=0;j--){const e=game.enemies[j],hw=e.isTarget?e.w*0.5:20,hh=e.isTarget?e.h*0.5:25;if(Math.abs(b.x-e.x)<hw&&Math.abs(b.y-e.y)<hh){e.hp-=b.damage;game.bullets.splice(i,1);if(e.isTarget){game.hits++;if(e.hp<=0){game.combo++;if(game.combo>game.maxCombo)game.maxCombo=game.combo;addScore(Math.round(e.points*(1+Math.floor(game.combo/5)*0.5)));game.kills++;createExplosion(e.x,e.y,'#88ddff',15);playSound('explosion');if(game.combo>1){waveInfo.textContent='\u{1F525} '+game.combo+' 连击！';waveInfo.style.opacity='1';setTimeout(()=>{waveInfo.style.opacity='0';},600);}game.enemies.splice(j,1);updateTrainingStats();}else{createExplosion(b.x,b.y,'#88ddff',5);playSound('enemy_hit');}}else{createExplosion(b.x,b.y,'#ffaa44',5);playSound('enemy_hit');if(e.hp<=0){addScore(10);game.kills++;createExplosion(e.x,e.y,'#ff6600',25);playSound('explosion');if(Math.random()<0.08)spawnSupply();game.enemies.splice(j,1);updateUI();if(game.kills>=game.totalEnemies&&!game.bossActive&&!game.trainingMode)triggerBoss();}}break;}}}
  }
  for(let i=game.supplies.length-1;i>=0;i--){const s=game.supplies[i];s.y+=s.speed;if(dist(s,player)<28){if(player.weapon==='pistol'){player.weapon='rifle';weaponInfo.textContent='\u{1F52B} 步枪 (25·连发)';}else if(player.weapon==='rifle'){player.weapon='shotgun';weaponInfo.textContent='\u{1F52B} 霰弹枪 (15×6·散射)';}else if(player.weapon==='shotgun'){player.weapon='sniper';weaponInfo.textContent='\\\u{1F3AF} 狙击枪 (60·远程)';}addScore(20);updateUI();playSound('pickup');createExplosion(s.x,s.y,'#ffd700',15);game.supplies.splice(i,1);continue;}if(s.y>H+30)game.supplies.splice(i,1);}
  for(let i=game.particles.length-1;i>=0;i--){const p=game.particles[i];p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.life--;if(p.life<=0)game.particles.splice(i,1);}
  for(let i=game.muzzleFlashes.length-1;i>=0;i--){game.muzzleFlashes[i].life--;if(game.muzzleFlashes[i].life<=0)game.muzzleFlashes.splice(i,1);}
  for(let i=game.shellCasings.length-1;i>=0;i--){const s=game.shellCasings[i];s.x+=s.vx;s.y+=s.vy;s.vy+=0.2;s.rotation+=0.1;s.life--;if(s.life<=0)game.shellCasings.splice(i,1);}
  if(game.screenShake>0)game.screenShake*=0.9;
  if(game.screenShake<0.1)game.screenShake=0;
}

// Render
function render() {
  ctx.save();
  if(game.screenShake>0.5)ctx.translate((Math.random()-0.5)*game.screenShake*1.5,(Math.random()-0.5)*game.screenShake*1.5);
  if(game.zoomed){const s=1.8;ctx.translate(W/2,H/2);ctx.scale(s,s);ctx.translate(-player.x,-player.y);}
  drawBackground();drawSupplies();drawBullets();drawShellCasings();
  for(const e of game.enemies){if(e.isTarget)drawTarget(e);else drawSoldier(e.x,e.y,e.w,e.h,e.dir,false,e.hp,e.maxHp,true,0);}
  if(!game.over&&!game.won){drawSoldier(player.x,player.y,player.w,player.h,player.dir,true,player.hp,player.maxHp,player.moving,player.invincible,false);if(aiTeammate.active)drawSoldier(aiTeammate.x,aiTeammate.y,aiTeammate.w,aiTeammate.h,aiTeammate.dir,false,aiTeammate.hp,aiTeammate.maxHp,aiTeammate.moving,aiTeammate.invincible,true);}
  if(game.bossActive&&game.boss)drawBoss(game.boss);
  drawExplosions();drawMuzzleFlashes();
  ctx.restore();
  ctx.save();drawHpBar();if(aiTeammate.active)drawAITeammateHpBar();if(game.zoomed)drawScopeOverlay();if(game.bossActive)drawBossHpBar();ctx.restore();
}

function gameLoop(){if(!game.started)return;update();if(game.trainingMode)updateTrainingStats();render();requestAnimationFrame(gameLoop);}
if(!CanvasRenderingContext2D.prototype.roundRect){CanvasRenderingContext2D.prototype.roundRect=function(x,y,w,h,r){this.moveTo(x+r,y);this.lineTo(x+w-r,y);this.quadraticCurveTo(x+w,y,x+w,y+r);this.lineTo(x+w,y+h-r);this.quadraticCurveTo(x+w,y+h,x+w-r,y+h);this.lineTo(x+r,y+h);this.quadraticCurveTo(x,y+h,x,y+h-r);this.lineTo(x,y+r);this.quadraticCurveTo(x,y,x+r,y);this.closePath();};}

document.addEventListener('keydown',(e)=>{
  // 检查是否在输入框中，如果是则不处理游戏按键
  if(e.target.tagName==='INPUT'&&e.target.type==='password')return;
  if(e.target.tagName==='INPUT'&&e.target.type==='text')return;
  if(e.target.tagName==='TEXTAREA')return;
  if(e.key==='a'||e.key==='A'||e.key==='ArrowLeft')keys.left=true;
  if(e.key==='d'||e.key==='D'||e.key==='ArrowRight')keys.right=true;
  if(e.key===' '){keys.space=true;e.preventDefault();}
  if(e.key==='Shift'&&!keys.zoom){keys.zoom=true;game.zoomed=true;e.preventDefault();}
  if(e.key==='b'||e.key==='B'){if(game.shopOpen)closeShop();else openShop();}
  if(e.key==='Escape'){
    if(game.shopOpen){closeShop();e.preventDefault();}
    else if(game.running&&!game.trainingMode){openShop();e.preventDefault();}
    else if(game.trainingMode&&game.running){e.preventDefault();goToMenu();}
  }
});
document.addEventListener('keyup',(e)=>{
  // 检查是否在输入框中，如果是则不处理游戏按键
  if(e.target.tagName==='INPUT'&&e.target.type==='password')return;
  if(e.target.tagName==='INPUT'&&e.target.type==='text')return;
  if(e.target.tagName==='TEXTAREA')return;
  if(e.key==='a'||e.key==='A'||e.key==='ArrowLeft')keys.left=false;
  if(e.key==='d'||e.key==='D'||e.key==='ArrowRight')keys.right=false;
  if(e.key===' '){keys.space=false;e.preventDefault();}
  if(e.key==='Shift'){keys.zoom=false;game.zoomed=false;e.preventDefault();}
});

// Touch controls: follow finger + auto-shoot
let touchTargetX = null;
document.getElementById('touchZoomBtn').addEventListener('click',()=>{game.zoomed=!game.zoomed;keys.zoom=game.zoomed;});

document.addEventListener('touchstart',(e)=>{
  if (e.target.closest('#shopOverlay') || e.target.closest('#gameOver') || e.target.closest('#victoryScreen') || e.target.closest('#startScreen') || e.target.closest('.touch-zoom')) return;
  const t = e.touches[0];
  touchTargetX = t.clientX;
  // keys.space = true; // 关闭自动射击，手动按空格或点击射击
}, {passive:true});

document.addEventListener('touchmove',(e)=>{
  if (touchTargetX === null) return;
  const t = e.touches[0];
  touchTargetX = t.clientX;
}, {passive:true});

document.addEventListener('touchend',(e)=>{
  if (e.target.closest('.touch-zoom')) return;
  if (e.touches.length === 0) {
    touchTargetX = null;
    keys.space = false;
  } else {
    touchTargetX = e.touches[0].clientX;
  }
}, {passive:true});

function fitGame(){
  const cv = document.getElementById('gameCanvas');
  const c = document.getElementById('gameContainer');
  const w = window.innerWidth, h = window.innerHeight;
  if (w > 920 && h > 670) {
    cv.style.width=''; cv.style.height='';
    c.style.position=''; c.style.top=''; c.style.left='';
    c.style.transform=''; c.style.width=''; c.style.height='';
    return;
  }
  // Scale canvas to fill viewport width, height may overflow
  const scale = Math.min(w / 900, 1);
  const cw = Math.round(900 * scale), ch = Math.round(650 * scale);
  cv.style.width = cw + 'px';
  cv.style.height = ch + 'px';
  c.style.width = cw + 'px';
  c.style.height = ch + 'px';
  c.style.position = 'fixed';
  c.style.top = '50%';
  c.style.left = '50%';
  c.style.transform = 'translate(-50%, -50%)';
}
window.addEventListener('resize',fitGame);
window.addEventListener('orientationchange',()=>setTimeout(fitGame,300));
fitGame();
document.addEventListener('touchmove',(e)=>{e.preventDefault();},{passive:false});
canvas.addEventListener('contextmenu',(e)=>{e.preventDefault();});
canvas.addEventListener('mousedown',(e)=>{
  canvas.focus();
  if(e.button===2){game.zoomed=!game.zoomed;keys.zoom=game.zoomed;}
});
// 点击游戏容器时获得焦点（但不包括输入框）
document.getElementById('gameContainer').addEventListener('click',(e)=>{
  if (e.target.tagName !== 'INPUT') {
    canvas.focus();
  }
});
// 让 canvas 可聚焦
canvas.setAttribute('tabindex','0');
canvas.style.outline='none';

function setMode(battle){
  document.getElementById('modeBattleBtn').classList.toggle('active',battle);
  document.getElementById('modeTrainBtn').classList.toggle('active',!battle);
  document.getElementById('startSub').textContent=battle?'—— 消灭全部敌人 ——':'—— 射击训练，无限弹药 ——';
  document.getElementById('startBtn').textContent=battle?'进入战场':'开始训练';
  document.getElementById('difficultySetting').style.display='none';
  document.getElementById('levelSelector').style.display=battle?'flex':'none';
  document.getElementById('aiTeammateRow').style.display=battle?'flex':'none';
}
document.getElementById('modeBattleBtn').addEventListener('click',()=>setMode(true));
document.getElementById('modeTrainBtn').addEventListener('click',()=>setMode(false));

document.getElementById('startBtn').addEventListener('click',()=>{initAudio();startScreen.style.display='none';game.started=true;resetGame();if(bgmEnabled)bgm.start();syncBgmToggleUI();setTimeout(fitGame,50);gameLoop();});
document.getElementById('restartBtn').addEventListener('click',()=>{gameOverScreen.style.display='none';resetGame();});
document.getElementById('victoryRestartBtn').addEventListener('click',()=>{victoryScreen.style.display='none';resetGame();});
function goToMenu(){gameOverScreen.style.display='none';victoryScreen.style.display='none';game.started=false;game.running=false;bgm.stop();startScreen.style.display='flex';updateUsernameDisplay();renderLevelSelector();}
document.getElementById('gameOverMenuBtn').addEventListener('click',goToMenu);
document.getElementById('victoryMenuBtn').addEventListener('click',goToMenu);
document.getElementById('trainExitBtn').addEventListener('click',goToMenu);
document.getElementById('aiTeammateLow').addEventListener('click',function(){if(this.classList.contains('active')){this.classList.remove('active');return;}document.querySelectorAll('#aiTeammateLow,#aiTeammateMid,#aiTeammateHigh').forEach(b=>b.classList.remove('active'));this.classList.add('active');});
document.getElementById('aiTeammateMid').addEventListener('click',function(){if(this.classList.contains('active')){this.classList.remove('active');return;}document.querySelectorAll('#aiTeammateLow,#aiTeammateMid,#aiTeammateHigh').forEach(b=>b.classList.remove('active'));this.classList.add('active');});
document.getElementById('aiTeammateHigh').addEventListener('click',function(){if(this.classList.contains('active')){this.classList.remove('active');return;}document.querySelectorAll('#aiTeammateLow,#aiTeammateMid,#aiTeammateHigh').forEach(b=>b.classList.remove('active'));this.classList.add('active');});
document.querySelectorAll('.preset').forEach(btn=>{btn.addEventListener('click',()=>{document.querySelectorAll('.preset').forEach(b=>b.classList.remove('active'));btn.classList.add('active');document.getElementById('enemyCountInput').value=btn.dataset.count;});});
document.getElementById('enemyCountInput').addEventListener('input',()=>{document.querySelectorAll('.preset').forEach(b=>b.classList.remove('active'));});

// 更新用户名显示
function updateUsernameDisplay() {
  const usernameDisplay = document.getElementById('usernameDisplay');
  const logoutBtn = document.getElementById('logoutBtn');
  if (usernameDisplay) {
    usernameDisplay.textContent = currentUser ? `👤 ${currentUser}${isAdmin?' (管理员)':''}` : '👤 未登录';
  }
}

// ==================== 关卡系统 ====================
function renderLevelSelector(){
  const grid=document.getElementById('levelGrid');
  if(!grid)return;
  grid.innerHTML='';
  levelSystem.levels.forEach(lvl=>{
    const btn=document.createElement('button');
    btn.className='level-btn'+(lvl.level<=game.unlockedLevel?' unlocked':'')+(lvl.level===game.currentLevel?' active':'');
    btn.textContent=lvl.level;
    btn.disabled=lvl.level>game.unlockedLevel;
    btn.onclick=()=>selectLevel(lvl.level);
    grid.appendChild(btn);
  });
  updateLevelInfo();
}
function updateLevelInfo(){
  const info=document.getElementById('levelInfo');
  if(info){
    const cfg=levelSystem.getCurrent();
    info.textContent='第'+cfg.level+'关: '+cfg.name+' — '+cfg.desc;
  }
}
function updateLevelUI(){
  renderLevelSelector();
}

// ==================== 密码登录系统 ====================

// ==================== 密码登录系统 ====================
const PASSWORD_KEY = 'battle_shooter_password';
const PASSWORD_HINT_KEY = 'battle_shooter_password_hint';
const USERNAME_KEY = 'battle_shooter_username';
const USERS_DATA_KEY = 'battle_shooter_users_data';
const CURRENT_USER_KEY = 'battle_shooter_current_user';
const ADMIN_USERNAME = '管理'; // 管理员用户名，可以修改

const loginScreen = document.getElementById('loginScreen');
const setPasswordScreen = document.getElementById('setPasswordScreen');
const usernameScreen = document.getElementById('usernameScreen');

let currentUser = null;
let isAdmin = false;

// 退出登录（切换用户）- 放在这里因为需要用 loginScreen 变量
document.getElementById('logoutBtn').addEventListener('click', () => {
  // 保存当前用户数据
  if (currentUser) {
    const userData = getUserData(currentUser);
    userData.unlockedLevel = game.unlockedLevel;
    userData.currentLevel = game.currentLevel;
    userData.rank = game.rank;
    userData.rankScore = game.rankScore;
    saveUserData(currentUser, userData);
  }
  // 清除当前用户，返回登录界面
  currentUser = null;
  isAdmin = false;
  localStorage.removeItem(CURRENT_USER_KEY);
  startScreen.style.display = 'none';
  loginScreen.style.display = 'flex';
  document.getElementById('loginPassword').value = '';
});

// 用户数据管理
function getUserData(username) {
  const allData = JSON.parse(localStorage.getItem(USERS_DATA_KEY) || '{}');
  return allData[username] || {
    username: username,
    totalScore: 0,
    highScore: 0,
    gamesPlayed: 0,
    gamesWon: 0,
    unlockedLevel: 1,
    currentLevel: 1,
    rank: 'bronze',
    rankScore: 0,
    playHistory: []
  };
}

function saveUserData(username, data) {
  const allData = JSON.parse(localStorage.getItem(USERS_DATA_KEY) || '{}');
  allData[username] = data;
  localStorage.setItem(USERS_DATA_KEY, JSON.stringify(allData));
}

function setCurrentUser(username) {
  currentUser = username;
  isAdmin = (username === ADMIN_USERNAME);
  localStorage.setItem(CURRENT_USER_KEY, username);

  // 加载用户进度
  const userData = getUserData(username);
  game.unlockedLevel = userData.unlockedLevel;
  game.currentLevel = userData.currentLevel;
  game.rank = userData.rank;
  game.rankScore = userData.rankScore;
}

function recordGameResult(score, won, level) {
  if (!currentUser) return;
  const userData = getUserData(currentUser);
  userData.totalScore += score;
  userData.highScore = Math.max(userData.highScore, score);
  userData.gamesPlayed++;
  if (won) userData.gamesWon++;
  userData.playHistory.push({
    date: new Date().toISOString(),
    score: score,
    won: won,
    level: level
  });
  // 只保留最近50条记录
  if (userData.playHistory.length > 50) {
    userData.playHistory = userData.playHistory.slice(-50);
  }
  // 保存进度
  userData.unlockedLevel = game.unlockedLevel;
  userData.currentLevel = game.currentLevel;
  userData.rank = game.rank;
  userData.rankScore = game.rankScore;
  saveUserData(currentUser, userData);
}

function checkPassword() {
  const savedPassword = localStorage.getItem(PASSWORD_KEY);
  const savedUsername = localStorage.getItem(USERNAME_KEY);

  if (!savedPassword) {
    // 首次进入，需要设置密码
    loginScreen.style.display = 'none';
    setPasswordScreen.style.display = 'flex';
    usernameScreen.style.display = 'none';
    startScreen.style.display = 'none';
  } else if (!savedUsername) {
    // 有密码但没用户名，需要设置用户名
    loginScreen.style.display = 'none';
    setPasswordScreen.style.display = 'none';
    usernameScreen.style.display = 'flex';
    startScreen.style.display = 'none';
  } else {
    // 已有密码和用户名，显示登录界面
    loginScreen.style.display = 'flex';
    setPasswordScreen.style.display = 'none';
    usernameScreen.style.display = 'none';
    startScreen.style.display = 'none';
  }
}

// 设置密码
document.getElementById('setPasswordBtn').addEventListener('click', () => {
  const newPwd = document.getElementById('newPassword').value.trim();
  const confirmPwd = document.getElementById('confirmPassword').value.trim();
  const hint = document.getElementById('passwordHint').value.trim();
  const errorEl = document.getElementById('setPwdError');

  if (newPwd.length < 4) {
    errorEl.textContent = '密码至少需要4位字符';
    return;
  }
  if (newPwd.length > 20) {
    errorEl.textContent = '密码不能超过20位字符';
    return;
  }
  if (newPwd !== confirmPwd) {
    errorEl.textContent = '两次输入的密码不一致';
    return;
  }

  localStorage.setItem(PASSWORD_KEY, newPwd);
  if (hint) {
    localStorage.setItem(PASSWORD_HINT_KEY, hint);
  }

  // 进入用户名设置界面
  setPasswordScreen.style.display = 'none';
  usernameScreen.style.display = 'flex';
});

// 设置用户名
document.getElementById('setUsernameBtn').addEventListener('click', () => {
  const username = document.getElementById('usernameInput').value.trim();
  const errorEl = document.getElementById('usernameError');

  if (username.length < 2) {
    errorEl.textContent = '用户名至少需要2位字符';
    return;
  }
  if (username.length > 20) {
    errorEl.textContent = '用户名不能超过20位字符';
    return;
  }

  localStorage.setItem(USERNAME_KEY, username);
  setCurrentUser(username);

  // 进入游戏主界面
  usernameScreen.style.display = 'none';
  startScreen.style.display = 'flex';
  updateUsernameDisplay();
  renderLevelSelector();
});

// 登录
document.getElementById('loginBtn').addEventListener('click', () => {
  const inputPwd = document.getElementById('loginPassword').value;
  const savedPassword = localStorage.getItem(PASSWORD_KEY);
  const savedUsername = localStorage.getItem(USERNAME_KEY);
  const hintEl = document.getElementById('loginHintText');

  if (inputPwd === savedPassword) {
    // 密码正确，加载用户数据
    if (savedUsername) {
      setCurrentUser(savedUsername);
    }
    loginScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    document.getElementById('loginPassword').value = '';
    hintEl.textContent = '';
    loadProgress();
    updateUsernameDisplay();
    renderLevelSelector();
    checkNewFeedback();
  } else {
    hintEl.textContent = '密码错误，请重试';
    hintEl.style.color = '#ff6666';
  }
});

// 回车键登录
document.getElementById('loginPassword').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('loginBtn').click();
  }
});

// 忘记密码
document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
  e.preventDefault();
  const hint = localStorage.getItem(PASSWORD_HINT_KEY);
  const forgotHintEl = document.getElementById('forgotPasswordHint');
  const hintDisplay = document.getElementById('passwordHintDisplay');

  if (hint) {
    hintDisplay.textContent = hint;
    forgotHintEl.style.display = 'block';
  } else {
    hintDisplay.textContent = '您没有设置密码提示。建议清除浏览器数据后重新设置密码。';
    forgotHintEl.style.display = 'block';
  }
});

// 设置密码时回车键
document.getElementById('confirmPassword').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('setPasswordBtn').click();
  }
});

// ==================== 反馈系统 ====================
const FEEDBACK_KEY = 'battle_shooter_feedback';
const FEEDBACK_READ_KEY = 'battle_shooter_feedback_read';

function saveFeedback(text) {
  const feedback = {
    text: text,
    time: new Date().toISOString(),
    level: game.currentLevel,
    score: game.score,
    username: currentUser || '匿名用户'
  };
  let allFeedback = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
  allFeedback.push(feedback);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(allFeedback));
}

function getUnreadFeedbackCount() {
  // 只有管理员才能看到未读反馈
  if (!isAdmin) return 0;
  const allFeedback = JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
  const lastRead = parseInt(localStorage.getItem(FEEDBACK_READ_KEY) || '0');
  return allFeedback.filter(f => new Date(f.time).getTime() > lastRead).length;
}

function markFeedbackAsRead() {
  localStorage.setItem(FEEDBACK_READ_KEY, Date.now().toString());
}

function getAllFeedback() {
  // 只有管理员才能查看所有反馈
  if (!isAdmin) return [];
  return JSON.parse(localStorage.getItem(FEEDBACK_KEY) || '[]');
}

function clearAllFeedback() {
  if (!isAdmin) return;
  localStorage.removeItem(FEEDBACK_KEY);
  localStorage.removeItem(FEEDBACK_READ_KEY);
}

// 反馈按钮事件
document.getElementById('feedbackBtn').addEventListener('click', () => {
  document.getElementById('feedbackOverlay').style.display = 'flex';
  document.getElementById('feedbackText').focus();
});

document.getElementById('feedbackClose').addEventListener('click', () => {
  document.getElementById('feedbackOverlay').style.display = 'none';
  document.getElementById('feedbackText').value = '';
});

document.getElementById('feedbackSubmit').addEventListener('click', () => {
  const text = document.getElementById('feedbackText').value.trim();
  if (!text) {
    alert('请输入反馈内容');
    return;
  }
  saveFeedback(text);
  document.getElementById('feedbackOverlay').style.display = 'none';
  document.getElementById('feedbackText').value = '';
  alert('感谢您的反馈！');
});

// 开发者通知关闭
document.getElementById('devNotifClose').addEventListener('click', () => {
  document.getElementById('devNotification').style.display = 'none';
});

// 检查是否有新反馈（开发者模式）
function checkNewFeedback() {
  // 只有管理员才显示通知
  if (!isAdmin) {
    document.getElementById('devNotification').style.display = 'none';
    return;
  }
  const unread = getUnreadFeedbackCount();
  if (unread > 0) {
    const notif = document.getElementById('devNotification');
    document.getElementById('devNotifText').textContent = `📩 有 ${unread} 条新反馈！`;
    notif.style.display = 'block';
  }
}

// 点击通知查看反馈
document.getElementById('devNotification').addEventListener('click', () => {
  // 只有管理员才能查看
  if (!isAdmin) {
    alert('只有管理员可以查看反馈');
    return;
  }
  const feedbackList = getAllFeedback();
  if (feedbackList.length === 0) {
    alert('暂无反馈');
    return;
  }

  let msg = `共 ${feedbackList.length} 条反馈：\n\n`;
  feedbackList.slice(-10).reverse().forEach((f, i) => {
    const time = new Date(f.time).toLocaleString('zh-CN');
    msg += `[${time}] 用户: ${f.username}\n`;
    msg += `关卡: ${f.level} 得分: ${f.score}\n`;
    msg += `反馈: ${f.text}\n\n`;
  });

  alert(msg);
  markFeedbackAsRead();
  document.getElementById('devNotification').style.display = 'none';
});

// 页面加载时检查新反馈
setTimeout(checkNewFeedback, 1000);

// ==================== 开发者命令 ====================
// 在控制台输入 showFeedback() 查看所有反馈
window.showFeedback = function() {
  if (!isAdmin) {
    console.log('只有管理员可以查看反馈');
    return '权限不足';
  }
  const feedbackList = getAllFeedback();
  console.log('=== 所有反馈 ===');
  feedbackList.forEach((f, i) => {
    console.log(`${i+1}. [${new Date(f.time).toLocaleString('zh-CN')}] 用户: ${f.username}`);
    console.log(`   关卡: ${f.level} 得分: ${f.score}`);
    console.log(`   反馈: ${f.text}`);
  });
  return `共 ${feedbackList.length} 条反馈`;
};

// 清空反馈
window.clearFeedback = clearAllFeedback;

// 查看所有用户数据（管理员）
window.showAllUsers = function() {
  if (!isAdmin) {
    console.log('只有管理员可以查看用户数据');
    return '权限不足';
  }
  const allData = JSON.parse(localStorage.getItem(USERS_DATA_KEY) || '{}');
  console.log('=== 所有用户数据 ===');
  Object.values(allData).forEach((user, i) => {
    console.log(`${i+1}. ${user.username}`);
    console.log(`   总分: ${user.totalScore} 最高分: ${user.highScore}`);
    console.log(`   游戏: ${user.gamesPlayed}场 胜利: ${user.gamesWon}场`);
    console.log(`   解锁关卡: ${user.unlockedLevel} 当前等级: ${user.rank}`);
  });
  return `共 ${Object.keys(allData).length} 位用户`;
};

// 查看当前用户数据
window.showMyData = function() {
  if (!currentUser) {
    console.log('未登录');
    return;
  }
  const userData = getUserData(currentUser);
  console.log('=== 我的游戏数据 ===');
  console.log(`用户名: ${userData.username}`);
  console.log(`总分: ${userData.totalScore} 最高分: ${userData.highScore}`);
  console.log(`游戏: ${userData.gamesPlayed}场 胜利: ${userData.gamesWon}场`);
  console.log(`解锁关卡: ${userData.unlockedLevel}`);
  console.log(`当前等级: ${userData.rank} (${userData.rankScore}分)`);
  console.log(`最近10场:`);
  userData.playHistory.slice(-10).reverse().forEach((h, i) => {
    console.log(`  ${i+1}. ${new Date(h.date).toLocaleDateString()} 第${h.level}关 得分${h.score} ${h.won?'胜':'负'}`);
  });
  return userData;
};

// 设置管理员（在控制台输入 setAdmin("你的用户名") ）
window.setAdmin = function(username) {
  if (!username) {
    console.log('用法: setAdmin("用户名")');
    return;
  }
  // 修改ADMIN_USERNAME常量需要重新加载，这里只是提示
  console.log(`请将代码中的 ADMIN_USERNAME 修改为 "${username}" 并刷新页面`);
  console.log('当前管理员名:', ADMIN_USERNAME);
};

// 页面加载时检查密码
checkPassword();
