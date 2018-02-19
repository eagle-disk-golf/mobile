import React, {Component} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {Text, ListItem, Body, Right} from 'native-base';
import Icon from './icon';
import InfiniteListView from './infinite-list-view';
import {globalStyles} from '../res/styles';
import firebase, {DB_NAMES} from '../services/firebase';
import time from '../helpers/time';
import {toArray, reverseArray} from '../helpers/data';

const CustomListItem = ({item, index, onPress, onLongPress}) => {
  const timeStamp = item && item.startLocation ? item.startLocation.timestamp : null;
  const completed = item && item.completed;

  return <ListItem style={globalStyles.bgDefault} key={index} onPress={onPress} onLongPress={onLongPress}>
    <Body>
      <Text>{timeStamp ? `${time.getFormattedDate(timeStamp)} ${time.getFormattedTime(timeStamp)}` : ''}</Text>
      {completed && <Text note>{item && item.address && item.address.formatted_address}</Text>}
      {!completed && <Text>Active course</Text>}
    </Body>
    <Right>
      <ArrowForwardIcon />
    </Right>
  </ListItem>;
};

export default class Summary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hasFetchedOnce: false,
      loading: false,
      refreshing: false,
      dataset: [],
      offset: 8,
      canLoadMore: true,
      lastCourseId: null
    };

    this.fetchGames = this.fetchGames.bind(this);
  }

  showLoader() {
    this.setState({loading: true});
  }

  hideLoader() {
    this.setState({loading: false});
  }

  canLoad() {
    return this.state.canLoadMore;
  }

  fetchGames() {
    const {offset, hasFetchedOnce, lastCourseId} = this.state;
    this.showLoader();

    // When fetching first time, we don't have any course id's that we need in order to implement infinite scroll (fetching courses between id's)
    // That's why on the first time, we just fetch the latest courses from the firebase (offset determines this), and after that we start fetching the courses
    // before the last courseId we received
    if (!hasFetchedOnce) {
      firebase.database()
        .ref(DB_NAMES.courses)
        .orderByKey()
        .limitToLast(offset)
        .once('value')
        .then(snapshot => {
          const value = toArray(snapshot.val());
          const dataset = reverseArray(value);
          this.setState({
            dataset,
            lastCourseId: value[0].courseId,
            hasFetchedOnce: true,
            canLoadMore: value.length === offset,
            refreshing: false
          }, this.hideLoader());
        }).catch(_ => {
          this.showAlert({title: 'Whoops', content: 'Cannot fetch latest games'});
        });
    } else {
      firebase.database()
        .ref(DB_NAMES.courses)
        .orderByKey()
        .endAt(lastCourseId)
        .limitToLast(offset)
        .once('value')
        .then(snapshot => {
          const value = toArray(snapshot.val());
          const dataset = [...this.state.dataset, ...reverseArray(value).slice(1)];

          this.setState({
            dataset,
            lastCourseId: value[0].courseId,
            canLoadMore: value.length == offset,
            refreshing: false
          }, this.hideLoader());
        }).catch(_ => {
          this.showAlert({title: 'Whoops', content: 'Cannot fetch latest games'});
        });
    }
  }

  refreshGames() {
    const {loading} = this.state;

    if (!loading) {
      this.setState({
        refreshing: true,
        hasFetchedOnce: false,
        lastCourseId: ''
      }, this.fetchGames);
    }
  }

  componentDidMount() {
    this.fetchGames();
  }

  confirmDelete(item) {
    Alert.alert(
      'Delete game',
      'Are you sure you want to delete the selected game?',
      [
        {text: 'Yes, delete the game', onPress: () => this.deleteItem(item)},
        {text: 'Cancel'}
      ]);
  }
  showAlert(alert) {
    Alert.alert(
      alert.title,
      alert.content,
      [{text: 'Okay'}]
    );
  }

  deleteItem(item) {
    const {dataset} = this.state;

    this.setState({refreshing: true});
    firebase.database().ref(DB_NAMES.courses + item.courseId).remove().then(res => {
      const filteredState = dataset.filter((val) => val.courseId !== item.courseId);
      this.setState({refreshing: false, dataset: filteredState});
    }).catch(er => {
      this.showAlert({title: 'Whoops', content: 'Error occured when trying to delete this game'});
      console.warn(er);
    });
  }


  render() {
    const {loading, dataset, refreshing} = this.state;
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <Text style={[globalStyles.h3, globalStyles.centerHorizontal, styles.header]}>Latest games</Text>

        <InfiniteListView
          data={dataset}
          renderRow={({item, index}) =>
            <CustomListItem
              index={index}
              item={item}
              onPress={() => navigation.navigate('SummaryDetail', item)}
              onLongPress={() => this.confirmDelete(item)} />}
          canLoad={this.canLoad()}
          isLoading={loading}
          onLoad={this.fetchGames}
          refreshing={refreshing}
          onRefresh={() => this.refreshGames()}
        />

      </View>
    );
  }
}

const ArrowForwardIcon = () => <Icon size={20} name="ios-arrow-forward" />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginVertical: 20
  },
  list: {

  }
});
