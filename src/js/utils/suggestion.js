
export function suggest( inquiries, previousId, text ) {
  const patternsNoPreviousId = [];
  const patternsSamePreviousId = [];

  for ( const inquiry of inquiries ) {
    const pattern = match( inquiry.query, text );
    if ( pattern ) {
      if ( inquiry.previous_id === previousId )
        patternsSamePreviousId.push( pattern );
      else if ( inquiry.previous_id === null )
        patternsNoPreviousId.push( pattern );
    }
  }

  // 並び替え
  patternsNoPreviousId.sort( ( x, y ) => x.length - y.length );
  patternsSamePreviousId.sort( ( x, y ) => x.length - y.length );

  // 結合
  let patterns = [ ...patternsSamePreviousId, ...patternsNoPreviousId ];

  // 重複削除
  patterns = patterns.filter( (x, i, self) => self.indexOf(x) === i );

  // 表示するサジェストの数を制限
  patterns = patterns.slice( 0, 4 );
  return patterns;
}


function match( query, text ) {
  const tokens = queryTokenize( '[[' + query + ']]' );

  function f( i, text, matched ) {
    if ( text.length === 0 ) {
      return matched + completeForward( i );
    }

    let nest = 1;
    switch ( tokens[ i ] ) {
      case '[[':
        {
          const result = f( i + 1, text, matched );
          if ( result ) return result;
        }
        // branch
        bracket:
        for ( let j = i + 1; ; ++j ) {
          switch ( tokens[ j ] ) {
            case '[[':
              nest++;
              break;
            case ']]':
              nest--;
              if ( nest > 0 ) {
                break;
              } else {
                break bracket;
              }
            case '|':
              if ( nest === 1 ) {
                const result = f( j + 1, text, matched );
                if ( result ) return result;
              }
              break;
          }
        }
        break;
      case ']]':
        return f( i + 1, text, matched );
      case '|':
        // skip to ]]
        for ( let j = i + 1; ; ++j ) {
          switch ( tokens[ j ] ) {
            case '[[':
              nest++;
              break;
            case ']]':
              nest--;
              if ( nest === 0 ) {
                return f( j + 1, text, matched );
              }
              break;
          }
        }
        throw new Exception();
      default:
        if ( text <= tokens[ i ] ) {
          if ( tokens[ i ].startsWith( text ) ) {
            return matched + tokens[ i ] + completeForward( i + 1 );
          }
        } else {
          if ( text.startsWith( tokens[ i ] ) ) {
            return f( i + 1, text.substr( tokens[ i ].length ), matched + tokens[ i ] );
          }
        }
        break;
    }
    return null;
  }

  function completeBackward(i) {
    let determined = '';
    for (let j = i - 1; 0 <= j; j--) {
      let nest = 1;
      switch (tokens[j]) {
        case '[[':
          break;
        case ']]':
          let k = j;
          while (nest) {
            k--;
            switch (tokens[k]) {
              case '[[':
                nest -= 1;
                break;
              case ']]':
                nest += 1;
                break;
              case '|':
                if (nest === 1) {
                  j = k;
                }
                break;
            }
          }
          break;
        case '|':
          while (nest) {
            j--;
            switch (tokens[j]) {
              case '[[':
                nest -= 1;
                break;
              case ']]':
                nest += 1;
                break;
            }
          }
          break;
        default:
          determined = tokens[j] + determined;
          break;
      }
    }
    return determined;
  }

  function completeForward(i) {
    let determined = '';
    for (let j = i; j < tokens.length; j++) {
      switch (tokens[j]) {
        case '[[':
          break;
        case ']]':
          break;
        case '|':
          let nest = 1;
          while (nest) {
            switch (tokens[j]) {
              case '[[':
                nest += 1;
                break;
              case ']]':
                nest -= 1;
                break;
            }
            j++;
          }
          j--;
          break;
        default:
          determined += tokens[j];
          break;
      }
    }
    return determined;
  }

  for (let i = 0; i < tokens.length; ++i) {
    if (!['[[', ']]', '|'].includes(tokens[i])) {
      const token = tokens[i];
      for (let j = 0; j < token.length; ++j) {
        const len = Math.min( token.length - j, text.length );
        if (token.substr(j, len) === text.substr(0, len)) {
          const result = f(i + 1, text.substr(len), token);
          if (result !== null) {
            return completeBackward(i) + result;
          }
        }
      }
    }
  }
  return null;
}

function queryTokenize( query ) {
  let e = query.search( /\[\[|\||\]\]/ );
  const tokens = [];
  while ( ~e ) {
    tokens.push( query.slice( 0, e ) );
    switch ( query[e] ) {
      case '[':
        tokens.push( '[[' );
        query = query.slice( e + 2 );
        break;
      case ']':
        tokens.push( ']]' );
        query = query.slice( e + 2 );
        break;
      case '|':
        tokens.push( '|' );
        query = query.slice( e + 1 );
        break;
    }
    e = query.search( /\[\[|\||\]\]/ );
  }
  tokens.push( query );
  return tokens;
}
