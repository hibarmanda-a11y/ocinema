import { useEffect } from 'react';

// Get new script URL from HilltopAds Dashboard → Zones → Get Code → Popunder script
const HILLTOP_AD_URL = 'https://troubled-entertainment.com/cODJ9a6.bw2/5llSSIWSQq9ONGzaQe5EOPTpI_3iMdyo0O3ANWDXkX5/MNj_ca3w';

export const HilltopAd = () => {
  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    try {
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = HILLTOP_AD_URL;
      script.async = true;
      script.referrerPolicy = 'no-referrer-when-downgrade';
      script.onerror = () => {
        console.warn('Failed to load HilltopAds script.');
        script?.remove();
      };
      document.body.appendChild(script);
    } catch (error) {
      console.warn('Failed to inject HilltopAds script.', error);
      script?.remove();
    }

    return () => {
      script?.remove();
    };
  }, []);

  return null;
};