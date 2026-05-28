export interface Trade {
  date: string;
  time2?: string;
  instrument: string;
  direction: "long" | "short";
  entry: number;
  stop: number;
  target: number;
  exitPrice: number;
  lotSize: number;
  profit: number;
  pips2: number;
  setup2?: string;
  emotions2?: string;
  notes2?: string;
}
