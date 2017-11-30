/*
  KIDE
  File created: 23.10.2017
  Made by: Riku
  History:
  23.11.2017 Topi: List and ListItem added
*/

import React, {Component} from 'react';
import {View} from 'react-native';
import {Text, Container, Content, List, ListItem, Body, Right, Center} from 'native-base';

export default class Summary extends Component {
  render() {
    console.log(this.props, 'summary');
    return (
      <View>
          <List>
            {/* <TouchableOpacity> -> Tarkempaan ikkunaan? */}
            <ListItem style={{
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
      }}>
              <Body>
              <Text>23.11.2017</Text>
              <Text note>13:37</Text>
              <Text note>Jyväskylä, Harju</Text>
              </Body>
            </ListItem>
            {/* </TouchableOpacity> */}
            <ListItem>
                <Body>
              <Text>19.11.2017</Text>
              <Text note>Jyväskylä, Viitaniemi</Text>
              </Body>
              <Right>
                <Text note>06:06</Text>
              </Right>
            </ListItem>
            <ListItem>
              <Body>
              <Text>20.11.2017</Text>
              <Text note>Muurame</Text>
              </Body>
              <Right>
                <Text note>04:21</Text>
              </Right>
            </ListItem>
          </List>
      </View>
    );
  }
}
