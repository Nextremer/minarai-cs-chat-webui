import { connect } from 'react-redux';
import NotificationView from '../presentators/NotificationArea/NotificationView';
import { hideNotificationView } from '../../actions';

@connect( state => ({
  html: state.notification.html,
  hidden: state.notification.hidden
}), {
  hideNotificationView
})
export default class NotificationContainer extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <NotificationView
        html={ this.props.html }
        hidden={ this.props.hidden }
        hideNotificationView={ this.props.hideNotificationView }
      />
    );
  }
}
