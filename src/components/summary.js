/*
  KIDE
  File created: 23.10.2017
  Made by: Riku
  History:
  23.11.2017 Topi: List and ListItem added
  30.11.2017 Topi: Styling
  12.12.2017 Riku: Use custom icon component
*/

import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, ListItem, Body, Right} from 'native-base';
import Icon from './icon';
import InfiniteListView from './infinite-list-view';
import {globalStyles} from '../res/styles';
import firebase, {DB_NAMES} from '../services/firebase';
import time from '../services/time';

const CustomListItem = ({item, index, navigation}) => {
  return <ListItem key={index} onPress={() => navigation.navigate('SummaryDetail', item)}>
    <Body>
      <Text>{item && item.startLocation && item.startLocation.timestamp ? time.getFormattedDate(item.startLocation.timestamp) : ''}</Text>
      <Text note>{item && item.address && item.address.formatted_address}</Text>
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
      initialized: false,
      loading: false,
      fetching: false,
      dataset: [],
      page: 0,
      offset: 10,
      itemsPerPage: 10,
      canLoadMore: true,
      previousDatasetLength: 0
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
    this.setState({fetching: true});
    const {page, offset, itemsPerPage, fetching, previousDatasetLength} = this.state;

    if (!fetching) {
      this.showLoader();
      firebase.database().ref(DB_NAMES.courses).limitToLast(offset).once('value').then(snapshot => {
        const value = snapshot.val() ? snapshot.val() : {};
        const latestGames = Object.keys(value).map(key => {return {...value[key]};}).reverse();

        const canLoadMore = latestGames.length !== previousDatasetLength;

        this.setState({
          dataset: latestGames,
          canLoadMore, page: page + 1, offset: offset + itemsPerPage,
          fetching: false,
          initialized: true,
          lastCourseId: latestGames[0].courseId
        });
        this.hideLoader();
      });
    }
  }

  componentDidMount() {
    this.fetchGames();
  }


  render() {
    const {loading, dataset} = this.state;

    return (
      <View style={styles.container}>
        <Text style={[globalStyles.h3, globalStyles.centerHorizontal, styles.header]}>Latest games</Text>

        <InfiniteListView
          style={styles.list}
          data={dataset}
          renderRow={(item, _, index) => <CustomListItem index={index} item={item} navigation={this.props.navigation} />}
          canLoad={this.canLoad()}
          isLoading={loading}
          onLoad={this.fetchGames}
        />

      </View>
    );
  }
}

const ArrowForwardIcon = () => <Icon size={20} name="ios-arrow-forward" />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10
    // backgroundColor: '#fff'
  },
  header: {
    // backgroundColor: '#fff,
    marginVertical: 20
  },
  list: {

  }
});
