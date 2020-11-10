export interface Score {
  range: string;
  date: Date;
  dateFormatted?: string;
  numberOfWords: number;
  goodAnswers: number;
  wrongAnswers: number;
  skippedWords: number;
}
