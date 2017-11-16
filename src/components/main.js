import React, {Component} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right} from 'native-base';
import { Col, Row, Grid } from "react-native-easy-grid";
export default class CardImageExample extends Component {
  render() {
    return (
      <Container>
        <Content>
          <Grid>
            <Col>
              <Row>
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
                      <Image source={require('../res/images/newgame_card.png')} style={{height: 200}} />
                    </CardItem>
                  </Card>
                  </TouchableOpacity>
              </Row>  
              <Row>
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
                      <Image source={require('../res/images/highscores_card.png')} style={{height: 200}} />
                    </CardItem>
                  </Card>
                  </TouchableOpacity>
              </Row>
            </Col>
            <Col>
            <Row>
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
                        <Image source={require('../res/images/highscores_card.png')} style={{height: 200}} />
                      </CardItem>
                    </Card>
                    </TouchableOpacity>
                </Row>
              <Row>
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
                        <Image source={require('../res/images/newgame_card.png')} style={{height: 200}} />
                      </CardItem>
                   </Card>
                    </TouchableOpacity>
                </Row>
              </Col>
            </Grid>
          </Content>
        </Container>
    );
  }
}
