
export function escape( str ) {
  return (str.replace(/&/g, '&amp;')
             .replace(/"/g, '&quot;')
             .replace(/'/g, '&#x27;')
             .replace(/</g, '&lt;')
             .replace(/>/g, '&gt;')
             .replace(/\//g, '&#x2F;')
             .replace(/\\/g, '&#x5C;')
             .replace(/`/g, '&#96;'));
}

export function htmlize( str ) {
  return escape( str ).replace( /\n/g, '<br>');
}

export function mdToHtml( md ) {
  return md.split( /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|https?:\/\/[^\s)]+)/g )
           .map( part => {
             const match = part.match( /^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/ );
             if ( match ) {
               const url = escape( match[2] );
               const caption = htmlize( match[1] );
               return `<a href="${ url }" target="_blank">${ caption }<\a>`;
             }
             if ( part.match( /^https?:\/\/[^\s)]+$/ ) ) {
               const url = escape( part );
               return `<a href="${ url }" target="_blank">${ url }<\a>`;
             }
             return htmlize( part );
           } )
           .join( '' );
}
