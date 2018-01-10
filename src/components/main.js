import React, {Component} from 'react';
import {TouchableOpacity, StyleSheet, ImageBackground, View} from 'react-native';
import {
  Card,
  CardItem,
  Text} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {globalStyles} from '../res/styles';

// Other way to import components/variables/etc
// import styles from '../res/styles'


export default class MainButton extends Component {
  render() {
    return (
      <View style={[{height: '100%'}]}>
          <Grid>
            <Col size={50} >
              <Row size={50}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Tracking')}>
                  <Card>
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/new_game_card.png')} style={[style.image, globalStyles.centerContent]}>
                          <Text style={[globalStyles.bgTransparent]}>   </Text>
                          <Text style={[globalStyles.bgTransparent]} note>      </Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              </Row>
              <Row size={50}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Summary')}>
                  <Card>
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/trophy_card.png')} style={[style.image, globalStyles.centerContent]}>
                        <Text style={[globalStyles.bgTransparent, globalStyles.textDefault]}>hello</Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              </Row>
            </Col>

            <Col size={50} >
              <Row size={50}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Summary')}>
                  <Card>
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/summary_card.png')} style={[style.image, globalStyles.centerContent]}>
                          <Text style={[globalStyles.bgTransparent]}>       </Text>
                          <Text style={[globalStyles.bgTransparent]} note>      </Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              </Row>
              <Row size={50}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Tracking')}>
                  <Card>
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/newgame_card.png')} style={[style.image, globalStyles.centerContent]}>
                          <Text style={[globalStyles.bgTransparent]} >New Game</Text>
                          <Text style={[globalStyles.bgTransparent]} note>Start a new game</Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
              </Row>
            </Col>
          </Grid>

          {/* <Button style={[styles.buttonPrimary]}>
            <Text>natibve base nappi</Text>
          </Button> */}
      </View>
    );
  }
}

const style = StyleSheet.create({
  image: {
    // resizeMode: 'cover'
    width: 200,
    height: 300
    // height: '100%'
  },
    col: {
        margin:0,
        padding:0
    }
    
});
