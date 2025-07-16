import { TreeService } from '../services/tree.service';
import {
  AutocompleteResponse,
  InsertPhrase,
  InsertWord,
  SearchResponse,
} from '../interface/tree-controller.interface';
import { TreeStats } from '../interface/tree-stats.interface';

export class TreeController {
  private readonly trieService: TreeService;

  constructor() {
    this.trieService = new TreeService();
  }

  /**
   * Добавляет слово в префиксное дерево
   * @param {InsertWord} dto - DTO с полем `word` (строка)
   * @returns {Object} Сообщение об успешном добавлении
   * @throws {Error} Ошибка при пустом слове или проблемах вставки
   * @example
   * insertWord({ word: "рыбалка" }) // { message: 'Слово "рыбалка" успешно добавлено' }
   */
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

  /**
   * Добавляет фразу в префиксное дерево (разбивает на слова)
   * @param {InsertPhrase} dto - DTO с полем `phrase` (строка)
   * @returns {Object} Сообщение об успешном добавлении
   * @throws {Error} Ошибка при пустой фразе или проблемах вставки
   * @example
   * insertPhrase({ phrase: "зимняя рыбалка" }) // { message: 'Фраза "зимняя рыбалка" успешно добавлена' }
   */
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

  /**
   * Проверяет существование слова в дереве
   * @param {string} word - Слово для поиска
   * @returns {SearchResponse} Объект с результатом и исходным текстом
   * @example
   * searchWord("удочка") // { exists: true, text: "удочка" }
   */
  searchWord(word: string): SearchResponse {
    const exists = this.trieService.search(word);
    return {
      exists,
      text: word,
    };
  }

  /**
   * Проверяет существование фразы в дереве (точное совпадение)
   * @param {string} phrase - Фраза для поиска
   * @returns {SearchResponse} Объект с результатом и исходным текстом
   * @example
   * searchPhrase("ловля карпа") // { exists: false, text: "ловля карпа" }
   */
  searchPhrase(phrase: string): SearchResponse {
    const exists = this.trieService.searchPhrase(phrase);
    return {
      exists,
      text: phrase,
    };
  }

  /**
   * Возвращает слова для автодополнения по префиксу
   * @param {string} prefix - Префикс для поиска
   * @param {number} [limit=10] - Ограничение количества результатов (опционально)
   * @returns {AutocompleteResponse} Объект с префиксом, предложениями и их количеством
   * @throws {Error} Если префикс не указан
   * @example
   * autocompleteWords("рыб", 5) // { prefix: "рыб", suggestions: ["рыба", "рыбак", ...], count: 5 }
   */
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

  /**
   * Возвращает фразы для автодополнения по префиксу
   * @param {string} prefix - Префикс для поиска
   * @param {number} [limit=10] - Ограничение количества результатов (опционально)
   * @returns {AutocompleteResponse} Объект с префиксом, предложениями и их количеством
   * @throws {Error} Если префикс не указан
   * @example
   * autocompletePhrases("лов", 3) // { prefix: "лов", suggestions: ["ловля карася", ...], count: 2 }
   */
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

  /**
   * Проверяет наличие слов/фраз с указанным префиксом
   * @param {string} prefix - Префикс для проверки
   * @returns {Object} Результат проверки
   * @example
   * checkPrefix("под") // { hasWords: true }
   */
  checkPrefix(prefix: string): { hasWords: boolean } {
    const hasWords = this.trieService.startsWith(prefix);
    return { hasWords };
  }

  /**
   * Удаляет слово из дерева
   * @param {string} word - Слово для удаления
   * @returns {Object} Сообщение об успешном удалении
   * @throws {Error} Если слово не найдено
   * @example
   * deleteWord("червяк") // { message: 'Слово "червяк" успешно удалено' }
   */
  deleteWord(word: string): { message: string } {
    const deleted = this.trieService.delete(word);

    if (!deleted) {
      throw new Error('Слово не найдено');
    }

    return { message: `Слово "${word}" успешно удалено` };
  }

  /**
   * Возвращает статистику дерева
   * @returns {TreeStats} Статистика (количество слов/узлов)
   * @example
   * getStats() // { totalWords: 42, totalNodes: 158 }
   */
  getStats(): TreeStats {
    return this.trieService.getStats();
  }

  /**
   * Полностью очищает префиксное дерево
   * @returns {Object} Сообщение об успешной очистке
   * @example
   * clearTrie() // { message: 'Префиксное дерево успешно очищено' }
   */
  clearTrie(): { message: string } {
    this.trieService.clear();
    return { message: 'Префиксное дерево успешно очищено' };
  }

  /**
   * Загружает предустановленные рыболовные фразы
   * @returns {Object} Сообщение и количество загруженных фраз
   * @example
   * loadFishingPhrases() // { message: 'Загружено 25 фраз', loaded: 25 }
   */
  loadFishingPhrases(): { message: string; loaded: number } {
    return this.trieService.loadFishingPhrases();
  }
}
