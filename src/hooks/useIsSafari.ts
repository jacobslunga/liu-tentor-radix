import { useState, useEffect } from "react";

export const useIsSafari = () => {
  const [isSafari, setIsSafari] = useState(false);

  useEffect(() => {
    const checkSafari =
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
      (/iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !(window as any).MSStream);
    setIsSafari(checkSafari);
  }, []);

  return isSafari;
};
