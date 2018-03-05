/* eslint max-len: 0 */
import React, {Component} from 'react';
import {View, StyleSheet, Alert, PermissionsAndroid} from 'react-native';
import {Text, Button, Toast, ActionSheet, Spinner} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import Icon from './icon';
import ModalSelector from 'react-native-modal-selector';
import FadeInView from './fade-in-view';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';

import firebase, {DB_NAMES} from '../services/firebase';
import geolocation from '../services/geolocation';
import {getAddressByCoordinates} from '../services/geocoding';
import {isAndroid} from '../helpers/platform';

import {LANE, COURSE} from '../constants/tracking';

// creates data for par-input selector
const getParSelectorData = () => {
  let data = [];

  for (let i = 0; i < 10; i++) {
    data.push({key: i, label: `${i}`});
  }

  return data;
};

const newEmptyCourse = _ => {return {...COURSE, lanes: {}};};
const newEmptyLane = _ => {return {...LANE};};

/**
  * Return the node param (session, round or lane) if it is already referenced in firebase.
  * If the node param is only initialized (missing id's) it will create new reference to the firebase database
  * and return that node
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
      resolve(newNode);
    } else {
      // return error
      reject({message: `Cannot get ${idField}`});
    }
  });
};

// get new or current course (with id reference in firebase)
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

  /**
  * ANDROID ONLY
  * request permission to read location data
  */
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

  /**
   * Display error on screen
   * @param {error} error (error-object)
   */
  displayError(error) {
    Alert.alert(
      'Whoops',
      error.message,
      [
        {text: 'Okay'},
      ]);
  }

  /**
   * Handles tracking button presses.
  */
  handleTrackThrow() {
    const {isLaneActive, androidLocationPermission, androidLocationPermissionRequested} = this.state;
    if (isAndroid && !androidLocationPermission && !androidLocationPermissionRequested) {
      // request permission from user
      this.requestPermissionToReadLocation();
      return;
    }

    // either start new or continue previous lane
    if (isLaneActive) {
      this.continueLane();
    } else this.startNewLane();
  }

  startNewLane() {
    const {isCourseActive} = this.state;

    // use javascript Promise the handle all the async functions
    this.showLoader();
    const promises = [getOrCreateCourseWithId(this.state.course), getOrCreateLaneWithId(this.state.lane), geolocation.getCurrentPosition()];
    /**
     * Resolved promises contain
     * [0] course-object (with id reference to firebase)
     * [1] lane-object (with id reference to firebase)
     * [2] geolocation-object
     */
    Promise.all(promises).then(values => {
      const initialCourse = values[0];
      const initialLane = values[1];
      const geolocation = values[2];

      // Create a new lane object. This will stored to firebase later
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

      // add reference to this new laneId to the current course
      let lanesById = initialCourse.lanes ? initialCourse.lanes : {};
      lanesById[lane.laneId] = true;
      const course = {
        ...initialCourse,
        lanes: lanesById,
        startLocation: geolocation
      };

      // add updated lane and course to state
      this.setState({lane, course, isCourseActive: true, isLaneActive: true});

      let updates = {};
      updates[DB_NAMES.lanes + lane.laneId] = lane;
      updates[DB_NAMES.courses + course.courseId] = course;

      // update firebase
      firebase.database().ref().update(updates);
      this.hideLoader();

      if (!isCourseActive) {
        // fetch location and update it to course asynchronoysly
        // if user has no internet connection this will fail but because this is not
        // critical feature to play the game, discard errors silently
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

    /**
     * Resolved promises contain
     * [0] lane-object (with id reference to firebase)
     * [1] geolocation-object
     */
    Promise.all(promises).then(values => {
      // const previousLane = this.state.lane;
      const currentLane = values[0];
      const geolocation = values[1];

      // update the currentLane by adding current throw into the throws array
      const lane = {
        ...currentLane,
        // add location to array
        throws: [...currentLane.throws, geolocation],
        totalThrows: currentLane.totalThrows + 1,
      };

      this.setState({lane});

      let updates = {};
      updates[DB_NAMES.lanes + lane.laneId] = lane;
      // update firebase
      firebase.database().ref().update(updates);
      this.hideLoader();
    }).catch((error) => {
      this.displayError(error);
      this.hideLoader();
    });
  }

  /**
   * Handle lane end when user has scored and is at the basket
   */
  handleEndLane() {
    // dont end if user has no throws
    if (this.state.lane.throws.length) {
      this.showLoader();

      const promises = [getOrCreateLaneWithId(this.state.lane), geolocation.getCurrentPosition()];
      /**
       * Resolved promises contain
       * [0] lane-object (with id reference to firebase)
       * [1] geolocation-object
       */
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
        // update firebase
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

  /**
   * Handle game ending click
   * User must confirm game ending first
   */
  handleEndCourse() {
    // confirm ending
    const {isCourseActive} = this.state;
    if (isCourseActive) {
      Alert.alert(
        'End game?',
        'Are you sure you want to end the current game?',
        [
          {text: 'Yes, end game', onPress: () => this.endCourse()},
          {text: 'Cancel'}
        ]);
    }
  }

  /**
   * Handle game ending (update to firebase)
   */
  endCourse() {
    this.showLoader();
    const promises = [getOrCreateCourseWithId(this.state.course), geolocation.getCurrentPosition()];

    /**
     * Resolved promises contain
     * [0] course-object (with id reference to firebase)
     * [1] geolocation-object
     */
    Promise.all(promises).then(values => {
      const currentCourse = values[0];
      const geolocation = values[1];

      const updatedCourse = {
        ...currentCourse,
        completed: true,
        endLocation: geolocation
      };

      // update state
      this.setState({course: newEmptyCourse(), isCourseActive: false});
      this.hideLoader();

      let updates = {};
      updates[DB_NAMES.courses + currentCourse.courseId] = updatedCourse;
      // update firebase
      firebase.database().ref().update(updates);
    }).catch((error) => {
      this.hideLoader();
      this.displayError(error);
    });
  }

  /**
   * Handle faulty throw selection
   * User will be displayed with actionSheet which has three option
   * 1. Over-bound
   * 2. Lost
   * 3. Mando
   */
  handleSelectFaultyThrow() {
    const {isCourseActive, isLaneActive} = this.state;

    const BUTTONS = [
      {name: 'over-bound', flag: 'isOverBound', text: 'Over bound', icon: 'remove-circle', iconColor: COLORS.success, penalty: 1},
      {name: 'lost', flag: 'isLost', text: 'Lost', icon: 'eye-off', iconColor: COLORS.primary, penalty: 1},
      {name: 'mando', flag: 'isMando', text: 'Mando', icon: 'redo', iconColor: COLORS.warning, penalty: 1},
      {name: 'cancel', text: 'Cancel', icon: 'close', iconColor: COLORS.danger}
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
          // get the pressed button
          // for some weird reason android and iOS have different type for buttonIndex (number, string)
          const pressedButton = BUTTONS[buttonIndex];
          if (pressedButton.name !== 'cancel') {
            this.setFaultyThrow(BUTTONS[buttonIndex]);
            this.flashFaultyThrowError(BUTTONS[buttonIndex]);
          }
        });
    }
  }

  /**
   * Handle saving faulty throw to the firebase
   */
  setFaultyThrow(faultyThrow) {
    const promises = [getOrCreateLaneWithId(this.state.lane)];
    /**
     * Resolved promises contain
     * [0] lane-object (with id reference to firebase)
     */
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

      // update state
      this.setState({lane});

      // update firebase
      firebase.database().ref(DB_NAMES.lanes + lane.laneId).set(lane);
    });
  }

  /**
   * Show error (usually +1) on screen
   * @param {faultyThrow}   object (error-object)
   * @param {duration}      number (determines how long the error will be displayed)
   */
  flashFaultyThrowError(faultyThrow, duration = 1000) {
    this.setState({faultyThrow: {...faultyThrow, show: true}});
    setTimeout(() => {
      this.setState({faultyThrow: {penalty: 1, show: false}});
    }, duration);
  }

  render() {
    const {lane, course, isLaneActive, isCourseActive, loading, initialized, faultyThrow} = this.state;
    const laneNumber = Object.keys(course.lanes).length;

    if (!initialized) {
      return <View style={[globalStyles.container]}>
        <Spinner color='green' />
      </View>;
    };

    return (
      <Grid style={styles.grid}>
        <Col>

          <Row style={[globalStyles.centerHorizontal, globalStyles.centerContent]} size={35}>
            {!isCourseActive && <FadeInView style={[globalStyles.centerContent]} visible>
              <View style={[globalStyles.centerContent]}>
                <Text style={[globalStyles.textPrimary]}>You're at the tee, ready to start a new game?</Text>
              </View>
            </FadeInView>}

            {isCourseActive && <FadeInView visible>
              <View style={[globalStyles.centerContent]}>
                {!isLaneActive && <Text style={styles.textMarginBottom}>You're at the next tee, continue game?</Text>}
                <Text style={[styles.textMarginBottom]}>
                  Lane number: {laneNumber}
                </Text>
                {isLaneActive && <View style={[{alignItems: 'center', width: '100%'}]}>
                  <Text style={[styles.textMarginBottom]}>
                    Throws: {lane.totalThrows + lane.penalty}
                  </Text>
                  <FadeInView style={[{position: 'absolute', right: -5}, styles.textMarginBottom]} visible={faultyThrow.show}>
                    <Text style={[globalStyles.textWarning]}>+{faultyThrow && faultyThrow.penalty}</Text>
                  </FadeInView>
                </View>}


                {isLaneActive && <ModalSelector
                  style={[styles.textMarginBottom]}
                  data={getParSelectorData()}
                  initValue={`Par: ${this.state.lane.par}`}
                  onChange={(option) => this.setState({lane: {...this.state.lane, par: option.key}})}
                  animationType='fade'
                  cancelText='Cancel'>
                  <View>
                    <Text>
                      Par {this.state.lane.par} <Icon size={15} name='ios-arrow-down' />
                    </Text>
                  </View>
                </ModalSelector>}
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
            </Button>

            {isCourseActive && isLaneActive && <FadeInView fadeOutDuration={100} style={[styles.fadeinView, {position: 'absolute', bottom: 20, right: 20}]} visible={true}>
              <Button style={[globalStyles.buttonRounded, styles.smallButtons, styles.border, styles.shadow, {backgroundColor: COLORS.success}]} onPress={this.handleEndLane}>
                <Icon size={30} style={[globalStyles.textDefault]} name='ios-basket' />
              </Button>
            </FadeInView>}

          </Row>
          {isCourseActive && !isLaneActive && <FadeInView style={[styles.fadeInView, {position: 'absolute', bottom: 20, left: 0, right: 0}]} visible={true}>
            <Button style={[globalStyles.buttonRounded, globalStyles.bgSuccess, styles.smallButtons, styles.border, styles.shadow, {alignSelf: 'center'}]} onPress={this.handleEndCourse}>
              <Icon size={30} style={[globalStyles.textDefault, globalStyles.bgTransparent, {paddingTop: 3, paddingBottom: 0}]} name='ios-close' />
            </Button>
          </FadeInView>}
        </Col>
      </Grid>
    );
  }
}

const styles = StyleSheet.create({
  textMarginBottom: {
    marginBottom: 10
  },
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
    backgroundColor: COLORS.white
  }
});
