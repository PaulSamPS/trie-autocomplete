import { TreeService } from '../src/services/tree.service';

describe('TreeService', () => {
  let trieService: TreeService;

  beforeEach(() => {
    trieService = new TreeService();
  });

  describe('конструктор', () => {
    it('должен создавать новый экземпляр с пустыми префиксными деревьями', () => {
      expect(trieService).toBeDefined();
      expect(trieService.getStats()).toEqual({
        totalNodes: 2,
        totalWords: 0,
        totalPhrases: 0,
      });
    });
  });

  describe('insert', () => {
    it('успешно добавляет слово', () => {
      trieService.insert('hello');
      expect(trieService.search('hello')).toBe(true);
    });

    it('нормализует и добавляет слова', () => {
      trieService.insert('  HeLLo  ');
      expect(trieService.search('hello')).toBe(true);
      expect(trieService.search('HeLLo')).toBe(true);
    });

    it('добавляет несколько слов', () => {
      trieService.insert('hello');
      trieService.insert('world');
      trieService.insert('help');

      expect(trieService.search('hello')).toBe(true);
      expect(trieService.search('world')).toBe(true);
      expect(trieService.search('help')).toBe(true);
    });

    it('вызывает ошибку для пустого слова', () => {
      expect(() => trieService.insert('')).toThrow(
        'Слово не может быть пустым',
      );
      expect(() => trieService.insert('   ')).toThrow(
        'Слово не может быть пустым',
      );
    });

    it('вызывает ошибку для null или undefined', () => {
      expect(() => trieService.insert(null as any)).toThrow(
        'Слово не может быть пустым',
      );
      expect(() => trieService.insert(undefined as any)).toThrow(
        'Слово не может быть пустым',
      );
    });
  });

  describe('insertPhrase', () => {
    it('успешно добавляет фразу', () => {
      trieService.insertPhrase('hello world');
      expect(trieService.searchPhrase('hello world')).toBe(true);
    });

    it('нормализует и добавляет фразы', () => {
      trieService.insertPhrase('  HeLLo   WoRLd  ');
      expect(trieService.searchPhrase('hello world')).toBe(true);
    });

    it('добавляет префиксы фраз', () => {
      trieService.insertPhrase('hello beautiful world');
      expect(trieService.searchPhrase('hello')).toBe(true);
      expect(trieService.searchPhrase('hello beautiful')).toBe(true);
      expect(trieService.searchPhrase('hello beautiful world')).toBe(true);
    });

    it('вызывает ошибку для пустой фразы', () => {
      expect(() => trieService.insertPhrase('')).toThrow(
        'Фраза не может быть пустой',
      );
      expect(() => trieService.insertPhrase('   ')).toThrow(
        'Фраза не может быть пустой',
      );
    });

    it('вызывает ошибку для null или undefined фразы', () => {
      expect(() => trieService.insertPhrase(null as any)).toThrow(
        'Фраза не может быть пустой',
      );
      expect(() => trieService.insertPhrase(undefined as any)).toThrow(
        'Фраза не может быть пустой',
      );
    });

    it('обрабатывает фразы из одного слова', () => {
      trieService.insertPhrase('hello');
      expect(trieService.searchPhrase('hello')).toBe(true);
    });
  });

  describe('search', () => {
    beforeEach(() => {
      trieService.insert('hello');
      trieService.insert('world');
      trieService.insert('help');
    });

    it('находит существующие слова', () => {
      expect(trieService.search('hello')).toBe(true);
      expect(trieService.search('world')).toBe(true);
      expect(trieService.search('help')).toBe(true);
    });

    it('не находит отсутствующие слова', () => {
      expect(trieService.search('hell')).toBe(false);
      expect(trieService.search('helping')).toBe(false);
      expect(trieService.search('foo')).toBe(false);
    });

    it('работает без учета регистра', () => {
      expect(trieService.search('HELLO')).toBe(true);
      expect(trieService.search('HeLLo')).toBe(true);
    });

    it('обрабатывает пустой или некорректный ввод', () => {
      expect(trieService.search('')).toBe(false);
      expect(trieService.search('   ')).toBe(false);
      expect(trieService.search(null as any)).toBe(false);
      expect(trieService.search(undefined as any)).toBe(false);
    });

    it('игнорирует пробелы вокруг слова', () => {
      expect(trieService.search('  hello  ')).toBe(true);
    });
  });

  describe('searchPhrase', () => {
    beforeEach(() => {
      trieService.insertPhrase('hello world');
      trieService.insertPhrase('hello beautiful world');
    });

    it('находит существующие фразы', () => {
      expect(trieService.searchPhrase('hello world')).toBe(true);
      expect(trieService.searchPhrase('hello beautiful world')).toBe(true);
    });

    it('находит префиксы фраз', () => {
      expect(trieService.searchPhrase('hello')).toBe(true);
      expect(trieService.searchPhrase('hello beautiful')).toBe(true);
    });

    it('не находит отсутствующие фразы', () => {
      expect(trieService.searchPhrase('world hello')).toBe(false);
      expect(trieService.searchPhrase('hello universe')).toBe(false);
    });

    it('работает без учета регистра', () => {
      expect(trieService.searchPhrase('HELLO WORLD')).toBe(true);
      expect(trieService.searchPhrase('HeLLo WoRLd')).toBe(true);
    });

    it('обрабатывает пустой или некорректный ввод', () => {
      expect(trieService.searchPhrase('')).toBe(false);
      expect(trieService.searchPhrase('   ')).toBe(false);
      expect(trieService.searchPhrase(null as any)).toBe(false);
      expect(trieService.searchPhrase(undefined as any)).toBe(false);
    });

    it('нормализует пробелы', () => {
      expect(trieService.searchPhrase('  hello   world  ')).toBe(true);
    });
  });

  describe('startsWith', () => {
    beforeEach(() => {
      trieService.insert('hello');
      trieService.insert('help');
      trieService.insert('world');
    });

    it('находит существующие префиксы', () => {
      expect(trieService.startsWith('he')).toBe(true);
      expect(trieService.startsWith('hel')).toBe(true);
      expect(trieService.startsWith('hell')).toBe(true);
      expect(trieService.startsWith('w')).toBe(true);
    });

    it('не находит отсутствующие префиксы', () => {
      expect(trieService.startsWith('xyz')).toBe(false);
      expect(trieService.startsWith('helping')).toBe(false);
    });

    it('распознает полные слова как префиксы', () => {
      expect(trieService.startsWith('hello')).toBe(true);
      expect(trieService.startsWith('help')).toBe(true);
    });

    it('работает без учета регистра', () => {
      expect(trieService.startsWith('HE')).toBe(true);
      expect(trieService.startsWith('HeLl')).toBe(true);
    });

    it('обрабатывает пустой или некорректный ввод', () => {
      expect(trieService.startsWith('')).toBe(false);
      expect(trieService.startsWith('   ')).toBe(false);
      expect(trieService.startsWith(null as any)).toBe(false);
      expect(trieService.startsWith(undefined as any)).toBe(false);
    });
  });

  describe('getWordsWithPrefix', () => {
    beforeEach(() => {
      trieService.insert('hello');
      trieService.insert('help');
      trieService.insert('helping');
      trieService.insert('helper');
      trieService.insert('world');
    });

    it('возвращает слова с заданным префиксом', () => {
      const results = trieService.getWordsWithPrefix('hel');
      expect(results).toContain('hello');
      expect(results).toContain('help');
      expect(results).toContain('helping');
      expect(results).toContain('helper');
      expect(results).not.toContain('world');
    });

    it('учитывает параметр лимита', () => {
      const results = trieService.getWordsWithPrefix('hel', 2);
      expect(results.length).toBe(2);
    });

    it('возвращает пустой массив для отсутствующего префикса', () => {
      const results = trieService.getWordsWithPrefix('xyz');
      expect(results).toEqual([]);
    });

    it('обрабатывает пустой или некорректный ввод', () => {
      expect(trieService.getWordsWithPrefix('')).toEqual([]);
      expect(trieService.getWordsWithPrefix('   ')).toEqual([]);
      expect(trieService.getWordsWithPrefix(null as any)).toEqual([]);
      expect(trieService.getWordsWithPrefix(undefined as any)).toEqual([]);
    });

    it('использует лимит по умолчанию', () => {
      // Добавляем больше 10 слов для теста
      for (let i = 0; i < 15; i++) {
        trieService.insert(`test${i}`);
      }
      const results = trieService.getWordsWithPrefix('test');
      expect(results.length).toBe(10); // Лимит по умолчанию
    });

    it('работает без учета регистра', () => {
      const results = trieService.getWordsWithPrefix('HEL');
      expect(results).toContain('hello');
      expect(results).toContain('help');
    });
  });

  describe('getPhrasesWithPrefix', () => {
    beforeEach(() => {
      trieService.insertPhrase('hello world');
      trieService.insertPhrase('hello beautiful world');
      trieService.insertPhrase('hello universe');
      trieService.insertPhrase('goodbye world');
    });

    it('возвращает фразы с заданным префиксом', () => {
      const results = trieService.getPhrasesWithPrefix('hello');
      expect(results).toContain('hello world');
      expect(results).toContain('hello beautiful world');
      expect(results).toContain('hello universe');
      expect(results).toContain('hello');
      expect(results).not.toContain('goodbye world');
    });

    it('учитывает параметр лимита', () => {
      const results = trieService.getPhrasesWithPrefix('hello', 2);
      expect(results.length).toBe(2);
    });

    it('возвращает пустой массив для отсутствующего префикса', () => {
      const results = trieService.getPhrasesWithPrefix('xyz');
      expect(results).toEqual([]);
    });

    it('обрабатывает пустой или некорректный ввод', () => {
      expect(trieService.getPhrasesWithPrefix('')).toEqual([]);
      expect(trieService.getPhrasesWithPrefix('   ')).toEqual([]);
      expect(trieService.getPhrasesWithPrefix(null as any)).toEqual([]);
      expect(trieService.getPhrasesWithPrefix(undefined as any)).toEqual([]);
    });

    it('использует лимит по умолчанию', () => {
      // Добавляем больше 10 фраз
      for (let i = 0; i < 15; i++) {
        trieService.insertPhrase(`test phrase ${i}`);
      }
      const results = trieService.getPhrasesWithPrefix('test');
      expect(results.length).toBe(10); // Лимит по умолчанию
    });

    it('работает без учета регистра', () => {
      const results = trieService.getPhrasesWithPrefix('HELLO');
      expect(results).toContain('hello world');
      expect(results).toContain('hello beautiful world');
    });

    it('не возвращает дубликаты', () => {
      const results = trieService.getPhrasesWithPrefix('hello');
      const uniqueResults = [...new Set(results)];
      expect(results.length).toBe(uniqueResults.length);
    });
  });

  describe('delete', () => {
    beforeEach(() => {
      trieService.insert('hello');
      trieService.insert('help');
      trieService.insert('helping');
      trieService.insert('world');
    });

    it('удаляет существующее слово', () => {
      expect(trieService.delete('hello')).toBe(true);
      expect(trieService.search('hello')).toBe(false);
      expect(trieService.search('help')).toBe(true); // Другие слова не затронуты
    });

    it('не удаляет отсутствующее слово', () => {
      expect(trieService.delete('nonexistent')).toBe(false);
    });

    it('обрабатывает пустой или некорректный ввод', () => {
      expect(trieService.delete('')).toBe(false);
      expect(trieService.delete('   ')).toBe(false);
      expect(trieService.delete(null as any)).toBe(false);
      expect(trieService.delete(undefined as any)).toBe(false);
    });

    it('работает без учета регистра', () => {
      expect(trieService.delete('HELLO')).toBe(true);
      expect(trieService.search('hello')).toBe(false);
    });

    it('удаляет слово, являющееся префиксом другого', () => {
      expect(trieService.delete('help')).toBe(true);
      expect(trieService.search('help')).toBe(false);
      expect(trieService.search('helping')).toBe(true); // Должно остаться
    });

    it('удаляет слово, имеющее префикс', () => {
      expect(trieService.delete('helping')).toBe(true);
      expect(trieService.search('helping')).toBe(false);
      expect(trieService.search('help')).toBe(true); // Должно остаться
    });
  });

  describe('getStats', () => {
    it('возвращает корректную статистику для пустого дерева', () => {
      const stats = trieService.getStats();
      expect(stats.totalNodes).toBe(2); // Корневые узлы
      expect(stats.totalWords).toBe(0);
      expect(stats.totalPhrases).toBe(0);
    });

    it('возвращает корректную статистику после добавления слов', () => {
      trieService.insert('hello');
      trieService.insert('help');

      const stats = trieService.getStats();
      expect(stats.totalWords).toBe(2);
      expect(stats.totalNodes).toBeGreaterThan(2);
    });

    it('возвращает корректную статистику после добавления фраз', () => {
      trieService.insertPhrase('hello world');
      trieService.insertPhrase('hello universe');

      const stats = trieService.getStats();
      expect(stats.totalPhrases).toBe(3); // hello, hello world, hello universe
      expect(stats.totalNodes).toBeGreaterThan(2);
    });

    it('возвращает корректную статистику при смешанных операциях', () => {
      trieService.insert('hello');
      trieService.insertPhrase('hello world');

      const stats = trieService.getStats();
      expect(stats.totalWords).toBe(1);
      expect(stats.totalPhrases).toBe(2); // hello, hello world
    });
  });

  describe('clear', () => {
    it('полностью очищает все данные', () => {
      trieService.insert('hello');
      trieService.insert('world');
      trieService.insertPhrase('hello world');

      trieService.clear();

      expect(trieService.search('hello')).toBe(false);
      expect(trieService.search('world')).toBe(false);
      expect(trieService.searchPhrase('hello world')).toBe(false);

      const stats = trieService.getStats();
      expect(stats.totalWords).toBe(0);
      expect(stats.totalPhrases).toBe(0);
      expect(stats.totalNodes).toBe(2);
    });
  });

  describe('loadFishingPhrases', () => {
    it('успешно загружает фразы для рыбалки', () => {
      const result = trieService.loadFishingPhrases();

      expect(result.message).toBe('Фразы для рыбалки успешно загружены');
      expect(result.loaded).toBe(30);

      // Проверка некоторых фраз
      expect(trieService.searchPhrase('собираю компанию на рыбалку')).toBe(
        true,
      );
      expect(trieService.searchPhrase('ищу компанию для рыбалки')).toBe(true);
      expect(trieService.searchPhrase('поехали на рыбалку')).toBe(true);
    });

    it('позволяет искать фразы для рыбалки по префиксу', () => {
      trieService.loadFishingPhrases();

      const results = trieService.getPhrasesWithPrefix('собираю');
      expect(results.length).toBeGreaterThan(0);
      expect(results.some((phrase) => phrase.includes('рыбалку'))).toBe(true);
    });
  });

  describe('крайние случаи и интеграция', () => {
    it('обрабатывает специальные символы в словах', () => {
      trieService.insert('hello-world');
      trieService.insert('test@example');

      expect(trieService.search('hello-world')).toBe(true);
      expect(trieService.search('test@example')).toBe(true);
    });

    it('обрабатывает цифры в словах', () => {
      trieService.insert('test123');
      trieService.insert('123test');

      expect(trieService.search('test123')).toBe(true);
      expect(trieService.search('123test')).toBe(true);
    });

    it('обрабатывает очень длинные слова', () => {
      const longWord = 'a'.repeat(1000);
      trieService.insert(longWord);

      expect(trieService.search(longWord)).toBe(true);
    });

    it('обрабатывает очень длинные фразы', () => {
      const longPhrase = 'word '.repeat(100).trim();
      trieService.insertPhrase(longPhrase);

      expect(trieService.searchPhrase(longPhrase)).toBe(true);
    });

    it('обрабатывает множественные пробелы во фразах', () => {
      trieService.insertPhrase('hello    world    test');

      expect(trieService.searchPhrase('hello world test')).toBe(true);
    });
  });
});
