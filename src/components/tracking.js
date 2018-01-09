/*

*/
import React, {Component} from 'react';
import {NavigationActions} from 'react-navigation'
import {View, StyleSheet, Dimensions, Animated, Alert} from 'react-native';
import {Container, Text, Button, Toast, Content, Header, Fab} from 'native-base';
// import Icon from 'react-native-vector-icons/Ionicons';
import Icon from './icon';
import {globalStyles} from '../res/styles'

import firebase, {DB_NAMES} from '../services/firebase';
import geolocation from '../services/geolocation';

import {LANE, ROUND, SESSION} from '../constants/tracking';


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
      let newNode = {...node};
      newNode[idField] = nodeId;
      // const node = {...node, attribute: };
      resolve(newNode);
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
      lane: LANE,
      round: ROUND,
      session: SESSION,
      isRoundActive: false,
      isSessionActive: false,
      isLaneActive: false,
      error: null,
        activeStop: 'true',
        activeError: false
     
    };

    this.handleTrackThrow = this.handleTrackThrow.bind(this);
    this.handleEndLane = this.handleEndLane.bind(this);
    this.handleEndRound = this.handleEndRound.bind(this);
    this.endRound = this.endRound.bind(this);
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
    const {isLaneActive} = this.state;
    if (isLaneActive) {
      this.continueLane();
    } else this.startNewLane();
  }

  continueLane() {
    // hole is started
    const promises = [getSession(this.state.session), getRound(this.state.round), getLane(this.state.lane), geolocation.getCurrentPosition];
    Promise.all(promises).then(values => {
      // const previousLane = this.state.lane;
      const currentLane = values[2];
      const geolocation = values[3];
      const location = {
        ...geolocation.coords,
        timestamp: geolocation.timestamp
      }

      // update the currentLane by adding current throw into the throws array
      const lane = {
          ...currentLane,
          par: 3,
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
      const promises = [getSession(this.state.session), getRound(this.state.round), getLane(this.state.lane), geolocation.getCurrentPosition];
      // after we have received all our values
      Promise.all(promises).then(values => {

        const initialSession = values[0];
        const initialRound = values[1];
        const initialLane = values[2];
        const geoLocation = values[3];
        console.log(initialLane, 'initail lane:[');

        // create location object (flatten the data)
        const location = {
          ...geoLocation.coords,
          timestamp: geoLocation.timestamp
        }

        // create new lane
        const lane = {
          ...initialLane,
          // id from firebase
          // laneId,
          roundId: initialRound.roundId,
          sessionId: initialSession.sessionId,
          // add location to array
          throws: [location],
          // this is the first throw
          total_throws: 1,
          start_point: location,
          isActive: true
        };

        // update round, add new reference to the lane into the lanes array
        let lanesById = initialRound.lanes ? initialRound.lanes : {};
        lanesById[lane.laneId] = true;
        const round = {
          ...initialRound,
          sessionId: initialSession.sessionId,
          lanes: lanesById,
        }

        const {isRoundActive, isSessionActive} = this.state;

        // if round is active do not create new round
        // create reference to the individual rounds
        let roundsById = isSessionActive ? initialSession.rounds : {};
        // add new round
        if (!isRoundActive) {
          roundsById[round.roundId] = true;
        }
        const session = {
          ...initialSession,
          rounds: roundsById
        }

        // set this lane to state and push to firebase
        let updates = {};
        updates[DB_NAMES.lanes + lane.laneId] = lane;
        updates[DB_NAMES.rounds + round.roundId] = round;
        updates[DB_NAMES.sessions + session.sessionId] = session;

        firebase.database().ref().update(updates);
        this.setState({lane, round, session, isRoundActive: true, isSessionActive: true, isLaneActive: true});
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
      const promises = [getLane(this.state.lane), geolocation.getCurrentPosition];
      // hole is started
      Promise.all(promises).then(values => {
        const currentLane = values[0];
        const geolocation = values[1];

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
          lane: LANE,
          isLaneActive: false
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
    // confirm ending
    const self = this;
    Alert.alert(
      'End round?',
      'Are you sure you want to end the current round?',
      [
        {text: 'Yes, end round', onPress: () => self.endRound()},
        {text: 'Cancel', onPress: () => console.log('cancel')}
      ]);
  }

  endRound() {
   const promises = [getRound(this.state.round), geolocation.getCurrentPosition];
      // hole is started
      Promise.all(promises).then(values => {
        const currentRound = values[0];

        const updatedRound = {
          ...currentRound,
          completed: true
        }

        let updates = {};
        updates[DB_NAMES.rounds + currentRound.roundId] = updatedRound;

        firebase.database().ref().update(updates);
        // reset round to initial values
        this.setState({round: ROUND, isRoundActive: false})

      });
  }


  render() {
    console.log(this.state, 'this state', this.props, 'props');
    const {lane, round, isLaneActive} = this.state;

    return (
      <View style={[globalStyles.container]}>
          <Text style={[globalStyles.textPrimary]}>
            Hole number: {round.lanes.length}
          </Text>
          <Text style={[globalStyles.textPrimary]}>
            Current hole throw count: {lane.total_throws}
          </Text>
          <Text style={[globalStyles.textPrimary]}>
            Par: {lane.total_throws - lane.par}
          </Text>
        
        <Fab
            active={this.state.activeError}
            direction="right"
            containerStyle={{ }}
            style={[globalStyles.buttonRounded, globalStyles.bgSuccess, styles.errorButton]} 
            position="bottomLeft"
            onPress={() => this.setState({ activeError: !this.state.activeError })}>
            <Icon size={40} style={[globalStyles.textDefault, globalStyles.bgTransparent]} name="ios-alert"  />
            <Button style={{ backgroundColor: '#34A34F' }}>
              <Icon name="logo-whatsapp" />
            </Button>
            <Button style={{ backgroundColor: '#3B5998' }}>
              <Icon name="logo-facebook" />
            </Button>
          </Fab>

          <Button style={[globalStyles.buttonRounded, globalStyles.bgPrimary, globalStyles.verticalMargin, globalStyles.centerHorizontal,  {width: 200, height: 200}]} onPress={this.handleTrackThrow}>
            <Text style={[globalStyles.textPrimary,]}>Throw</Text>
          </Button>

     {  /*   <Button style={[globalStyles.buttonRounded, globalStyles.centerHorizontal, globalStyles.centerVertical, globalStyles.bgSuccess, styles.errorButton]} onPress={this.handle}>
            <Icon size={40} style={[globalStyles.textDefault, globalStyles.bgTransparent]} name="ios-alert"  />
          </Button> */ }


          {/* <FadeInView style={{width: 250, height: 50, backgroundColor: 'powderblue'}}>
            <Text style={{fontSize: 28, textAlign: 'center', margin: 10}}>Fading in</Text>
          </FadeInView> */}

       <Fab
            active={this.state.activeStop}
            direction="left"
            containerStyle={{ }}
            style={[globalStyles.buttonRounded, globalStyles.bgSuccess, styles.errorButton]}
            position="bottomRight"
            onPress={isLaneActive ? this.handleEndLane : this.handleEndRound}>
            {isLaneActive && <Icon style={[globalStyles.textDefault, {fontSize: 40}]} name="ios-basket" />}
            {!isLaneActive && <Icon size={40} style={[globalStyles.textDefault, globalStyles.bgTransparent, {paddingTop: 3, paddingBottom: 0}]} name="ios-close" />}

          </Fab> 
                  
                         
   {/*  <Button style={[globalStyles.buttonRounded, globalStyles.bgSuccess, styles.stopButton]} onPress={isLaneActive ? this.handleEndLane : this.handleEndRound}>
            {isLaneActive && <Icon style={[globalStyles.textDefault, {fontSize: 40}]} name="ios-basket" />}
            {!isLaneActive && <Icon size={40} style={[globalStyles.textDefault, globalStyles.bgTransparent, {paddingTop: 3, paddingBottom: 0}]} name="ios-close" />}
          </Button>   */}
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
    // marginTop: 15,
    width: 50,
    height: 50,

  },
  icon: {
    // fontSize: 30,
    transform: [{rotateX: '60deg'}]
  },
  font: {
      fontFamily:"Roboto",
      fontSize:20
    }
});

// class FadeInView extends React.Component {
//   state = {
//     fadeAnim: new Animated.Value(0),  // Initial value for opacity: 0
//   }

//   componentDidMount() {
//     Animated.timing(                  // Animate over time
//       this.state.fadeAnim,            // The animated value to drive
//       {
//         toValue: '90deg',                   // Animate to opacity: 1 (opaque)
//         duration: 500,              // Make it take a while
//       }
//     ).start();                        // Starts the animation
//   }

//   render() {
//     let {fadeAnim} = this.state;

//     return (
//       <Animated.View                 // Special animatable View
//         style={{
//           ...this.props.style,
//           opacity: fadeAnim,         // Bind opacity to animated value
//           transform: [{rotate: this.state.fadeAnim.interpolate({inputRange: [0, 360], outputRange: ['0deg', '360deg']}), }],
//         }}
//       >
//         {this.props.children}
//       </Animated.View>
//     );
//   }
// }
