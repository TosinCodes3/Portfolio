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
