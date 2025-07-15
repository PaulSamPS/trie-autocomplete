export interface TrieNode {
  isEndOfWord: boolean;
  children: Map<string, TrieNode>;
  original?: string;
}
