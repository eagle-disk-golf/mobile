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
import {Container} from 'native-base';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import Panel from './panel';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

class Panels extends Component {
  render() {
    return (
      <ScrollView style={styles.container} >
        <Panel title="A Panel">
          <View style={{backgroundColor: 'green', flexDirection: 'column'}}>
            <MapView
              style={{height: 200, width: '100%'}}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
            <View>
              <Text>results</Text>
              <Text>results</Text>
              <Text>results</Text>
              <Text>results</Text>
              <Text>results</Text>
            </View>

          </View>
        </Panel>
        <Panel title="A Panel">
          <View style={{backgroundColor: 'green', flexDirection: 'column'}}>
            <MapView
              style={{height: 200, width: '100%'}}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
            <View>
              <Text>results</Text>
              <Text>results</Text>
              <Text>results</Text>
              <Text>results</Text>
              <Text>results</Text>
            </View>

          </View>
        </Panel>
        <Panel title="Another">
          <Text>Lorem ipsum dolor sit amet...</Text>
          <View style={{backgroundColor: 'green', flexDirection: 'column'}}>
            <MapView
              style={{height: 200, width: '100%'}}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
            <View>
              <Text>results</Text>
              <Text>results</Text>
              <Text>results</Text>
              <Text>results</Text>
              <Text>results</Text>
            </View>

          </View>
        </Panel>
      </ScrollView>
    );
  }
}

export default Panels;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f9',
    paddingTop: 30
  }
});
