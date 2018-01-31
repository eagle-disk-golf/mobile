// /*
//   KIDE
//   File created: 30.11.2017
//   Made by: Topi
//   History:

// */

// import React, {Component} from 'react';
// import {View} from 'react-native';
// import {Text, Col, Row, Grid} from 'native-base';
// import {globalStyles} from '../res/styles';

// export default class SummaryDetail extends Component {
//   render() {
//     return (
//       <View>
//           <Text>Summary Detail</Text>
//           <Text note>Date here with location</Text>
//         <Grid>
//             <Row>
//             <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
//             <Text>Lane</Text>
//             </Col>
//             <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
//             <Text>Throws</Text>
//             </Col>
//             <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
//             <Text>Par</Text>
//             </Col>
//             <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
//             <Text>Score</Text>
//             </Col>
//             </Row>
//             <Row>
//             <Col style={{height: 50}}>
//             <Text>1</Text>
//             </Col>
//             <Col style={{height: 50}}>
//             <Text>4</Text>
//             </Col>
//             <Col style={{height: 50}}>
//             <Text>3</Text>
//             </Col>
//             <Col style={{height: 50}}>
//             <Text>+1</Text>
//             </Col>
//             </Row>
//             <Row>
//             <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
//             <Text>Total</Text>
//             </Col>
//             <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
//             <Text>00</Text>
//             </Col>
//             <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
//             <Text>00</Text>
//             </Col>
//             <Col style={{backgroundColor: '#7F1B4B', height: 50}}>
//             <Text>+1</Text>
//             </Col>
//             </Row>
//          </Grid>
//       </View>
//     );
//   }
// }


import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import PanelList from './panel-list';
import Panel from './panel';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';

class SummaryDetail extends Component {

  render() {
    return (
      <View>
        <PanelList />
      </View>
    );
  }
}

export default SummaryDetail;

