import React, {Component} from 'react';
import {Animated} from 'react-native';
import {stylesToArray} from '../helpers/components';

export default class FadeInView extends Component {
    /**
      * Fade in animation
      * @constructor
      */
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
    };
  }

    /**
      * If visible is true, componentDidMount does fadeIn, if not it does fadeOut.
      * componentDidMount is invoked immediately after a component is mounted.
      * @componentDidMount
      */
  componentDidMount() {
    if (!!this.props.visible) {
      this.fadeIn();
    } else {
      this.fadeOut();
    }
  }

    /**
      * If nextProps.visible is true and
      */
  componentWillReceiveProps(nextProps) {
    if (!!nextProps.visible && (nextProps.visible !== this.props.visible)) {
      this.fadeIn();
    } else if (!nextProps.visible && (nextProps.visible !== this.props.visibe)) {
      this.fadeOut();
    }
  }

  fadeIn() {
    const {fadeInDuration = 300} = this.props;

    Animated.timing(
      this.state.opacity, {
        toValue: 1,
        duration: fadeInDuration
      }
    ).start();
  }

  fadeOut() {
    const {fadeOutDuration = 300} = this.props;

    Animated.timing(
      this.state.opacity, {
        toValue: 0,
        duration: fadeOutDuration
      }
    ).start();
  }

  render() {
    const {opacity} = this.state;
    const styles = stylesToArray(this.props.style);

    return (
      <Animated.View
        style={[...styles, {opacity}]}>
        {this.props.children}
      </Animated.View>
    );
  }
}
