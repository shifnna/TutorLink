import { useEffect } from "react";

// same fonts and styles your Home and Explore Tutors pages use
export const fraunces = { fontFamily: "'Fraunces', Georgia, serif" };
export const mono = { fontFamily: "'Space Mono', monospace" };

const FONT_ID = "tutorlink-midnight-fonts";
const FONT_URL = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,450;9..144,550;9..144,650&family=Space+Mono:wght@400;700&display=swap";

// loads the fonts once, whichever page opens first
export const useMidnightFonts = () => {
  useEffect(() => {
    if (document.getElementById(FONT_ID)) return;
    const link = document.createElement("link");
    link.id = FONT_ID;
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);
};