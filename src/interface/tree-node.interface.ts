export interface TreeNode {
  isEndOfWord: boolean;
  children: Map<string, TreeNode>;
  count: number;
  original?: string;
  prefixes?: Set<string>;
}
