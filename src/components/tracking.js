/*
 eslint max-len: 0
*/
import React, {Component} from 'react';
import {View, StyleSheet, Alert, PermissionsAndroid} from 'react-native';
import {Text, Button, Toast, ActionSheet, Spinner} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Icon from './icon';
import FadeInView from './fade-in-view';
// import NewCourseModal from './new-course-modal';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';

import firebase, {DB_NAMES} from '../services/firebase';
import geolocation from '../services/geolocation';
import {getAddressByCoordinates} from '../services/geocoding';
import {isAndroid} from '../helpers/platform';

import {LANE, COURSE} from '../constants/tracking';

const newEmptyCourse = _ => {return {...COURSE, lanes: {}};};
const newEmptyLane = _ => {return {...LANE};};


/*
  return the node param (session, round or lane) if it is already referenced in firebase.
  if the node param is only initialized (missing id's) it will create new reference to the firebase database
  and return that node
*/

const getOrCreateNodeWithIdFromFirebase = (node, idField, table) => {
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


const getOrCreateCourseWithId = (node) => getOrCreateNodeWithIdFromFirebase(node, 'courseId', DB_NAMES.courses);
const getOrCreateLaneWithId = (node) => getOrCreateNodeWithIdFromFirebase(node, 'laneId', DB_NAMES.lanes);

export default class Tracking extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lane: newEmptyLane(),
      course: newEmptyCourse(),
      isCourseActive: false,
      isLaneActive: false,
      error: null,
      faultyThrow: {show: false, penalty: 1},
      loading: false,
      initialized: true,
      androidLocationPermission: false,
      androidLocationPermissionRequested: false
    };

    this.handleTrackThrow = this.handleTrackThrow.bind(this);
    this.handleEndLane = this.handleEndLane.bind(this);
    this.handleEndCourse = this.handleEndCourse.bind(this);
    this.endCourse = this.endCourse.bind(this);
    this.handleSelectFaultyThrow = this.handleSelectFaultyThrow.bind(this);
  }

  componentDidMount() {
    const {androidLocationPermissionRequested, androidLocationPermission} = this.state;
    // check if android has permission to read location
    if (isAndroid && !androidLocationPermissionRequested && !androidLocationPermission) {
      setTimeout(() => {
        this.requestPermissionToReadLocation();
      }, 1000);
    }


    // THis was used the fetch the latest game from firebase and check if the previous game was
    // completed. Because we don't actually have users in the database everyone will be playing the same game

    // firebase.database().ref(DB_NAMES.courses).limitToLast(1).once('value').then(snapshot => {
    //   const value = snapshot.val() ? snapshot.val() : {};
    //   const latestCourse = Object.keys(value).map(key => { return {...value[key]}; })[0];

    //   // get the last played lane
    //   const lanesById = latestCourse && latestCourse.lanes ? Object.keys(latestCourse.lanes).map(key => key) : [];
    //   const lastLaneId = lanesById[lanesById.length - 1];

    //   if (latestCourse && !latestCourse.completed) {
    //     // latest course has not been completed, fetch latest lane to check if was completed
    //     // this.setState({course: latestCourse, isCourseActive: true});
    //     const courseToState = {course: latestCourse, isCourseActive: true};

    //     firebase.database().ref(DB_NAMES.lanes + lastLaneId).once('value').then(snapshot => {
    //       const latestLane = snapshot.val() ? snapshot.val() : {};

    //       let laneToState = latestCourse && !latestLane.completed ? {lane: latestLane, isLaneActive: true} : {};

    //       this.setState({...courseToState, ...laneToState, initialized: true});
    //     });
    //   } else {
    //     // latest course was completed successfully
    //     this.setState({initialized: true});
    //   }
    // });
  }

  requestPermissionToReadLocation(callback = null) {
    const self = this;
    async function req() {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
            'title': 'Location permissions',
            'message': 'EagleDiscGolf needs access to your location ' +
              'in order to track your throws correctly'
          }
        );

        let stateOptions = {};
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          stateOptions['androidLocationPermission'] = true;
        } else {
          stateOptions['androidLocationPermission'] = false;
          self.displayError({message: 'Please allow EagleDiscGolf to use your location services'});
        }

        stateOptions['androidLocationPermissionRequested'] = true;
        self.setState(stateOptions);
      } catch (er) {
        console.warn(er);
      }
    };

    req().then(() => {
      if (callback !== null) callback();
    }).catch(er => this.displayError(er));
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
    ]);
}

