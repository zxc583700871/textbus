import { Formatter } from './formatter';
import { dtd } from '../editor/dtd';

export class BlockFormatter extends Formatter {
  readonly document: Document;
  private rawTagKey = '__tanbo_editor_raw_tag__';

  constructor(private tagName: string) {
    super();
  }

  format(doc: Document): Range {
    (this as { document: Document }).document = doc;
    const selection = doc.getSelection();
    const range = selection.getRangeAt(0);
    const tag = this.tagName;
    const parentTagContainer = this.matchContainerByTagName(
      range.commonAncestorContainer as HTMLElement,
      tag,
      this.document.body) as HTMLElement;
    if (parentTagContainer) {
      console.log('b1');
      const cacheMark = this.splitBySelectedRange(range, range.commonAncestorContainer);
      const parent = parentTagContainer.parentNode;
      const block = this.findBlockContainer(range.commonAncestorContainer as HTMLElement, parentTagContainer);
      const containerRange = doc.createRange();
      const nextSibling = parentTagContainer.nextSibling;
      const rawTag = parentTagContainer[this.rawTagKey];
      if (parentTagContainer === block) {
        containerRange.selectNodeContents(block);
      } else {
        containerRange.selectNode(block);
      }

      const {before, current, after, startMark, endMark} = this.splitBySelectedRange(containerRange, parentTagContainer);

      const beforeContents = before.extractContents();
      const afterContents = after.extractContents();

      if (nextSibling) {
        if (beforeContents.textContent) {
          parent.insertBefore(beforeContents, nextSibling);
        }
        if (rawTag) {
          const wrapper = this.document.createElement(rawTag);
          wrapper.appendChild(current.extractContents());
          parent.insertBefore(wrapper, nextSibling);
        } else {
          parent.insertBefore(current.extractContents(), nextSibling);
        }
        if (afterContents.textContent) {
          parent.insertBefore(afterContents, nextSibling);
        }
      } else {
        if (beforeContents.textContent) {
          parent.appendChild(beforeContents);
        }
        if (rawTag) {
          const wrapper = doc.createElement(rawTag);
          wrapper.appendChild(current.extractContents());
          parent.insertBefore(wrapper, nextSibling);
        } else {
          parent.insertBefore(current.extractContents(), nextSibling);
        }
        if (afterContents.textContent) {
          parent.appendChild(afterContents);
        }
      }
      const s = this.findEmptyContainer(cacheMark.startMark);
      const e = this.findEmptyContainer(cacheMark.endMark);
      range.setStartAfter(s);
      range.setEndBefore(e);
      s.parentNode.removeChild(s);
      e.parentNode.removeChild(e);
      const ss = this.findEmptyContainer(startMark);
      const ee = this.findEmptyContainer(endMark);
      ss.parentNode.removeChild(ss);
      ee.parentNode.removeChild(ee);
    } else {

      console.log('b2');
      const {startMark, current, endMark} = this.splitBySelectedRange(range, range.commonAncestorContainer);
      const containerRange = doc.createRange();
      const container = this.findBlockContainer(range.commonAncestorContainer, doc.body);
      containerRange.selectNodeContents(container);
      const newContainer = doc.createElement(tag);
      containerRange.surroundContents(newContainer);
      console.log(container);
      if (container !== doc.body) {
        newContainer[this.rawTagKey] = (container as HTMLElement).tagName;
        container.parentNode.replaceChild(newContainer, container);
      } else {
        newContainer[this.rawTagKey] = tag;
      }

      const s = this.findEmptyContainer(startMark);
      const e = this.findEmptyContainer(endMark);
      current.setStartAfter(s);
      current.setEndBefore(e);
      s.parentNode.removeChild(s);
      e.parentNode.removeChild(e);
    }
    return range;
  }
}
