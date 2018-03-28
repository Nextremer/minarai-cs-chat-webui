import style from './FormTemplateButton.css';

@CSSModules( style )
export default class FormTemplateButton extends React.Component {
  constructor( props ) {
    super( props );
  }

  buttonClicked() {
    this.props.setFormTemplate( this.props.fields );
  }

  render() {
    const body = this.props.fields.join( '・' );

    return (
      <div styleName="form-template-button" onClick={ this.buttonClicked.bind( this ) } >
        <div styleName="instruction">
          タップして回答
        </div>
        <div styleName="body">
          { body }
        </div>
      </div>
    );
  }
}
