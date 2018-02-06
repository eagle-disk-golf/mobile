/*
  KIDE
  File created: 5.2.2018
  Made by: Jenni
  History:
*/

import React, {Component, Fragment} from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';
import firebase, {DB_NAMES} from '../services/firebase';
import {toArray} from '../helpers/data';
import {getDistanceInMetersBetweenCoordinates} from '../helpers/geolocation';


const itemHasError = item => !!item.isLost || !!item.isMando || !!item.isOverbound;

const CustomMarker = ({index, item, throws}) => {

  const MARKER_COLORS = {
    first: COLORS.primary,
    normal: COLORS.primaryLighter,
    error: COLORS.danger,
    last: COLORS.success
  };

  const MARKER_DESCRIPTIONS = {
    isMando: 'Your throw was mando',
    isLost: 'Your throw was lost',
    isOverbound: 'Your throw was overbounds',
    isFirst: 'First throw',
    isLast: 'Last throw, score!'
  };

  // const hasError = !!item['isLost'] || !!item['isOverbound'] || !!item['isMando'];
  const error = item.isLost ? 'isLost' : item.isOverbound ? 'isOverbound' : item.isMando ? 'isMando' : null;
  const isFirst = index === 0;
  const isLast = index === (throws.length - 1);
  const markerStyle = error ? 'error' : (isFirst ? 'first' : (isLast ? 'last' : 'normal'));

  // const GreenZone = () => <Image style={{height: 30, width: 30}} source={require('../res/images/greenzone.png')} />;
  // const Basket = _ => <Image style={{height: 30, width: 30}} source={require('../res/images/basket.png')} />;
  // const ImageMarker = isFirst ? <GreenZone /> : isLast ? <Basket /> : null;

  // if (isFirst || isLast) {
  //   return (
  //     <Marker
  //       key={index}
  //       pinColor={MARKER_COLORS[markerStyle]}
  //       coordinate={{latitude: item.latitude, longitude: item.longitude}}
  //       title={`Throw: ${index + 1}`}
  //       description='kuvaus'>
  //       <View>
  //         {ImageMarker}
  //       </View>
  //     </Marker>
  //   );
  // }
  return (
    <Marker
      pinColor={MARKER_COLORS[markerStyle]}
      coordinate={{latitude: item.latitude, longitude: item.longitude}}
      title={`Throw: ${index + 1}`}
      description={MARKER_DESCRIPTIONS[markerStyle]} />
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
    const {loading} = this.state;
    const lane = this.props.navigation.state.params;

    return (
      <View style={{flexDirection: 'column'}}>
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
          {lane.throws.map((item, index) => {
            const nextItem = lane.throws[index + 1];
            const strokeColor = itemHasError(item) ? COLORS.danger : COLORS.textPrimary;
            return (
              <View>
                <CustomMarker index={index} key={index} item={item} throws={lane.throws} />
                {nextItem && <Polyline
                  coordinates={[item, nextItem]}
                  strokeColor={strokeColor}
                  strokeWidth={2} />}
              </View>);
          })}

        </MapView>
        <View style={styles.resultsContainer}>
          {lane.throws.map((item, index) => (
            <Text key={index} style={styles.result}>
              {index + 1}. {getDistanceInMetersBetweenCoordinates(lane.startLocation, item)}m
              </Text>
          ))}

        </View>
      </View>
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
    width: '33%',
    paddingTop: 20,
    paddingBottom: 20
  }
});
