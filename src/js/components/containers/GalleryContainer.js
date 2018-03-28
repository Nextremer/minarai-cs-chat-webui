import { connect } from 'react-redux';
import GalleryModal from '../presentators/GalleryArea/GalleryModal';
import { closeGallery } from '../../actions';

@connect( state => ({
  url: state.gallery.url
}), {
  closeGallery
})
export default class GalleryContainer extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <GalleryModal
        url={ this.props.url }
        closeGallery={ this.props.closeGallery }
      />
    );
  }
}
