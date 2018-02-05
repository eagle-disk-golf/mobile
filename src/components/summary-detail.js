/*
  KIDE
  File created: 30.11.2017
  Made by: Topi
  History:

*/

import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {Spinner} from 'native-base';
import PanelList from './panel-list';
import Panel from './panel';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';
import firebase, {DB_NAMES} from '../services/firebase';
import {toArray} from '../helpers/data';

class SummaryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset: [],
      loading: false
    };
  }

  componentDidMount() {
    const course = this.props.navigation.state.params || {};
    this.fetchData(course);
  }

  showLoader() { this.setState({loading: true}); }

  hideLoader() { this.setState({loading: false}); }

  fetchData(course) {
    console.log(course, 'course');
    this.showLoader();

    firebase.database().ref(DB_NAMES.lanes).orderByChild('courseId').equalTo(course.courseId).once('value').then(snapshot => {
      const data = toArray(snapshot.val());
      this.setState({dataset: data});
      console.log(data, 'res data');
      this.hideLoader();
    });
  }


  render() {
    console.log(this.props, 'props');
    const {dataset, loading} = this.state;
    return (
      <View>
        <PanelList lanes={dataset} />
      </View>
    );
  }
}

export default SummaryDetail;

