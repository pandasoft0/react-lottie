import React from 'react';
import PropTypes from 'prop-types';
import bodymovin from 'bodymovin';

export default class Lottie extends React.Component {

  render() {
    const lottieStyles = {
      width: `${this.props.width}px` || '100%',
      height: `${this.props.height}px` || '100%',
      overflow: 'hidden',
      margin: '0 auto'
    };

    return <div ref='lavContainer' style={lottieStyles}></div>;
  }

  componentDidMount() {
    this.options = {
      container: this.refs.lavContainer,
      renderer: 'svg',
      loop: this.props.options.loop !== false,
      autoplay: this.props.options.autoplay !== false,
      animationData: this.props.options.animationData,
      rendererSettings: this.props.options.rendererSettings
    };
    this.anim = bodymovin.loadAnimation(this.options);
  }

  componentWillUpdate( nextProps, nextState ) {
    /* Recreate the animation handle if the data is changed */
    if( this.options.animationData !== nextProps.options.animationData ) {
      this.destroy();
      this.options.animationData = nextProps.options.animationData;
      this.anim = bodymovin.loadAnimation(this.options);
    }
  }

  componentDidUpdate() {
    this.props.isStopped ? this.stop() : this.play();
    this.pause();
    this.setSpeed();
    this.setDirection();
  }

  pause() {
    if (this.props.isPaused && !this.anim.isPaused) {
      this.anim.pause()
    } else if (!this.props.isPaused && this.anim.isPaused) {
      this.anim.pause()
    }
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  setSpeed() {
    this.anim.setSpeed(this.props.speed);
  }

  setDirection() {
    this.anim.setDirection(this.props.direction)
  }

  destroy() {
    this.anim.destroy();
  }
}

Lottie.propTypes = {
  options: PropTypes.object.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  direction: PropTypes.number,
};

Lottie.defaultProps = {
  isStopped: false,
  isPaused: false,
  speed: 1,
};
