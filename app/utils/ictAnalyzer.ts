import dayjs from "dayjs";

// ---------------------------------------------------------
// TIPOS
// ---------------------------------------------------------
export interface Candle {
  time: string;   // "2026-05-27T14:30:00Z"
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface Trade {
  date: string;
  time: string;
  direction: "long" | "short";
  entry: number;
  stop: number;
  target: number;
  notes?: string;
}

// ---------------------------------------------------------
// SESIONES ICT
// ---------------------------------------------------------
function detectSession(time: string) {
  const hour = parseInt(time.split(":")[0]);

  if (hour >= 0 && hour < 5) return "Asia";
  if (hour >= 7 && hour < 10) return "London Open";
  if (hour >= 10 && hour < 12) return "London AM";
  if (hour >= 13 && hour < 15) return "NY Open";
  if (hour >= 15 && hour < 17) return "NY PM";
  return "Fuera de sesión";
}

// ---------------------------------------------------------
// SWING HIGH / SWING LOW
// ---------------------------------------------------------
function detectSwingHigh(candles: Candle[], i: number) {
  if (i < 2 || i > candles.length - 3) return false;
  return (
    candles[i].high > candles[i - 1].high &&
    candles[i].high > candles[i - 2].high &&
    candles[i].high > candles[i + 1].high &&
    candles[i].high > candles[i + 2].high
  );
}

function detectSwingLow(candles: Candle[], i: number) {
  if (i < 2 || i > candles.length - 3) return false;
  return (
    candles[i].low < candles[i - 1].low &&
    candles[i].low < candles[i - 2].low &&
    candles[i].low < candles[i + 1].low &&
    candles[i].low < candles[i + 2].low
  );
}

// ---------------------------------------------------------
// BOS / CHoCH
// ---------------------------------------------------------
function detectStructure(candles: Candle[]) {
  let structure = [];

  for (let i = 2; i < candles.length - 2; i++) {
    if (detectSwingHigh(candles, i)) {
      structure.push({ type: "swingHigh", index: i, price: candles[i].high });
    }
    if (detectSwingLow(candles, i)) {
      structure.push({ type: "swingLow", index: i, price: candles[i].low });
    }
  }

  let signals = [];

  for (let i = 1; i < structure.length; i++) {
    const prev = structure[i - 1];
    const curr = structure[i];

    if (prev.type === "swingHigh" && curr.type === "swingHigh") {
      if (curr.price > prev.price) signals.push("BOS alcista");
    }

    if (prev.type === "swingLow" && curr.type === "swingLow") {
      if (curr.price < prev.price) signals.push("BOS bajista");
    }

    if (prev.type !== curr.type) {
      signals.push("CHoCH");
    }
  }

  return signals;
}

// ---------------------------------------------------------
// FVG REAL
// ---------------------------------------------------------
function detectFVG(candles: Candle[]) {
  let fvgList = [];

  for (let i = 2; i < candles.length; i++) {
    const c1 = candles[i - 2];
    const c2 = candles[i - 1];
    const c3 = candles[i];

    // Bullish FVG
    if (c1.high < c3.low) {
      fvgList.push({
        type: "Bullish FVG",
        index: i,
        gap: [c1.high, c3.low],
      });
    }

    // Bearish FVG
    if (c1.low > c3.high) {
      fvgList.push({
        type: "Bearish FVG",
        index: i,
        gap: [c3.high, c1.low],
      });
    }
  }

  return fvgList;
}

// ---------------------------------------------------------
// PREMIUM / DISCOUNT REAL
// ---------------------------------------------------------
function detectPremiumDiscount(candles: Candle[], trade: Trade) {
  const high = Math.max(...candles.map((c) => c.high));
  const low = Math.min(...candles.map((c) => c.low));
  const mid = (high + low) / 2;

  if (trade.direction === "long") {
    return trade.entry < mid ? "Discount" : "Premium (malo)";
  }

  if (trade.direction === "short") {
    return trade.entry > mid ? "Premium" : "Discount (malo)";
  }

  return "Indefinido";
}

// ---------------------------------------------------------
// LIQUIDEZ REAL
// ---------------------------------------------------------
function detectLiquidity(candles: Candle[], trade: Trade) {
  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);

  const equalHighs = highs.filter((h, i) => Math.abs(h - highs[i - 1]) < 0.0005);
  const equalLows = lows.filter((l, i) => Math.abs(l - lows[i - 1]) < 0.0005);

  if (equalHighs.length > 0) return "Equal Highs";
  if (equalLows.length > 0) return "Equal Lows";

  return "Ninguna";
}

// ---------------------------------------------------------
// MODELO ICT REAL
// ---------------------------------------------------------
function detectModel(structure: string[], fvg: any[]) {
  if (structure.includes("CHoCH") && fvg.length > 0) return "Reversal Model";
  if (structure.includes("BOS alcista") && fvg.length > 0) return "Continuation Model";
  if (structure.includes("BOS bajista") && fvg.length > 0) return "Continuation Model";

  return "Desconocido";
}

// ---------------------------------------------------------
// RATING ICT REAL
// ---------------------------------------------------------
function rateTrade(session: string, structure: string[], fvg: any[], liquidity: string, model: string) {
  let score = 0;

  if (session.includes("London") || session.includes("NY")) score += 2;
  if (structure.includes("CHoCH")) score += 2;
  if (fvg.length > 0) score += 2;
  if (liquidity !== "Ninguna") score += 2;
  if (model !== "Desconocido") score += 2;

  if (score >= 8) return "A+";
  if (score >= 6) return "A";
  if (score >= 4) return "B";
  return "C";
}

// ---------------------------------------------------------
// ANALIZADOR PRINCIPAL
// ---------------------------------------------------------
export function analyzeICT(trade: Trade, candles: Candle[]) {
  const session = detectSession(trade.time);
  const structure = detectStructure(candles);
  const fvg = detectFVG(candles);
  const liquidity = detectLiquidity(candles, trade);
  const premiumDiscount = detectPremiumDiscount(candles, trade);
  const model = detectModel(structure, fvg);
  const rating = rateTrade(session, structure, fvg, liquidity, model);

  return {
    session,
    structure,
    fvg,
    liquidity,
    premiumDiscount,
    model,
    rating,
  };
}
