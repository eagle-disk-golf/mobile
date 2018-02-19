import React, {Component} from 'react';
import {StyleSheet, View, TouchableHighlight, Animated} from 'react-native'; //Step 1
import {COLORS} from '../res/styles/constants';

class Panel extends Component {
    /**
     * This is not used.
     * @constructor
     */
  constructor(props) {
    super(props);

    // this.icons = {     //Step 2
    //   'up': require('./images/Arrowhead-01-128.png'),
    //   'down': require('./images/Arrowhead-Down-01-128.png')
    // };

    this.state = {
      title: props.title,
      expanded: false,
      animation: new Animated.Value(props.titleHeight || 60),
      canRenderChildren: false,
    };

    this.toggle = this.toggle.bind(this);
  }

  hideChildren() {
    // this.setState({canRenderChildren: false});
    setTimeout(() => {
      const {expanded} = this.state;
      if (!expanded) this.setState({canRenderChildren: false});
    }, 200);
  }

  showChildren() {
    this.setState({canRenderChildren: true});
  }

  scrollToPanel(event) {

  }

  toggle(event) {
    const {expanded} = this.state;
    const {onItemSelected} = this.props;
    const nativeEvent = event.nativeEvent;
    // panel opens, allow rendering of the children immediatly so this component can action on its height
    if (!expanded) {
      this.showChildren();
    } else {
      this.hideChildren();
    }

    // wait a little so the children will be rendered
    setTimeout(() => {
      const initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight;
      const finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

      if (!expanded) {
        onItemSelected({nativeEvent, contentHeight: finalValue, titleHeight: this.state.minHeight});
      }

      this.setState({
        expanded: !this.state.expanded
      });

      this.state.animation.setValue(initialValue);
      Animated.spring(
        this.state.animation,
        {
          toValue: finalValue
        }
      ).start();
    }, 50);
  }

  _setMaxHeight(event) {
    // const {onItemSelected} = this.props;
    // onItemSelected(event);

    this.setState({
      maxHeight: event.nativeEvent.layout.height
    });
  }

  _setMinHeight(event) {
    this.setState({
      minHeight: event.nativeEvent.layout.height
    });
  }

  render() {
    const {animation, expanded, shouldPanelOpen, canRenderChildren} = this.state;
    const {renderTitle, renderContent} = this.props;
    // let icon = this.icons['down'];
    // if (this.state.expanded) {
    //   icon = this.icons['up'];   //Step 4
    // }

    //Step 5
    return (
      <Animated.View
        style={[styles.container, {height: this.state.animation}]}>
        <View onLayout={this._setMinHeight.bind(this)}>
          <TouchableHighlight
            style={[styles.button]}
            onPress={(event) => this.toggle(event)}
            underlayColor="#f1f1f1">
            <View style={[styles.titleContainer]}>
              {renderTitle}
              {/* <Text style={styles.title}>{this.state.title}</Text>
              <Text style={styles.title}>{this.state.title}</Text> */}
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
          {!!canRenderChildren && this.props.children}
        </View>

      </Animated.View>
    );
  }
}

export default Panel;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    overflow: 'hidden'
  },
  titleContainer: {
    flexDirection: 'row'
  },
  title: {
    backgroundColor: 'red',
    flex: 1,
    padding: 20,
    color: COLORS.primary,
    fontWeight: 'bold'
  },
  button: {

  },
  buttonImage: {
    width: 30,
    height: 25
  },
  body: {
    padding: 0,
    paddingTop: 0
  }
});
