type P = { className?: string };
const base = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const;

export const IconBox = ({ className = "h-6 w-6" }: P) => <svg {...base} className={className}><path d="M3 7l9-4 9 4v10l-9 4-9-4V7zM3 7l9 4m0 0l9-4m-9 4v10" /></svg>;
export const IconDoctor = ({ className = "h-6 w-6" }: P) => <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" /></svg>;
export const IconDrip = ({ className = "h-6 w-6" }: P) => <svg {...base} className={className}><path d="M12 3.5s6 6.2 6 10.5a6 6 0 01-12 0C6 9.7 12 3.5 12 3.5z" /><path d="M9.5 14.5a2.5 2.5 0 002.5 2.5" /></svg>;
export const IconBuilding = ({ className = "h-6 w-6" }: P) => <svg {...base} className={className}><path d="M4 21V5a1 1 0 011-1h9a1 1 0 011 1v16M15 9h4a1 1 0 011 1v11M3 21h18M8 8h3M8 12h3M8 16h3" /></svg>;
export const IconClock = ({ className = "h-6 w-6" }: P) => <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
export const IconChat = ({ className = "h-6 w-6" }: P) => <svg {...base} className={className}><path d="M20 11.5a8 8 0 01-11.6 7.1L4 20l1.4-4.2A8 8 0 1120 11.5z" /><path d="M9 11h.01M12 11h.01M15 11h.01" strokeWidth="2.4" /></svg>;
export const IconPhone = ({ className = "h-6 w-6" }: P) => <svg {...base} className={className}><path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" /></svg>;
export const IconShield = ({ className = "h-6 w-6" }: P) => <svg {...base} className={className}><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3z" /><path d="M9 12l2 2 4-4" /></svg>;
export const IconGlobe = ({ className = "h-6 w-6" }: P) => <svg {...base} className={className}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.500 5.700 12 3z" /></svg>;
export const IconPill = ({ className = "h-6 w-6" }: P) => <svg {...base} className={className}><path d="M10.5 20.5a4.95 4.95 0 01-7-7l10-10a4.95 4.95 0 017 7l-10 10zM8.5 8.5l7 7" /></svg>;
export const IconStar = ({ className = "h-4 w-4" }: P) => <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4 6.1 20.5l1.2-6.5L2.500 9.400l6.600-.9L12 2.500z" /></svg>;
