/*

*/
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation'
import {View, StyleSheet, Dimensions, Animated} from 'react-native';
import {Container, Text, Button, Toast, Content, Header, Icon} from 'native-base';
import {styles} from '../res/styles'

import geolocation from '../services/geolocation';

import {hole, round} from '../constants/tracking';




export default class Tracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hole,
      round,
      error: null,
    };

    this.handleTrackThrow = this.handleTrackThrow.bind(this);
    this.handleEndHole = this.handleEndHole.bind(this);
  }

  componentDidMount() {
    // TEST: this will send these params to the summary screen
    const setParamsAction = NavigationActions.setParams({
      params: {hole: this.state.hole, round: this.state.round},
      key: 'Summary',
    });
    const setParamsActionForParent = NavigationActions.setParams({
      params: {hole: this.state.hole, round: this.state.round},
      key: 'Test',
    });
    this.props.navigation.dispatch(setParamsAction);
    this.props.navigation.dispatch(setParamsActionForParent);
  }

  handleTrackThrow() {
    if (this.state.hole.holeId) {
      this.continueHole();
    } else this.startNewHole();
  }

  continueHole() {
    // hole is started
    geolocation.getCurrentPosition.then((position) => {
      const previousHole = this.state.hole;
      const location = {
        ...position.coords,
        timestamp: position.timestamp
      }

      this.setState({
        hole: {
          ...previousHole,
          // add location to array
          throws: [...previousHole.throws, location],
          total_throws: previousHole.total_throws + 1,
        }
      })
    }).catch((error) => {
      console.warn(error);
      this.setState({error: error.message});
    })
  }

  startNewHole() {
    // hole is not started
    geolocation.getCurrentPosition.then((position) => {
      const initialHole = this.state.hole;
      // create location object
      const location = {
        ...position.coords,
        timestamp: position.timestamp
      }

      this.setState({
        hole: {
          ...initialHole,
          //hard coded id
          holeId: 1,
          // add location to array
          throws: [location],
          total_throws: initialHole.total_throws + 1,
          start_point: location,
          isActive: true
        }
      })
    }).catch((error) => {
      console.warn(error);
      this.setState({error: error.message});
    })
  }

  // when ending round, is the user at the basket or not??
  handleEndHole() {
    // dont end if no throws
    if (this.state.hole.throws.length) {
      // hole is started
      geolocation.getCurrentPosition.then((position) => {
        const previousHole = this.state.hole;
        const location = {
          ...position.coords,
          timestamp: position.timestamp
        }
        const completedHole = {
          ...previousHole,
          // add location to array
          throws: [...previousHole.throws, location],
          total_throws: previousHole.total_throws + 1,
          end_point: location,
          isActive: false,
          completed: true
        }

        // initialize empty hole, add completed hole to the round
        this.setState({
          hole: hole,
          round: {
            ...this.state.round,
            holes: [...this.state.round.holes, completedHole]
          }

        })
      }).catch((error) => {
        console.warn(error);
        this.setState({error: error.message});
      })
    } else Toast.show({
      text: "You haven't even started yet!",
      position: 'bottom',
      buttonText: 'Okay!'
    });
  }
  render() {
    console.log(this.state, 'this state', this.props, 'props');
    const {hole, round} = this.state;
    const isHoleActive = hole.isActive;
    return (
        <View style={[styles.centerContent, {alignItems: 'center', flex: 1, flexDirection: 'column'}]}>
          <Text style={[styles.textPrimary]}>
            Hole number: {round.holes.length}
          </Text>
          <Text style={[styles.textPrimary]}>
            Current hole throw count: {hole.total_throws}
          </Text>
          <Text style={[styles.textPrimary]}>
            Par: {hole.total_throws - hole.par}
          </Text>
          <Button style={[styles.buttonRounded, styles.bgPrimary, styles.verticalMargin, styles.centerHorizontal, {width: 200, height: 200}]} onPress={this.handleTrackThrow}>
            <Text style={[styles.textPrimary, ]}>Throw</Text>
          </Button>

          <Button style={[styles.buttonRounded, styles.centerHorizontal, styles.bgSuccess, stylesLocal.errorButton]} onPress={this.handleEndHole}>
            <Icon style={[styles.textDefault]} name="alert" />
          </Button>

          {/* <FadeInView style={{width: 250, height: 50, backgroundColor: 'powderblue'}}>
          <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text>
        </FadeInView> */}

          <Button style={[styles.buttonRounded, styles.bgSuccess, stylesLocal.stopButton]} onPress={this.handleEndHole}>
            {isHoleActive && <FadeInView><Icon style={[]} name="basket" /></FadeInView>}
            {!isHoleActive && <FadeInView><Icon style={{fontSize: 30}} name="close" /></FadeInView>}
          </Button>
      </View>
    );
  }
}


const stylesLocal = StyleSheet.create({
  stopButton: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 20,
    right: 20
  },
  errorButton: {
    marginTop: 15,
    width: 50,
    height: 50,
    padding: 20
  },
  icon: {
    // fontSize: 30,
    transform: [{rotateX: '60deg'}]
  }
});

class FadeInView extends React.Component {
  state = {
    fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
  }

  componentDidMount() {
    Animated.timing(                  // Animate over time
      this.state.fadeAnim,            // The animated value to drive
      {
        toValue: '90deg',                   // Animate to opacity: 1 (opaque)
        duration: 500,              // Make it take a while
      }
    ).start();                        // Starts the animation
  }

  render() {
    let { fadeAnim } = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
          transform: [{ rotate: this.state.fadeAnim.interpolate({inputRange: [0, 360], outputRange: ['0deg', '360deg']}), }],
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

