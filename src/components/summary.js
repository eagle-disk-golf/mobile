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

export default class Summary extends Component {
  render() {
    console.log(this.props, 'summary');
    return (
      <View>
        <Text>Dates</Text>
        <List>
          {/* <TouchableOpacity> -> Tarkempaan ikkunaan? */}
          <ListItem onPress={() => this.props.navigation.navigate('SummaryDetail')}>
            <Body>
              <Text>23.11.2017 - 13:37</Text>
              <Text note>Jyväskylä, Harju</Text>
            </Body>
            <Right>
              <ArrowForwardIcon />
            </Right>
          </ListItem>
          {/* </TouchableOpacity> */}
          <ListItem>
            <Body>
              <Text>19.11.2017 - 12:37</Text>
              <Text note>Jyväskylä, Viitaniemi</Text>
            </Body>
            <Right>
              <ArrowForwardIcon />
            </Right>
          </ListItem>
          <ListItem>
            <Body>
              <Text>13.11.2017 - 04:37</Text>
              <Text note>Muurame</Text>
            </Body>
            <Right>
              <ArrowForwardIcon />
            </Right>
          </ListItem>
        </List>
      </View>
    );
  }
}

const ArrowForwardIcon = () => <Icon size={20} name="ios-arrow-forward" />;

