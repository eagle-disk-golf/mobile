import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableHighlight, Animated} from 'react-native'; //Step 1
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

class Panel extends Component {
  constructor(props) {
    super(props);

    // this.icons = {     //Step 2
    //   'up': require('./images/Arrowhead-01-128.png'),
    //   'down': require('./images/Arrowhead-Down-01-128.png')
    // };

    this.state = {       //Step 3
      title: props.title,
      expanded: false,
      animation: new Animated.Value(57)
    };

    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    // this.toggle();
  }

  toggle() {
    //Step 1
    const initialValue = this.state.expanded ? this.state.maxHeight + this.state.minHeight : this.state.minHeight;
    const finalValue = this.state.expanded ? this.state.minHeight : this.state.maxHeight + this.state.minHeight;

    this.setState({
      expanded: !this.state.expanded  //Step 2
    });

    // console.log(initialValue, 'initialVAlue');
    this.state.animation.setValue(initialValue);  //Step 3
    Animated.spring(     //Step 4
      this.state.animation,
      {
        toValue: finalValue
      }
    ).start();  //Step 5
  }

  _setMaxHeight(event) {
    // console.log('settings max height');
    this.setState({
      maxHeight: event.nativeEvent.layout.height
    });
  }

  _setMinHeight(event) {
    console.log('settings min heights');
    this.setState({
      minHeight: event.nativeEvent.layout.height
    });
}


  render() {
    const {animation, expanded} = this.state;
    // console.log(animation, 'animatiop');
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
            onPress={this.toggle}
            underlayColor="#f1f1f1">
            <View style={[styles.titleContainer]}>
              <Text style={styles.title}>{this.state.title}</Text>
              <Text style={styles.title}>{this.state.title}</Text>
              {/* <Image
              style={styles.buttonImage}
              source={icon}
            ></Image> */}
            </View>
          </TouchableHighlight>
        </View>

        <View style={styles.body} onLayout={this._setMaxHeight.bind(this)}>
          {this.props.children}
        </View>

      </Animated.View>
    );
  }
}

export default Panel;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 10,
    overflow: 'hidden'
  },
  titleContainer: {
    flexDirection: 'row'
  },
  title: {
    backgroundColor: 'red',
    flex: 1,
    padding: 20,
    color: '#2a2f43',
    fontWeight: 'bold'
  },
  button: {


  },
  buttonImage: {
    width: 30,
    height: 25
  },
  body: {
    padding: 10,
    paddingTop: 0
  }
});
