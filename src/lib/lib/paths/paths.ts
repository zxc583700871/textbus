import { Observable, Subject } from 'rxjs';

export class Paths {
  onCheck: Observable<HTMLElement>;
  readonly host = document.createElement('div');
  private checkEvent = new Subject<HTMLElement>();

  constructor() {
    this.onCheck = this.checkEvent.asObservable();
    this.host.classList.add('tanbo-editor-paths');
  }

  update(node: Element) {
    const fragment = document.createDocumentFragment();
    const elements: HTMLElement[] = [];
    while (node) {
      if (node.nodeType !== 1) {
        node = node.parentNode as HTMLElement;
      } else {
        const tagName = node.tagName;
        if (tagName && tagName !== 'HTML') {
          const link = document.createElement('button');
          link.type = 'button';
          link.classList.add('tanbo-editor-paths-link');
          link.innerText = node.nodeName.toLowerCase();
          ((node) => {
            link.onclick = () => {
              this.checkEvent.next(node as HTMLElement);
            };
          })(node);
          elements.push(link);
          node = node.parentNode as HTMLElement;
        } else {
          break;
        }
      }
    }
    let ele = elements.pop();
    while (ele) {
      fragment.appendChild(ele);
      ele = elements.pop();
      if (ele) {
        const split = document.createElement('span');
        split.classList.add('tanbo-editor-paths-split', 'tanbo-editor-icon-arrow-right');
        fragment.appendChild(split);
      }
    }
    this.host.innerHTML = '';
    this.host.appendChild(fragment);
  }
}
