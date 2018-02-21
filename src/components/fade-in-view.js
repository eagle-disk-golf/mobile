import React, {Component} from 'react';
import {Animated} from 'react-native';
import {stylesToArray} from '../helpers/components';

export default class FadeInView extends Component {
    /**
      * Fade in animation
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
      */
  componentDidMount() {
    if (!!this.props.visible) {
      this.fadeIn();
    } else {
      this.fadeOut();
    }
  }

    /**
      * If nextProps.visible is true fade in comes in, if not fade out comes in.
      */
  componentWillReceiveProps(nextProps) {
    if (!!nextProps.visible && (nextProps.visible !== this.props.visible)) {
      this.fadeIn();
    } else if (!nextProps.visible && (nextProps.visible !== this.props.visibe)) {
      this.fadeOut();
    }
  }

    /**
     * Fade in duration set as props.
     */
  fadeIn() {
    const {fadeInDuration = 300} = this.props;

    Animated.timing(
      this.state.opacity, {
        toValue: 1,
        duration: fadeInDuration
      }
    ).start();
  }

    /**
     * Fade out duration set as props.
     */
  fadeOut() {
    const {fadeOutDuration = 300} = this.props;

    Animated.timing(
      this.state.opacity, {
        toValue: 0,
        duration: fadeOutDuration
      }
    ).start();
  }

    /**
     * Render function that takes opacity and styles as variables.
     * Returns an animated view.
     */
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
