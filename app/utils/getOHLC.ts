export async function getOHLC(symbol: string, date: string) {
  const API_KEY = process.env.NEXT_PUBLIC_TWELVEDATA_KEY;

  // Convertimos la fecha a rango de 1 día
  const start = `${date} 00:00:00`;
  const end = `${date} 23:59:59`;

  // 🔥 TwelveData soporta Forex, índices y metales
  const url = `https://api.twelvedata.com/time_series?symbol=${symbol}&interval=5min&start_date=${start}&end_date=${end}&apikey=${API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.values) {
      console.warn("No se encontraron velas para", symbol);
      return [];
    }

    return data.values.map((c: any) => ({
      time: c.datetime,
      open: parseFloat(c.open),
      high: parseFloat(c.high),
      low: parseFloat(c.low),
      close: parseFloat(c.close),
    }));
  } catch (e) {
    console.error("Error cargando OHLC:", e);
    return [];
  }
}
