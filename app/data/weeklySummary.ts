import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { tradesData } from "./tradesData";

// Activar plugin de semanas
dayjs.extend(weekOfYear);

export function getWeeklySummary() {
  const weeks: any = {};

  tradesData.forEach((trade) => {
    const date = dayjs(trade.date);
    const weekNumber = date.week(); // ahora sí funciona

    if (!weeks[weekNumber]) {
      weeks[weekNumber] = {
        totalProfit: 0,
        daysTraded: 0,
        bestDay: null,
        worstDay: null,
      };
    }

    weeks[weekNumber].totalProfit += trade.profit;
    weeks[weekNumber].daysTraded += 1;

    if (
      weeks[weekNumber].bestDay === null ||
      trade.profit > weeks[weekNumber].bestDay.profit
    ) {
      weeks[weekNumber].bestDay = trade;
    }

    if (
      weeks[weekNumber].worstDay === null ||
      trade.profit < weeks[weekNumber].worstDay.profit
    ) {
      weeks[weekNumber].worstDay = trade;
    }
  });

  return weeks;
}
