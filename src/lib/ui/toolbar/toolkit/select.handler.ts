import { Subject } from 'rxjs';

import { I18nString, Tool, ToolFactory, ToolFactoryParams } from '../help';
import { HighlightState } from '../help';
import { Commander } from '../commander';
import { Keymap, FormatData, AbstractComponent } from '../../../core/_api';
import { Matcher, SelectionMatchState } from '../matcher/_api';
import { UIKit } from '../../uikit/uikit';

/**
 * Select 工具选项配置项
 */
export interface SelectOptionConfig {
  /** 当前选项被选中后，要应用的值 */
  value: any;
  /** 当前选项显示的文字，如为空则显示 value */
  label?: I18nString;
  /** 给当前选项添加一组 css class 类 */
  classes?: string[];
  /** 给当前选项添加 icon css class 类 */
  iconClasses?: string[];
  /** 当所有选项都未锚中时，显示的默认项 */
  default?: boolean;
  /** 当前选项应用的快捷键 */
  keymap?: Keymap;
}

export interface SelectToolConfig {
  /** 当前 Select 某项点击后，应用的命令 */
  commanderFactory(): Commander;

  /** Select 的可选项配置 */
  options: SelectOptionConfig[];

  /** 根据当前匹配的抽象数据，返回要高亮的选项 */
  matchOption?<T = FormatData | AbstractComponent>(data: T): SelectOptionConfig;

  /** 锚中节点的的匹配项配置 */
  matcher?: Matcher;
  /** 给 Select 控件添加一组 css class */
  classes?: string[];
  /** 给 select 控件添加一组 icon css class 类 */
  iconClasses?: string[];
  /** 设置当前 Select 是否根据内容扩展宽度 */
  mini?: boolean;
  /** 当鼠标放在控件上的提示文字 */
  tooltip?: I18nString;
}

export class SelectTool implements ToolFactory {
  constructor(private config: SelectToolConfig) {
  }

  create(params: ToolFactoryParams, addTool: (tool: Tool) => void): HTMLElement {
    const {i18n, limitElement} = params;
    const config = {
      ...this.config,
      tooltip: typeof this.config.tooltip === 'function' ? this.config.tooltip(i18n) : this.config.tooltip,
      options: this.config.options.map(option => {
        return {
          ...option,
          label: typeof option.label === 'function' ? option.label(i18n) : option.label
        }
      })
    }
    const subject = new Subject();
    const obs = subject.asObservable();
    const dropdown = UIKit.select({
      ...config,
      stickyElement: limitElement,
      onSelected: (value: any) => {
        subject.next(value);
      }
    })
    addTool({
      commander: config.commanderFactory(),
      onAction: obs,
      keymaps: config.options.filter(i => i.keymap).map(i => {
        return {
          keymap: i.keymap,
          action() {
            if (!dropdown.disabled) {
              subject.next(i.value);
            }
          }
        }
      }),
      matcher: config.matcher,
      refreshState(selectionMatchState: SelectionMatchState): void {
        if (selectionMatchState.matchData) {
          const option = config.matchOption?.(selectionMatchState.matchData);
          if (option) {
            dropdown.button.label.innerText = option.label || option.value;
            dropdown.disabled = false;
            dropdown.highlight = true;
            return;
          }
        }
        dropdown.highlight = false;
        dropdown.disabled = selectionMatchState.state === HighlightState.Disabled;
        let defaultOption: SelectOptionConfig;
        for (const op of config.options) {
          if (op.default) {
            defaultOption = op;
            break;
          }
        }
        if (defaultOption) {
          dropdown.button.label.innerText = defaultOption.label || defaultOption.value;
        }
      }
    })
    return dropdown.elementRef;
  }
}
