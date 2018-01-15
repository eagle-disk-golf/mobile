import React, {Component} from 'react';
import {Animated} from 'react-native';
import {stylesToArray} from '../helpers/components';

export default class FadeInView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: new Animated.Value(0),
    };
  }

  componentDidMount() {
    if (!!this.props.visible) {
      this.fadeIn();
    } else {
      this.fadeOut();
    }
  }

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
