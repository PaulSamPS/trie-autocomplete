import { TrieService } from '../services/trie.service';
import { AutocompleteResponse, InsertPhrase, InsertWord, SearchResponse } from '../interface/trie-controller.type';

export class TrieController {
  private readonly trieService: TrieService;

  constructor() {
    this.trieService = new TrieService();
  }

  insertWord(dto: InsertWord): { message: string } {
    try {
      this.trieService.insert(dto.word);
      return { message: `Слово "${dto.word}" успешно добавлено` };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка запроса: ${errorMessage}`);
    }
  }

  insertPhrase(dto: InsertPhrase): { message: string } {
    try {
      this.trieService.insertPhrase(dto.phrase);
      return { message: `Фраза "${dto.phrase}" успешно добавлена` };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Неизвестная ошибка';
      throw new Error(`Ошибка запроса: ${errorMessage}`);
    }
  }

  searchWord(word: string): SearchResponse {
    const exists = this.trieService.search(word);
    return {
      exists,
      text: word,
    };
  }

  searchPhrase(phrase: string): SearchResponse {
    const exists = this.trieService.searchPhrase(phrase);
    return {
      exists,
      text: phrase,
    };
  }

  autocompleteWords(prefix: string, limit?: number): AutocompleteResponse {
    const limitNum = limit || 10;

    if (!prefix) {
      throw new Error('Префикс обязателен для автодополнения');
    }

    const suggestions = this.trieService.getWordsWithPrefix(prefix, limitNum);

    return {
      prefix,
      suggestions,
      count: suggestions.length,
    };
  }

  autocompletePhrases(prefix: string, limit?: number): AutocompleteResponse {
    const limitNum = limit || 10;

    if (!prefix) {
      throw new Error('Префикс обязателен для автодополнения');
    }

    const suggestions = this.trieService.getPhrasesWithPrefix(prefix, limitNum);

    return {
      prefix,
      suggestions,
      count: suggestions.length,
    };
  }

  checkPrefix(prefix: string): { hasWords: boolean } {
    const hasWords = this.trieService.startsWith(prefix);
    return { hasWords };
  }

  deleteWord(word: string): { message: string } {
    const deleted = this.trieService.delete(word);

    if (!deleted) {
      throw new Error('Слово не найдено');
    }

    return { message: `Слово "${word}" успешно удалено` };
  }

  getStats() {
    return this.trieService.getStats();
  }

  clearTrie(): { message: string } {
    this.trieService.clear();
    return { message: 'Префиксное дерево успешно очищено' };
  }

  loadFishingPhrases(): { message: string; loaded: number } {
    return this.trieService.loadFishingPhrases();
  }
}
