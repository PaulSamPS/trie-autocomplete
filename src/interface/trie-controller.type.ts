export interface InsertWord {
  word: string;
}

export interface InsertPhrase {
  phrase: string;
}

export interface SearchResponse {
  exists: boolean;
  text: string;
}

export interface AutocompleteResponse {
  prefix: string;
  suggestions: string[];
  count: number;
}