export interface TreeNode {
  isEndOfWord: boolean;
  children: Map<string, TreeNode>;
  original?: string;
  prefixes?: Set<string>;
}
