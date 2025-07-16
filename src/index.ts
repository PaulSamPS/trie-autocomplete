export {
  InsertPhrase,
  InsertWord,
  SearchResponse,
  AutocompleteResponse,
} from './interface/tree-controller.interface';
export { TreeNode } from './interface/tree-node.interface';
export { TreeStats } from './interface/tree-stats.interface';
import { TreeController } from './controllers/tree.controller';

export const tree = new TreeController();
