
(function(){
  const key='goodLogisticsArticleLeadSeen';
  const failureMessage='We couldn’t send your inquiry. Please try again or contact us by WhatsApp or email.';
  const pendingMessage='Your inquiry is being processed. Please do not submit it again. Our team will contact you after we receive your shipment details.';
  const serviceByPath={
    'oversized-cargo-shipping-from-china-to-usa.html':'oversized-cargo',
    'ddp-shipping-from-china-to-usa-quote-risks.html':'ddp-door-to-door',
    'multi-supplier-consolidation-china-shipping.html':'supplier-consolidation'
  };
  const sourcePage=()=>['localhost','127.0.0.1'].includes(window.location.hostname)
    ?`https://gdlogi.us${window.location.pathname}`
    :`${window.location.origin}${window.location.pathname}`;
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
    const showPendingStatus=(submissionId)=>{
      const reference=submissionId?` Reference: ${submissionId}. `:' ';
      const whatsAppLink=document.createElement('a');
      whatsAppLink.href='https://wa.me/8613556861676';
      whatsAppLink.textContent='WhatsApp';
      whatsAppLink.addEventListener('click',()=>track('whatsapp_click','pending-help'));
      const emailLink=document.createElement('a');
      emailLink.href='mailto:zoe@gdlogi.com';
      emailLink.textContent='email';
      emailLink.addEventListener('click',()=>track('email_click','pending-help'));
      status.replaceChildren(
        document.createTextNode(`${pendingMessage}${reference}`),
        document.createTextNode('If you need to add information, contact us by '),
        whatsAppLink,
        document.createTextNode(' or '),
        emailLink,
        document.createTextNode('.')
      );
      status.classList.remove('is-error');
      status.classList.add('is-pending');
      button.disabled=true;
      button.textContent='Inquiry Processing…';
    };
    const addHidden=(name,value)=>{
      let input=form.elements[name];
      if(!input){input=document.createElement('input');input.type='hidden';input.name=name;form.appendChild(input);}
      input.value=value;
    };
    const addVisibleInput=(name,placeholder,beforeElement)=>{
      let input=form.elements[name];
      if(input)return input;
      input=document.createElement('input');
      input.name=name;
      input.placeholder=placeholder;
      input.required=true;
      input.maxLength=name==='product_name'?200:120;
      form.insertBefore(input,beforeElement||button);
      return input;
    };
    const track=(event,result='')=>{
      const payload={
        event,
        form_source:'article-popup',
        service:String(form.elements.service?.value||'not-sure').slice(0,80),
        result:String(result).slice(0,40)
      };
      window.dataLayer=window.dataLayer||[];
      window.dataLayer.push(payload);
      window.dispatchEvent(new CustomEvent('gdlogi:analytics',{detail:payload}));
    };
    const legacyPhone=form.elements.phone;
    if(legacyPhone) legacyPhone.name='whatsapp';
    const whatsapp=form.elements.whatsapp;
    if(whatsapp){
      whatsapp.required=false;
      whatsapp.type='tel';
      whatsapp.autocomplete='tel';
      whatsapp.addEventListener('input',()=>{
        const value=whatsapp.value.trim();
        const digits=value.replace(/\D/g,'').length;
        whatsapp.setCustomValidity(!value||(/^\+?[0-9][0-9\s().-]{6,22}$/.test(value)&&digits>=7&&digits<=20)?'':'Enter a valid phone or WhatsApp number.');
      });
    }
    const company=form.elements.company;
    addVisibleInput('product_name','Product name',company);
    addVisibleInput('origin','Pickup city in China',form.elements.destination);
    if(form.elements.destination){
      form.elements.destination.required=true;
      form.elements.destination.placeholder='Destination city or ZIP code';
    }
    if(form.elements.message){
      form.elements.message.name='cargo_type';
      form.elements.message.required=true;
      form.elements.message.placeholder='Cargo details, packaging, weight or volume (if known)';
    }
    form.action='/api/inquiry/';
    form.querySelectorAll('input[name^="_"]:not([name="_honey"])').forEach((input)=>input.remove());
    addHidden('source_type','article-popup');
    addHidden('source_page',sourcePage());
    addHidden('service',serviceByPath[window.location.pathname.split('/').pop()]||'not-sure');
    addHidden('preferred_contact','email');
    addHidden('weight','');
    addHidden('volume','');
    form.addEventListener('focusin',()=>track('quote_start','started'),{once:true});
    form.addEventListener('invalid',()=>{
      status.textContent='Please complete the required fields and review the privacy consent.';
      status.classList.remove('is-pending');
      status.classList.add('is-error');
      track('quote_submit_failed','validation');
    },true);
    form.addEventListener('input',()=>{
      if(form.dataset.submissionState==='pending')return;
      status.classList.remove('is-pending');
      status.classList.remove('is-error');
    });
    form.addEventListener('submit',async(event)=>{
      event.preventDefault();
      if(button.disabled){event.preventDefault();return;}
      if(!form.checkValidity())return;
      form.dataset.submissionState='submitting';
      form.dataset.submissionId='';
      button.disabled=true;
      button.textContent='Sending…';
      status.classList.remove('is-error');
      status.classList.remove('is-pending');
      status.textContent='Sending your shipment details…';
      addHidden('source_page',sourcePage());
      const controller=new AbortController();
      const timeoutId=window.setTimeout(()=>controller.abort(),32000);
      try{
        let response;
        try{
          response=await fetch('/api/inquiry/',{
            method:'POST',
            headers:{Accept:'application/json','Content-Type':'application/json'},
            body:JSON.stringify(Object.fromEntries(new FormData(form).entries())),
            signal:controller.signal
          });
        }catch{
          form.dataset.submissionState='pending';
          showPendingStatus('');
          track('quote_submit_pending','network-or-timeout');
          return;
        }
        const result=await response.json().catch(()=>null);
        if(response.status===202||result?.submission_status==='PENDING'){
          form.dataset.submissionState='pending';
          form.dataset.submissionId=result?.submission_id||'';
          showPendingStatus(result?.submission_id||'');
          track('quote_submit_pending','pending');
          return;
        }
        if(result?.submission_status==='FAILED'){
          const error=new Error('DELIVERY_FAILED');
          error.explicit=true;
          error.submissionId=result?.submission_id||'';
          throw error;
        }
        if(!response.ok||result?.ok!==true||result?.submission_status!=='SUCCESS'){
          form.dataset.submissionState='pending';
          form.dataset.submissionId=result?.submission_id||'';
          showPendingStatus(result?.submission_id||'');
          track('quote_submit_pending','unknown-response');
          return;
        }
        form.dataset.submissionState='success';
        form.dataset.submissionId=result.submission_id||'';
        track('quote_submit_success','accepted');
        window.dataLayer?.push({event:'article_popup_form_submit',request_id:result.request_id,submission_id:result.submission_id});
        window.location.assign(result.redirect||'/thank-you/');
      }catch(error){
        if(!error?.explicit){
          form.dataset.submissionState='pending';
          showPendingStatus(error?.submissionId||'');
          track('quote_submit_pending','unknown-error');
          return;
        }
        form.dataset.submissionState='failed';
        form.dataset.submissionId=error.submissionId||'';
        button.disabled=false;
        button.textContent='Get a Shipping Quote';
        status.classList.remove('is-pending');
        status.classList.add('is-error');
        status.textContent=failureMessage;
        track('quote_submit_failed','rejected');
      }finally{
        window.clearTimeout(timeoutId);
      }
    });
    window.addEventListener('pageshow',()=>{
      if(form.dataset.submissionState==='pending'){
        showPendingStatus(form.dataset.submissionId||'');
        return;
      }
      button.disabled=false;
      button.textContent='Get a Shipping Quote';
    });
  }
  document.querySelectorAll('[data-event]').forEach((el)=>el.addEventListener('click',()=>window.dataLayer?.push({event:el.dataset.event,href:el.getAttribute('href')})));
})();
