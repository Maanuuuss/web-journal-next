export function getInstrumentConfig(instrumentRaw: string) {
  const instrument = instrumentRaw.replace(/\s+/g, "").toUpperCase();

  switch (instrument) {
    case "EURUSD":
    case "BTCUSD":
      return { pipSize: 0.0001, pipValuePerLot: 10 };
    case "GBPJPY":
    case "USDJPY":
      return { pipSize: 0.01, pipValuePerLot: 9 };
    case "XAUUSD":
      return { pipSize: 0.1, pipValuePerLot: 1 };
    case "DE40":
    case "US500":
    case "NAS100":
      return { pipSize: 1, pipValuePerLot: 1 };
    default:
      return { pipSize: 0.0001, pipValuePerLot: 10 };
  }
}

export function calculatePipsAndProfit(trade: {
  instrument: string;
  direction: "long" | "short";
  entry: number;
  exitPrice: number;
  lotSize: number;
}) {
  const { pipSize, pipValuePerLot } = getInstrumentConfig(trade.instrument);
  const directionSign = trade.direction === "long" ? 1 : -1;

  const rawPips = (trade.exitPrice - trade.entry) / pipSize;
  const pips = rawPips * directionSign;
  const profit = pips * pipValuePerLot * trade.lotSize;

  return { pips, profit };
}
