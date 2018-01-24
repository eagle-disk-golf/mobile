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
import {Text, List, ListItem, Body, Right, Spinner} from 'native-base';
import Icon from './icon';
import {globalStyles} from '../res/styles';
import firebase, {DB_NAMES} from '../services/firebase';
import time from '../services/time';

export default class Summary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
      loading: false,
      games: []
    };
  }

  showLoader() {
    this.setState({loading: true});
  }

  hideLoader() {
    this.setState({loading: false});
  }

  componentDidMount() {
    this.showLoader();
    firebase.database().ref(DB_NAMES.courses).limitToLast(10).once('value').then(snapshot => {
      const value = snapshot.val() ? snapshot.val() : {};
      const latestGames = Object.keys(value).map(key => {return {...value[key]};});

      this.setState({games: latestGames});
      this.hideLoader();
    });
  }


  render() {
    const {loading} = this.state;

    return (
      <View>
        <Text style={[globalStyles.h3, globalStyles.centerHorizontal, styles.header]}>Latest games</Text>
        <List
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
        </List>
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
