/*
  KIDE
  File created: 23.10.2017
  Made by: Riku
  History:
  23.11.2017 Topi: List and ListItem added
  30.11.2017 Topi: Styling
*/

import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, Container, Content, Icon, List, ListItem, Body, Right, Center} from 'native-base';
import {globalStyles} from '../res/styles'

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
              <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            {/* </TouchableOpacity> */}
            <ListItem>
            <Body>
            <Text>19.11.2017 - 12:37</Text>
            <Text note>Jyväskylä, Viitaniemi</Text>
            </Body>
            <Right>
            <Icon name="arrow-forward" />
            </Right>
          </ListItem>
          <ListItem>
          <Body>
          <Text>13.11.2017 - 04:37</Text>
          <Text note>Muurame</Text>
          </Body>
          <Right>
          <Icon name="arrow-forward" />
          </Right>
        </ListItem>
          </List>
      </View>
    );
  }
}
