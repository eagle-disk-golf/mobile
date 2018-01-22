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
      <View 
        style={[{
            height: '100%'
        }]}>
        
    <Grid>
        <Col style={style.col}>
            <Row style={style.row}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Tracking')}>
                  <Card>
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/new_game_card.png')} style={[style.image]}>
                          <Text style={[globalStyles.bgTransparent,globalStyles.textTop]}>NEW GAME</Text>
                          <Text style={[globalStyles.bgTransparent]} note>      </Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                 </TouchableOpacity>
            </Row>
                          
            <Row style={style.row}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Summary')}>    
                  <Card >
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/statistic_card.png')} style={[style.image]}>
                        <Text style={[globalStyles.bgTransparent, globalStyles.bgTransparent,globalStyles.textTop]}>STATISTICS</Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>    
                </TouchableOpacity>
            </Row>
        </Col>

        <Col style={style.col} >
            <Row style={style.row}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Summary')}>
                  <Card>
                    <CardItem cardBody>
                        
                      <ImageBackground source={require('../res/images/summary_card.png')} style={[style.image]}>
                          <Text style={[globalStyles.bgTransparent, globalStyles.bgTransparent,globalStyles.textTop]}>   SUMMARY    </Text>
                          <Text style={[globalStyles.bgTransparent]} note>      </Text>
                      </ImageBackground>
                    </CardItem>
                  </Card>
                </TouchableOpacity>
            </Row>
                                                  
                                                  
            <Row style={style.row}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Tracking')}>
                  <Card>
                    <CardItem cardBody>
                      <ImageBackground source={require('../res/images/newgame_card.png')} style={[style.image]}>
                          <Text style={[globalStyles.bgTransparent]} >New Game</Text>
                          <Text style={[globalStyles.bgTransparent]} note>Start a new game</Text>
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

const style = StyleSheet.create({
  card:{
    flex:1,

  },
    image: {
       /* resizeMode: 'cover',*/
        /*flex: 1 */ 
        height:300,
        width:250
    },
    col: {
        flex:1,
        margin:0,
        padding:0
    },
    row:{
        flex:1
    }
    
    
});
