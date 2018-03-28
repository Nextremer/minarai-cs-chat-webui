import style from "./Suggestion.css";

@CSSModules( style, { allowMultiple: true } )
export default class Suggestion extends React.Component {
  constructor( props ) {
    super( props );
  }

  suggestionClicked( text ) {
    this.props.changeMessageText( text );
    this.props.resetSuggestion();
  }

  render() {
    const hidden = this.props.hidden ? 'hidden' : '';
    const items = this.props.suggestion.suggestions.map(( suggestion, i ) => {
      return (
        <div key={ i } onClick={ this.suggestionClicked.bind( this, suggestion ) }>
          { suggestion }
        </div>
      );
    });

    return (
      <div styleName= { "suggestion " + hidden }>
        { items }
      </div>
    );
  }
}
