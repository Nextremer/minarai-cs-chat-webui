import { connect } from 'react-redux';
import Timeline from '../presentators/TimelineArea/Timeline';
import { sendMessage, sendCommand, buttonPressed, openGallery, setFormTemplate, setScrolledToBottom,
  setScrolledToTop, retrieveHistory, touchEnd } from '../../actions';

@connect( state => ({
  entries: state.timeline.entries,
  pendingEntry: state.timeline.pendingEntry,
  destination: state.timeline.destination,
  scrolledToBottom: state.timeline.scrolledToBottom,
  scrolledToTop: state.timeline.scrolledToTop,
  logCompleted: state.timeline.logCompleted,
  retrieveHistoryLocked: state.timeline.retrieveHistoryLocked
}), {
  sendMessage,
  sendCommand,
  buttonPressed,
  openGallery,
  setFormTemplate,
  setScrolledToBottom,
  setScrolledToTop,
  retrieveHistory,
  touchEnd
})
export default class TimelineContainer extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <Timeline
        entries={ this.props.entries }
        pendingEntry={ this.props.pendingEntry }
        destination={ this.props.destination }
        scrolledToBottom={ this.props.scrolledToBottom }
        scrolledToTop={ this.props.scrolledToTop }
        sendMessage={ this.props.sendMessage }
        sendCommand={ this.props.sendCommand }
        buttonPressed={ this.props.buttonPressed }
        openGallery={ this.props.openGallery }
        setFormTemplate={ this.props.setFormTemplate }
        setScrolledToBottom={ this.props.setScrolledToBottom }
        setScrolledToTop={ this.props.setScrolledToTop }
        logCompleted={ this.props.logCompleted }
        retrieveHistory={ this.props.retrieveHistory }
        retrieveHistoryLocked={ this.props.retrieveHistoryLocked }
        touchEnd={ this.props.touchEnd }
      />
    );
  }
}
