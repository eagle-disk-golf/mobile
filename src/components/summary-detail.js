import React, {Component} from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
/** https://docs.nativebase.io/Components.html#Spinner */
import {Spinner, Text} from 'native-base';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';
import firebase, {DB_NAMES} from '../services/firebase';
import {toArray} from '../helpers/data';

/**
 * titleHeight sets the height of the title bar.
 * TitleComponent function takes item, index and onPress as parameters.
 * Inside of the function it sets score variable as (totalThrows + penalty) - par.
 * scoreWithSign takes in a string if score is less than 0. Otherwise shows "+score".
 * scoreColor shows danger color if score is bigger than 0. Otherwise shows success color.
 * Returns a TouchableOpacity item which shows info from a game that you can click.
 */
const titleHeight = 60;
const TitleComponent = ({item, index, onPress}) => {
const score = (item.totalThrows + item.penalty) - item.par;
const scoreWithSign = score < 0 ? score.toString() : `+${score}`;
const scoreColor = score > 0 ? COLORS.danger : COLORS.success;

return (
  <TouchableOpacity onPress={onPress}>
    <View style={[styles.titleContainer]}>
      <View style={[styles.titleItemContainer, styles.borderRight]}>
        <Text>{index + 1}</Text>
      </View>

      <View style={[styles.titleItemContainer, styles.borderRight, {flexDirection: 'row'}]}>
        <Text>{item.throws.length}</Text>
        <Text style={globalStyles.textDanger}> {item.penalty ? `+${item.penalty}` : ''}</Text>
      </View>

        <View style={[styles.titleItemContainer, styles.borderRight]}>
          <Text>{item.par}</Text>
        </View>

        <View style={styles.titleItemContainer}>
          <Text style={{color: scoreColor}}>{score === 0 ? 'par' : scoreWithSign}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default class SummaryDetail extends Component {
    /**
     * Makes an array for lanes and loading false.
     */
  constructor(props) {
    super(props);
    this.state = {
      lanes: [],
      loading: false
    };
  }

    /**
     * Course variable check, if navigation props is not found then returns an empty object.
     */
  componentDidMount() {
    const course = this.props.navigation.state.params || {};
    this.fetchData(course);
  }

    /**
     * Sets the state to true.
     */
  showLoader() {this.setState({loading: true});}

    /**
     * Sets the state to false.
     */
  hideLoader() {this.setState({loading: false});}

    /**
     * Shows the loading animation. Loads the database information. Hides the loading animation.
     */
  fetchData(course) {
    this.showLoader();

    firebase.database()
      .ref(DB_NAMES.lanes)
      .orderByChild('courseId')
      .equalTo(course.courseId)
      .once('value').then(snapshot => {
      const data = toArray(snapshot.val());
      this.setState({lanes: data});
      this.hideLoader();
    });
  }

    /**
     * Rendering function sets the default variables for lanes and loading first.
     * Returns a ScrollView component with a table-like view.
     * If it is loading from the database it shows a Spinner, if not it shows game information
     * and onPress you can proceed to more detailed view.
     */
  render() {
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
            {!loading && lanes && lanes.map((lane, index) =>
              <TitleComponent
                key={index}
                index={index}
                item={lane}
                onPress={() => this.props.navigation.navigate('SummaryDetailLane', {lane, index})} />)}
          </View>
        </ScrollView>
      </View>
    );
  }
}

/**
 * Variables and stylesheet.
 */
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
    width: '33%',
    paddingTop: 20,
    paddingBottom: 20
  },
});
