import React, {Component} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import Color from 'color';
/** https://www.npmjs.com/package/react-native-maps */
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, Polygon, Circle } from 'react-native-maps';
/** https://github.com/GeekyAnts/react-native-easy-grid */
import {Col, Row, Grid} from 'react-native-easy-grid';
import {COLORS} from '../res/styles/constants';
import time from '../helpers/time';
import {getDistanceInMetersBetweenCoordinates, createSquareInMetersFromCoordinate} from '../helpers/geolocation';

/**
 * getOverallDistance gets throws as a parameter and the function makes distance variable as 0.
 * The function then maps throws with item and index as parameters and makes a function.
 * nextThrow is throw index + 1. If there is a nextThrow, the function gets added to distance.
 * Returns the sum of distance.
 */
const getOverallDistance = throws => {
  let distance = 0;
  throws.map((item, index) => {
    const nextThrow = throws[index + 1];
    if (nextThrow) {
      distance += getDistanceInMetersBetweenCoordinates(item, nextThrow);
    }
  });

  return distance;
};

/**
 * Error variable. Item is from the database and isLost, isMando or isOverbound.
 */
const itemHasError = item => item && !!item.isLost || item && !!item.isMando || item && !!item.isOverbound;

/**
 * Markers variable. Markers on the map. Sets the color, description and title for the markers.
 */
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
  isLast: _ => ({
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

/**
 * getThrowMarker function takes error variable and checks if isLost is true, if not then isOverbound, if not then isMando, if not then null.
 * Variable index returns the index of item in throws.
 * Variable isFirst is 0, isLast is last index.
 * markerStyle variable returns the correct marker from above.
 * Returns Markers array with styles and correct lane index.
 */
const getThrowMarker = (item, throws) => {
  const error = item && item.isLost ?
    'isLost' : item && item.isOverbound ?
      'isOverbound' : item && item.isMando ?
        'isMando' : null;

  const index = throws.indexOf(item);
  const isFirst = index === 0;
  const isLast = index === throws.length - 1;
  const markerStyle = error ? error : (isFirst ? 'isFirst' : (isLast ? 'isLast' : 'normal'));

  return MARKERS[markerStyle](index);
};

/**
 * CustomMarker variable makes a function with item and throws as parameters.
 * If there is an item, marker variable gets made as getThrowMarker with item and throws as parameters. If not, returns null.
 * Returns Marker component with pinColor, coordinates, title and description.
 */
const CustomMarker = ({item, throws}) => {
  if (item) {
    const marker = getThrowMarker(item, throws);
    return (
      <Marker
        pinColor={marker.color}
        coordinate={{latitude: item.latitude, longitude: item.longitude}}
        title={marker.title}
        description={marker.description} />
    );
  }

  return null;
};

export default class SummaryDetailLane extends Component {
    /**
     * Lane object.
     */
  constructor(props) {
    super(props);
    this.state = {
      lane: {}
    };
  }

    /**
     * Zooms to markers and fits them on the screen.
     * If called fitToElements immediately, the map won't zoom in for some reason
     * this usually happnes only on the first time the map is opened.
     */
  zoomToMarkers() {
    setTimeout(() => {
      this.mapView.fitToElements(true);
    }, 100);
  }

    /**


        W I P


     * Render function
     */
  render() {
    const {lane, index} = this.props.navigation.state.params;
    const laneMarkers = lane && lane.completed && lane.endLocation ? [...lane.throws, lane.endLocation] : lane.throws;
    /* eslint max-len: 0 */
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
            {lane.completed && <Circle
              center={laneMarkers[laneMarkers.length - 1]}
              radius={5}
              fillColor={Color(COLORS.success).lighten(1).rgb().toString()} />}
            <Polygon
              fillColor={Color(COLORS.primary).lighten(0.5).rgb().toString()}
              coordinates={createSquareInMetersFromCoordinate(laneMarkers[0])} />
          </MapView>
          <View style={styles.resultsContainer}>
            {!lane.completed && <Text style={{fontWeight: 'bold', alignSelf: 'center'}}>This lane is still uncompleted!</Text>}

            {laneMarkers.map((item, index) => {
              const nextItem = laneMarkers[index + 1];
              if (lane.completed && nextItem || !lane.completed) {
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
              {lane.completed && <Row style={styles.rowStyle}>
                <Col>
                  <Text>Total time:</Text>
                </Col>
                <Col>
                  {<Text style={styles.boldResult}>{time.getFormattedMinutes(lane.endLocation.timestamp - lane.startLocation.timestamp)}</Text>}
                </Col>
              </Row>}
              {lane.completed && <Row style={styles.rowStyle}>
                <Col>
                  <Text>Distance covered:</Text>
                </Col>
                <Col>
                  {/* <Text style={styles.boldResult}>{getDistanceInMetersBetweenCoordinates(lane.startLocation, lane.endLocation)} meters</Text> */}
                  <Text style={styles.boldResult}>{`${getOverallDistance(laneMarkers)} meters`}</Text>
                </Col>
              </Row>}

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
