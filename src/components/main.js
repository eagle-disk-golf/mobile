import React, { Component } from 'react';
import { Image } from 'react-native';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';
export default class CardImageExample extends Component {
  render() {
    return (
      <Container>
        <Content>
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
              <Image source={{uri: 'http://student.labranet.jamk.fi/~H3041/kide/newgame.PNG'}} style={{height: 200, width: null, flex: 1}} />
            </CardItem>
          </Card>
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
              <Image source={{uri: 'http://student.labranet.jamk.fi/~H3041/kide/highscores.png'}} style={{height: 200, width: null, flex: 1}} />
            </CardItem>
          </Card>
        </Content>
      </Container>
    );
  }
}