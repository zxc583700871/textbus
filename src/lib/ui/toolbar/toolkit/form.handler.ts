import { Tool, ToolFactoryParams } from '../help';
import { HighlightState, ToolFactory } from '../help';
import { SelectionMatchState } from '../matcher/_api';
import { UIKit, FileUploader } from '../../_api';
import { DropdownToolConfig, DropdownViewer } from './dropdown.handler';
import { I18n } from '../../../i18n';

export interface FormViewer extends DropdownViewer {
  setFileUploader(fileUploader: FileUploader): void;
}

export interface FormToolConfig extends DropdownToolConfig {
  menuFactory(i18n: I18n): FormViewer;
}

export class FormTool implements ToolFactory {
  constructor(private config: FormToolConfig) {
  }

  create(params: ToolFactoryParams, addTool: (tool: Tool) => void): HTMLElement {
    const {i18n, dialog, uploader} = params;
    const config = {
      ...this.config,
      label: typeof this.config.label === 'function' ? this.config.label(i18n) : this.config.label,
      tooltip: typeof this.config.tooltip === 'function' ? this.config.tooltip(i18n) : this.config.tooltip
    };
    const viewer = config.menuFactory(i18n);
    const button = UIKit.button({
      ...config,
      onChecked: () => {
        dialog.dialog(viewer.elementRef);
        const s = viewer.onComplete.subscribe(() => {
          dialog.close();
          s.unsubscribe();
        })
        const b = viewer.onClose?.subscribe(() => {
          dialog.close();
          s.unsubscribe();
          b.unsubscribe();
        });
      }
    });
    if (typeof viewer.setFileUploader === 'function') {
      viewer.setFileUploader(uploader);
    }
    addTool({
      keymaps: [],
      onAction: viewer.onComplete,
      commander: config.commanderFactory(),
      matcher: config.matcher,
      refreshState(selectionMatchState: SelectionMatchState): void {
        viewer.update(selectionMatchState.matchData);
        switch (selectionMatchState.state) {
          case HighlightState.Highlight:
            button.disabled = false;
            button.highlight = true;
            break;
          case HighlightState.Normal:
            button.disabled = false;
            button.highlight = false;
            break;
          case HighlightState.Disabled:
            button.disabled = true;
            button.highlight = false;
            break
        }
      }
    })
    return button.elementRef;
  }
}
