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
import {View, StyleSheet, FlatList, ListView, TouchableHighlight} from 'react-native';
import {Text, List, ListItem, Body, Right, Spinner} from 'native-base';
import Icon from './icon';
import {globalStyles} from '../res/styles';
import firebase, {DB_NAMES} from '../services/firebase';
import time from '../services/time';

const CustomListItem = ({item, index, navigation}) => {
  return <ListItem key={index} onPress={() => navigation.navigate('SummaryDetail')}>
    <Body>
      <Text>{item && item.startLocation && item.startLocation.timestamp ? time.getFormattedDate(item.startLocation.timestamp) : ''}</Text>
      <Text note>{item.address.formatted_address}</Text>
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
      canLoadMore: true
    };

    this.fetchGames = this.fetchGames.bind(this);
  }

  showLoader() {
    this.setState({loading: true});
  }

  hideLoader() {
    this.setState({loading: false});
  }

  fetchGames() {
    this.setState({fetching: true});
    const {page, offset, itemsPerPage, fetching} = this.state;

    if (!fetching) {
      this.showLoader();
      firebase.database().ref(DB_NAMES.courses).limitToLast(offset).once('value').then(snapshot => {
        const value = snapshot.val() ? snapshot.val() : {};
        const latestGames = Object.keys(value).map(key => {return {...value[key]};}).reverse();

        const canLoadMore = latestGames.length > 0 ? true : false;

        this.setState({dataset: [...this.state.dataset, ...latestGames], canLoadMore, page: page + 1, offset: offset + itemsPerPage, fetching: false});
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
      <View style={{flex: 1}}>
        <Text style={[globalStyles.h3, globalStyles.centerHorizontal, styles.header]}>Latest games</Text>
        {/* <FlatList
          style={[globalStyles.bgDefault, {flex: 1}]}
          data={dataset || []}
          // onRefresh={this.fetchGames}
          refreshing={loading}
          // onEndReachedThreshold={0.5}
          // onEndReached={_ => this.fetchGames()}
          renderItem={({item, index, separators}) => <CustomListItem key={index} item={item} navigation={this.props.navigation} />}>
        </FlatList> */}

        {/* <List
          style={[globalStyles.bgDefault]}
          dataArray={this.state.games || []}
          renderRow={(game) => <ListItem onPress={() => this.props.navigation.navigate('SummaryDetail')}>
            <Body>
              <Text>{game && game.startLocation && game.startLocation.timestamp ? time.getFormattedDate(game.startLocation.timestamp) : ''}</Text>
              <Text note>{game.address.formatted_address}</Text>
            </Body>
            <Right>
              <ArrowForwardIcon />
            </Right>
          </ListItem>}>
        </List> */}
        {loading && <Spinner color='green' />}
      </View>
    );
  }
}

const ArrowForwardIcon = () => <Icon size={20} name="ios-arrow-forward" />;

const styles = StyleSheet.create({
  header: {
    marginVertical: 20
  }
});
