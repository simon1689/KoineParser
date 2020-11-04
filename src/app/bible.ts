import {
  actsChapters,
  colossiansChapters,
  ephesiansChapters,
  firstCorinthiansChapters, firstJohnChapters,
  firstPeterChapters,
  firstThessaloniansChapters,
  firstTimothyChapters,
  galatiansChapters,
  hebrewsChapters,
  jamesChapters,
  johnChapters, judeChapters,
  lukeChapters,
  markChapters,
  mattChapters,
  philemonChapters,
  philippiansChapters, revelationChapters,
  romansChapters,
  secondCorinthiansChapters, secondJohnChapters, secondPeterChapters,
  secondThessaloniansChapters,
  secondTimothyChapters, thirdJohnChapters,
  titusChapters
} from './chapters';

export interface Book {
  name: string;
  number: number;
  amountOfChapters: number;
  chapters?: any[];
}

export const BibleBooks: Book[] = [
  {name: 'Matthew', number: 40, amountOfChapters: 28, chapters: mattChapters},
  {name: 'Mark', number: 41, amountOfChapters: 16, chapters: markChapters},
  {name: 'Luke', number: 42, amountOfChapters: 24, chapters: lukeChapters},
  {name: 'John', number: 43, amountOfChapters: 21, chapters: johnChapters},
  {name: 'Acts', number: 44, amountOfChapters: 28, chapters: actsChapters},
  {name: 'Romans', number: 45, amountOfChapters: 16, chapters: romansChapters},
  {name: '1 Corinthians', number: 46, amountOfChapters: 16, chapters: firstCorinthiansChapters},
  {name: '2 Corinthians', number: 47, amountOfChapters: 13, chapters: secondCorinthiansChapters},
  {name: 'Galatians', number: 48, amountOfChapters: 6, chapters: galatiansChapters},
  {name: 'Ephesians', number: 49, amountOfChapters: 6, chapters: ephesiansChapters},
  {name: 'Philippians', number: 50, amountOfChapters: 4, chapters: philippiansChapters},
  {name: 'Colossians', number: 51, amountOfChapters: 4, chapters: colossiansChapters},
  {name: '1 Thessalonians', number: 52, amountOfChapters: 5, chapters: firstThessaloniansChapters},
  {name: '2 Thessalonians', number: 53, amountOfChapters: 3, chapters: secondThessaloniansChapters},
  {name: '1 Timothy', number: 54, amountOfChapters: 6, chapters: firstTimothyChapters},
  {name: '2 Timothy', number: 55, amountOfChapters: 4, chapters: secondTimothyChapters},
  {name: 'Titus', number: 56, amountOfChapters: 3, chapters: titusChapters},
  {name: 'Philemon', number: 57, amountOfChapters: 1, chapters: philemonChapters},
  {name: 'Hebrews', number: 58, amountOfChapters: 13, chapters: hebrewsChapters},
  {name: 'James', number: 59, amountOfChapters: 5, chapters: jamesChapters},
  {name: '1 Peter', number: 60, amountOfChapters: 5, chapters: firstPeterChapters},
  {name: '2 Peter', number: 61, amountOfChapters: 3, chapters: secondPeterChapters},
  {name: '1 John', number: 62, amountOfChapters: 5, chapters: firstJohnChapters},
  {name: '2 John', number: 63, amountOfChapters: 1, chapters: secondJohnChapters},
  {name: '3 John', number: 64, amountOfChapters: 1, chapters: thirdJohnChapters},
  {name: 'Jude', number: 65, amountOfChapters: 1, chapters: judeChapters},
  {name: 'Revelation', number: 66, amountOfChapters: 22, chapters: revelationChapters},
];
