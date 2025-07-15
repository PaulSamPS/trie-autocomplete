import { App } from './app';
export { TrieNode } from './interface/trie-node.interface';
export { TrieService } from './services/trie.service';
export { TrieController } from './controllers/trie.controller';

const app = new App();
app.demo();
