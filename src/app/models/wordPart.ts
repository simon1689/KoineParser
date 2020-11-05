export interface WordPart {
  abbreviation: string;
  name: string;
  headCategory?: WordPart;
  type: string;
}
