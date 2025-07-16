export { InsertPhrase, InsertWord, SearchResponse, AutocompleteResponse } from './interface/trie-controller.type';
export { TrieNode } from './interface/trie-node.interface';
import { TrieController } from './controllers/trie.controller';

export const trie = new TrieController()
