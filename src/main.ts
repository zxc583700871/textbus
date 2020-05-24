import 'core-js';
// import { Observable } from 'rxjs';

// import { createEditor } from './lib/create';
import {
  AudioTemplateTranslator, audioTool,
  blockBackgroundTool, cleanTool,
  CodeTemplateTranslator,
  codeTool,
  Editor, emojiTool, fontFamilyFormatter, fontFamilyTool,
  fontSizeFormatter,
  fontSizeTool, ImageTemplateTranslator, imageTool,
  italicFormatter,
  italicTool,
  letterSpacingFormatter,
  letterSpacingTool,
  lineHeightFormatter,
  lineHeightTool, linkTool,
  olTool,
  strikeThroughFormatter,
  strikeThroughTool,
  subscriptFormatter,
  subscriptTool,
  superscriptFormatter,
  superscriptTool, tableEditTool, TableTemplateTranslator, tableTool, textAlignTool,
  textBackgroundTool,
  textIndentFormatter,
  textIndentTool,
  ulTool,
  underlineFormatter,
  underlineTool, VideoTemplateTranslator, videoTool
} from './lib/public-api';

import './lib/assets/index.scss';

import {
  ListTemplateTranslator,
  BlockTemplateTranslator,
  SingleTemplateTranslator,
  boldFormatter,
  colorFormatter,
  historyBackTool,
  historyForwardTool,
  headingTool,
  boldTool,
  colorTool
} from './lib/public-api';


const editor = new Editor('#editor', {
  templateTranslators: [
    new ListTemplateTranslator('ul'),
    new ListTemplateTranslator('ol'),
    new BlockTemplateTranslator('div'),
    new BlockTemplateTranslator('p'),
    new SingleTemplateTranslator('br'),
    new CodeTemplateTranslator(),
    new AudioTemplateTranslator(),
    new VideoTemplateTranslator(),
    new ImageTemplateTranslator(),
    new TableTemplateTranslator()
  ],
  formatters: [
    fontFamilyFormatter,
    boldFormatter,
    italicFormatter,
    strikeThroughFormatter,
    underlineFormatter,
    fontSizeFormatter,
    lineHeightFormatter,
    letterSpacingFormatter,
    textIndentFormatter,
    colorFormatter,
    subscriptFormatter,
    superscriptFormatter,
  ],
  toolbar: [
    [historyBackTool, historyForwardTool],
    [headingTool],
    [boldTool, italicTool, strikeThroughTool, underlineTool],
    [codeTool],
    [olTool, ulTool],
    [fontSizeTool, lineHeightTool, letterSpacingTool, textIndentTool],
    [subscriptTool, superscriptTool],
    [colorTool, textBackgroundTool, blockBackgroundTool, emojiTool],
    [fontFamilyTool],
    [linkTool, imageTool, audioTool, videoTool],
    [textAlignTool],
    [tableTool, tableEditTool],
    [cleanTool]
  ]
});

editor.setContents(`
<p><strong style="font-family: FangSong">test</strong>54</p>
<ul>
<li>fdsafdsafdsa</li>
</ul>
`);

// const editor = createEditor('#editor', {
//   theme: 'dark',
//   usePaperModel: true,
//   uploader(type: string): string | Promise<string> | Observable<string> {
//     const fileInput = document.createElement('input');
//     fileInput.setAttribute('type', 'file');
//     fileInput.setAttribute('accept', 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon');
//     fileInput.style.cssText = 'position: absolute; left: -9999px; top: -9999px; opacity: 0';
//     document.body.appendChild(fileInput);
//     fileInput.click();
//     return new Promise((resolve) => {
//       setTimeout(() => {
//         resolve('/test')
//       }, 3000)
//     })
//   },
//   content: ``
// });

// editor.updateContentHTML('<p>p1<span>p-span</span></p><span>span3</span><span>span4</span><p>p2</p><span>span1</span><span>span2</span>')
//
// const box = document.getElementById('box');
// editor.onChange.subscribe(result => {
//   console.log(result);
//   box.innerText = result;
// });

// setTimeout(() => {
//   editor.setContents(`<html><body><div>测试</div></body></html>`)
// }, 3000);
