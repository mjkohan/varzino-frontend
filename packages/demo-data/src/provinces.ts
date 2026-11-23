export type Province = {
  id: string;
  name: string;
  /** registered athletes in the federation for this province */
  athletes: number;
  clubs: number;
  coaches: number;
  referees: number;
  /** growth of registered athletes vs last year, percent */
  growth: number;
};

// Figures are demo values sized roughly by population.
export const provinces: Province[] = [
  { id: "thr", name: "تهران", athletes: 18420, clubs: 412, coaches: 1260, referees: 342, growth: 6.2 },
  { id: "isf", name: "اصفهان", athletes: 9840, clubs: 221, coaches: 640, referees: 188, growth: 8.1 },
  { id: "krz", name: "خراسان رضوی", athletes: 9120, clubs: 204, coaches: 598, referees: 171, growth: 4.4 },
  { id: "frs", name: "فارس", athletes: 7310, clubs: 168, coaches: 472, referees: 139, growth: 9.6 },
  { id: "kzs", name: "خوزستان", athletes: 6980, clubs: 152, coaches: 430, referees: 122, growth: 3.1 },
  { id: "eaz", name: "آذربایجان شرقی", athletes: 6420, clubs: 149, coaches: 418, referees: 117, growth: 5.7 },
  { id: "maz", name: "مازندران", athletes: 5960, clubs: 141, coaches: 391, referees: 109, growth: 11.4 },
  { id: "alb", name: "البرز", athletes: 4870, clubs: 118, coaches: 322, referees: 86, growth: 7.3 },
  { id: "krm", name: "کرمان", athletes: 4410, clubs: 97, coaches: 276, referees: 74, growth: 2.2 },
  { id: "waz", name: "آذربایجان غربی", athletes: 4280, clubs: 95, coaches: 268, referees: 71, growth: 4.9 },
  { id: "gil", name: "گیلان", athletes: 3940, clubs: 92, coaches: 251, referees: 69, growth: 6.8 },
  { id: "sbl", name: "سیستان و بلوچستان", athletes: 3120, clubs: 61, coaches: 176, referees: 44, growth: 14.2 },
  { id: "ker", name: "کرمانشاه", athletes: 2980, clubs: 66, coaches: 184, referees: 49, growth: 3.6 },
  { id: "gol", name: "گلستان", athletes: 2710, clubs: 63, coaches: 171, referees: 46, growth: 5.1 },
  { id: "ham", name: "همدان", athletes: 2560, clubs: 60, coaches: 166, referees: 45, growth: 4.0 },
  { id: "yzd", name: "یزد", athletes: 2390, clubs: 58, coaches: 162, referees: 43, growth: 7.9 },
  { id: "hor", name: "هرمزگان", athletes: 2240, clubs: 49, coaches: 139, referees: 37, growth: 8.8 },
  { id: "lor", name: "لرستان", athletes: 2210, clubs: 48, coaches: 134, referees: 36, growth: 2.7 },
  { id: "ard", name: "اردبیل", athletes: 1960, clubs: 44, coaches: 121, referees: 33, growth: 3.9 },
  { id: "qom", name: "قم", athletes: 1920, clubs: 45, coaches: 124, referees: 34, growth: 5.5 },
  { id: "mkz", name: "مرکزی", athletes: 1880, clubs: 43, coaches: 118, referees: 32, growth: 1.8 },
  { id: "qzv", name: "قزوین", athletes: 1840, clubs: 42, coaches: 117, referees: 31, growth: 6.1 },
  { id: "kur", name: "کردستان", athletes: 1790, clubs: 40, coaches: 112, referees: 30, growth: 4.6 },
  { id: "zan", name: "زنجان", athletes: 1430, clubs: 34, coaches: 92, referees: 25, growth: 3.3 },
  { id: "bsh", name: "بوشهر", athletes: 1390, clubs: 32, coaches: 88, referees: 24, growth: 9.2 },
  { id: "sem", name: "سمنان", athletes: 1060, clubs: 27, coaches: 71, referees: 19, growth: 2.5 },
  { id: "kns", name: "خراسان شمالی", athletes: 980, clubs: 23, coaches: 63, referees: 17, growth: 6.4 },
  { id: "chb", name: "چهارمحال و بختیاری", athletes: 960, clubs: 22, coaches: 61, referees: 16, growth: 5.0 },
  { id: "kbr", name: "کهگیلویه و بویراحمد", athletes: 820, clubs: 19, coaches: 52, referees: 14, growth: 7.1 },
  { id: "kjs", name: "خراسان جنوبی", athletes: 790, clubs: 18, coaches: 50, referees: 13, growth: 4.2 },
  { id: "ilm", name: "ایلام", athletes: 610, clubs: 15, coaches: 41, referees: 11, growth: 3.4 },
];

export const provinceById = Object.fromEntries(provinces.map((p) => [p.id, p])) as Record<string, Province>;

export const nationalTotals = provinces.reduce(
  (acc, p) => ({
    athletes: acc.athletes + p.athletes,
    clubs: acc.clubs + p.clubs,
    coaches: acc.coaches + p.coaches,
    referees: acc.referees + p.referees,
  }),
  { athletes: 0, clubs: 0, coaches: 0, referees: 0 },
);
