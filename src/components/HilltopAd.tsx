import { useEffect } from 'react';

export const HilltopAd = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = `
      (function(nomb){
        var d = document,
        s = d.createElement('script'),
        l = d.currentScript || d.scripts[d.scripts.length - 1];
        s.settings = nomb || {};
        s.src = "//troubled-entertainment.com/c/D.9Y6VbF2/5v1x5kKW/QF9/NLzuQz5XOYTY/1y3nMqyS0K3-NTdxkM5WMXjPcA3B";
        s.async = true;
        s.referrerPolicy = 'no-referrer-when-downgrade';
        l.parentNode.insertBefore(s, l);
      })({});
    `;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
};