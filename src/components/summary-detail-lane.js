/*
  KIDE
  File created: 5.2.2018
  Made by: Jenni
  History:
  12.02.2018: Topi: Added information box
  13.02.2018: Topi: Added styling and native base grid box, import time
*/

import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import Color from 'color';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, Polygon, Circle } from 'react-native-maps';
import { Container, Header, Content } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { COLORS } from '../res/styles/constants';
import time from '../services/time';
import {getDistanceInMetersBetweenCoordinates, createSquareInMetersFromCoordinate} from '../helpers/geolocation';

const itemHasError = item => !!item.isLost || !!item.isMando || !!item.isOverbound;

const MARKERS = {
  isMando: index => ({
    color: COLORS.danger,
    description: 'Your throw was mando!',
    title: `Throw: ${index + 1}`
  }),
  isLost: index => ({
    color: COLORS.danger,
    description: 'You lost your disc!',
    title: `Throw: ${index + 1}`
  }),
  isOverbound: index => ({
    color: COLORS.danger,
    description: 'Your throw went overbounds!',
    title: `Throw ${index + 1}`
  }),
  isFirst: index => ({
    color: COLORS.primary,
    description: 'First throw',
    title: `Throw: ${index + 1}`
  }),
  isLast: index => ({
    color: COLORS.success,
    description: 'You scored!',
    title: 'Basket'
  }),
  normal: index => ({
    color: COLORS.primaryLighter,
    description: '',
    title: `Throw: ${index + 1}`
  })
};

const getThrowMarker = (item, throws) => {
  const error = item.isLost ? 'isLost' : item.isOverbound ? 'isOverbound' : item.isMando ? 'isMando' : null;
  const index = throws.indexOf(item);
  const isFirst = index === 0;
  const isLast = index === throws.length - 1;
  const markerStyle = error ? error : (isFirst ? 'isFirst' : (isLast ? 'isLast' : 'normal'));

  return MARKERS[markerStyle](index);
};

const CustomMarker = ({item, throws}) => {
  const marker = getThrowMarker(item, throws);

  return (
    <Marker
      pinColor={marker.color}
      coordinate={{latitude: item.latitude, longitude: item.longitude}}
      title={marker.title}
      description={marker.description} />
  );
};

export default class SummaryDetailLane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lane: {}
    };
  }

  zoomToMarkers() {
    // if called fitToElements immediatly, the map wont zoom in for some reason
    // this usually happens only on the first time map is opened
    setTimeout(() => {
      this.mapView.fitToElements(true);
    }, 100);
  }

  render() {
    console.log(this.props, 'props');
    const {lane, index} = this.props.navigation.state.params;
    const laneMarkers = [...lane.throws, lane.endLocation];

    return (
        <ScrollView>
      <View style={{flexDirection: 'column', flex: 0}}>
        <MapView
          ref={(ref) => {this.mapView = ref;}}
          onLayout={() => this.zoomToMarkers()}
          style={{height: 300, width: '100%'}}
          provider={PROVIDER_GOOGLE}
          minZoomLevel={10}
          maxZoomLevel={20}
          region={{
            latitude: lane.startLocation.latitude,
            longitude: lane.startLocation.longitude,
            latitudeDelta: 1,
            longitudeDelta: 1,
          }}>
          {laneMarkers.map((item, index) => {
            const nextItem = laneMarkers[index + 1];
            const strokeColor = itemHasError(item) ? COLORS.danger : COLORS.textPrimary;
            return (
              <View key={index}>
                <CustomMarker key={`marker-${index}`} item={item} throws={laneMarkers} />
                {nextItem && <Polyline
                  key={`polyline-${index}`}
                  coordinates={[item, nextItem]}
                  strokeColor={strokeColor}
                  strokeWidth={2} />}
              </View>);
          })}

          {/* {for showing circle around the basket} */}
          <Circle
            center={laneMarkers[laneMarkers.length - 1]}
            radius={5}
            fillColor={Color(COLORS.success).lighten(1).rgb().toString()} />
          <Polygon
            fillColor={Color(COLORS.primary).lighten(0.5).rgb().toString()}
            coordinates={createSquareInMetersFromCoordinate(laneMarkers[0])} />
            </MapView>
        <View style={styles.resultsContainer}>
          {laneMarkers.map((item, index) => {
            const nextItem = laneMarkers[index + 1];
            if (nextItem) {
              return (
                <Text key={index} style={styles.result}>
                      {index + 1}. <Text style={styles.boldResult}>{getDistanceInMetersBetweenCoordinates(item, nextItem)}</Text> m
              </Text>
              );
            }
          })}
        </View>
        <View style={styles.viewGridStyle}>
            <Grid style={styles.gridStyle}>
                <Row style={styles.rowStyle}>
                    <Col>
                        <Text>Lane:</Text>
                    </Col>
                    <Col>
                        <Text style={styles.boldResult}>{index + 1}</Text>
                    </Col>
                </Row>
                <Row style={styles.rowStyle}>
                    <Col>
                        <Text>Total throws:</Text>
                    </Col>
                    <Col>
                        <Text style={styles.boldResult}>{lane.totalThrows}</Text>
                    </Col>
                </Row>
                <Row style={styles.rowStyle}>
                    <Col>
                        <Text>Par:</Text>
                    </Col>
                    <Col>
                        <Text style={styles.boldResult}>{lane.par}</Text>
                    </Col>
                </Row>
                <Row style={styles.rowStyle}>
                    <Col>
                        <Text>Score:</Text>
                    </Col>
                    <Col>
                        <Text style={styles.boldResult}>{lane.totalThrows - lane.par}</Text>
                    </Col>
                </Row>
                <Row style={styles.rowStyle}>
                    <Col>
                        <Text>Total time:</Text>
                    </Col>
                    <Col>
                        <Text style={styles.boldResult}>{time.getFormattedMinutes(lane.endLocation.timestamp - lane.startLocation.timestamp)}</Text>
                    </Col>
                </Row>
                <Row style={styles.rowStyle}>
                    <Col>
                        <Text>Distance covered:</Text>
                    </Col>
                    <Col>
                        <Text style={styles.boldResult}>{getDistanceInMetersBetweenCoordinates(lane.startLocation, lane.endLocation)} meters</Text>
                    </Col>
                </Row>
            </Grid>
        </View>
        </View>
       </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  resultsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  result: {
    width: '100%',
    paddingTop: 5
  },
  boldResult: {
    fontWeight: 'bold'
  },
  information: {
    width: '100%',
    paddingTop: 5
  },
  rowStyle: {
    flex: 1,
    height: 20,
    paddingLeft: 20
  },
  gridStyle: {
      flex: 1,
      paddingBottom: 20
  },
  viewGridStyle: {
      width: '100%'
  }
});
