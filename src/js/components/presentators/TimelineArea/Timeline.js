import { animateScroll, Element } from 'react-scroll';
import style from './Timeline.css';
import Balloon from './Entry/Balloon';
import File from './Entry/File';
import ButtonGroup from './Entry/ButtonGroup';
import FormTemplateButton from './Entry/FormTemplateButton';
import MessageBar from './Entry/MessageBar';
import config from 'conf';


@CSSModules( style, { allowMultiple: true } )
export default class Timeline extends React.Component {
  constructor( props ) {
    super( props );
  }

  componentDidMount() {
    window.addEventListener( 'scroll', () => {
      let scrollingElement = null;
      let scrollHeight = null;
      let bottom = null;

      // https://stackoverflow.com/questions/45061901/chrome-61-body-doesnt-scroll
      if ( document.scrollingElement ) {
        scrollingElement = document.scrollingElement;
        scrollHeight = document.scrollingElement.scrollHeight;
        bottom = window.innerHeight + document.scrollingElement.scrollTop;
      } else {
        scrollingElement = document.body;
        scrollHeight = document.documentElement.scrollHeight;
        bottom = window.innerHeight + document.documentElement.scrollTop;
      }

      const offset = 20;
      const scrolledToBottom = scrollHeight <= bottom + offset;
      
      if ( scrolledToBottom !== this.props.scrolledToBottom ) {
        this.props.setScrolledToBottom( scrolledToBottom );
      }

      const scrolledToTop = scrollingElement.scrollTop == 0;

      if ( scrolledToTop !== this.props.scrolledToTop ) {
        this.props.setScrolledToTop( scrolledToTop );
      }
    } );
  }

  makeEntry( data ) {
    const isLeft = data.speaker !== "user";
    let faceIcon = {
      bot: config.assets.faceBotUrls[ data.entry.face || 'normal' ],
      operator: config.assets.faceOperatorDefaultUrl,
      user: config.assets.faceUserUrl,
    }[ data.speaker ];

    if ( window.minaraiConfig ) {
      faceIcon = {
        bot: window.minaraiConfig.icons.botIconPath,
        operator: window.minaraiConfig.icons.botIconPath,
        user: window.minaraiConfig.icons.userIconPath,
      }[ data.speaker ];
    }

    switch ( data.entry.type ) {
      case 'balloon':
        return (
          <div styleName="entry-container">
            <div styleName={ isLeft ? "left-face" : "right-face" }
                 style={ { backgroundImage: `url(${ faceIcon })` } }></div>
            <Balloon
              speaker={ data.speaker }
              html={ data.entry.html }
            />
          </div>
        );

      case 'figure':
      case 'file':
        const isImage = data.entry.url.search( /\.(png|jpe?g|gif)/i ) > -1 ||
            data.entry.url.search(/^data:.*base64.*/) > -1;
        return (
          <div styleName="entry-container">
            <div styleName={ isLeft ? "left-face" : "right-face" }
                 style={ { backgroundImage: `url(${ faceIcon })` } }></div>
            <File
              speaker={ data.speaker }
              url={ data.entry.url }
              isImage={ isImage }
              openGallery={ this.props.openGallery }
            />
          </div>
        );

      case 'verticalButtons':
        return (
          <ButtonGroup
            style="vertical-buttons"
            captions={ data.entry.captions }
            commands={ data.entry.commands }
            disabled={ data.entry.disabled !== undefined ? data.entry.disabled : false }
            selectedIndex={ data.entry.selectedIndex !== undefined ? data.entry.selectedIndex : null }
            buttonPressed={ this.props.buttonPressed }
          />
        );

      case 'horizontalButtons':
        return (
          <ButtonGroup
            style="horizontal-buttons"
            captions={ data.entry.captions }
            commands={ data.entry.commands }
            disabled={ data.entry.disabled !== undefined ? data.entry.disabled : false }
            selectedIndex={ data.entry.selectedIndex !== undefined ? data.entry.selectedIndex : null }
            buttonPressed={ this.props.buttonPressed }
          />
        );

      case 'formTemplate':
        return (
          <FormTemplateButton
            fields={ data.entry.fields }
            setFormTemplate={ this.props.setFormTemplate }
          />
        );

      case 'metaMessage':
        return (
          <MessageBar
            text={ data.entry.text }
          />
        );
    }
  }

  render() {
    const entries = this.props.entries.map(( entry, i ) => {
      if ( entry.invisible ) {
        return null;
      }

      if ( entry === this.props.destination ) {
        return (
          <Element name="destination" key={ i }>
            { this.makeEntry( entry ) }
          </Element>
        );
      } else {
        return this.makeEntry( entry );
      }
    });

    if ( this.props.pendingEntry !== null ) {
      entries.push(
        <div>{ this.makeEntry( this.props.pendingEntry ) }</div>
      );
    }

    const historyLoader = this.props.retrieveHistoryLocked ? (
      <div styleName="history-loader">
        <div styleName="spinner">
          <div styleName="bounce1"></div>
          <div styleName="bounce2"></div>
          <div styleName="bounce3"></div>
        </div>
      </div>
    ) : (
      <div styleName="history-loader">
        <div styleName="history-loader-button"
             onClick={ this.props.retrieveHistory.bind( this, true ) }>
          ログを取得
        </div>
      </div>
    );

    return (
      <div
        id="timeline"
        styleName="timeline"
        onTouchEnd={ this.props.touchEnd.bind( this ) }
      >
        { !this.props.logCompleted ? historyLoader : null }
        { entries }
      </div>
    );
  }
}
