import style from './UploadDialog.css';

@CSSModules( style, { allowMultiple: true } )
export default class UploadDialog extends React.Component {
  constructor( props ) {
    super( props );
  }

  cancel() {
    if ( ['ready', 'failed'].includes( this.props.uploadStatus ) ) {
      this.props.fileUploadCancel();
    }
  }

  upload() {
    if ( ['ready', 'failed'].includes( this.props.uploadStatus ) ) {
      this.props.fileUpload();
    }
  }

  render() {
    if ( this.props.uploadStatus === 'no file' ) {
      return null;
    }

    const fileName = this.props.fileForUpload.name;
    const extension = ~fileName.indexOf( '.' ) ? fileName.slice( fileName.lastIndexOf( '.' ) ).toLowerCase() : '';
    const preview = ['.jpg', '.jpeg', '.png', '.gif'].includes( extension ) && this.props.dataUrl ? (
      <img styleName="image" src={ this.props.dataUrl }/>
    ) : (
      <div styleName="no-image">no image</div>
    );

    const uploadStatus = this.props.uploadStatus;
    const message = {
      'uploading': 'アップロード中...',
      'ready': 'ファイルをアップロードします',
      'failed': 'アップロードに失敗しました',
    }[ uploadStatus ];

    return (
      <div styleName="grayout">
        <div styleName="upload-dialog">
          <div>
           <div styleName={ "header" + (uploadStatus === "failed" ? " header-red" : "") }>
             { message }
            </div>
            { preview }
            <div>{ this.props.fileForUpload.name }</div>
          </div>
          <div styleName="footer">
            <div styleName={ "cancel-button" + (uploadStatus === "uploading" ? " cancel-button-disabled" : "") }
                 onClick={ this.cancel.bind(this) }>
              キャンセル
            </div>
            <div styleName="upload-button" onClick={ this.upload.bind(this) }>
              {
                uploadStatus === 'uploading' ?
                (
                  <div styleName="spinner">
                    <div styleName="bounce1"></div>
                    <div styleName="bounce2"></div>
                    <div styleName="bounce3"></div>
                  </div>
                ) :
                <span>アップロード</span>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}
