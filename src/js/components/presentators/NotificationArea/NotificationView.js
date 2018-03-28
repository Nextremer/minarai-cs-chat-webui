import style from "./NotificationView.css";

@CSSModules( style, { allowMultiple: true } )
export default class NotificationView extends React.Component {
  constructor( props ) {
    super( props );
  }

  hide() {
    this.props.hideNotificationView();
  }

  render() {
    return (
      <div styleName={ "notification-view " + ( this.props.hidden ? "hidden" : "" ) }>
        <div styleName="notification-body">
          <div
            styleName="notification-content"
            dangerouslySetInnerHTML={{ __html: this.props.html }}
          ></div>
          <div styleName="notification-close">
            <div onClick={ this.hide.bind( this ) } >
              <i className="fa fa-times"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
