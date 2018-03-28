import style from './MessageBar.css';

@CSSModules( style )
export default class MessageBar extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <div styleName="message-bar">
        { this.props.text }
      </div>
    );
  }
}
