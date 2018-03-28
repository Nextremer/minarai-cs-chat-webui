import style from './Balloon.css';

@CSSModules( style )
export default class Balloon extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    const isLeft = this.props.speaker !== "user";
    return (
      <div styleName={ isLeft ? "left-balloon" : "right-balloon" }
           dangerouslySetInnerHTML={{__html: this.props.html}}>
      </div>
    );
  }
}
