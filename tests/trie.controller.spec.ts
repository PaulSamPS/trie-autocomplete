import { TreeController } from '../src/controllers/tree.controller';
import { TreeService } from '../src/services/tree.service';

jest.mock('../src/services/tree.service');

describe('TreeController', () => {
  let controller: TreeController;
  let mockService: jest.Mocked<TreeService>;

  beforeEach(() => {
    controller = new TreeController();
    mockService = (controller as any).trieService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insertWord', () => {
    it('должен успешно добавить слово', () => {
      const wordDto = { word: 'test' };
      mockService.insert.mockReturnValue(undefined);

      const result = controller.insertWord(wordDto);

      expect(mockService.insert).toHaveBeenCalledWith('test');
      expect(result).toEqual({ message: 'Слово "test" успешно добавлено' });
    });

    it('должен обработать ошибку при добавлении слова', () => {
      const wordDto = { word: 'test' };
      mockService.insert.mockImplementation(() => {
        throw new Error('Слово уже существует');
      });

      expect(() => controller.insertWord(wordDto)).toThrow(
        'Ошибка запроса: Слово уже существует',
      );
    });
  });

  describe('insertPhrase', () => {
    it('должен успешно добавить фразу', () => {
      const phraseDto = { phrase: 'test phrase' };
      mockService.insertPhrase.mockReturnValue(undefined);

      const result = controller.insertPhrase(phraseDto);

      expect(mockService.insertPhrase).toHaveBeenCalledWith('test phrase');
      expect(result).toEqual({
        message: 'Фраза "test phrase" успешно добавлена',
      });
    });
  });

  describe('searchWord', () => {
    it('должен найти существующее слово', () => {
      mockService.search.mockReturnValue(true);

      const result = controller.searchWord('test');

      expect(mockService.search).toHaveBeenCalledWith('test');
      expect(result).toEqual({ exists: true, text: 'test' });
    });

    it('должен не найти несуществующее слово', () => {
      mockService.search.mockReturnValue(false);

      const result = controller.searchWord('nonexistent');

      expect(result).toEqual({ exists: false, text: 'nonexistent' });
    });
  });

  describe('searchPhrase', () => {
    it('должен найти существующую фразу', () => {
      mockService.searchPhrase.mockReturnValue(true);

      const result = controller.searchPhrase('test phrase');

      expect(result).toEqual({ exists: true, text: 'test phrase' });
    });
  });

  describe('autocompleteWords', () => {
    it('должен вернуть автодополнения для слов', () => {
      const suggestions = ['test', 'testing'];
      mockService.getWordsWithPrefix.mockReturnValue(suggestions);

      const result = controller.autocompleteWords('te');

      expect(mockService.getWordsWithPrefix).toHaveBeenCalledWith('te', 10);
      expect(result).toEqual({
        prefix: 'te',
        suggestions,
        count: 2,
      });
    });

    it('должен выбросить ошибку при пустом префиксе', () => {
      expect(() => controller.autocompleteWords('')).toThrow(
        'Префикс обязателен для автодополнения',
      );
    });
  });

  describe('autocompletePhrases', () => {
    it('должен вернуть автодополнения для фраз', () => {
      const suggestions = ['test phrase', 'test example'];
      mockService.getPhrasesWithPrefix.mockReturnValue(suggestions);

      const result = controller.autocompletePhrases('test');

      expect(mockService.getPhrasesWithPrefix).toHaveBeenCalledWith('test', 10);
      expect(result).toEqual({
        prefix: 'test',
        suggestions,
        count: 2,
      });
    });
  });

  describe('checkPrefix', () => {
    it('должен вернуть true для существующего префикса', () => {
      mockService.startsWith.mockReturnValue(true);

      const result = controller.checkPrefix('te');

      expect(result).toEqual({ hasWords: true });
    });
  });

  describe('deleteWord', () => {
    it('должен успешно удалить слово', () => {
      mockService.delete.mockReturnValue(true);

      const result = controller.deleteWord('test');

      expect(result).toEqual({ message: 'Слово "test" успешно удалено' });
    });

    it('должен выбросить ошибку для несуществующего слова', () => {
      mockService.delete.mockReturnValue(false);

      expect(() => controller.deleteWord('nonexistent')).toThrow(
        'Слово не найдено',
      );
    });
  });

  describe('getStats', () => {
    it('должен вернуть статистику', () => {
      const stats = {
        totalNodes: 100,
        totalWords: 50,
        totalPhrases: 25,
        totalWordOccurrences: 75,
        totalPhraseOccurrences: 30,
      };
      mockService.getStats.mockReturnValue(stats);

      const result = controller.getStats();

      expect(result).toEqual(stats);
    });
  });

  describe('clearTrie', () => {
    it('должен очистить префиксное дерево', () => {
      mockService.clear.mockReturnValue(undefined);

      const result = controller.clearTrie();

      expect(result).toEqual({ message: 'Префиксное дерево успешно очищено' });
    });
  });

  describe('loadFishingPhrases', () => {
    it('должен загрузить примеры рыболовных фраз', () => {
      const loadResult = { message: 'Фразы загружены', loaded: 15 };
      mockService.loadFishingPhrases.mockReturnValue(loadResult);

      const result = controller.loadFishingPhrases();

      expect(result).toEqual(loadResult);
    });
  });
});
