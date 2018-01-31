import React, {Component} from 'react';
import {StyleSheet, ScrollView, View, Text, Dimensions, UIManager, findNodeHandle, Platform} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import Panel from './panel';
import {globalStyles} from '../res/styles';
import {COLORS} from '../res/styles/constants';

const isAndroid = Platform.OS === 'android';

const lanes = [
  {name: '1 lane'},
  {name: '2 lane'},
  {name: '3 lane'},
  {name: '4 lane'},
  {name: '5 lane'},
  {name: '6 lane'},
  {name: '7 lane'},
  {name: '8 lane'},
  {name: '9 lane'},
  {name: '10 lane'},
  {name: '11 lane'},
];

const titleHeight = 60;
const TitleComponent = (game) => <View style={[styles.titleContainer]}>
  <View style={[styles.titleItemContainer, styles.borderRight]}><Text>1</Text></View>
  <View style={[styles.titleItemContainer, styles.borderRight]}><Text>4</Text></View>
  <View style={[styles.titleItemContainer, styles.borderRight]}><Text>3</Text></View>
  <View style={styles.titleItemContainer}><Text>par</Text></View>
</View>;

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
          } else {
            scrollList.scrollTo({y: panelFrameOffsetY - (panelEndPosition - containerEndPosition)});
          }
        });
      });
    }

    // scrollList.scrollTo({y: event.nativeEvent.pageY});
    /* eslint max-params: 0 */
    // scrollListContainer.measure((containerFrameOffsetX, containerFrameOffsetY, containerWidth, containerHeight, containerPageOffsetX, containerPageOffsetY) => {
    //   panel.measure((panelFrameOffsetX, panelFrameOffsetY, panelWidth, panelHeight, panelPageOffsetX, panelPageOffsetY) => {
    //     const panelEndPosition = panelFrameOffsetY + window.height + event.contentHeight;
    //     const containerEndPosition = window.height + containerHeight;

    //     console.log(panelFrameOffsetY, 'panelfrmaoffset');
    //     if (panelEndPosition < containerEndPosition) {
    //       scrollList.scrollTo({y: panelFrameOffsetY});
    //     } else {
    //       scrollList.scrollTo({y: panelFrameOffsetY - (panelEndPosition - containerEndPosition)});
    //     }
    //   });
    // });
  }

  render() {
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

          {lanes && lanes.map((lane, index) => <View collapsable={false} onLayout={() => {}} ref={`scroll_list_panel_item_${index}`} key={index}>
            <Panel
              onItemSelected={(event) => this.scrollToPane(event, index)}
              onItemDeSelect={(event) => null}
              renderTitle={<TitleComponent />}
              titleHeight={60}
              title="A Panel">
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
                </View>
              </View>
            </Panel></View>)}
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
  }
});
