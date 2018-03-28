import { connect } from 'react-redux';
import UploadDialog from '../presentators/UploadArea/UploadDialog';
import { fileUpload, fileUploadCancel } from '../../actions';

@connect( state => ({
  fileForUpload: state.fileUpload.fileForUpload,
  dataUrl: state.fileUpload.dataUrl,
  uploadStatus: state.fileUpload.uploadStatus,
  clientId: state.dialog.socket.minaraiClient.clientId
}), {
  fileUpload,
  fileUploadCancel
})
export default class FileUploadContainer extends React.Component {
  constructor( props ) {
    super( props );
  }

  fileUpload() {
    this.props.fileUpload( {
      clientId: this.props.clientId,
      file: this.props.fileForUpload
    } );
  }

  render() {
    return (
      <UploadDialog
        dataUrl={ this.props.dataUrl }
        fileUpload={ this.fileUpload.bind( this ) }
        fileUploadCancel={ this.props.fileUploadCancel }
        fileForUpload={ this.props.fileForUpload }
        uploadStatus={ this.props.uploadStatus }
      />
    );
  }
}
