import style from './ButtonGroup.css';
import config from 'conf';

@CSSModules( style )
export default class VerticalButtonGroup extends React.Component {
  constructor( props ) {
    super( props );
  }

  buttonClicked( index ) {
    this.props.buttonPressed( { buttonGroupProps: this.props, index: index } );
  }

  render() {
    const buttons = this.props.captions.map(( caption, i ) => {
      let style = 'enabled-button';
      if ( this.props.disabled )
        style = 'disabled-button';
      if ( this.props.selectedIndex === i )
        style = 'selected-button';

      if ( config.specialButtonCaptions.includes( caption ) )
        style = 'special-' + style;

      return (
        <div key={ i }
             styleName={ style }
             onClick={ !this.props.disabled ? this.buttonClicked.bind( this, i ) : null } >
          { caption }
        </div>
      );
    });

    return (
      <div styleName={ this.props.style }>
        { buttons }
      </div>
    );
  }
}
