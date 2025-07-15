# Trie Autocomplete

Efficient TypeScript implementation of a trie (prefix tree) for autocomplete systems with support for both words and phrases.

## Installation

```bash
npm install trie-autocomplete
```

## Usage

```typescript
import { TrieService, TrieController } from 'trie-autocomplete';

// Initialize
const trieService = new TrieService();

// Insert data
trieService.insert('рыба');
trieService.insertPhrase('идти рыбачить');

// Search
console.log(trieService.search('рыба')); // true

// Autocomplete
console.log(trieService.getWordsWithPrefix('рыб')); // ['рыба']

// Load demo data
controller.loadFishingPhrases();
```

## Features

- Insert/search words and phrases
- Prefix-based autocomplete
- Phrase normalization
- Demo dataset for fishing-related phrases
- Statistics tracking
- Memory efficient

## API Documentation

### TrieService
- `insert(word: string)`
- `insertPhrase(phrase: string)`
- `search(word: string): boolean`
- `searchPhrase(phrase: string): boolean`
- `startsWith(prefix: string): boolean`
- `getWordsWithPrefix(prefix: string, limit = 10): string[]`
- `getPhrasesWithPrefix(prefix: string, limit = 10): string[]`
- `delete(word: string): boolean`
- `getStats(): { totalNodes, totalWords, totalPhrases }`
- `clear()`

### TrieController
- All TrieService methods wrapped
- REST-friendly methods
- DTO-based input validation
- `loadFishingPhrases(): { message, loaded }`