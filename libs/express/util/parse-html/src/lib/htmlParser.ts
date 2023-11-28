import { ChildNode, Element, ParentNode, Text } from 'domhandler';
import { parseDocument } from 'htmlparser2';

import { CalendarDay, PuzzleNode, elementTags } from '@aon/util-types';

const { NX_AOC_URL = 'https://adventofcode.com' } = process.env;

const getElements = ({ children }: ParentNode, filter: (element: Element) => boolean): Element[] => {
  return children.flatMap(child => {
    let elements = [];
    if (child instanceof Element) {
      filter(child) && elements.push(child);
      elements = elements.concat(getElements(child, filter));
    }
    return elements;
  });
};

export const parseStarCounts = (html: string) => {
  const dayPattern = /calendar-day(\d\d?)/;
  const anchors = getElements(parseDocument(html), ({ attribs }) => dayPattern.test(attribs['class']));
  const starCounts = Array<number>(25);
  for (const element of anchors) {
    const matches = dayPattern.exec(element.attribs['class']);
    if (matches) {
      const day = parseInt(matches[1]);
      starCounts[day - 1] = element.attribs['class']?.split(' ').includes('calendar-verycomplete')
        ? 2
        : element.attribs['class']?.split(' ').includes('calendar-complete')
        ? 1
        : 0;
    }
  }
  return starCounts;
};

const titlePattern = /^--- Day \d\d?: (.*) ---$/;

const addClassName = (attributes: object, newClassName: string) => {
  attributes['className'] = `${attributes['className'] ?? ''} ${newClassName}`.trim();
};

export const parsePuzzle = (html: string, { year, day }: CalendarDay) => {
  const main = getElements(parseDocument(html), ({ tagName }) => tagName === 'main');
  if (main.length !== 1) return undefined;

  let stars = -1;
  let puzzleTitle: string;

  const parseMain = ({ tagName, nodeType, childNodes, attribs }: Element): PuzzleNode => {
    const main = {
      name: tagName,
      nodeType,
      childNodes: parseChildNodes(childNodes),
      attributes: parseAttribs(attribs),
    };
    addClassName(main.attributes, stars === 2 ? 'verycomplete' : stars === 1 ? 'complete' : 'incomplete');
    main.attributes['title'] = puzzleTitle;
    return main;
  };

  const parseElement = ({ tagName, childNodes, attribs, nodeType }: Element): PuzzleNode => {
    const attributes = parseAttribs(attribs);
    const classes = attributes['className']?.split(' ');
    if (classes) {
      if (classes.includes('share')) {
        return {
          name: 'a',
          nodeType,
          childNodes: [{ name: '#text', nodeType: 3, text: '[Share]' }],
          attributes: { href: `${NX_AOC_URL}/${year}/day/${day}`, target: '_blank' },
        };
      } else if (classes.includes('part2')) {
        return {
          name: tagName,
          nodeType,
          childNodes: [
            {
              name: 'a',
              nodeType,
              childNodes: [{ name: '#text', nodeType: 3, text: '--- Part Two ---' }],
              attributes: { href: `${NX_AOC_URL}/${year}/day/${day}#part2`, target: '_blank' },
            },
          ],
          attributes,
        };
      } else if (classes.includes('day-desc') && stars > 1) {
        stars = 1;
      } else if (classes.includes('day-success')) {
        stars = 2;
      }
    }
    return { name: tagName, nodeType, childNodes: parseChildNodes(childNodes), attributes };
  };

  const parseAttribs = (nodeAttributes: Record<string, string>): { [name: string]: string } => {
    const attributes = {};
    let refFlag = false;
    for (const name in nodeAttributes) {
      const value = nodeAttributes[name];
      if (name === 'href') {
        if (/^https?:\/\//.test(value)) {
          addClassName(attributes, `withHref=${encodeURIComponent(value)}`);
        } else {
          const parsedYear = /20\d{2}/.exec(value);
          const dayPath = /(?<!\d)\d\d?(?!\d).*$/.exec(value);
          attributes[name] = `${NX_AOC_URL}/${parsedYear ? parsedYear[0] : year}${dayPath ? `/day/${dayPath[0]}` : ''}`;
        }
        refFlag = true;
      } else if (name === 'class') {
        addClassName(attributes, value);
      } else if (name === 'id' && value === 'part2') {
        attributes['className'] = `${attributes['className'] ?? ''} ${'part2'}`.trim();
      } else if (name === 'title') {
        attributes[name] = value;
      }
    }
    if (refFlag) attributes['target'] = '_blank';
    return attributes;
  };

  const parseChildNodes = (childNodes: ChildNode[]): PuzzleNode[] => {
    return childNodes
      .map(child => {
        if (child instanceof Element && elementTags.includes(child.tagName)) {
          return parseElement(child);
        } else if (child instanceof Text) {
          const title = titlePattern.exec(child.data);
          if (title) {
            puzzleTitle = title[1];
            return { name: '#text', nodeType: child.nodeType, text: `--- ${title[1]} ---` } as const;
          } else {
            return { name: '#text', nodeType: child.nodeType, text: child.data } as const;
          }
        }
        return null;
      })
      .filter(child => !!child);
  };

  return parseMain(main[0]);
};
