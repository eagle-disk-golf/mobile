/*
 eslint max-len: 0
*/
import React, {Component} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Text, Button, Toast, Fab, ActionSheet, Spinner} from 'native-base';
import Icon from './icon';
import FadeInView from './fade-in-view';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';

import firebase, {DB_NAMES} from '../services/firebase';
import geolocation from '../services/geolocation';

import {LANE, COURSE} from '../constants/tracking';

const newEmptyCourse = _ => {return {...COURSE, lanes: {}};};
const newEmptyLane = _ => {return {...LANE};};


/*
  return the node param (session, round or lane) if it is already referenced in firebase.
  if the node param is only initialized (missing id's) it will create new reference to the firebase database
  and return that node
*/

const getOrCreateNodeFromFirebase = (node, idField, table) => {
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

// const getSession = (node) => getNodeFromFirebase(node, 'sessionId', DB_NAMES.sessions);
// const getRound = (node) => getNodeFromFirebase(node, 'roundId', DB_NAMES.rounds);

const getOrCreateCourse = (node) => getOrCreateNodeFromFirebase(node, 'courseId', DB_NAMES.courses);
const getOrCreateLane = (node) => getOrCreateNodeFromFirebase(node, 'laneId', DB_NAMES.lanes);

export default class Tracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lane: newEmptyLane(),
      course: newEmptyCourse(),
      isCourseActive: false,
      isLaneActive: false,
      error: null,
      loading: false,
      initialized: false,
    };

    this.handleTrackThrow = this.handleTrackThrow.bind(this);
    this.handleEndLane = this.handleEndLane.bind(this);
    this.handleEndCourse = this.handleEndCourse.bind(this);
    this.endCourse = this.endCourse.bind(this);
    this.handleSelectFayltyThrow = this.handleSelectFayltyThrow.bind(this);
  }

  componentDidMount() {
    firebase.database().ref(DB_NAMES.courses).limitToLast(1).once('value').then(snapshot => {
      const value = snapshot.val() ? snapshot.val() : {};
      const latestCourse = Object.keys(value).map(key => { return {...value[key]}; })[0];

      // get the last played lane
      const lanesById = latestCourse && latestCourse.lanes ? Object.keys(latestCourse.lanes).map(key => key) : [];
      const lastLaneId = lanesById[lanesById.length - 1];

      if (latestCourse && !latestCourse.completed) {
        // latest course has not been completed, fetch latest lane to check if was completed
        // this.setState({course: latestCourse, isCourseActive: true});
        const courseToState = {course: latestCourse, isCourseActive: true};

        firebase.database().ref(DB_NAMES.lanes + lastLaneId).once('value').then(snapshot => {
          const latestLane = snapshot.val() ? snapshot.val() : {};

          let laneToState = latestCourse && !latestLane.completed ? {lane: latestLane, isLaneActive: true} : {};

          this.setState({...courseToState, ...laneToState, initialized: true});
        });
      } else {
        // latest course was completed successfully
        this.setState({initialized: true});
      }
    });
    // TEST: this will send these params to the summary screen
    // const setParamsAction = NavigationActions.setParams({
    //   params: {lane: this.state.lane, round: this.state.round},
    //   key: 'Summary',
    // });
    // const setParamsActionForParent = NavigationActions.setParams({
    //   params: {lane: this.state.lane, round: this.state.round},
    //   key: 'Test',
    // });
    // this.props.navigation.dispatch(setParamsAction);
    // this.props.navigation.dispatch(setParamsActionForParent);
  }

  showLoader() {
    this.setState({loading: true});
  }
  hideLoader() {
    this.setState({loading: false});
  }

  displayError(error) {
    Alert.alert(
      'Whoops',
      error.message,
      [
        {text: 'Okay'},
        // {text: 'Cancel', onPress: () => console.log('cancel')}
      ]);
  }

  handleTrackThrow() {
    const {isLaneActive} = this.state;
    if (isLaneActive) {
      this.continueLane();
    } else this.startNewLane();
  }

  continueLane() {
    // lane is started
    this.showLoader();
    const promises = [getOrCreateLane(this.state.lane), geolocation.getCurrentPosition()];
    Promise.all(promises).then(values => {
      // const previousLane = this.state.lane;
      const currentLane = values[0];
      const geolocation = values[1];

      // update the currentLane by adding current throw into the throws array
      const lane = {
        ...currentLane,
        par: 3,
        // add location to array
        throws: [...currentLane.throws, geolocation],
        totalThrows: currentLane.totalThrows + 1,
      };

      this.setState({lane});

      let updates = {};
      updates[DB_NAMES.lanes + lane.laneId] = lane;
      firebase.database().ref().update(updates);
      this.hideLoader();
    }).catch((error) => {
      this.displayError(error);
      this.hideLoader();
      // console.warn(error);
    });
  }

  startNewLane() {
    // use javascript Promise the handle all the async functions
    this.showLoader();
    const promises = [getOrCreateCourse(this.state.course), getOrCreateLane(this.state.lane), geolocation.getCurrentPosition()];
    // after we have received all our values
    Promise.all(promises).then(values => {
      const initialCourse = values[0];
      const initialLane = values[1];
      const geolocation = values[2];

        // create new lane
      const lane = {
        ...initialLane,
        // id from firebase
        // laneId,
        courseId: initialCourse.courseId,
        // add location to array
        throws: [geolocation],
        // this is the first throw
        totalThrows: 1,
        startPoint: geolocation,
        isActive: true
      };

      let lanesById = initialCourse.lanes ? initialCourse.lanes : {};
      lanesById[lane.laneId] = true;
      const course = {
        ...initialCourse,
        lanes: lanesById,
      };

      // set this lane to state and push to firebase
      let updates = {};
      updates[DB_NAMES.lanes + lane.laneId] = lane;
      updates[DB_NAMES.courses + course.courseId] = course;

      this.setState({lane, course, isCourseActive: true, isLaneActive: true});
      firebase.database().ref().update(updates);
      this.hideLoader();
      // })
    }).catch((error) => {
      this.displayError(error);
      this.hideLoader();
      // console.warn(error);
    });
  }

  // when ending round, is the user at the basket or not??
  handleEndLane() {
    // dont end if no throws
    if (this.state.lane.throws.length) {
      this.showLoader();
      const promises = [getOrCreateLane(this.state.lane), geolocation.getCurrentPosition()];
      // hole is started
      Promise.all(promises).then(values => {
        const currentLane = values[0];
        const geolocation = values[1];

        const completedLane = {
          ...currentLane,
          // add location to array
          throws: [...currentLane.throws, geolocation],
          totalThrows: currentLane.totalThrows + 1,
          endPoint: geolocation,
          isActive: false,
          completed: true
        };

        this.setState({
          // initializing empty lane
          lane: newEmptyLane(),
          isLaneActive: false
        });

        let updates = {};
        updates[DB_NAMES.lanes + completedLane.laneId] = completedLane;
        firebase.database().ref().update(updates);
        this.hideLoader();
      }).catch((error) => {
        console.warn(error);
        this.setState({error: error.message});
        this.hideLoader();
      });
    } else {
      Toast.show({
        text: 'You haven\'t even started yet!',
        position: 'bottom',
        buttonText: 'Okay!'
      });
    }
  }

  handleEndCourse() {
    // confirm ending
    const {isCourseActive} = this.state;
    if (isCourseActive) {
      Alert.alert(
        'End game?',
        'Are you sure you want to end the current game?',
        [
          {text: 'Yes, end round', onPress: () => this.endCourse()},
          {text: 'Cancel', onPress: () => console.log('cancel')}
        ]);
    }
  }

  endCourse() {
    this.showLoader();
    const promises = [getOrCreateCourse(this.state.course)];
    // hole is started
    Promise.all(promises).then(values => {
      const currentCourse = values[0];

      const updatedCourse = {
        ...currentCourse,
        completed: true
      };

      this.setState({course: newEmptyCourse(), isCourseActive: false});
      this.hideLoader();

      let updates = {};
      updates[DB_NAMES.courses + currentCourse.courseId] = updatedCourse;

      firebase.database().ref().update(updates);
    }).catch((error) => {
      this.hideLoader();
      this.displayError(error);
    });
  }

  handleSelectFayltyThrow() {
    const {isCourseActive, isLaneActive} = this.state;

    const BUTTONS = [
      {name: 'over-bound', flag: 'isOverBound', text: 'Over bound', icon: 'remove-circle', iconColor: COLORS.success, penalty: 1},
      {name: 'lost', flag: 'isLost', text: 'Lost', icon: 'eye-off', iconColor: COLORS.primary, penalty: 1},
      {name: 'mando', flag: 'isMando', text: 'Mando', icon: 'redo', iconColor: COLORS.warningr, penalty: 1},
      {text: 'Cancel', icon: 'close', iconColor: '#25de5b'}
    ];
    const DESTRUCTIVE_INDEX = 3;
    const CANCEL_INDEX = 3;


    if (isCourseActive && isLaneActive) {
      ActionSheet.show(
        {
          options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
        title: 'Select right option'
      },
      buttonIndex => {
        console.log(buttonIndex, 'btn index');
        if (buttonIndex !== 3) {
          this.setFaultyThrow(BUTTONS[buttonIndex]);
          this.setState({faultyThrow: BUTTONS[buttonIndex]});
        }
        // this.setState({clicked: BUTTONS[buttonIndex]});
      });
    }
  }

  setFaultyThrow(faultyThrow) {
    const promises = [getOrCreateLane(this.state.lane)];
    Promise.all(promises).then(resolvedValues => {
      const currentLane = resolvedValues[0];

      let throws = currentLane.throws;
      // last throw, add flag that is true (isOverBound, isLost etc)
      throws[throws.length - 1][faultyThrow.flag] = true;

      const lane = {
        ...currentLane,
        totalThrows: currentLane.totalThrows + faultyThrow.penalty,
        penalty: currentLane.penalty + faultyThrow.penalty,
        throws
      };

      this.setState({lane});

      firebase.database().ref(DB_NAMES.lanes + lane.laneId).set(lane);
    });
  }


  render() {
    const {lane, course, isLaneActive, isCourseActive, loading, initialized} = this.state;
    const laneNumber = Object.keys(course.lanes).length;

    if (!initialized) { return <View style={[globalStyles.container]}>
      <Spinner color='green' />
    </View>;
    };

    return (
      <View style={[globalStyles.container]}>
        <Text style={[globalStyles.textPrimary]}>
          Lane number: {laneNumber}
        </Text>
        <Text style={[globalStyles.textPrimary]}>
          Current lane throw count: {lane.totalThrows}
        </Text>
        {
          /* <Text style={[globalStyles.textPrimary]}>
          Par: {lane.total_throws - lane.par}
        </Text> */
        }

        <FadeInView style={[styles.fadeinView, {position: 'absolute', bottom: 20, left: 20}]} visible={isCourseActive && isLaneActive}>
          <Button style={[globalStyles.buttonRounded, globalStyles.bgSuccess, styles.smallButtons, styles.shadow]}  onPress={this.handleSelectFayltyThrow}>
          <Icon size={30} style={[globalStyles.textDefault]} name='ios-alert' />
          </Button>
        </FadeInView>

        <Button style={[globalStyles.buttonRounded, globalStyles.bgPrimary, globalStyles.verticalMargin, globalStyles.centerHorizontal, isCourseActive ? styles.shadow : {}, {width: 200, height: 200}]} onPress={this.handleTrackThrow}>
          {!loading && <Text style={[globalStyles.textPrimary]}>Throw</Text>}
          {!!loading && <FadeInView visible={true}><Spinner color="green" /></FadeInView>}
        </Button>

        {isCourseActive && isLaneActive && <FadeInView fadeOutDuration={100} style={[styles.fadeinView, {position: 'absolute', bottom: 20, right: 20}]} visible={true}>
          <Button style={[globalStyles.buttonRounded, styles.smallButtons, styles.shadow, {backgroundColor: 'green'}]}  onPress={this.handleEndLane}>
            <Icon size={30} style={[globalStyles.textDefault]} name='ios-basket' />
          </Button>
        </FadeInView>}

        {isCourseActive && !isLaneActive && <FadeInView style={[styles.fadeinView, {position: 'absolute', bottom: 20, right: 20}]} visible={true}>
          <Button style={[globalStyles.buttonRounded, globalStyles.bgSuccess, styles.smallButtons, styles.shadow]}  onPress={this.handleEndCourse}>
            <Icon size={30} style={[globalStyles.textDefault, globalStyles.bgTransparent, {paddingTop: 3, paddingBottom: 0}]} name='ios-close' />
          </Button>
        </FadeInView>}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  fadeinView: {
    width: 50,
    height: 50
  },
  smallButtons: {
    width: 50,
    height: 50
  },
  stopButton: {
    width: 60,
    height: 60,
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  errorButton: {
    width: 50,
    height: 50,

  },
  shadow: {
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2
  },
  icon: {
    transform: [{rotateX: '60deg'}]
  },
  font: {
    fontFamily: 'Roboto',
    fontSize: 20
  }
});
