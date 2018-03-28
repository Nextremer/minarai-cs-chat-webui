import style from './CallingModal.css';

@CSSModules( style )
export default class CallingModal extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    if ( !this.props.calling ) {
      return null;
    }

    return (
      <div>
        <div styleName="grayout">
          <div styleName="upper-area">
            <div styleName="upper-area-content">
              <div styleName="message">
                オペレーターを呼び出しています<br />
                しばらくお待ちください
              </div>
              <div styleName="waiting-animation">
                <div styleName="spinner">
                  <div styleName="bounce1"></div>
                  <div styleName="bounce2"></div>
                  <div styleName="bounce3"></div>
                </div>
              </div>
            </div>
          </div>
          <div styleName="lower-area">
            <div styleName="button" onClick={ this.props.callingCancel }>
              接続をキャンセル
            </div>
          </div>
        </div>
      </div>
    );
  }
}
