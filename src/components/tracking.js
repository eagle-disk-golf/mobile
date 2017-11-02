import React, {Component} from 'react';
import {Text, Button, Toast, Content, Header} from 'native-base';
import Container from './container';
import {styles} from '../res/styles'

import geolocation from '../services/geolocation';

import {hole, round} from '../constants/tracking';

import { NavigationActions } from 'react-navigation'



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
          start_time: position.timestamp
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
        end_time: position.timestamp,
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
    console.log(this.props, 'this state');
    const {hole, round} = this.state;
    return (
      <Container style={styles.centerContent}>
        <Text style={[styles.textPrimary]}>
          Hole number: {round.holes.length}
        </Text>
        <Text style={[styles.textPrimary]}>
          Current hole throw count: {hole.total_throws}
        </Text>
        <Text style={[styles.textPrimary]}>
          Par: {hole.total_throws - hole.par}
        </Text>
        <Button style={[styles.buttonRounded, styles.verticalMargin, styles.centerHorizontal, {width: 200, height: 200}]} onPress={this.handleTrackThrow}>
          <Text>Add</Text>
        </Button>


        <Button style={[styles.verticalMargin, styles.centerHorizontal]} onPress={this.handleEndHole}>
          <Text>End hole</Text>
        </Button>
      </Container>
    );
  }
}