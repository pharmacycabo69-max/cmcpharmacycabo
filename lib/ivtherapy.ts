// IV therapy menu, FAQ and booking settings. Single source of truth: the page, the booking wizard and
// /api/iv-therapy/checkout (which re-reads prices server-side) all use this file.
export type IvDrip = {
  id: string; name: string; category: string; tagline: string; priceUsd: number; from: boolean;
  duration: string; includes: string; benefits: string[]; image: string; alt: string;
};

export const IV_DRIPS: IvDrip[] = [
  {
    "id": "hydration-boost",
    "name": "Hydration Boost",
    "category": "Recovery",
    "tagline": "For sun, sweat, and Cabo summer days.",
    "priceUsd": 199,
    "from": false,
    "duration": "30–45 min",
    "includes": "Saline + electrolytes + magnesium + B-complex",
    "benefits": [
      "Rapid rehydration vs. drinking water alone",
      "Replenishes electrolytes lost to sun",
      "Eases dehydration headaches",
      "Perfect day-of arrival relief"
    ],
    "image": "/wp-content/uploads/2026/05/Gemini_Generated_Image_p22mucp22mucp22m-2-768x768.jpeg",
    "alt": "Hydration Boost IV drip delivered in Cabo San Lucas"
  },
  {
    "id": "hangover-recovery",
    "name": "Hangover Recovery",
    "category": "Recovery",
    "tagline": "After a long night in Cabo. Back on your feet.",
    "priceUsd": 279,
    "from": false,
    "duration": "45–60 min",
    "includes": "Saline + magnesium + B-complex + B6 + anti-nausea + anti-inflammatory",
    "benefits": [
      "Relieves headache and nausea",
      "Replenishes electrolytes and fluids",
      "Reduces post-alcohol inflammation",
      "Most clients feel relief within 45 minutes"
    ],
    "image": "/wp-content/uploads/2026/05/Gemini_Generated_Image_uz2c58uz2c58uz2c-768x768.jpeg",
    "alt": "Hangover Recovery IV drip delivered in Cabo San Lucas"
  },
  {
    "id": "myers-cocktail-classic",
    "name": "Myers Cocktail Classic",
    "category": "Wellness",
    "tagline": "The original IV wellness formula. Used since the 1970s.",
    "priceUsd": 249,
    "from": false,
    "duration": "45–60 min",
    "includes": "Vitamin C + B-complex + B12 + magnesium + calcium",
    "benefits": [
      "Broad-spectrum wellness support",
      "May help with fatigue and stress",
      "Supports immune and cardiovascular function",
      "Ideal monthly maintenance drip"
    ],
    "image": "/wp-content/uploads/2026/05/Gemini_Generated_Image_gxbb5gxbb5gxbb5g-768x768.jpeg",
    "alt": "Myers Cocktail Classic IV drip delivered in Cabo San Lucas"
  },
  {
    "id": "immune-boost",
    "name": "Immune Boost",
    "category": "Immunity",
    "tagline": "When you feel something coming on.",
    "priceUsd": 279,
    "from": false,
    "duration": "60–90 min",
    "includes": "High-dose Vitamin C + glutathione + zinc + B-complex",
    "benefits": [
      "Reinforces immune response",
      "May help shorten cold and flu duration",
      "Supports recovery after illness",
      "Recommended before long-haul flights"
    ],
    "image": "/wp-content/uploads/2026/05/cmc-iv-drip-immune-coral-1-768x768.png",
    "alt": "Immune Boost IV drip delivered in Cabo San Lucas"
  },
  {
    "id": "beauty-glow",
    "name": "Beauty Glow",
    "category": "Beauty",
    "tagline": "Skin luminosity from the inside out.",
    "priceUsd": 299,
    "from": false,
    "duration": "45–60 min",
    "includes": "Glutathione + Vitamin C + biotin",
    "benefits": [
      "Powerful antioxidant action",
      "Supports collagen production",
      "Brightens skin and evens tone",
      "Ideal before weddings, photoshoots, events"
    ],
    "image": "/wp-content/uploads/2026/05/Gemini_Generated_Image_3a11yd3a11yd3a11-768x768.jpeg",
    "alt": "Beauty Glow IV drip delivered in Cabo San Lucas"
  },
  {
    "id": "nad-performance",
    "name": "NAD+ Performance",
    "category": "Longevity",
    "tagline": "Mitochondrial energy. Mental clarity. Healthy aging.",
    "priceUsd": 549,
    "from": true,
    "duration": "90–150 min",
    "includes": "NAD+ (Nicotinamide Adenine Dinucleotide)",
    "benefits": [
      "Supports mitochondrial energy production",
      "May enhance cognitive clarity and focus",
      "Backed by longevity research",
      "500mg and 1000mg doses also available"
    ],
    "image": "/wp-content/uploads/2026/05/Gemini_Generated_Image_qmjv9gqmjv9gqmjv-768x768.jpeg",
    "alt": "NAD+ Performance IV drip delivered in Cabo San Lucas"
  },
  {
    "id": "b-complex-energy",
    "name": "B-Complex Energy",
    "category": "Energy",
    "tagline": "Sustained energy without the caffeine crash.",
    "priceUsd": 229,
    "from": false,
    "duration": "45–60 min",
    "includes": "B-complex + B12 + amino acids + magnesium",
    "benefits": [
      "Supports natural energy metabolism",
      "May reduce mental fatigue",
      "Helpful for busy travel itineraries",
      "Add a B12 booster for extra kick"
    ],
    "image": "/wp-content/uploads/2026/05/cmc-iv-drip-bcomplex-green-1-768x768.png",
    "alt": "B-Complex Energy IV drip delivered in Cabo San Lucas"
  },
  {
    "id": "athletic-performance",
    "name": "Athletic Performance",
    "category": "Recovery",
    "tagline": "Train hard, recover faster.",
    "priceUsd": 279,
    "from": false,
    "duration": "60–90 min",
    "includes": "Vitamin C + glutathione + B-complex + calcium + zinc + B6",
    "benefits": [
      "Supports muscle recovery",
      "May reduce post-workout fatigue",
      "Replenishes electrolytes lost to training",
      "Ideal for golfers, cyclists, surfers"
    ],
    "image": "/wp-content/uploads/2026/05/cmc-iv-drip-athletic-orange-1-768x768.png",
    "alt": "Athletic Performance IV drip delivered in Cabo San Lucas"
  },
  {
    "id": "jet-lag-recovery",
    "name": "Jet Lag Recovery",
    "category": "Recovery",
    "tagline": "Hit the ground running after a long flight.",
    "priceUsd": 249,
    "from": false,
    "duration": "45–60 min",
    "includes": "Saline + B-complex + magnesium + B12 + amino acids",
    "benefits": [
      "Combats dehydration from flying",
      "Supports circadian rhythm reset",
      "Restores energy on day-of-arrival",
      "Available concierge to your hotel"
    ],
    "image": "/wp-content/uploads/2026/05/cmc-iv-drip-jetlag-lavender-1-768x768.png",
    "alt": "Jet Lag Recovery IV drip delivered in Cabo San Lucas"
  },
  {
    "id": "detox-and-reset",
    "name": "Detox & Reset",
    "category": "Longevity",
    "tagline": "Post-indulgence reset. Glutathione the heavyweight antioxidant.",
    "priceUsd": 299,
    "from": false,
    "duration": "60–90 min",
    "includes": "Glutathione + Vitamin C + B-complex + magnesium + N-Acetyl Cysteine",
    "benefits": [
      "Supports liver detoxification pathways",
      "Powerful antioxidant blend",
      "Helpful after long weekends or rich meals",
      "Pair with Hydration Boost for full reset"
    ],
    "image": "/wp-content/uploads/2026/05/cmc-iv-drip-detox-mint-1-768x768.png",
    "alt": "Detox & Reset IV drip delivered in Cabo San Lucas"
  }
];

