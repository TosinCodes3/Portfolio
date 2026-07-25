// live Lagos clock in top bar
function tick(){
  var el=document.getElementById('clock');
  if(!el)return;
  el.textContent='[ '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',timeZone:'Africa/Lagos'})+' ]';
}
tick();setInterval(tick,30000);

// scroll reveals
var io=new IntersectionObserver(function(es){
  es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(function(el){io.observe(el);});

// featured projects show more / less
(function(){
  var toggle=document.querySelector('.feature-toggle');
  var rest=document.getElementById('featureRest');
  if(!toggle||!rest)return;
  toggle.addEventListener('click',function(){
    var open=rest.classList.toggle('open');
    toggle.classList.toggle('open',open);
    toggle.setAttribute('aria-expanded',open?'true':'false');
    toggle.querySelector('.ft-label').textContent=open?'Show less':'Show 2 more projects';
    if(open){
      rest.querySelectorAll('.reveal').forEach(function(el){el.classList.add('in');});
    }else{
      rest.scrollIntoView({behavior:'smooth',block:'nearest'});
    }
  });
})();

// horizontal-scroll rows (all-work page)
document.querySelectorAll('.cat-block').forEach(function(block){
  var row=block.querySelector('.hscroll');
  var prev=block.querySelector('.harrow.prev');
  var next=block.querySelector('.harrow.next');
  if(!row||!prev||!next)return;
  function step(){return Math.max(row.clientWidth*0.8,240);}
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
