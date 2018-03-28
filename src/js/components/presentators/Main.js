import { connect } from 'react-redux';
import Contents from './Contents';
import style from './Main.css';
import config from 'conf';

@CSSModules( style, { allowMultiple: true } )
export default class Main extends React.Component {
  constructor( props ) {
    super( props );
  }

  render() {
    return (
      <div styleName="main">
        <div styleName="main-background"
             style={ { backgroundImage: `url(${ config.assets.backgroundImgUrl })` } }>
        </div>
        <Contents />
      </div>
    );
  }
}