export const getDrip = (id: string) => IV_DRIPS.find((d) => d.id === id);

export const IV_FAQ: { q: string; a: string }[] = [
  {
    "q": "Is IV therapy safe?",
    "a": "Yes. Every protocol is designed and supervised by our medical director. Infusions are administered by certified nursing staff using pharmaceutical-grade supplies and disposable sterile equipment, under valid Mexican health authority licensing (COFEPRIS)."
  },
  {
    "q": "Do I need a prescription or prior consultation?",
    "a": "No prescription is required. A free 10-minute medical consultation is included with your first IV: we review your health history, your goals, and rule out any contraindications before the session."
  },
  {
    "q": "How often should I do an IV session?",
    "a": "It depends on your goals and clinical evaluation. Each formula has a different protocol — from single sessions for specific needs to cycles of 3–4 sessions with monthly maintenance for sustained results."
  },
  {
    "q": "Does it hurt?",
    "a": "The IV placement feels similar to a standard blood draw — a brief initial pinch. After that, the infusion itself is painless. Most clients relax, listen to music, or rest while the drip runs."
  },
  {
    "q": "Who should not do IV therapy?",
    "a": "IV therapy is safe for the vast majority of healthy adults. However, certain conditions require caution or medical supervision: pregnancy and breastfeeding, advanced kidney or heart disease, known component allergies, hemochromatosis, and G6PD deficiency. Our medical team screens for these during your consultation."
  },
  {
    "q": "Can you come to my hotel or villa?",
    "a": "Yes. We offer concierge delivery across Cabo San Lucas, San José del Cabo, and the Tourist Corridor. Most appointments arrive within 60–90 minutes of confirmation. Message us on WhatsApp with your hotel and room number."
  },
  {
    "q": "How do I pay?",
    "a": "Reserve your visit online with a 50% deposit by card (Stripe). The remaining balance is paid after the session by credit card (Visa, MasterCard, AMEX), USD cash or bank transfer. Receipts are available for travel insurance reimbursement."
  },
  {
    "q": "What if I have a reaction during the drip?",
    "a": "Reactions are rare, and our nursing staff is trained to manage and stop infusions immediately if needed. Our medical director is available by phone during all sessions. For your first IV, we recommend the in-pharmacy setting where you can be monitored in our dedicated treatment area."
  }
];

export const IV = {
  whatsapp: "5216242261023", // IV therapy / nursing team number
  phoneDisplay: "+52 (624) 226 1023",
  timezone: "America/Mazatlan", // Cabo time
  hours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21], // first-visit start hours (9 AM – 9 PM)
  maxDays: 90,
  depositRate: 0.5,
};
