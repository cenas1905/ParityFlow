import { createServerSupabase, Database } from '@/lib/supabase';
import { NextResponse, NextRequest } from 'next/server';

import { COUNTRY_NAMES } from '@/lib/countries';

export async function GET(req: NextRequest) {
  const supabase = createServerSupabase();
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('id');

  // Yerel test icin: ?country=TR parametresi override olarak calisir
  const countryCode = (
    searchParams.get('country') ||
    req.headers.get('x-vercel-ip-country') ||
    'US'
  ).toUpperCase();

  // Project ID yoksa sessizce cik
  if (!projectId) {
    return new NextResponse(
      '// ParityFlow: Missing project ID',
      { headers: { 'Content-Type': 'application/javascript' } }
    );
  }

  try {
    type ProjectSettings = Database['public']['Tables']['project_settings']['Row'];

    // ADIM 1: Projeyi ve sahibini bul
    const { data: project, error: projectError } = (await supabase
      .from('projects')
      .select('user_id, is_active')
      .eq('id', projectId)
      .single()) as unknown as { data: { user_id: string; is_active: boolean } | null; error: Error | null };

    if (projectError || !project || !project.is_active) {
      return new NextResponse(
        '// ParityFlow: Project not found or inactive',
        { headers: { 'Content-Type': 'application/javascript' } }
      );
    }

    // ADIM 2: Abonelik kontrolu (PAYWALL GATE)
    const { data: profile } = (await supabase
      .from('profiles')
      .select('subscription_status')
      .eq('id', project.user_id)
      .single()) as unknown as { data: { subscription_status: string } | null };

    const isActive = profile?.subscription_status === 'active' || 
                     profile?.subscription_status === 'trialing';

    if (!isActive) {
      return new NextResponse(
        '// ParityFlow: Subscription inactive. Activate at parityflow.com',
        { headers: { 'Content-Type': 'application/javascript' } }
      );
    }

    // ADIM 3: Widget ayarlarini cek
    const { data: settings } = (await supabase
      .from('project_settings')
      .select('*')
      .eq('project_id', projectId)
      .single()) as unknown as { data: ProjectSettings | null };

    if (!settings) {
      return new NextResponse(
        '// ParityFlow: Settings not configured',
        { headers: { 'Content-Type': 'application/javascript' } }
      );
    }

    // ADIM 4: Ulkeye gore indirim hesapla
    let discount = 0;
    let coupon = '';

    const tier2 = settings.tier2_countries as string[];
    const tier3 = settings.tier3_countries as string[];
    const tier4 = settings.tier4_countries as string[];

    if (tier2?.includes(countryCode)) {
      discount = settings.tier2_discount;
      coupon = settings.tier2_coupon;
    } else if (tier3?.includes(countryCode)) {
      discount = settings.tier3_discount;
      coupon = settings.tier3_coupon;
    } else if (tier4?.includes(countryCode)) {
      discount = settings.tier4_discount;
      coupon = settings.tier4_coupon;
    }

    // Gelismis ulke veya kupon yoksa sessizce cik
    if (discount === 0 || !coupon) {
      return new NextResponse(
        '// ParityFlow: No discount for this region',
        { headers: { 'Content-Type': 'application/javascript' } }
      );
    }

    // ADIM 5: Dinamik metinleri doldur
    const countryName = COUNTRY_NAMES[countryCode] || countryCode;
    const title = settings.banner_title;
    const bodyText = settings.banner_text
      .replace('{country}', countryName)
      .replace('{discount}', String(discount));
    const ctaText = settings.banner_cta;
    const color = settings.primary_color;
    const position = settings.banner_position;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://parityflow.com';

    // Pozisyon CSS'i hesapla
    const positionCSS = position === 'bottom-left'
      ? 'bottom: 24px; left: 24px;'
      : position === 'top-bar'
      ? 'top: 0; left: 0; right: 0; width: 100%; border-radius: 0; border-left: none; border-right: none; border-top: none;'
      : 'bottom: 24px; right: 24px;'; // default: bottom-right

    // ADIM 6: Widget JavaScript kodunu olustur ve dondur
    const widgetJS = `
(function() {
  if (window.__pf_loaded) return;
  window.__pf_loaded = true;

  // Phase 4: A/B Testing
  var abEnabled = ${Boolean(settings.ab_test_enabled)};
  var variant = 'A'; // Default to showing widget
  if (abEnabled) {
    // Check localStorage to maintain variant across page loads
    try {
      variant = localStorage.getItem('__pf_variant') || (Math.random() > 0.5 ? 'A' : 'B');
      localStorage.setItem('__pf_variant', variant);
    } catch(e) { variant = Math.random() > 0.5 ? 'A' : 'B'; }
  }

  // Phase 4: Triggers
  var triggerType = '${settings.trigger_type || 'immediate'}';
  var triggerDelay = parseInt('${settings.trigger_delay || 5}', 10) * 1000;

  var container = document.createElement('div');
  container.id = '__pf_root';
  document.body.appendChild(container);

  var shadow = container.attachShadow({ mode: 'closed' });

  var style = document.createElement('style');
  style.textContent = [
    '@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600&display=swap");',
    '#pf-wrap {',
    '  position: fixed;',
    '  ${positionCSS}',
    '  width: ${position === 'top-bar' ? '100%' : '360px'};',
    '  background: rgba(14, 14, 18, 0.92);',
    '  backdrop-filter: blur(20px) saturate(180%);',
    '  -webkit-backdrop-filter: blur(20px) saturate(180%);',
    '  border: 1px solid rgba(255,255,255,0.08);',
    '  border-radius: ${position === 'top-bar' ? '0' : '16px'};',
    '  padding: ${position === 'top-bar' ? '12px 24px' : '20px'};',
    '  color: #f4f4f5;',
    '  font-family: "Outfit", sans-serif;',
    '  box-shadow: 0 20px 60px rgba(0,0,0,0.5);',
    '  z-index: 2147483647;',
    '  transform: translateY(${position === 'top-bar' ? '-100%' : '120px'});',
    '  opacity: 0;',
    '  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);',
    '  display: ${position === 'top-bar' ? 'flex' : 'block'};',
    '  align-items: center;',
    '  gap: 16px;',
    '}',
    '#pf-wrap.show { transform: translateY(0); opacity: 1; }',
    '#pf-title { font-size: ${position === 'top-bar' ? '14px' : '15px'}; font-weight: 600; margin-bottom: ${position === 'top-bar' ? '0' : '6px'}; }',
    '#pf-desc { font-size: 13px; color: #a1a1aa; line-height: 1.5; margin-bottom: ${position === 'top-bar' ? '0' : '16px'}; flex: 1; }',
    '#pf-actions { display: flex; gap: 8px; align-items: center; ${position === 'top-bar' ? 'flex-shrink: 0;' : ''} }',
    '#pf-cta { background: ${color}; color: #fff; border: none; padding: 8px 16px; font-size: 13px; font-weight: 500; border-radius: 8px; cursor: pointer; white-space: nowrap; transition: filter 0.2s; font-family: inherit; }',
    '#pf-cta:hover { filter: brightness(1.15); }',
    '#pf-close { background: transparent; border: 1px solid rgba(255,255,255,0.12); color: #71717a; padding: 7px 12px; font-size: 13px; border-radius: 8px; cursor: pointer; font-family: inherit; transition: all 0.2s; }',
    '#pf-close:hover { color: #fff; background: rgba(255,255,255,0.06); }',
  ].join('');

  shadow.appendChild(style);

  var wrap = document.createElement('div');
  wrap.id = 'pf-wrap';
  wrap.innerHTML = '<div id="pf-title">${title.replace(/'/g, "\\'")}</div><div id="pf-desc">${bodyText.replace(/'/g, "\\'")}</div><div id="pf-actions"><button id="pf-cta">${ctaText.replace(/'/g, "\\'")}</button><button id="pf-close">✕</button></div>';
  shadow.appendChild(wrap);

  // Core show function
  function showWidget() {
    if (wrap.classList.contains('show')) return;
    
    // If Variant B (Control Group), don't show the widget, but fire impression
    if (variant === 'B') {
      fetch('${appUrl}/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: '${projectId}', countryCode: '${countryCode}', eventType: 'impression', variant: 'B' })
      }).catch(function(){});
      return;
    }

    // Variant A: Show the widget
    wrap.classList.add('show');
    fetch('${appUrl}/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: '${projectId}', countryCode: '${countryCode}', eventType: 'impression', variant: 'A' })
    }).catch(function(){});
  }

  // Handle Triggers
  if (triggerType === 'delay') {
    setTimeout(showWidget, triggerDelay);
  } else if (triggerType === 'exit_intent') {
    var intentTriggered = false;
    document.addEventListener('mouseleave', function(e) {
      if (e.clientY < 0 && !intentTriggered) {
        intentTriggered = true;
        showWidget();
      }
    });
  } else {
    // immediate
    setTimeout(showWidget, 300);
  }

  shadow.getElementById('pf-close').onclick = function() {
    wrap.classList.remove('show');
    setTimeout(function() { container.remove(); }, 500);
  };

  shadow.getElementById('pf-cta').onclick = function() {
    var btn = shadow.getElementById('pf-cta');
    navigator.clipboard.writeText('${coupon}').then(function() {
      btn.textContent = 'Copied! 🎉';
      // Analytics: tiklama kaydi
      fetch('${appUrl}/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: '${projectId}', countryCode: '${countryCode}', eventType: 'click', variant: variant })
      }).catch(function(){});
      setTimeout(function() {
        wrap.classList.remove('show');
        setTimeout(function() { container.remove(); }, 500);
      }, 1500);
    }).catch(function() {
      // Clipboard API yoksa prompt ile goster
      prompt('Copy your discount code:', '${coupon}');
    });
  };
})();
`;

    return new NextResponse(widgetJS, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

  } catch (err) {
    console.error('Widget API Error:', err);
    return new NextResponse(
      '// ParityFlow: Server error',
      { headers: { 'Content-Type': 'application/javascript' } }
    );
  }
}
