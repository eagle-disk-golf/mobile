import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Text, Dimensions, Platform, findNodeHandle, TouchableOpacity} from 'react-native';
import {Spinner} from 'native-base';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Panel from './panel';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';
import {getDistanceInMetersBetweenCoordinates} from '../helpers/geolocation';

const isAndroid = Platform.OS === 'android';

const titleHeight = 60;
const TitleComponent = ({item, index, testi}) => {
  const score = item.par - item.throws.length;
  return (
    <TouchableOpacity onPress={testi}>
    <View style={[styles.titleContainer]}>
    <View style={[styles.titleItemContainer, styles.borderRight]}><Text>{index + 1}</Text></View>
    <View style={[styles.titleItemContainer, styles.borderRight]}><Text>{item.throws.length}</Text></View>
    <View style={[styles.titleItemContainer, styles.borderRight]}><Text>{item.par}</Text></View>
    <View style={styles.titleItemContainer}><Text>{score === 0 ? 'par' : score}</Text></View>
  </View>
  </TouchableOpacity>
  );
};

export default class PanelList extends Component {
  scrollToPane(event, index) {
    const window = Dimensions.get('window');
    const scrollList = this.refs.scrollList;
    const scrollListContainer = this.refs.scrollListContainer;
    const panel = this.refs[`scroll_list_panel_item_${index}`];

    // getting the measurements on android is not as simple as in ios.
    // we have to use different function for that, furthermore we need a timer to delay the transition
    // so the correct end position will be get
    if (isAndroid) {
      setTimeout(() => {
        /* eslint max-params: 0 */
        scrollListContainer.measureLayout(findNodeHandle(scrollList), (containerFrameOffsetX, containerFrameOffsetY, containerWidth, containerHeight, containerPageOffsetX, containerPageOffsetY) => {
          panel.measureLayout((findNodeHandle(scrollListContainer)), (panelFrameOffsetX, panelFrameOffsetY, panelWidth, panelHeight, panelPageOffsetX, panelPageOffsetY) => {
            const panelEndPosition = panelFrameOffsetY + window.height + event.contentHeight;
            const containerEndPosition = window.height + containerHeight;

            console.log(panelFrameOffsetY, 'panelfrmaoffset');
            if (panelEndPosition < containerEndPosition) {
              scrollList.scrollTo({y: panelFrameOffsetY});
            } else {
              scrollList.scrollTo({y: panelFrameOffsetY - (panelEndPosition - containerEndPosition)});
            }
          });
        });
      }, 60);
    } else {
      scrollListContainer.measure((containerFrameOffsetX, containerFrameOffsetY, containerWidth, containerHeight, containerPageOffsetX, containerPageOffsetY) => {
        panel.measure((panelFrameOffsetX, panelFrameOffsetY, panelWidth, panelHeight, panelPageOffsetX, panelPageOffsetY) => {
          const panelEndPosition = panelFrameOffsetY + window.height + event.contentHeight;
          const containerEndPosition = window.height + containerHeight;

          console.log(panelFrameOffsetY, 'panelfrmaoffset');
          if (panelEndPosition < containerEndPosition) {
            scrollList.scrollTo({y: panelFrameOffsetY});
            console.log('does not go ove');
           } else {
            scrollList.scrollToEnd();
            console.log('goes over');
            // scrollList.scrollTo({y: panelFrameOffsetY - (panelEndPosition - containerEndPosition)});
          }
        });
      });
    }
  }

  render() {
    const {lanes, navigation} = this.props;
    console.log(navigation, 'navigaiont');
    const isInitialized = lanes && (lanes.length > 0);
    console.log(isInitialized, 'isInitialized');
    return (
      <ScrollView removeClippedSubviews={false} ref='scrollList' style={styles.container}>
        <View renderToHardwareTextureAndroid={true} collapsable={false} ref='scrollListContainer' onLayout={() => {}}>
          <View style={[globalStyles.bgSuccess, styles.titleContainer, styles.border]}>
            <View style={[styles.titleItemContainer, styles.borderRight]}>
              <Text style={globalStyles.textDefault}>Lane</Text>
            </View>
            <View style={[styles.titleItemContainer, styles.borderRight]}>
              <Text style={globalStyles.textDefault}>Throws</Text>
            </View>
            <View style={[styles.titleItemContainer, styles.borderRight]}>
              <Text style={globalStyles.textDefault}>Par</Text>
            </View>
            <View style={styles.titleItemContainer}>
              <Text style={globalStyles.textDefault}>Score</Text>
            </View>
          </View>

          {!isInitialized && <Spinner color="green" />}
          {isInitialized && lanes && lanes.map((lane, index) => <TitleComponent index={index} item={lane} testi={() => this.props.navigation.navigate('SummaryDetailLane', lane) } /> )}
        </View>
      </ScrollView>
    );
  }
}

const borderWidth = 0.5;
/* eslint object-shorthand: 0 */
const styles = StyleSheet.create({
  container: {
    margin: 10,
    paddingBottom: 50
  },
  titleContainer: {
    height: titleHeight,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: borderWidth,
    borderBottomWidth: borderWidth,
    borderRightWidth: borderWidth,
    borderColor: COLORS.textDark
  },
  border: {
    borderColor: COLORS.default,
    borderWidth: borderWidth
  },
  borderRight: {
    borderRightColor: COLORS.textDark,
    borderRightWidth: 0.5
  },
  titleItemContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  borderLeft: {
    borderLeftColor: 'black',
    borderLeftWidth: 1
  },
  resultsContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap'
  },
  result: {
    // backgroundColor: 'orange',
    width: '33%',
    paddingTop: 20,
    paddingBottom: 20
  }
});
