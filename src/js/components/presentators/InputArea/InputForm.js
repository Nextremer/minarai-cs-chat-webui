import style from "./InputForm.css";
import Suggestion from './Suggestion';
import InputField from './InputField';

@CSSModules( style )
export default class InputForm extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <div styleName="input-form">
        <Suggestion
          hidden={ !this.props.messageText }
          suggestion={ this.props.suggestion }
          changeMessageText={ this.props.changeMessageText }
        />
        <InputField
          messageText={ this.props.messageText }
          changeMessageText={ this.props.changeMessageText }
          sendMessage={ this.props.sendMessage }
          selectFile={ this.props.selectFile }
        />
      </div>
    );
  }
}
