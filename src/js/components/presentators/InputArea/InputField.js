import style from "./InputField.css";
import Textarea from 'react-textarea-autosize';
import { iOS } from '../../../utils/deviceSuitability';

@CSSModules( style, { allowMultiple: true } )
export default class InputField extends React.Component {
  constructor( props ) {
    super( props );
  }

  focused() {
    this.props.inputBegin();
  }

  blurred() {
    // 送信ボタンを押すと、blur イベントが先に発生して、ボタンが元の位置に戻った後に
    // click イベントが発生するらしい（タップした位置に送信ボタンが無くなっている）
    // なので、click イベントの処理を先に終わらせるために inputEnd を遅らせる
    // (inputField の下部にマージンが挿入されている iOS 固有)
    if ( iOS ) {
      setTimeout( () => {
        this.props.inputEnd();
      }, 100 );
    } else {
      this.props.inputEnd();
    }
  }

  changeText( e ) {
    const text = e.target.value;
    if (e.target.value.length > 1000) {
      alert('1000文字を超えるメッセージは登録出来ません');
    } else {
      this.props.changeMessageText( text );
    }
  }

  keyDown( e ) {
    if ( !e.shiftKey && e.keyCode === 13 ) {
      this.sendMessage();
      e.preventDefault();
    }
  }

  fileSelected( e ) {
    if ( e.target.files.length === 1)
      this.props.selectFile( e.target.files[0] );
  }

  sendMessage() {
    const messageText = this.props.messageText.trim();

    if ( messageText ) {
      this.props.sendMessage( messageText );
      this.props.changeMessageText( '' );
    }
  }

  render() {
    const imeMargin = iOS ? (
      <div
        styleName={ this.props.inputting ? " ime-margin-on" : "ime-margin-off" }
        onTouchEnd={ this.props.touchEnd.bind( this ) }
      ></div>
    ) : null;

    return (
      <div>
        <div styleName="input-bar">
        <label styleName="plus">
          <div>
            <i className="fa fa-plus"></i>
          </div>
          <input type="file"
                 accept="image/*"   // Android では accept="image/gif,image/jpeg,image/png" を指定すると
                                    // なぜか任意のファイルをアップロードできるようになる
                 value="" // <- これがないと同じファイルを連続して選択したときに onChange が呼ばれない
                 onChange={ this.fileSelected.bind( this ) } />
        </label>
        <Textarea
          styleName="textbox"
          maxRows={ 10 }
          value={ this.props.messageText }
          onChange={ this.changeText.bind( this ) }
          onKeyDown= { this.keyDown.bind( this ) }
          onFocus={ this.focused.bind( this ) }
          onBlur={ this.blurred.bind( this ) }
          placeholder="質問内容を入力する"
        />
        <div
          styleName={ "send-button" + ( this.props.messageText === "" ? " disabled" : "") }
          onClick={ this.sendMessage.bind( this ) }
        >
          <i className="fa fa-send"></i>
        </div>
        </div>
        { imeMargin }
      </div>
    );
  }
}
