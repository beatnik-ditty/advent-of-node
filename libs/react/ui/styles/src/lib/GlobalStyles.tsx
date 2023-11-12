import { Global } from '@emotion/react';

export const GlobalStyles = () => (
  <Global
    styles={ [
      {
        /* latin */
        '@font-face': {
          fontFamily: 'Source Code Pro',
          fontStyle: 'normal',
          fontWeight: 300,
          src:
            'url(' +
            'https://fonts.gstatic.com/s/sourcecodepro/v23/HI_diYsKILxRpg3hIP6sJ7fM7PqPMcMnZFqUwX28DJKQtMlrTA.woff2' +
            ") format('woff2')",
          unicodeRange: [
            'U+0000-00FF',
            'U+0131',
            'U+0152-0153',
            'U+02BB-02BC',
            'U+02C6',
            'U+02DA',
            'U+02DC',
            'U+0304',
            'U+0308',
            'U+0329',
            'U+2000-206F',
            'U+2074',
            'U+20AC',
            'U+2122',
            'U+2191',
            'U+2193',
            'U+2212',
            'U+2215',
            'U+FEFF',
            'U+FFFD',
          ].join(', '),
        },
      },

      /* greek */ {
        '@font-face': {
          fontFamily: 'Source Code Pro',
          fontStyle: 'normal',
          fontWeight: 300,
          src:
            'url' +
            '(https://fonts.gstatic.com/s/sourcecodepro/v23/HI_diYsKILxRpg3hIP6sJ7fM7PqPMcMnZFqUwX28DJKQtMprTEUc.woff2' +
            ") format('woff2')",
          unicodeRange: [
            'U+0100-02AF',
            'U+0304',
            'U+0308',
            'U+0329',
            'U+0370-03FF',
            'U+1E00-1E9F',
            'U+1EF2-1EFF',
            'U+2020',
            'U+20A0-20AB',
            'U+20AD-20CF',
            'U+2113',
            'U+2C60-2C7F',
            'U+0370-03FF',
            'U+A720-A7FF',
          ].join(', '),
        },
      },
      {
        'html, body, #root': {
          margin: 'auto',
          width: '100%',
          height: '100%',
        },
      },
      {
        body: {
          overflow: 'hidden',
          verticalAlign: 'middle',
          background: '#0f0f24',
          userSelect: 'none',
          fontWeight: 300,
        },
        div: {
          fontSize: '2vmin',
          fontFamily: "'Source Code Pro', monospace",
          width: '100%',
          height: '100%',
          boxSizing: 'border-box',
        },
        '#tooltip-container': {
          height: 0,
        },
      },
    ] }
  />
);
