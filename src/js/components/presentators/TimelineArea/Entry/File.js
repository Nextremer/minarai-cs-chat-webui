import style from './File.css';
import config from 'conf';

@CSSModules( style )
export default class File extends React.Component {
  constructor( props ) {
    super( props );
  }

  clicked( url ) {
    this.props.openGallery( { url } );
  }

  render() {
    const url = this.props.url;
    const isImage = this.props.isImage;
    const imageUrl = isImage ? url : config.assets.fileIconUrl;

    return (
      <div styleName={ this.props.speaker || "bot" }>
        <img
          styleName={ isImage ? "image-file" : "other-file" }
          src={ imageUrl }
          onClick={ this.clicked.bind( this, imageUrl ) }
        />
      </div>
    );
  }
}
