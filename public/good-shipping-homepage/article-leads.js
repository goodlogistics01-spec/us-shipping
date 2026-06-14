
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
  popup.querySelector('form')?.addEventListener('submit',(e)=>{e.preventDefault(); const form=e.currentTarget; const required=[...form.querySelectorAll('[required]')]; const invalid=required.find(i=>!i.value.trim()); const status=popup.querySelector('[data-popup-status]'); if(invalid){status.textContent='Please complete name, email and phone or WhatsApp.'; invalid.focus(); return;} const data=Object.fromEntries(new FormData(form).entries()); const saved=JSON.parse(localStorage.getItem('goodShippingArticleLeads')||'[]'); saved.push({...data,source:location.pathname,submittedAt:new Date().toISOString()}); localStorage.setItem('goodShippingArticleLeads',JSON.stringify(saved)); window.dataLayer?.push({event:'article_popup_form_submit'}); status.textContent='Submitted. Our logistics team will review your message.'; form.reset(); });
  document.querySelectorAll('[data-event]').forEach((el)=>el.addEventListener('click',()=>window.dataLayer?.push({event:el.dataset.event,href:el.getAttribute('href')})));
})();
