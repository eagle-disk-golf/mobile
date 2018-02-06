/*
  KIDE
  File created: 30.11.2017
  Made by: Topi
  History:

*/

import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView, TouchableOpacity, } from 'react-native';
import {Spinner} from 'native-base';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';
import firebase, {DB_NAMES} from '../services/firebase';
import {toArray} from '../helpers/data';

const titleHeight = 60;
const TitleComponent = ({item, index, testi}) => {
  const score = item.throws.length - item.par;
  const scoreWithSign = score < 0 ? score.toString() : `+${score}`;

  return (
    <TouchableOpacity onPress={testi}>
    <View style={[styles.titleContainer]}>
    <View style={[styles.titleItemContainer, styles.borderRight]}><Text>{index + 1}</Text></View>
    <View style={[styles.titleItemContainer, styles.borderRight]}><Text>{item.throws.length}</Text></View>
    <View style={[styles.titleItemContainer, styles.borderRight]}><Text>{item.par}</Text></View>
    <View style={styles.titleItemContainer}><Text>{score === 0 ? 'par' : scoreWithSign}</Text></View>
  </View>
  </TouchableOpacity>
  );
};

export default class SummaryDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lanes: [],
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
      this.setState({lanes: data.reverse()});
      this.hideLoader();
    });
  }


  render() {
    console.log(this.props, 'props');
    const {lanes, loading} = this.state;
    return (
      <View>
           <ScrollView removeClippedSubviews={false} ref='scrollList' style={styles.container}>
        <View renderToHardwareTextureAndroid={true} collapsable={false} ref='scrollListContainer' onLayout={() => {}}>
          <View style={[globalStyles.bgSuccess, styles.titleContainer, styles.border]}>
            <View style={[styles.titleItemContainer, styles.borderRight]}>
              <Text style={globalStyles.textDefault}>Lane</Text>
            </View>
            <View style={[styles.titleItemContainer, styles.borderRight]}>
              <Text style={globalStyles.textDefault}>Throws</Text>
            </View>
            <View style={[styles.titleItemContainer, styles.borderRight]}>
              <Text style={globalStyles.textDefault}>Par</Text>
            </View>
            <View style={styles.titleItemContainer}>
              <Text style={globalStyles.textDefault}>Score</Text>
            </View>
          </View>

          {loading && <Spinner color="green" />}
          {!loading && lanes && lanes.map((lane, index) => <TitleComponent key={index} index={index} item={lane} testi={() => this.props.navigation.navigate('SummaryDetailLane', lane) } /> )}
        </View>
      </ScrollView>
      </View>
    );
  }
}


const borderWidth = 0.5;
/* eslint object-shorthand: 0 */
const styles = StyleSheet.create({
  container: {
    margin: 10,
    paddingBottom: 50
  },
  titleContainer: {
    height: titleHeight,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: borderWidth,
    borderBottomWidth: borderWidth,
    borderRightWidth: borderWidth,
    borderColor: COLORS.textPrimary
  },
  border: {
    borderColor: COLORS.white,
    borderWidth: borderWidth
  },
  borderRight: {
    borderRightColor: COLORS.textPrimary,
    borderRightWidth: 0.5
  },
  titleItemContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  borderLeft: {
    borderLeftColor: 'black',
    borderLeftWidth: 1
  },
  resultsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  result: {
    // backgroundColor: 'orange',
    width: '33%',
    paddingTop: 20,
    paddingBottom: 20
  }
});
