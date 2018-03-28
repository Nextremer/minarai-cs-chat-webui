import style from "./InputBar.css";
import Suggestion from './Suggestion';
import InputField from './InputField';

@CSSModules( style )
export default class InputBar extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <div styleName="input-bar">
        <Suggestion
          hidden={ !this.props.messageText }
          suggestion={ this.props.suggestion }
          changeMessageText={ this.props.changeMessageText }
          resetSuggestion={ this.props.resetSuggestion }
        />
        <InputField
          messageText={ this.props.messageText }
          inputting={ this.props.inputting }
          changeMessageText={ this.props.changeMessageText }
          sendMessage={ this.props.sendMessage }
          selectFile={ this.props.selectFile }
          inputBegin={ this.props.inputBegin }
          inputEnd={ this.props.inputEnd }
          touchEnd={ this.props.touchEnd }
        />
      </div>
    );
  }
}
