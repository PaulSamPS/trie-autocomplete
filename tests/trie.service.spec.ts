import { TreeService } from '../src/services/tree.service';

describe('TreeService', () => {
  let trieService: TreeService;

  beforeEach(() => {
    trieService = new TreeService();
  });

  describe('insert', () => {
    it('успешно добавляет слово', () => {
      trieService.insert('hello');
      expect(trieService.search('hello')).toBe(true);
    });

    it('нормализует слова перед добавлением', () => {
      trieService.insert('  HeLLo  ');
      expect(trieService.search('hello')).toBe(true);
    });

    it('вызывает ошибку для пустого слова', () => {
      expect(() => trieService.insert('')).toThrow(
        'Слово не может быть пустым',
      );
      expect(() => trieService.insert('   ')).toThrow(
        'Слово не может быть пустым',
      );
    });
  });

  describe('insertPhrase', () => {
    it('успешно добавляет фразу', () => {
      trieService.insertPhrase('hello world');
      expect(trieService.searchPhrase('hello world')).toBe(true);
    });

    it('нормализует фразы перед добавлением', () => {
      trieService.insertPhrase('  HeLLo   WoRLd  ');
      expect(trieService.searchPhrase('hello world')).toBe(true);
    });

    it('вызывает ошибку для пустой фразы', () => {
      expect(() => trieService.insertPhrase('')).toThrow(
        'Фраза не может быть пустой',
      );
    });
  });

  describe('search', () => {
    beforeEach(() => {
      trieService.insert('hello');
      trieService.insert('help');
    });

    it('находит существующие слова', () => {
      expect(trieService.search('hello')).toBe(true);
      expect(trieService.search('help')).toBe(true);
    });

    it('не находит отсутствующие слова', () => {
      expect(trieService.search('hell')).toBe(false);
      expect(trieService.search('foo')).toBe(false);
    });

    it('работает без учета регистра', () => {
      expect(trieService.search('HELLO')).toBe(true);
    });

    it('возвращает false для пустого ввода', () => {
      expect(trieService.search('')).toBe(false);
      expect(trieService.search('   ')).toBe(false);
    });
  });

  describe('searchPhrase', () => {
    beforeEach(() => {
      trieService.insertPhrase('hello world');
    });

    it('находит существующие фразы', () => {
      expect(trieService.searchPhrase('hello world')).toBe(true);
    });

    it('не находит отсутствующие фразы', () => {
      expect(trieService.searchPhrase('world hello')).toBe(false);
    });

    it('работает без учета регистра', () => {
      expect(trieService.searchPhrase('HELLO WORLD')).toBe(true);
    });
  });

  describe('startsWith', () => {
    beforeEach(() => {
      trieService.insert('hello');
      trieService.insert('help');
    });

    it('находит существующие префиксы', () => {
      expect(trieService.startsWith('he')).toBe(true);
      expect(trieService.startsWith('hel')).toBe(true);
    });

    it('не находит отсутствующие префиксы', () => {
      expect(trieService.startsWith('xyz')).toBe(false);
    });

    it('возвращает false для пустого ввода', () => {
      expect(trieService.startsWith('')).toBe(false);
    });
  });

  describe('getWordsWithPrefix', () => {
    beforeEach(() => {
      trieService.insert('hello');
      trieService.insert('help');
      trieService.insert('world');
    });

    it('возвращает слова с заданным префиксом', () => {
      const results = trieService.getWordsWithPrefix('hel');
      expect(results).toContain('hello');
      expect(results).toContain('help');
      expect(results).not.toContain('world');
    });

    it('учитывает лимит', () => {
      const results = trieService.getWordsWithPrefix('hel', 1);
      expect(results.length).toBe(1);
    });

    it('возвращает пустой массив для отсутствующего префикса', () => {
      const results = trieService.getWordsWithPrefix('xyz');
      expect(results).toEqual([]);
    });
  });

  describe('getPhrasesWithPrefix', () => {
    beforeEach(() => {
      trieService.insertPhrase('hello world');
      trieService.insertPhrase('hello universe');
    });

    it('возвращает фразы с заданным префиксом', () => {
      const results = trieService.getPhrasesWithPrefix('hello');
      expect(results).toContain('hello world');
      expect(results).toContain('hello universe');
    });

    it('учитывает лимит', () => {
      const results = trieService.getPhrasesWithPrefix('hello', 1);
      expect(results.length).toBe(1);
    });

    it('возвращает пустой массив для отсутствующего префикса', () => {
      const results = trieService.getPhrasesWithPrefix('xyz');
      expect(results).toEqual([]);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      trieService.insert('hello');
      trieService.insert('help');
    });

    it('удаляет существующее слово', () => {
      expect(trieService.delete('hello')).toBe(true);
      expect(trieService.search('hello')).toBe(false);
      expect(trieService.search('help')).toBe(true);
    });

    it('не удаляет отсутствующее слово', () => {
      expect(trieService.delete('nonexistent')).toBe(false);
    });

    it('возвращает false для пустого ввода', () => {
      expect(trieService.delete('')).toBe(false);
    });
  });

  describe('getStats', () => {
    it('возвращает статистику для пустого дерева', () => {
      const stats = trieService.getStats();
      expect(stats.totalWords).toBe(0);
      expect(stats.totalPhrases).toBe(0);
      expect(stats.totalNodes).toBe(2);
    });

    it('возвращает корректную статистику после добавления', () => {
      trieService.insert('hello');
      trieService.insertPhrase('hello world');

      const stats = trieService.getStats();
      expect(stats.totalWords).toBe(1);
      expect(stats.totalPhrases).toBe(1);
      expect(stats.totalNodes).toBeGreaterThan(2);
    });
  });

  describe('clear', () => {
    it('очищает все данные', () => {
      trieService.insert('hello');
      trieService.insertPhrase('hello world');

      trieService.clear();

      expect(trieService.search('hello')).toBe(false);
      expect(trieService.searchPhrase('hello world')).toBe(false);

      const stats = trieService.getStats();
      expect(stats.totalWords).toBe(0);
      expect(stats.totalPhrases).toBe(0);
    });
  });

  describe('loadFishingPhrases', () => {
    it('загружает фразы для рыбалки', () => {
      const result = trieService.loadFishingPhrases();

      expect(result.loaded).toBeGreaterThan(0);
      expect(result.message).toContain('успешно загружены');
    });
  });
});
