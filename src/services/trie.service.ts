import { TrieNode } from '../interface/trie-node.interface';

export class TrieService {
  private readonly wordTrie: TrieNode;
  private readonly phraseTrie: TrieNode;
  private readonly WORD_SEPARATOR = '___WORD___';

  constructor() {
    this.wordTrie = this.createNode();
    this.phraseTrie = this.createNode();
  }

  /**
   * Создает новый узел дерева
   */
  private createNode(): TrieNode {
    return {
      isEndOfWord: false,
      children: new Map<string, TrieNode>(),
    };
  }

  /**
   * Нормализует текст для хранения
   */
  private normalizeText(text: string): string {
    return text.toLowerCase().trim().replace(/\s+/g, ' ');
  }

  /**
   * Преобразует фразу в путь для хранения в дереве
   */
  private phraseToPath(phrase: string): string {
    const words = this.normalizeText(phrase).split(' ');
    return words.join(this.WORD_SEPARATOR);
  }

  /**
   * Преобразует путь обратно в фразу
   */
  private pathToPhrase(path: string): string {
    return path.split(this.WORD_SEPARATOR).join(' ');
  }

  /**
   * Добавляет слово в префиксное дерево (для одиночных слов)
   */
  insert(word: string): void {
    if (!word || word.trim().length === 0) {
      throw new Error('Слово не может быть пустым');
    }

    const normalizedWord = word.toLowerCase().trim();
    let currentNode = this.wordTrie;

    // Проходим по каждому символу слова
    for (const char of normalizedWord) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, this.createNode());
      }
      currentNode = currentNode.children.get(char)!;
    }

    // Отмечаем конец слова
    currentNode.isEndOfWord = true;
  }

  /**
   * Добавляет фразу в префиксное дерево
   */
  insertPhrase(phrase: string): void {
    if (!phrase || phrase.trim().length === 0) {
      throw new Error('Фраза не может быть пустой');
    }

    const normalizedPhrase = this.normalizeText(phrase);
    const words = normalizedPhrase.split(' ');

    // Добавляем фразу целиком для точного поиска
    this.insertPhraseToTrie(normalizedPhrase, true);

    // Также добавляем все возможные префиксы фразы (кроме полной фразы)
    for (let i = 1; i < words.length; i++) {
      const partialPhrase = words.slice(0, i).join(' ');
      this.insertPhraseToTrie(partialPhrase, false);
    }
  }

  /**
   * Внутренний метод для добавления фразы в дерево
   */
  private insertPhraseToTrie(phrase: string, isComplete: boolean): void {
    const phrasePath = this.phraseToPath(phrase);
    let currentNode = this.phraseTrie;

    // Проходим по каждому символу фразы
    for (const char of phrasePath) {
      if (!currentNode.children.has(char)) {
        currentNode.children.set(char, this.createNode());
      }
      currentNode = currentNode.children.get(char)!;
    }

    // Отмечаем конец фразы и сохраняем оригинальный текст
    if (isComplete) {
      currentNode.isEndOfWord = true;
      currentNode.original = phrase;
    } else {
      // Для префиксов также отмечаем как конец слова
      currentNode.isEndOfWord = true;
      if (!currentNode.original) {
        currentNode.original = phrase;
      }
    }
  }

  /**
   * Проверяет, существует ли слово в дереве
   */
  search(word: string): boolean {
    if (!word || word.trim().length === 0) {
      return false;
    }

    const normalizedWord = word.toLowerCase().trim();
    let currentNode = this.wordTrie;

    // Проходим по каждому символу слова
    for (const char of normalizedWord) {
      if (!currentNode.children.has(char)) {
        return false;
      }
      currentNode = currentNode.children.get(char)!;
    }

    return currentNode.isEndOfWord;
  }

  /**
   * Проверяет, существует ли фраза в дереве
   */
  searchPhrase(phrase: string): boolean {
    if (!phrase || phrase.trim().length === 0) {
      return false;
    }

    const normalizedPhrase = this.normalizeText(phrase);
    const phrasePath = this.phraseToPath(normalizedPhrase);
    let currentNode = this.phraseTrie;

    // Проходим по каждому символу фразы
    for (const char of phrasePath) {
      if (!currentNode.children.has(char)) {
        return false;
      }
      currentNode = currentNode.children.get(char)!;
    }

    return currentNode.isEndOfWord;
  }

  /**
   * Проверяет, есть ли слова с данным префиксом
   */
  startsWith(prefix: string): boolean {
    if (!prefix || prefix.trim().length === 0) {
      return false;
    }

    const normalizedPrefix = prefix.toLowerCase().trim();
    let currentNode = this.wordTrie;

    // Проходим по каждому символу префикса
    for (const char of normalizedPrefix) {
      if (!currentNode.children.has(char)) {
        return false;
      }
      currentNode = currentNode.children.get(char)!;
    }

    return true;
  }

  /**
   * Получает все слова с заданным префиксом
   */
  getWordsWithPrefix(prefix: string, limit: number = 10): string[] {
    if (!prefix || prefix.trim().length === 0) {
      return [];
    }

    const normalizedPrefix = prefix.toLowerCase().trim();
    let currentNode = this.wordTrie;

    // Находим узел с префиксом
    for (const char of normalizedPrefix) {
      if (!currentNode.children.has(char)) {
        return [];
      }
      currentNode = currentNode.children.get(char)!;
    }

    // Собираем все слова из поддерева
    const results: string[] = [];
    this.dfsWordSearch(currentNode, normalizedPrefix, results, limit);

    return results;
  }

  /**
   * Получает все фразы с заданным префиксом
   */
  getPhrasesWithPrefix(prefix: string, limit: number = 10): string[] {
    if (!prefix || prefix.trim().length === 0) {
      return [];
    }

    const normalizedPrefix = this.normalizeText(prefix);
    const results: string[] = [];

    const phrasePath = this.phraseToPath(normalizedPrefix);
    let currentNode = this.phraseTrie;

    // Находим узел с префиксом
    for (const char of phrasePath) {
      if (!currentNode.children.has(char)) {
        return [];
      }
      currentNode = currentNode.children.get(char)!;
    }

    // Если сам префикс является фразой, добавляем его
    if (currentNode.isEndOfWord && currentNode.original) {
      results.push(currentNode.original);
    }

    // Ищем все фразы, начинающиеся с этого префикса
    this.dfsPhraseSearch(currentNode, phrasePath, results, limit);

    return results.slice(0, limit);
  }

  /**
   * Рекурсивный поиск слов в глубину
   */
  private dfsWordSearch(
    node: TrieNode,
    currentWord: string,
    results: string[],
    limit: number,
  ): void {
    if (results.length >= limit) {
      return;
    }

    if (node.isEndOfWord) {
      results.push(currentWord);
      if (results.length >= limit) {
        return;
      }
    }

    for (const [char, childNode] of node.children) {
      this.dfsWordSearch(childNode, currentWord + char, results, limit);
      if (results.length >= limit) {
        return;
      }
    }
  }

  /**
   * Рекурсивный поиск фраз в глубину
   */
  private dfsPhraseSearch(
    node: TrieNode,
    currentPath: string,
    results: string[],
    limit: number,
  ): void {
    if (results.length >= limit) {
      return;
    }

    for (const [char, childNode] of node.children) {
      const newPath = currentPath + char;

      if (childNode.isEndOfWord && childNode.original) {
        if (!results.includes(childNode.original)) {
          results.push(childNode.original);
          if (results.length >= limit) {
            return;
          }
        }
      }

      this.dfsPhraseSearch(childNode, newPath, results, limit);
      if (results.length >= limit) {
        return;
      }
    }
  }

  /**
   * Удаляет слово из дерева
   */
  delete(word: string): boolean {
    if (!word || word.trim().length === 0) {
      return false;
    }

    const normalizedWord = word.toLowerCase().trim();

    // Проверяем, существует ли слово
    if (!this.search(normalizedWord)) {
      return false;
    }

    // Удаляем слово рекурсивно
    this.deleteWordRecursive(this.wordTrie, normalizedWord, 0);
    return true;
  }

  /**
   * Рекурсивное удаление слова
   */
  private deleteWordRecursive(
    node: TrieNode,
    word: string,
    index: number,
  ): boolean {
    if (index === word.length) {
      // Дошли до конца слова
      if (!node.isEndOfWord) {
        return false;
      }

      node.isEndOfWord = false;

      // Если у узла нет детей, его можно удалить
      return node.children.size === 0;
    }

    const char = word[index];
    const childNode = node.children.get(char);

    if (!childNode) {
      return false;
    }

    const shouldDeleteChild = this.deleteWordRecursive(
      childNode,
      word,
      index + 1,
    );

    if (shouldDeleteChild) {
      node.children.delete(char);
      // Возвращаем true, если узел можно удалить (нет детей и не конец слова)
      return node.children.size === 0 && !node.isEndOfWord;
    }

    return false;
  }

  /**
   * Получает статистику дерева
   */
  getStats(): { totalNodes: number; totalWords: number; totalPhrases: number } {
    const wordStats = this.getTreeStats(this.wordTrie);
    const phraseStats = this.getTreeStats(this.phraseTrie);

    return {
      totalNodes: wordStats.nodes + phraseStats.nodes,
      totalWords: wordStats.words,
      totalPhrases: phraseStats.words,
    };
  }

  /**
   * Получает статистику конкретного дерева
   */
  private getTreeStats(node: TrieNode): { nodes: number; words: number } {
    let nodes = 1;
    let words = node.isEndOfWord ? 1 : 0;

    for (const childNode of node.children.values()) {
      const childStats = this.getTreeStats(childNode);
      nodes += childStats.nodes;
      words += childStats.words;
    }

    return { nodes, words };
  }

  /**
   * Очищает все дерево
   */
  clear(): void {
    this.wordTrie.children.clear();
    this.wordTrie.isEndOfWord = false;

    this.phraseTrie.children.clear();
    this.phraseTrie.isEndOfWord = false;
  }

  /**
   * Демонстрационный метод для загрузки примеров фраз
   */
  loadFishingPhrases(): { message: string; loaded: number } {
    const fishingPhrases = [
      'собираю компанию на рыбалку',
      'собираю команду на рыбалку',
      'собираю друзей на рыбалку',
      'собираю группу рыбаков',
      'собираюсь на рыбалку',
      'соберем компанию рыбаков',
      'соберем команду на рыбалку',
      'создаю группу для рыбалки',
      'создаю команду рыбаков',
      'ищу компанию для рыбалки',
      'ищу команду на рыбалку',
      'ищу партнеров по рыбалке',
      'ищу попутчиков на рыбалку',
      'приглашаю на рыбалку',
      'приглашаю в команду рыбаков',
      'поехали на рыбалку',
      'поехали рыбачить',
      'пойдем на рыбалку',
      'пойдем рыбачить вместе',
      'компания для рыбалки',
      'команда рыбаков',
      'группа рыбаков',
      'рыболовная команда',
      'рыболовная группа',
      'рыбалка с друзьями',
      'рыбалка в компании',
      'рыбалка выходного дня',
      'организую рыбалку',
      'планирую рыбалку',
      'готовлю рыбалку',
    ];

    for (const phrase of fishingPhrases) {
      this.insertPhrase(phrase);
    }

    return {
      message: 'Фразы для рыбалки успешно загружены',
      loaded: fishingPhrases.length,
    };
  }
}
