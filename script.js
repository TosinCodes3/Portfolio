// scroll reveals
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

// horizontal-scroll rows: featured projects (home) and category rows (all-work)
document.querySelectorAll('.fp, .cat-block').forEach(function(block){
  var row=block.querySelector('.hscroll');
  var prev=block.querySelector('.harrow.prev');
  var next=block.querySelector('.harrow.next');
  if(!row||!prev||!next)return;
  function step(){return Math.max(row.clientWidth*0.8,240);}
  // behavior is passed explicitly so the arrows stay smooth even while .drift
  // has turned CSS scroll-behavior off
  prev.addEventListener('click',function(){row.scrollBy({left:-step(),behavior:'smooth'});});
  next.addEventListener('click',function(){row.scrollBy({left:step(),behavior:'smooth'});});
  function update(){
    prev.disabled=row.scrollLeft<=2;
    next.disabled=row.scrollLeft+row.clientWidth>=row.scrollWidth-2;
  }
  row.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  update();
});

// rows drift on their own, reversing at each end. visitors always win: any hover,
// focus, swipe or arrow press stops the drift and hands scrolling back.
(function(){
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;

  var SPEED=26;          // px per second
  var EDGE_HOLD=1200;    // ms paused at each end before turning back
  var RESUME_AFTER=3500; // ms of no interaction before drifting again

  var rows=[];
  document.querySelectorAll('.hscroll').forEach(function(row){
    var s={row:row,dir:1,pos:row.scrollLeft,visible:false,hover:false,focus:false,holdUntil:0,idleUntil:0,lastSet:-1};
    row.__drift=s;

    function touched(){s.idleUntil=performance.now()+RESUME_AFTER;row.classList.remove('drift');}

    row.addEventListener('pointerenter',function(){s.hover=true;row.classList.remove('drift');});
    row.addEventListener('pointerleave',function(){s.hover=false;});
    row.addEventListener('pointerdown',touched);
    row.addEventListener('focusin',function(){s.focus=true;row.classList.remove('drift');});
    row.addEventListener('focusout',function(){s.focus=false;});
    row.addEventListener('wheel',touched,{passive:true});
    row.addEventListener('scroll',function(){
      // ignore the scroll events this animation causes itself
      if(Math.abs(row.scrollLeft-s.lastSet)>2){s.pos=row.scrollLeft;touched();}
    },{passive:true});

    var block=row.closest('.fp, .cat-block');
    if(block)block.querySelectorAll('.harrow').forEach(function(b){b.addEventListener('click',touched);});

    rows.push(s);
  });
  if(!rows.length)return;

  // only rows actually on screen animate, so offscreen rows cost nothing
  var vis=new IntersectionObserver(function(es){
    es.forEach(function(e){
      var s=e.target.__drift;
      if(!s)return;
      s.visible=e.isIntersecting;
      if(!e.isIntersecting)e.target.classList.remove('drift');
    });
  },{threshold:.2});
  rows.forEach(function(s){vis.observe(s.row);});

  var last=performance.now();
  requestAnimationFrame(function frame(now){
    var dt=Math.min((now-last)/1000,.05);
    last=now;

    rows.forEach(function(s){
      var row=s.row;
      if(!s.visible||s.hover||s.focus||now<s.idleUntil){row.classList.remove('drift');return;}

      var max=row.scrollWidth-row.clientWidth;
      if(max<=4){row.classList.remove('drift');return;} // nothing to scroll

      if(now<s.holdUntil)return;
      row.classList.add('drift');

      s.pos+=s.dir*SPEED*dt;
      if(s.pos>=max){s.pos=max;s.dir=-1;s.holdUntil=now+EDGE_HOLD;}
      else if(s.pos<=0){s.pos=0;s.dir=1;s.holdUntil=now+EDGE_HOLD;}

      row.scrollLeft=s.pos;
      s.lastSet=row.scrollLeft;
    });

    requestAnimationFrame(frame);
  });
})();
