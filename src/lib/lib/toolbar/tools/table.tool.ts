import { Form } from '../forms/form';
import { AttrType } from '../forms/help';
import { TableCommander } from '../commands/table.commander';
import { Toolkit } from '../toolkit/toolkit';
import { PreComponent } from '../../components/pre.component';
import { TableMatcher } from '../matcher/table.matcher';

export const tableTool = Toolkit.makeDropdownTool({
  classes: ['tbus-icon-table'],
  tooltip: '表格',
  menuFactory() {
    return new Form([{
      type: AttrType.TextField,
      required: true,
      name: 'rows',
      label: '表格行数',
      placeholder: '请输入表格行数'
    }, {
      type: AttrType.TextField,
      required: true,
      name: 'cols',
      label: '表格列数',
      placeholder: '请输入表格列数'
    }]);
  },
  matcher: new TableMatcher([PreComponent]),
  commanderFactory() {
    return new TableCommander();
  }
});
