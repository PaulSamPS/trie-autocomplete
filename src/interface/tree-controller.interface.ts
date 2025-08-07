export interface InsertWord {
  word: string;
}

export interface InsertPhrase {
  phrase: string;
}

export interface SearchResponse {
  exists: boolean;
  text: string;
  count?: number;
}

export interface AutocompleteResponse {
  prefix: string;
  suggestions: string[];
  count: number;
}

export interface WordCountResponse {
  word: string;
  count: number;
  normalized: string;
}

export interface PhraseCountResponse {
  phrase: string;
  count: number;
  normalized: string;
}
