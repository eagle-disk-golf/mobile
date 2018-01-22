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
import {View} from 'react-native';
import {Text, List, ListItem, Body, Right} from 'native-base';
import Icon from './icon';
import {globalStyles} from '../res/styles';
import firebase, {DB_NAMES} from '../services/firebase';

export default class Summary extends Component {
  constructor(props) {
    super(props);

    this.state = {
      games: [
        {
          name: "jee"
        },
        {
          name: "JUUU"
        }
      ]
    };
  }

componentDidMount() {
firebase.database().ref(DB_NAMES.courses).limitToLast(10).once('value').then(snapshot => {
  const value = snapshot.val() ? snapshot.val() : {};
  const latestGames = Object.keys(value).map(key => { return {...value[key]}; })[0];


  // 10 last games

  });
}


  render() {
    console.log(this.props, 'summary');
    return (
      <View>
        <Text>Dates</Text>
        <List
        dataArray={this.state.games}
        renderRow={(game) => <ListItem onPress={() => this.props.navigation.navigate('SummaryDetail')}>
            <Body>
              <Text>{game.name}</Text>
            </Body>
            <Right>
              <ArrowForwardIcon />
            </Right>
          </ListItem>}>
        </List>
      </View>
    );
  }
}

const ArrowForwardIcon = () => <Icon size={20} name="ios-arrow-forward" />;

/*
      <ListItem onPress={() => this.props.navigation.navigate('SummaryDetail')}>
            <Body>
              <Text>23.11.2017 - 13:37</Text>
              <Text note>Jyväskylä, Harju</Text>
            </Body>
            <Right>
              <ArrowForwardIcon />
            </Right>
          </ListItem>*/
