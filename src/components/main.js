import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right} from 'native-base';
export default class CardImageExample extends Component {
  render() {
    return (
      <Container>
        <Content>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Tracking')}>
            <Card>
              <CardItem>
                <Left>
                  <Body>
                    <Text>New Game</Text>
                    <Text note>Start a new game</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image source={require('../res/images/newgame_card.png')} style={{height: 200, width: null, flex: 1}} />
              </CardItem>
            </Card>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.props.navigation.navigate('Summary')}>
            <Card>
              <CardItem>
                <Left>
                  <Body>
                    <Text>High scores</Text>
                    <Text note>Local high scores</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem cardBody>
                <Image source={require('../res/images/highscores_card.png')} style={{height: 200, width: null, flex: 1}} />
              </CardItem>
            </Card>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}
