import { connect } from 'react-redux';
import InputBar from '../presentators/InputArea/InputBar';
import { changeMessageText, sendMessage, selectFile, resetSuggestion,
  inputBegin, inputEnd, touchEnd } from '../../actions';

@connect( state => ({
  messageText: state.messageText,
  suggestion: state.suggestion,
  inputting: state.inputField.inputting
}), {
  changeMessageText,
  sendMessage,
  selectFile,
  resetSuggestion,
  inputBegin,
  inputEnd,
  touchEnd
})
export default class InputContainer extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <div>
        <InputBar
          hidden={ !this.props.messageText }
          messageText={ this.props.messageText }
          suggestion={ this.props.suggestion }
          inputting={ this.props.inputting }
          changeMessageText={ this.props.changeMessageText }
          sendMessage={ this.props.sendMessage }
          selectFile={ this.props.selectFile }
          resetSuggestion={ this.props.resetSuggestion }
          inputBegin={ this.props.inputBegin }
          inputEnd={ this.props.inputEnd }
          touchEnd={ this.props.touchEnd }
        />
      </div>
    );
  }
}
