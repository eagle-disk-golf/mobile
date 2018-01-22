import {StyleSheet} from 'react-native';
import {COLORS, MARGINS} from './constants';

// text styling
const text = StyleSheet.create({
  textDefault: {
    color: COLORS.default
  },
  textPrimary: {
    color: COLORS.textDark
  },
  textSuccess: {
    color: COLORS.success
  },
  textInfo: {
    // color: COLORS.info
  },
  textWarning: {
    color: COLORS.warning
  },
  textDanger: {
    // color: COLORS.warning
  },
  fontDefault: {
   fontFamily: 'Roboto'}
});

// background
const background = StyleSheet.create({
  bgDefault: {
    backgroundColor: COLORS.default
  },
  bgPrimary: {
    backgroundColor: COLORS.primary
  },
  bgSuccess: {
    backgroundColor: COLORS.success
  },
  bgInfo: {
    // backgroundColor: COLORS.info
  },
  bgWarning: {
    backgroundColor: COLORS.warning
  },
  bgDanger: {
    // backgroundColor: COLORS.warning
  },
  bgTransparent: {
    backgroundColor: 'transparent'
  }
});


// helper classes
const helpers = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  centerHorizontal: {
    alignSelf: 'center'
  },
  centerVertical: {
    justifyContent: 'center'
  },
  pullLeft: {
    alignSelf: 'flex-start'
  },
  pullRight: {
    alignSelf: 'flex-end'
  },
  centerTop: {
    alignItems: 'flex-start'
  },
  centerBottom: {
    alignItems: 'flex-end'
  },
  textCenter: {
    justifyContent: 'center'
  },
  textTop:{
    fontSize:30
    
  },
});

const layout = StyleSheet.create({
  verticalMargin: {
    marginTop: MARGINS.marginXs,
    marginBottom: MARGINS.marginXs
  }
});

const buttons = StyleSheet.create({
  buttonPrimary: {
    backgroundColor: COLORS.primary
  },
  buttonRounded: {
    borderRadius: 100,
    justifyContent: 'center'
  },
});


export const globalStyles = {
  ...helpers,
  ...text,
  ...background,
  ...layout,
  ...buttons
};

