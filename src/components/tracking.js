/*

*/
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation'
import {View, StyleSheet, Dimensions, Animated} from 'react-native';
import {Container, Text, Button, Toast, Content, Header, Icon} from 'native-base';
import {globalStyles} from '../res/styles'

import firebase, {DB_NAMES} from '../services/firebase';
import geolocation from '../services/geolocation';

import {lane, round, session} from '../constants/tracking';


/*
  return the node param (session, round or lane) if it is already referenced in firebase.
  if the node param is only initialized (missing id's) it will create new reference to the firebase database
  and return that node
*/
const getNodeFromFirebase = (node, idField, table) => {
  // check if session exists
  return new Promise((resolve, reject) => {
    if (!!node[idField]) {
      // session exists in state, just return that
      resolve(node);
    } else if (!node[idField]) {
      // session is not yet created, create new node to the database and retreive the key
      const nodeId = firebase.database().ref(table).push().key;
      let node = {...node};
      node[idField] = nodeId;
      // const node = {...node, attribute: };
      resolve(node);
    } else {
      // send out error object
      reject({message: `Cannot get ${idField}`});
    }
  });
};

const getSession = (node) => getNodeFromFirebase(node, 'sessionId', DB_NAMES.sessions);
const getRound = (node) => getNodeFromFirebase(node, 'roundId', DB_NAMES.rounds);
const getLane = (node) => getNodeFromFirebase(node, 'laneId', DB_NAMES.lanes);

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
    this.handleEndRound = this.handleEndRound.bind(this);
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
  }

  handleTrackThrow() {
    if (this.state.lane.laneId) {
      this.continueLane();
    } else this.startNewLane();
  }

  continueLane() {
    // hole is started
    const resolvedPromises = [getSession(this.state.session), getRound(this.state.round), getLane(this.state.lane), geolocation.getCurrentPosition];

    Promise.all(resolvedPromises).then(resolvedValues => {
    // geolocation.getCurrentPosition.then((position) => {
      // const previousLane = this.state.lane;
      const currentLane = resolvedValues[2];
      const geolocation = resolvedValues[3];
      const location = {
        ...geolocation.coords,
        timestamp: geolocation.timestamp
      }

      const lane = {
          ...currentLane,
          // add location to array
          throws: [...currentLane.throws, location],
          total_throws: currentLane.total_throws + 1,
        }

      this.setState({lane});

      let updates = {};
      updates[DB_NAMES.lanes + lane.laneId] = lane;
      firebase.database().ref().update(updates);
    }).catch((error) => {
      console.warn(error);
      this.setState({error: error.message});
    })
  }

  startNewLane() {
      // use javascript Promise the handle all the async functions
      const resolvedPromises = [getSession(this.state.session), getRound(this.state.round), geolocation.getCurrentPosition];

      // after we have received all our values
      Promise.all(resolvedPromises).then(resolvedValues => {

        const initialLane = this.state.lane;
        const initialSession = resolvedValues[0];
        const initialRound = resolvedValues[1];
        const geoLocation = resolvedValues[2];

        // create location object (flatten the data)
        const location = {
          ...geoLocation.coords,
          timestamp: geoLocation.timestamp
        }

        // create new lane
        const laneId = firebase.database().ref(DB_NAMES.lane).push().key;
        // create lane
        const lane = {
          ...initialLane,
          // id from firebase
          laneId,
          roundId: initialRound.roundId,
          sessionId: initialSession.sessionId,
          // add location to array
          throws: [location],
          // this is the first throw
          total_throws: 1,
          start_point: location,
          isActive: true
        };

        const previousLanes = !!initialRound.lanes ? initialRound.lanes : [];
        // const previousLanes = initialRound.lanes;
        const round = {
          ...initialRound,
          lanes: [...previousLanes, {laneId: lane.laneId}]
        }

        const session = {
          ...initialSession,
          rounds: [{roundId: initialRound.roundId}]
        }

        // set this lane to state and push to firebase
        let updates = {};
        updates[DB_NAMES.lanes + lane.laneId] = lane;
        updates[DB_NAMES.rounds + round.roundId] = round;
        updates[DB_NAMES.sessions + session.sessionId] = session;

        firebase.database().ref().update(updates);
        this.setState({lane, round, session});
      // })
    }).catch((error) => {
      console.warn(error);
      Toast.show({text: error.message});
      this.setState({error: error.message});
    })
  }

  // when ending round, is the user at the basket or not??
  handleEndLane() {
    // dont end if no throws
    if (this.state.lane.throws.length) {
      const resolvedPromises = [getSession(this.state.session), getRound(this.state.round), getLane(this.state.lane), geolocation.getCurrentPosition];
      // hole is started
      Promise.all(resolvedPromises).then(resolvedValues => {
        // geolocation.getCurrentPosition.then((position) => {
        const previousRound = resolvedValues[1];
        const currentLane = resolvedValues[2];
        const geolocation = resolvedValues[3];

        const location = {
          ...geolocation.coords,
          timestamp: geolocation.timestamp
        }
        const completedLane = {
          ...currentLane,
          // add location to array
          throws: [...currentLane.throws, location],
          total_throws: currentLane.total_throws + 1,
          end_point: location,
          isActive: false,
          completed: true
        }

        this.setState({
          // initializing empty lane
          lane: lane,
        })

        let updates = {};
        updates[DB_NAMES.lanes + completedLane.laneId] = completedLane;
        firebase.database().ref().update(updates);
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

  handleEndRound() {
    // end round, initialize round so when tracking next throw firebase will create automatically new round
    this.setState({round: round});
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
          <Text style={[globalStyles.textPrimary,]}>Throw</Text>
        </Button>

        <Button style={[globalStyles.buttonRounded, globalStyles.centerHorizontal, globalStyles.bgSuccess, styles.errorButton]} onPress={this.handleEndLane}>
          <Icon style={[globalStyles.textDefault]} name="alert" />
        </Button>

        {/* <FadeInView style={{width: 250, height: 50, backgroundColor: 'powderblue'}}>
          <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text>
        </FadeInView> */}

        <Button style={[globalStyles.buttonRounded, globalStyles.bgSuccess, styles.stopButton]} onPress={isLaneActive ? this.handleEndLane : this.handleEndRound}>
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
    let {fadeAnim} = this.state;

    return (
      <Animated.View                 // Special animatable View
        style={{
          ...this.props.style,
          opacity: fadeAnim,         // Bind opacity to animated value
          transform: [{rotate: this.state.fadeAnim.interpolate({inputRange: [0, 360], outputRange: ['0deg', '360deg']}), }],
        }}
      >
        {this.props.children}
      </Animated.View>
    );
  }
}

