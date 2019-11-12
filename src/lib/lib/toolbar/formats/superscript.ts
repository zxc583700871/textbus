import { ButtonConfig, HandlerType, inlineHandlerPriority } from '../help';
import { InlineCommander } from '../../commands/inline-commander';

export const superscriptHandler: ButtonConfig = {
  type: HandlerType.Button,
  classes: ['tanbo-editor-icon-superscript'],
  priority: inlineHandlerPriority,
  tooltip: '上标',
  match: {
    tags: ['sup']
  },
  execCommand: new InlineCommander('sup')
};
