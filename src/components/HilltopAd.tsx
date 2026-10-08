import { useEffect } from 'react';

export const HilltopAd = () => {
  useEffect(() => {
    // প্রতি ইউজার সেশনে একবারই খুলবে
    const shown = sessionStorage.getItem('hilltop_ad_shown');
    if (shown) return;

    // ৫ সেকেন্ড পর Popunder খুলবে (ইউজার সাইটে আসার পর)
    const timer = setTimeout(() => {
      window.open(
        'https://fluffy-machine.com/bk3/V_0.Pr3Op/vMbFmBVWJOZmDS0z3aNVDNkz5xMFj/clz/LbTkcC0/OmTSkbyBNzzScJ',
        '_blank'
      );
      sessionStorage.setItem('hilltop_ad_shown', '1');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return null;
};