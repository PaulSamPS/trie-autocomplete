import { TrieController } from './controllers/trie.controller';

export class App {
  private trieController: TrieController;

  constructor() {
    this.trieController = new TrieController();
  }

  // Пример использования API
  demo(): void {
    // Загружаем демо-данные
    console.log('Loading fishing phrases...');
    const loadResult = this.trieController.loadFishingPhrases();
    console.log(loadResult);

    // Добавляем отдельные слова
    console.log('\nAdding words...');
    this.trieController.insertWord({ word: 'рыбалка' });
    this.trieController.insertWord({ word: 'рыбак' });
    this.trieController.insertWord({ word: 'рыба' });

    // Поиск слов
    console.log('\nSearching words...');
    console.log(this.trieController.searchWord('рыба'));
    console.log(this.trieController.searchWord('несуществующее'));

    // Поиск фраз
    console.log('\nSearching phrases...');
    console.log(this.trieController.searchPhrase('ищу компанию для рыбалки'));
    console.log(this.trieController.searchPhrase('несуществующая фраза'));

    // Автодополнение слов
    console.log('\nWord autocomplete...');
    console.log(this.trieController.autocompleteWords('рыб', 5));

    // Автодополнение фраз
    console.log('\nPhrase autocomplete...');
    console.log(this.trieController.autocompletePhrases('собираю', 5));

    // Статистика
    console.log('\nStats...');
    console.log(this.trieController.getStats());
  }
}
