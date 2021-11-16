import React from 'react';
import PropTypes from 'prop-types';
import bodymovin from 'bodymovin';

export default class Lottie extends React.Component {
  componentDidMount() {
    const {
      options: { loop, autoplay, animationData, rendererSettings },
      eventListeners,
    } = this.props;

    const { lavContainer } = this.el;
    this.options = {
      container: lavContainer,
      renderer: 'svg',
      loop: loop !== false,
      autoplay: autoplay !== false,
      animationData,
      rendererSettings,
    };

    this.anim = bodymovin.loadAnimation(this.options);
    this.registerEvents(eventListeners);
  }

  componentWillUpdate(nextProps /* , nextState */) {
    /* Recreate the animation handle if the data is changed */
    if (this.options.animationData !== nextProps.options.animationData) {
      this.deRegisterEvents(this.props.eventListeners);
      this.destroy();
      this.options.animationData = nextProps.options.animationData;
      this.anim = bodymovin.loadAnimation(this.options);
      this.registerEvents(nextProps.eventListeners);
    }
  }

  componentDidUpdate() {
    this.props.isStopped ? this.stop() : this.play();
    this.pause();
    this.setSpeed();
    this.setDirection();
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
    this.anim.setDirection(this.props.direction);
  }

  pause() {
    if (this.props.isPaused && !this.anim.isPaused) {
      this.anim.pause();
    } else if (!this.props.isPaused && this.anim.isPaused) {
      this.anim.pause();
    }
  }

  destroy() {
    this.anim.destroy();
  }

  registerEvents(eventListeners) {
    eventListeners.forEach((eventListener) => {
      this.anim.addEventListener(eventListener.eventName, eventListener.callback);
    });
  }

  deRegisterEvents(eventListeners) {
    eventListeners.forEach((eventListener) => {
      this.anim.removeEventListener(eventListener.eventName, eventListener.callback);
    });
  }

  render() {
    const { width, height } = this.props;

    const getSize = (initial) => {
      let size;

      if (typeof initial === 'number') {
        size = `${initial}px`;
      } else {
        size = initial || '100%';
      }

      return size;
    };

    const lottieStyles = {
      width: getSize(width),
      height: getSize(height),
      overflow: 'hidden',
      margin: '0 auto',
    };
    return (
      <div
        ref={(c) => {
          this.el = c;
        }}
        style={lottieStyles}
      />
    );
  }
}

Lottie.propTypes = {
  eventListeners: PropTypes.arrayOf(PropTypes.object),
  options: PropTypes.object.isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  isStopped: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  direction: PropTypes.number,
};

Lottie.defaultProps = {
  eventListeners: [],
  isStopped: false,
  isPaused: false,
  speed: 1,
};
