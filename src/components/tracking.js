/*

*/
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation'
import {View, StyleSheet, Dimensions, Animated} from 'react-native';
import {Container, Text, Button, Toast, Content, Header, Icon} from 'native-base';
import {globalStyles} from '../res/styles'

import firebase from '../services/firebase';
import geolocation from '../services/geolocation';

import {lane, round, session} from '../constants/tracking';




export default class Tracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lane,
      round,
      session,
      error: null,
    };

    this.handleTrackThrow = this.handleTrackThrow.bind(this);
    this.handleEndLane = this.handleEndLane.bind(this);
  }

  componentDidMount() {
    // TEST: this will send these params to the summary screen
    const setParamsAction = NavigationActions.setParams({
      params: {lane: this.state.lane, round: this.state.round},
      key: 'Summary',
    });
    const setParamsActionForParent = NavigationActions.setParams({
      params: {lane: this.state.lane, round: this.state.round},
      key: 'Test',
    });
    this.props.navigation.dispatch(setParamsAction);
    this.props.navigation.dispatch(setParamsActionForParent);

    firebase.database().ref('test').set({id: '1', message: 'mooro'});
  }

  handleTrackThrow() {
    if (this.state.lane.laneId) {
      this.continueLane();
    } else this.startNewLane();
  }

  continueLane() {
    // hole is started
    geolocation.getCurrentPosition.then((position) => {
      const previousLane = this.state.lane;
      const location = {
        ...position.coords,
        timestamp: position.timestamp
      }

      this.setState({
        lane: {
          ...previousLane,
          // add location to array
          throws: [...previousLane.throws, location],
          total_throws: previousLane.total_throws + 1,
        }
      })
    }).catch((error) => {
      console.warn(error);
      this.setState({error: error.message});
    })
  }

  startNewLane() {
    // hole is not started
    geolocation.getCurrentPosition.then((position) => {
      const initialLane = this.state.lane;
      // create location object
      const location = {
        ...position.coords,
        timestamp: position.timestamp
      }

      this.setState({
        lane: {
          ...initialLane,
          //hard coded id
          laneId: 1,
          // add location to array
          throws: [location],
          total_throws: initialLane.total_throws + 1,
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
  handleEndLane() {
    // dont end if no throws
    if (this.state.lane.throws.length) {
      // hole is started
      geolocation.getCurrentPosition.then((position) => {
        const previousLane = this.state.lane;
        const location = {
          ...position.coords,
          timestamp: position.timestamp
        }
        const completedLane = {
          ...previousLane,
          // add location to array
          throws: [...previousLane.throws, location],
          total_throws: previousLane.total_throws + 1,
          end_point: location,
          isActive: false,
          completed: true
        }

        // initialize empty hole, add completed hole to the round
        this.setState({
          lane: lane,
          round: {
            ...this.state.round,
            lanes: [...this.state.round.lanes, completedLane]
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
    const {lane, round} = this.state;
    const isLaneActive = lane.isActive;
    return (
        <View style={[globalStyles.centerContent, {alignItems: 'center', flex: 1, flexDirection: 'column'}]}>
          <Text style={[globalStyles.textPrimary]}>
            Hole number: {round.lanes.length}
          </Text>
          <Text style={[globalStyles.textPrimary]}>
            Current hole throw count: {lane.total_throws}
          </Text>
          <Text style={[globalStyles.textPrimary]}>
            Par: {lane.total_throws - lane.par}
          </Text>
          <Button style={[globalStyles.buttonRounded, globalStyles.bgPrimary, globalStyles.verticalMargin, globalStyles.centerHorizontal, {width: 200, height: 200}]} onPress={this.handleTrackThrow}>
            <Text style={[globalStyles.textPrimary, ]}>Throw</Text>
          </Button>

          <Button style={[globalStyles.buttonRounded, globalStyles.centerHorizontal, globalStyles.bgSuccess, styles.errorButton]} onPress={this.handleEndLane}>
            <Icon style={[globalStyles.textDefault]} name="alert" />
          </Button>

          {/* <FadeInView style={{width: 250, height: 50, backgroundColor: 'powderblue'}}>
          <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text>
        </FadeInView> */}

          <Button style={[globalStyles.buttonRounded, globalStyles.bgSuccess, styles.stopButton]} onPress={this.handleEndLane}>
            {isLaneActive && <FadeInView><Icon style={[]} name="basket" /></FadeInView>}
            {!isLaneActive && <FadeInView><Icon style={{fontSize: 30}} name="close" /></FadeInView>}
          </Button>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  stopButton: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 20,
    right: 20,
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