handleTrackThrow() {
  const {isLaneActive, androidLocationPermission, androidLocationPermissionRequested} = this.state;
    if (isAndroid && !androidLocationPermission && !androidLocationPermissionRequested) {
      // request permission from user
      // run this function again to
      this.requestPermissionToReadLocation();
      return;
    }

    if (isLaneActive) {
      this.continueLane();
    } else this.startNewLane();
  }

  startNewLane() {
    const {isCourseActive} = this.state;

    // use javascript Promise the handle all the async functions
    this.showLoader();
    const promises = [getOrCreateCourseWithId(this.state.course), getOrCreateLaneWithId(this.state.lane), geolocation.getCurrentPosition()];
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
        startLocation: geolocation,
        isActive: true
      };

      let lanesById = initialCourse.lanes ? initialCourse.lanes : {};
      lanesById[lane.laneId] = true;
      const course = {
        ...initialCourse,
        lanes: lanesById,
        startLocation: geolocation
      };

      // set this lane to state and push to firebase
      let updates = {};
      updates[DB_NAMES.lanes + lane.laneId] = lane;
      updates[DB_NAMES.courses + course.courseId] = course;

      this.setState({lane, course, isCourseActive: true, isLaneActive: true});
      firebase.database().ref().update(updates);
      this.hideLoader();

      if (!isCourseActive) {
        // fetch location and update it to course asynchronoysly
        getAddressByCoordinates(geolocation).then(val => {
          const address = val && val.results && val.results[0] ? val.results[0] : null;
          let addressUpdate = {};
          addressUpdate[DB_NAMES.courses + course.courseId + '/address'] = address;

          this.setState({course: {...this.state.course, address}});
          firebase.database().ref().update(addressUpdate);
        }).catch(_ => {
          // console.warn(er);
        });
      }
    }).catch((error) => {
      this.displayError(error);
      this.hideLoader();
    });
  }

  continueLane() {
    // lane is started
    this.showLoader();
    const promises = [getOrCreateLaneWithId(this.state.lane), geolocation.getCurrentPosition()];
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
    });
  }

  // when ending round, is the user at the basket or not??
  handleEndLane() {
    // dont end if no throws
    if (this.state.lane.throws.length) {
      this.showLoader();
      const promises = [getOrCreateLaneWithId(this.state.lane), geolocation.getCurrentPosition()];
      // hole is started
      Promise.all(promises).then(values => {
        const currentLane = values[0];
        const geolocation = values[1];

        const completedLane = {
          ...currentLane,
          endLocation: geolocation,
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
        this.displayError(error);
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
          {text: 'Yes, end game', onPress: () => this.endCourse()},
          {text: 'Cancel', onPress: () => console.log('cancel')}
        ]);
    }
  }

  endCourse() {
    this.showLoader();
    const promises = [getOrCreateCourseWithId(this.state.course), geolocation.getCurrentPosition()];
    // hole is started
    Promise.all(promises).then(values => {
      const currentCourse = values[0];
      const geolocation = values[1];

      const updatedCourse = {
        ...currentCourse,
        completed: true,
        endLocation: geolocation
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

  handleSelectFaultyThrow() {
    const {isCourseActive, isLaneActive} = this.state;

    const BUTTONS = [
      {name: 'over-bound', flag: 'isOverBound', text: 'Over bound', icon: 'remove-circle', iconColor: COLORS.success, penalty: 1},
      {name: 'lost', flag: 'isLost', text: 'Lost', icon: 'eye-off', iconColor: COLORS.primary, penalty: 1},
      {name: 'mando', flag: 'isMando', text: 'Mando', icon: 'redo', iconColor: COLORS.warning, penalty: 1},
      {name: 'cancel', text: 'Cancel', icon: 'close', iconColor: '#25de5b'}
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
        const pressedButton = BUTTONS[buttonIndex];
        // for some reason, buttonIndex is NOT a number but a string
        if (pressedButton.name !== 'cancel') {
          this.setFaultyThrow(BUTTONS[buttonIndex]);
          this.flashFaultyThrowError(BUTTONS[buttonIndex]);
        }
      });
    }
  }

  setFaultyThrow(faultyThrow) {
    const promises = [getOrCreateLaneWithId(this.state.lane)];
    Promise.all(promises).then(resolvedValues => {
      const currentLane = resolvedValues[0];

      let throws = currentLane.throws;
      // last throw, add flag that is true (isOverBound, isLost etc)
      throws[throws.length - 1][faultyThrow.flag] = true;

      const lane = {
        ...currentLane,
        penalty: currentLane.penalty + faultyThrow.penalty,
        throws
      };

      this.setState({lane});

      firebase.database().ref(DB_NAMES.lanes + lane.laneId).set(lane);
    });
  }

  flashFaultyThrowError(faultyThrow, duration = 1000) {
    this.setState({faultyThrow: {...faultyThrow, show: true}});
    setTimeout(() => {
      this.setState({faultyThrow: {penalty: 1, show: false}});
    }, duration);
  }


  render() {
    const {lane, course, isLaneActive, isCourseActive, loading, initialized, faultyThrow} = this.state;
    // const isGameActive = isCourseActive || isLaneActive;
    const laneNumber = Object.keys(course.lanes).length;


    const toggleTransparentText = (isVisible, styleClass) => isVisible ? styleClass : {color: 'transparent'};

    if (!initialized) { return <View style={[globalStyles.container]}>
      <Spinner color='green' />
    </View>;
    };

    return (
      <Grid style={styles.grid}>
        <Col>

          <Row style={[globalStyles.centerBottom, globalStyles.centerHorizontal]} size={35}>
            {!isCourseActive && <FadeInView style={[globalStyles.centerContent]} visible={!isCourseActive && !isLaneActive}>
              <View style={[globalStyles.centerContent, {marginBottom: 40}]}>
                <Text style={[globalStyles.textPrimary]}>You're at the Tee, ready to start a new game?</Text>
              </View>
            </FadeInView>}

            {isCourseActive && <FadeInView visible={isCourseActive || isLaneActive}>
              <View style={[globalStyles.centerContent, {marginBottom: 40}]}>
                <Text style={[toggleTransparentText(isCourseActive, globalStyles.textPrimary), globalStyles.verticalMargin]}>
                  Lane number: {laneNumber}
                </Text>
                <Text style={[toggleTransparentText(isCourseActive && isLaneActive, globalStyles.textPrimary), globalStyles.verticalMargin]}>
                  Throws: {lane.totalThrows + lane.penalty}
                </Text>
                <FadeInView visible={faultyThrow.show}>
                  <Text style={[globalStyles.textWarning]}>+{faultyThrow && faultyThrow.penalty}</Text>
                </FadeInView>
              </View>
            </FadeInView>}
          </Row>


          <Row style={[globalStyles.centerContent]} size={65}>
            <FadeInView style={[styles.fadeinView, {position: 'absolute', bottom: 20, left: 20}]} visible={isCourseActive && isLaneActive}>
              <Button style={[globalStyles.buttonRounded, globalStyles.bgSuccess, styles.smallButtons, styles.border, styles.shadow]} onPress={this.handleSelectFaultyThrow}>
                <Icon size={30} style={[globalStyles.textDefault]} name='ios-alert' />
              </Button>
            </FadeInView>

            <Button style={[
              globalStyles.buttonRounded, globalStyles.bgPrimary, globalStyles.centerVertical, styles.border,
              isCourseActive ? styles.shadow : {}, {width: 200, height: 200}]} onPress={this.handleTrackThrow}>
              {!loading && <Text style={[globalStyles.textPrimary]}>{!isCourseActive ? 'Start' : isLaneActive ? 'Throw' : 'Continue'}</Text>}
              {!!loading && <FadeInView visible={true}><Spinner color="green" /></FadeInView>}
              {
                /* <NewCourseModal onSuccess={(text) => this.handleStartNewCourse(text)} visible={newCourseModalVisible} placeholderText={address ? address : previousCourseName} /> */
              }
            </Button>

            {isCourseActive && isLaneActive && <FadeInView fadeOutDuration={100} style={[styles.fadeinView, {position: 'absolute', bottom: 20, right: 20}]} visible={true}>
              <Button style={[globalStyles.buttonRounded, styles.smallButtons, styles.border, styles.shadow, {backgroundColor: COLORS.success}]} onPress={this.handleEndLane}>
                <Icon size={30} style={[globalStyles.textDefault]} name='ios-basket' />
              </Button>
            </FadeInView>}

          </Row>
          {isCourseActive && !isLaneActive && <FadeInView style={[styles.fadeInView, {position: 'absolute', bottom: 20, left: 0, right: 0}]} visible={true}>
            <Button style={[globalStyles.buttonRounded, globalStyles.bgSuccess, styles.smallButtons, styles.border, styles.shadow, {alignSelf: 'center'}]} onPress={this.handleEndCourse}>
              {/* <Text>Quit</Text> */}
              <Icon size={30} style={[globalStyles.textDefault, globalStyles.bgTransparent, {paddingTop: 3, paddingBottom: 0}]} name='ios-close' />
            </Button>
          </FadeInView>}
        </Col>
      </Grid>
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
    height: 50,
  },
  border: {
    borderWidth: 0.2,
    borderColor: COLORS.textPrimary
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
  },
  grid: {
    backgroundColor: '#F8FDFF'
  }
});
