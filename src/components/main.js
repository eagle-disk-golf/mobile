import React, {Component} from 'react';
import {Image, TouchableOpacity, StyleSheet, ImageBackground, View} from 'react-native';
import {Container, Header, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right} from 'native-base';
import {Col, Row, Grid} from "react-native-easy-grid";
import {styles} from '../res/styles';


export default class CardImageExample extends Component {
  render() {
    return (
      <View style={[{height: '100%'}]}>
          <Grid>
            <Col >
              <Row>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Tracking')}>
                  <Card>
                    {/* <CardItem>
                      <Left>
                        <Body>
                          <Text>New Game</Text>
                          <Text note>Start a new game</Text>
                        </Body>
                      </Left>
                    </CardItem> */}
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/newgame_card.png')} style={[localStyle.image, styles.centerContent]}>
                          <Text style={[styles.bgTransparent]}>New Game</Text>
                          <Text style={[styles.bgTransparent]} note>Start a new game</Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              </Row>
              <Row>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Summary')}>
                  <Card>
                    {/* <CardItem>
                      <Left>
                        <Body>
                          <Text>High scores</Text>
                          <Text note>Local high scores</Text>
                        </Body>
                      </Left>
                    </CardItem> */}
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/highscores_card.png')} style={[localStyle.image, styles.centerContent]}>
                        <Text style={[styles.bgTransparent, styles.textDefault]}>hello</Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              </Row>
            </Col>

            <Col >
              <Row>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Summary')}>
                  <Card>
                    {/* <CardItem>
                      <Left>
                        <Body>
                          <Text>High scores</Text>
                          <Text note>Local high scores</Text>
                        </Body>
                      </Left>
                    </CardItem> */}
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/highscores_card.png')} style={[localStyle.image, styles.centerContent]}>
                          <Text style={[styles.bgTransparent]}>High scores</Text>
                          <Text style={[styles.bgTransparent]} note>Local high scores</Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              </Row>
              <Row>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Tracking')}>
                  <Card>
                    {/* <CardItem>
                      <Left>
                        <Body>
                          <Text>New Game</Text>
                          <Text note>Start a new game</Text>
                        </Body>
                      </Left>
                    </CardItem> */}
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/newgame_card.png')} style={[localStyle.image, styles.centerContent]}>
                          <Text style={[styles.bgTransparent]} >New Game</Text>
                          <Text style={[styles.bgTransparent]} note>Start a new game</Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              </Row>
            </Col>
          </Grid>
      </View>
    );
  }
}

const localStyle = StyleSheet.create({
  image: {
    // resizeMode: 'cover'
    width: '100%',
    height: 200
    // height: '100%'
  }
})
