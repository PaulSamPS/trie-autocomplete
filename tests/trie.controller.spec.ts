// Мокаем TreeService

import { TreeController } from '../src/controllers/tree.controller';
import { TreeService } from '../src/services/tree.service';

jest.mock('../src/services/tree.service');

describe('TreeController', () => {
  let trieController: TreeController;
  let mockTrieService: jest.Mocked<TreeService>;

  beforeEach(() => {
    // Создаем новый экземпляр контроллера перед каждым тестом
    trieController = new TreeController();
    mockTrieService = (trieController as any).trieService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insertWord', () => {
    it('должен успешно добавить слово', () => {
      const wordDto = { word: 'test' };
      mockTrieService.insert.mockReturnValue(undefined);

      const result = trieController.insertWord(wordDto);

      expect(mockTrieService.insert).toHaveBeenCalledWith('test');
      expect(result).toEqual({ message: 'Слово "test" успешно добавлено' });
    });

    it('должен обработать ошибку при добавлении слова', () => {
      const wordDto = { word: 'test' };
      const errorMessage = 'Слово уже существует';
      mockTrieService.insert.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      expect(() => trieController.insertWord(wordDto)).toThrow(
        `Ошибка запроса: ${errorMessage}`,
      );
      expect(mockTrieService.insert).toHaveBeenCalledWith('test');
    });

    it('должен обработать неизвестную ошибку', () => {
      const wordDto = { word: 'test' };
      mockTrieService.insert.mockImplementation(() => {
        throw 'Неизвестная ошибка';
      });

      expect(() => trieController.insertWord(wordDto)).toThrow(
        'Ошибка запроса: Неизвестная ошибка',
      );
    });
  });

  describe('insertPhrase', () => {
    it('должен успешно добавить фразу', () => {
      const phraseDto = { phrase: 'test phrase' };
      mockTrieService.insertPhrase.mockReturnValue(undefined);

      const result = trieController.insertPhrase(phraseDto);

      expect(mockTrieService.insertPhrase).toHaveBeenCalledWith('test phrase');
      expect(result).toEqual({
        message: 'Фраза "test phrase" успешно добавлена',
      });
    });

    it('должен обработать ошибку при добавлении фразы', () => {
      const phraseDto = { phrase: 'test phrase' };
      const errorMessage = 'Фраза уже существует';
      mockTrieService.insertPhrase.mockImplementation(() => {
        throw new Error(errorMessage);
      });

      expect(() => trieController.insertPhrase(phraseDto)).toThrow(
        `Ошибка запроса: ${errorMessage}`,
      );
      expect(mockTrieService.insertPhrase).toHaveBeenCalledWith('test phrase');
    });
  });

  describe('searchWord', () => {
    it('должен найти существующее слово', () => {
      const word = 'test';
      mockTrieService.search.mockReturnValue(true);

      const result = trieController.searchWord(word);

      expect(mockTrieService.search).toHaveBeenCalledWith(word);
      expect(result).toEqual({
        exists: true,
        text: word,
      });
    });

    it('должен не найти несуществующее слово', () => {
      const word = 'nonexistent';
      mockTrieService.search.mockReturnValue(false);

      const result = trieController.searchWord(word);

      expect(mockTrieService.search).toHaveBeenCalledWith(word);
      expect(result).toEqual({
        exists: false,
        text: word,
      });
    });
  });

  describe('searchPhrase', () => {
    it('должен найти существующую фразу', () => {
      const phrase = 'test phrase';
      mockTrieService.searchPhrase.mockReturnValue(true);

      const result = trieController.searchPhrase(phrase);

      expect(mockTrieService.searchPhrase).toHaveBeenCalledWith(phrase);
      expect(result).toEqual({
        exists: true,
        text: phrase,
      });
    });

    it('должен не найти несуществующую фразу', () => {
      const phrase = 'nonexistent phrase';
      mockTrieService.searchPhrase.mockReturnValue(false);

      const result = trieController.searchPhrase(phrase);

      expect(mockTrieService.searchPhrase).toHaveBeenCalledWith(phrase);
      expect(result).toEqual({
        exists: false,
        text: phrase,
      });
    });
  });

  describe('autocompleteWords', () => {
    it('должен вернуть автодополнения для слов с лимитом по умолчанию', () => {
      const prefix = 'te';
      const suggestions = ['test', 'text', 'testing'];
      mockTrieService.getWordsWithPrefix.mockReturnValue(suggestions);

      const result = trieController.autocompleteWords(prefix);

      expect(mockTrieService.getWordsWithPrefix).toHaveBeenCalledWith(
        prefix,
        10,
      );
      expect(result).toEqual({
        prefix,
        suggestions,
        count: suggestions.length,
      });
    });

    it('должен вернуть автодополнения для слов с указанным лимитом', () => {
      const prefix = 'te';
      const limit = 5;
      const suggestions = ['test', 'text'];
      mockTrieService.getWordsWithPrefix.mockReturnValue(suggestions);

      const result = trieController.autocompleteWords(prefix, limit);

      expect(mockTrieService.getWordsWithPrefix).toHaveBeenCalledWith(
        prefix,
        limit,
      );
      expect(result).toEqual({
        prefix,
        suggestions,
        count: suggestions.length,
      });
    });

    it('должен выбросить ошибку при пустом префиксе', () => {
      expect(() => trieController.autocompleteWords('')).toThrow(
        'Префикс обязателен для автодополнения',
      );
      expect(mockTrieService.getWordsWithPrefix).not.toHaveBeenCalled();
    });

    it('должен обработать пустой массив предложений', () => {
      const prefix = 'xyz';
      mockTrieService.getWordsWithPrefix.mockReturnValue([]);

      const result = trieController.autocompleteWords(prefix);

      expect(result).toEqual({
        prefix,
        suggestions: [],
        count: 0,
      });
    });
  });

  describe('autocompletePhrases', () => {
    it('должен вернуть автодополнения для фраз с лимитом по умолчанию', () => {
      const prefix = 'test';
      const suggestions = ['test phrase', 'test example'];
      mockTrieService.getPhrasesWithPrefix.mockReturnValue(suggestions);

      const result = trieController.autocompletePhrases(prefix);

      expect(mockTrieService.getPhrasesWithPrefix).toHaveBeenCalledWith(
        prefix,
        10,
      );
      expect(result).toEqual({
        prefix,
        suggestions,
        count: suggestions.length,
      });
    });

    it('должен вернуть автодополнения для фраз с указанным лимитом', () => {
      const prefix = 'test';
      const limit = 3;
      const suggestions = ['test phrase'];
      mockTrieService.getPhrasesWithPrefix.mockReturnValue(suggestions);

      const result = trieController.autocompletePhrases(prefix, limit);

      expect(mockTrieService.getPhrasesWithPrefix).toHaveBeenCalledWith(
        prefix,
        limit,
      );
      expect(result).toEqual({
        prefix,
        suggestions,
        count: suggestions.length,
      });
    });

    it('должен выбросить ошибку при пустом префиксе', () => {
      expect(() => trieController.autocompletePhrases('')).toThrow(
        'Префикс обязателен для автодополнения',
      );
      expect(mockTrieService.getPhrasesWithPrefix).not.toHaveBeenCalled();
    });
  });

  describe('checkPrefix', () => {
    it('должен вернуть true для существующего префикса', () => {
      const prefix = 'te';
      mockTrieService.startsWith.mockReturnValue(true);

      const result = trieController.checkPrefix(prefix);

      expect(mockTrieService.startsWith).toHaveBeenCalledWith(prefix);
      expect(result).toEqual({ hasWords: true });
    });

    it('должен вернуть false для несуществующего префикса', () => {
      const prefix = 'xyz';
      mockTrieService.startsWith.mockReturnValue(false);

      const result = trieController.checkPrefix(prefix);

      expect(mockTrieService.startsWith).toHaveBeenCalledWith(prefix);
      expect(result).toEqual({ hasWords: false });
    });
  });

  describe('deleteWord', () => {
    it('должен успешно удалить слово', () => {
      const word = 'test';
      mockTrieService.delete.mockReturnValue(true);

      const result = trieController.deleteWord(word);

      expect(mockTrieService.delete).toHaveBeenCalledWith(word);
      expect(result).toEqual({ message: `Слово "${word}" успешно удалено` });
    });

    it('должен выбросить ошибку при попытке удалить несуществующее слово', () => {
      const word = 'nonexistent';
      mockTrieService.delete.mockReturnValue(false);

      expect(() => trieController.deleteWord(word)).toThrow('Слово не найдено');
      expect(mockTrieService.delete).toHaveBeenCalledWith(word);
    });
  });

  describe('getStats', () => {
    it('должен вернуть статистику', () => {
      const stats = {
        totalNodes: 100,
        totalWords: 50,
        totalPhrases: 25,
      };
      mockTrieService.getStats.mockReturnValue(stats);

      const result = trieController.getStats();

      expect(mockTrieService.getStats).toHaveBeenCalled();
      expect(result).toEqual(stats);
    });
  });

  describe('clearTrie', () => {
    it('должен очистить префиксное дерево', () => {
      mockTrieService.clear.mockReturnValue(undefined);

      const result = trieController.clearTrie();

      expect(mockTrieService.clear).toHaveBeenCalled();
      expect(result).toEqual({ message: 'Префиксное дерево успешно очищено' });
    });
  });

  describe('loadFishingPhrases', () => {
    it('должен загрузить примеры рыболовных фраз', () => {
      const loadResult = {
        message: 'Фразы загружены',
        loaded: 15,
      };
      mockTrieService.loadFishingPhrases.mockReturnValue(loadResult);

      const result = trieController.loadFishingPhrases();

      expect(mockTrieService.loadFishingPhrases).toHaveBeenCalled();
      expect(result).toEqual(loadResult);
    });
  });

  // Интеграционные тесты с мокированием поведения
  describe('Integration tests', () => {
    let integrationController: TreeController;
    let integrationMockService: jest.Mocked<TreeService>;

    beforeEach(() => {
      jest.clearAllMocks();
      integrationController = new TreeController();
      integrationMockService = (integrationController as any).trieService;
    });

    it('должен работать весь цикл: добавление, поиск, автодополнение, удаление', () => {
      // Настраиваем моки для симуляции реального поведения
      const words = new Set<string>();

      // Мокируем insert для отслеживания добавленных слов
      integrationMockService.insert.mockImplementation((word: string) => {
        words.add(word);
      });

      // Мокируем search для проверки существования слов
      integrationMockService.search.mockImplementation((word: string) => {
        return words.has(word);
      });

      // Мокируем getWordsWithPrefix для автодополнения
      integrationMockService.getWordsWithPrefix.mockImplementation(
        (prefix: string) => {
          return Array.from(words).filter((word) => word.startsWith(prefix));
        },
      );

      // Мокируем startsWith для проверки префикса
      integrationMockService.startsWith.mockImplementation((prefix: string) => {
        return Array.from(words).some((word) => word.startsWith(prefix));
      });

      // Мокируем delete для удаления слов
      integrationMockService.delete.mockImplementation((word: string) => {
        const existed = words.has(word);
        words.delete(word);
        return existed;
      });

      // Мокируем clear для очистки
      integrationMockService.clear.mockImplementation(() => {
        words.clear();
      });

      // Добавляем слова
      integrationController.insertWord({ word: 'test' });
      integrationController.insertWord({ word: 'testing' });
      integrationController.insertWord({ word: 'text' });

      // Проверяем поиск
      expect(integrationController.searchWord('test').exists).toBe(true);
      expect(integrationController.searchWord('nonexistent').exists).toBe(
        false,
      );

      // Проверяем автодополнение
      const autocomplete = integrationController.autocompleteWords('te');
      expect(autocomplete.suggestions).toContain('test');
      expect(autocomplete.suggestions).toContain('testing');
      expect(autocomplete.suggestions).toContain('text');

      // Проверяем префикс
      expect(integrationController.checkPrefix('te').hasWords).toBe(true);
      expect(integrationController.checkPrefix('xyz').hasWords).toBe(false);

      // Удаляем слово
      integrationController.deleteWord('test');
      expect(integrationController.searchWord('test').exists).toBe(false);

      // Очищаем все
      integrationController.clearTrie();
      expect(
        integrationController.autocompleteWords('te').suggestions,
      ).toHaveLength(0);
    });

    it('должен работать с фразами', () => {
      // Настраиваем моки для фраз
      const phrases = new Set<string>();

      // Мокируем insertPhrase для отслеживания добавленных фраз
      integrationMockService.insertPhrase.mockImplementation(
        (phrase: string) => {
          phrases.add(phrase);
        },
      );

      // Мокируем searchPhrase для проверки существования фраз
      integrationMockService.searchPhrase.mockImplementation(
        (phrase: string) => {
          return phrases.has(phrase);
        },
      );

      // Мокируем getPhrasesWithPrefix для автодополнения фраз
      integrationMockService.getPhrasesWithPrefix.mockImplementation(
        (prefix: string) => {
          return Array.from(phrases).filter((phrase) =>
            phrase.startsWith(prefix),
          );
        },
      );

      // Добавляем фразы
      integrationController.insertPhrase({ phrase: 'test phrase' });
      integrationController.insertPhrase({ phrase: 'test example' });

      // Проверяем поиск фраз
      expect(integrationController.searchPhrase('test phrase').exists).toBe(
        true,
      );
      expect(
        integrationController.searchPhrase('nonexistent phrase').exists,
      ).toBe(false);

      // Проверяем автодополнение фраз
      const autocomplete = integrationController.autocompletePhrases('test');
      expect(autocomplete.suggestions).toContain('test phrase');
      expect(autocomplete.suggestions).toContain('test example');
      expect(autocomplete.count).toBe(2);
    });
  });
});
