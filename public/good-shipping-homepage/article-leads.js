
(function(){
  const key='goodLogisticsArticleLeadSeen';
  const popup=document.querySelector('[data-lead-popup]');
  if(!popup) return;
  const close=()=>{popup.classList.remove('is-visible'); window.dataLayer?.push({event:'article_popup_close'});};
  const show=()=>{ if(sessionStorage.getItem(key)) return; sessionStorage.setItem(key,'1'); popup.classList.add('is-visible'); window.dataLayer?.push({event:'article_popup_impression'}); };
  let scrollShown=false;
  window.addEventListener('scroll',()=>{ const doc=document.documentElement; const depth=(doc.scrollTop)/(doc.scrollHeight-doc.clientHeight); if(!scrollShown && depth>.45){scrollShown=true; show(); window.dataLayer?.push({event:'article_scroll_50'});} if(depth>.9 && !window.__gs90){window.__gs90=true; window.dataLayer?.push({event:'article_scroll_90'});} },{passive:true});
  window.setTimeout(show,42000);
  popup.querySelector('[data-popup-close]')?.addEventListener('click',close);
  popup.addEventListener('click',(e)=>{if(e.target===popup) close();});
  document.addEventListener('keydown',(e)=>{if(e.key==='Escape') close();});
  const form=popup.querySelector('form');
  if(form){
    const status=popup.querySelector('[data-popup-status]');
    const button=form.querySelector('[type="submit"]');
    form.addEventListener('invalid',()=>{
      status.textContent='Please complete the required fields and review the privacy consent.';
    },true);
    form.addEventListener('submit',(event)=>{
      if(button.disabled){event.preventDefault();return;}
      if(!form.checkValidity())return;
      button.disabled=true;
      button.textContent='Sending…';
      status.textContent='Sending your request through the current form provider…';
      window.dataLayer?.push({event:'article_popup_form_submit'});
    });
    window.addEventListener('pageshow',()=>{
      button.disabled=false;
      button.textContent='Get a Shipping Quote';
    });
  }
  document.querySelectorAll('[data-event]').forEach((el)=>el.addEventListener('click',()=>window.dataLayer?.push({event:el.dataset.event,href:el.getAttribute('href')})));
})();
