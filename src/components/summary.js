import React, {Component} from 'react';
import { View, StyleSheet, Alert } from 'react-native';
/** https://docs.nativebase.io/Components.html#list-def-headref */
import {Text, ListItem, Body, Right} from 'native-base';
import Icon from './icon';
import InfiniteListView from './infinite-list-view';
import {globalStyles} from '../res/styles';
import firebase, {DB_NAMES} from '../services/firebase';
import time from '../helpers/time';
import { toArray, reverseArray } from '../helpers/data';

/**
 * CustomListItem function that takes item, index, onPress and onLongPress as parameters.
 * timeStamp is database's startLocation's timestamp if found.
 * completed marks the item completed.
 * Returns ListItem with a timestamp that includes date and time. Text note either includes address or information about active course.
 * Right side is filled with an arrow. You can short or long press the item.
 * @CustomListItem
 * @ListItem
 * @Body
 * @Text
 * @ArrowForwardIcon
 * @Right
 * @globalStyles
 * @timeStamp
 * @getFormattedDate
 * @getFormattedTime
 * @item
 * @timeStamp
 * @completed
 */
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
    /**
     * Constructor with props fetching the data from the database. ES6 binding to fetchGames.
     * @constructor
     * @fetchGames
     */
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

    /**
     * Show animation loader.
     * @showLoader
     */
  showLoader() {
    this.setState({loading: true});
  }

    /**
     * Hide animation loader.
     * @hideLoader
     */
  hideLoader() {
    this.setState({loading: false});
  }

    /**
     * Possibility to load more items to list.
     * @canLoad
     */
  canLoad() {
    return this.state.canLoadMore;
  }

    /**
     * fetchGames function that shows loading animation first.
     * If there has not been any fetching done, a database fetch activates.
     * @fetchGames
     * @offset
     * @hasFetchedOnce
     * @lastCourseId
     * @firebase
     * @value
     * @dataset
     */
  fetchGames() {
    const {offset, hasFetchedOnce, lastCourseId} = this.state;
    this.showLoader();

    /**
     * When fetching first time, we don't have any course id's that we need in order to implement infinite scroll (fetching courses between id's)
     * That's why on the first time, we just fetch the latest courses from the firebase (offset determines this), and after that we start fetching the courses
     * before the last courseId we received.
     */
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

    /**
     * refreshGames function that checks if the list is not loading it refreshes the state with these values.
     * @loading
     * @refreshGames
     */
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

    /**
     * Invokes fetchGames when loaded.
     * @componentDidMount
     */
  componentDidMount() {
    this.fetchGames();
  }

    /**
     * Alert that prompts you to delete an item.
     * @confirmDelete
     * @deleteItem
     * @Alert
     */
  confirmDelete(item) {
    Alert.alert(
      'Delete game',
      'Are you sure you want to delete the selected game?',
      [
        {text: 'Yes, delete the game', onPress: () => this.deleteItem(item)},
        {text: 'Cancel'}
      ]);
  }

    /**
     * Shows an alert with title and content.
     * @showAlert
     * @Alert
     */
  showAlert(alert) {
    Alert.alert(
      alert.title,
      alert.content,
      [{text: 'Okay'}]
    );
  }

    /**
     * Function that deletes an item from the list and the database with a prompt.
     * @deleteItem
     * @dataset
     * @refreshing
     * @firebase
     */
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

    /**
     * Render function that returns the latest games from the database as a list view.
     * Uses infinite list view and onPress you get the details, onLongPress you can delete the item.
     * @loading
     * @dataset
     * @refreshing
     * @navigation
     * @return
     * @View
     * @Text
     * @InfiniteListView
     * @CustomListItem
     */
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

/**
 * ArrowForwardIcon on the right side of the list view.
 * @ArrowForwardIcon
 */
const ArrowForwardIcon = () => <Icon size={20} name="ios-arrow-forward" />;

/**
 * StyleSheet
 */
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
