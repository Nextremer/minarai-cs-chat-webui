import style from './Contents.css';
import TimelineContainer from '../containers/TimelineContainer';
import NotificationContainer from '../containers/NotificationContainer';
import InputContainer from '../containers/InputContainer';
import FileUploadContainer from '../containers/FileUploadContainer';
import GalleryContainer from '../containers/GalleryContainer';
import CallingContainer from '../containers/CallingContainer';

@CSSModules( style )
export default class Contents extends React.Component {

  constructor( props ) {
    super( props );
  }

  render() {
    return(
      <div styleName="section">
        <TimelineContainer />
        <NotificationContainer />
        <InputContainer />
        <FileUploadContainer />
        <GalleryContainer />
        <CallingContainer />
      </div>
    );
  }
}
