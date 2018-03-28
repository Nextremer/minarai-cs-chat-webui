import style from './GalleryModal.css';

@CSSModules( style )
export default class GalleryModal extends React.Component {
  constructor( props ) {
    super( props );
  }

  clicked( e ) {
    if ( [ 'gallery-grayout', 'gallery-close-button', 'gallery-close-font' ].includes( e.target.id ) ) {
      this.props.closeGallery();
    }
  }

  render() {
    if ( !this.props.url ) {
      return null;
    }

    return (
      <div>
        <div id="gallery-grayout" styleName="grayout" onClick={ this.clicked.bind( this ) }>
          <div styleName="gallery-modal">
            <div id="gallery-close-button" styleName="close">
              <i id="gallery-close-font" className="fa fa-times"></i>
            </div>
            <img styleName="gallery-image" src={ this.props.url } />
          </div>
        </div>
      </div>
    );
  }
}
