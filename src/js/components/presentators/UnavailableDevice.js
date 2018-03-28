import style from './UnavailableDevice.css';


@CSSModules( style )
export default class UnavailableDevice extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <div styleName="container">
        <div styleName="section">
          <p>いつも（アプリ名）をご利用いただきありがとうございます。<br />
          大変恐れ入りますが、お客様がご利用されている端末ではチャット機能をご利用いただくことができません。</p>
        </div>

        <div styleName="section">
          <p>お手数ではございますが、下記窓口よりメールにてお問い合わせくださいますようお願いいたします。</p>
          <p><a href="#">dummy@nextremer.com</a></p>
        </div>

        <div styleName="section">
          <h2>ご利用可能な端末</h2>
          <h3>OS</h3>
          <ul>
            <li>Android 4.1以上</li>
            <li>iOS 7.0以上</li>
          </ul>
          <h3>Webブラウザ</h3>
          <ul>
            <li>Google Chrome</li>
            <li>Firefox</li>
            <li>Opera</li>
            <li>Safari （iOS のみ）</li>
          </ul>
        </div>

        <div styleName="section">
          <h2>注意事項</h2>
          <ul styleName="list_sentence">
            <li>返信の際はお問い合わせ頂いたメールアドレスへのみ返信をいたします。</li>
            <li>メール受信設定により、サポートからの返信が受信できない場合がございます。<br />
            お手数ではございますが、「@～ドメイン」の受信許可設定を行なってください。</li>
            <li>お客様からのメールを受信いたしましたら、受領確認のための自動返信メールが送信されます。<br />
            上記メールが届かない場合はドメイン設定をご確認いただくか、迷惑メールフォルダに振り分けられていないかご確認くださいますようお願いいたします。</li>
          </ul>
        </div>
      </div>
    );
  }
}
