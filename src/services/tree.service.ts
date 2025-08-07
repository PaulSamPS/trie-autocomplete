import { TreeNode } from '../interface/tree-node.interface';
import { TreeStats } from '../interface/tree-stats.interface';

export class TreeService {
  private readonly wordTrie: TreeNode;
  private readonly phraseTrie: TreeNode;
  private readonly WORD_SEPARATOR = '___WORD___';

  constructor() {
    this.wordTrie = this.createNode();
    this.phraseTrie = this.createNode();
  }

  /**
   * Создает новый узел дерева
   */
  private createNode(): TreeNode {
    return {
      isEndOfWord: false,
      children: new Map<string, TreeNode>(),
      count: 0,
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

    // Отмечаем конец слова и увеличиваем счетчик
    currentNode.isEndOfWord = true;
    currentNode.count++;
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

    // Отмечаем конец фразы и увеличиваем счетчик
    if (isComplete) {
      currentNode.isEndOfWord = true;
      currentNode.count++;
      currentNode.original = phrase;
    } else {
      // Для префиксов НЕ отмечаем как конец слова, только добавляем в список префиксов
      if (!currentNode.prefixes) {
        currentNode.prefixes = new Set();
      }
      currentNode.prefixes.add(phrase);
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

    return currentNode.isEndOfWord && currentNode.count > 0;
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

    return currentNode.isEndOfWord && currentNode.count > 0;
  }

  /**
   * Получает количество вхождений слова
   */
  getWordCount(word: string): number {
    if (!word || word.trim().length === 0) {
      return 0;
    }

    const normalizedWord = word.toLowerCase().trim();
    let currentNode = this.wordTrie;

    for (const char of normalizedWord) {
      if (!currentNode.children.has(char)) {
        return 0;
      }
      currentNode = currentNode.children.get(char)!;
    }

    return currentNode.isEndOfWord ? currentNode.count : 0;
  }

  /**
   * Получает количество вхождений фразы
   */
  getPhraseCount(phrase: string): number {
    if (!phrase || phrase.trim().length === 0) {
      return 0;
    }

    const normalizedPhrase = this.normalizeText(phrase);
    const phrasePath = this.phraseToPath(normalizedPhrase);
    let currentNode = this.phraseTrie;

    for (const char of phrasePath) {
      if (!currentNode.children.has(char)) {
        return 0;
      }
      currentNode = currentNode.children.get(char)!;
    }

    return currentNode.isEndOfWord ? currentNode.count : 0;
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

    // Если сам префикс является полной фразой и имеет count > 0, добавляем его
    if (
      currentNode.isEndOfWord &&
      currentNode.original &&
      currentNode.count > 0
    ) {
      results.push(currentNode.original);
    }

    // Ищем все полные фразы, начинающиеся с этого префикса
    this.dfsPhraseSearch(currentNode, phrasePath, results, limit);

    return results.slice(0, limit);
  }

  /**
   * Рекурсивный поиск слов в глубину
   */
  private dfsWordSearch(
    node: TreeNode,
    currentWord: string,
    results: string[],
    limit: number,
  ): void {
    if (results.length >= limit) {
      return;
    }

    if (node.isEndOfWord && node.count > 0) {
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
    node: TreeNode,
    currentPath: string,
    results: string[],
    limit: number,
  ): void {
    if (results.length >= limit) {
      return;
    }

    for (const [char, childNode] of node.children) {
      const newPath = currentPath + char;

      // Добавляем только полные фразы с count > 0
      if (childNode.isEndOfWord && childNode.original && childNode.count > 0) {
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
   * Удаляет слово из дерева (уменьшает счетчик)
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

    let currentNode = this.wordTrie;

    // Находим конечный узел
    for (const char of normalizedWord) {
      currentNode = currentNode.children.get(char)!;
    }

    // Уменьшаем счетчик
    if (currentNode.count > 0) {
      currentNode.count--;

      // Если счетчик стал 0, снимаем флаг конца слова
      if (currentNode.count === 0) {
        currentNode.isEndOfWord = false;
        // Можно добавить логику физического удаления пустых узлов при необходимости
        this.deleteWordRecursive(this.wordTrie, normalizedWord, 0);
      }
    }

    return true;
  }

  /**
   * Удаляет фразу из дерева (уменьшает счетчик)
   */
  deletePhrase(phrase: string): boolean {
    if (!phrase || phrase.trim().length === 0) {
      return false;
    }

    const normalizedPhrase = this.normalizeText(phrase);

    // Проверяем, существует ли фраза
    if (!this.searchPhrase(normalizedPhrase)) {
      return false;
    }

    const phrasePath = this.phraseToPath(normalizedPhrase);
    let currentNode = this.phraseTrie;

    // Находим конечный узел
    for (const char of phrasePath) {
      currentNode = currentNode.children.get(char)!;
    }

    // Уменьшаем счетчик
    if (currentNode.count > 0) {
      currentNode.count--;

      // Если счетчик стал 0, снимаем флаг конца фразы и удаляем original
      if (currentNode.count === 0) {
        currentNode.isEndOfWord = false;
        delete currentNode.original;

        // Также удаляем связанные префиксы
        const words = normalizedPhrase.split(' ');
        for (let i = 1; i < words.length; i++) {
          const prefix = words.slice(0, i).join(' ');
          this.removePrefixFromNodes(prefix);
        }
      }
    }

    return true;
  }

  /**
   * Рекурсивное удаление слова (только если count = 0)
   */
  private deleteWordRecursive(
    node: TreeNode,
    word: string,
    index: number,
  ): boolean {
    if (index === word.length) {
      // Дошли до конца слова
      if (!node.isEndOfWord || node.count > 0) {
        return false;
      }

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
      // Возвращаем true, если узел можно удалить (нет детей и не конец слова с count > 0)
      return (
        node.children.size === 0 && (!node.isEndOfWord || node.count === 0)
      );
    }

    return false;
  }

  /**
   * Удаляет префикс из узлов и очищает пустые узлы
   */
  private removePrefixFromNodes(prefix: string): void {
    const prefixPath = this.phraseToPath(prefix);
    let currentNode = this.phraseTrie;
    const nodePath: { node: TreeNode; char: string; parent: TreeNode }[] = [];

    // Находим путь к узлу префикса
    for (const char of prefixPath) {
      if (!currentNode.children.has(char)) {
        return; // Префикс не найден
      }
      const childNode = currentNode.children.get(char)!;
      nodePath.push({ node: childNode, char, parent: currentNode });
      currentNode = childNode;
    }

    // Удаляем префикс из узла
    if (currentNode.prefixes) {
      currentNode.prefixes.delete(prefix);
      if (currentNode.prefixes.size === 0) {
        delete currentNode.prefixes;
      }
    }

    // Проверяем, можно ли удалить узлы снизу вверх
    for (let i = nodePath.length - 1; i >= 0; i--) {
      const { node, char, parent } = nodePath[i];

      // Узел можно удалить, если:
      // 1. Он не является концом фразы с count > 0
      // 2. У него нет детей
      // 3. У него нет префиксов
      if (
        (!node.isEndOfWord || node.count === 0) &&
        node.children.size === 0 &&
        (!node.prefixes || node.prefixes.size === 0)
      ) {
        parent.children.delete(char);
      } else {
        // Если узел нельзя удалить, прекращаем удаление вверх по дереву
        break;
      }
    }
  }

  /**
   * Получает статистику дерева
   */
  getStats(): TreeStats {
    const wordStats = this.getTreeStats(this.wordTrie);
    const phraseStats = this.getTreeStats(this.phraseTrie);

    return {
      totalNodes: wordStats.nodes + phraseStats.nodes,
      totalWords: wordStats.uniqueWords,
      totalPhrases: phraseStats.uniqueWords,
      totalWordOccurrences: wordStats.totalOccurrences,
      totalPhraseOccurrences: phraseStats.totalOccurrences,
    };
  }

  /**
   * Получает статистику конкретного дерева
   */
  private getTreeStats(node: TreeNode): {
    nodes: number;
    uniqueWords: number;
    totalOccurrences: number;
  } {
    let nodes = 1;
    let uniqueWords = node.isEndOfWord && node.count > 0 ? 1 : 0;
    let totalOccurrences = node.isEndOfWord ? node.count : 0;

    for (const childNode of node.children.values()) {
      const childStats = this.getTreeStats(childNode);
      nodes += childStats.nodes;
      uniqueWords += childStats.uniqueWords;
      totalOccurrences += childStats.totalOccurrences;
    }

    return { nodes, uniqueWords, totalOccurrences };
  }

  /**
   * Очищает все дерево
   */
  clear(): void {
    this.wordTrie.children.clear();
    this.wordTrie.isEndOfWord = false;
    this.wordTrie.count = 0;

    this.phraseTrie.children.clear();
    this.phraseTrie.isEndOfWord = false;
    this.phraseTrie.count = 0;
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
