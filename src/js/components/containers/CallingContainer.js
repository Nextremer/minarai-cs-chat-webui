import { connect } from 'react-redux';
import CallingModal from '../presentators/CallingArea/CallingModal';
import { callingCancel } from '../../actions';

@connect( state => ({
  calling: state.calling.calling
}), {
  callingCancel
})
export default class CallingContainer extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <CallingModal
        calling={ this.props.calling }
        callingCancel={ this.props.callingCancel }
      />
    );
  }
}
