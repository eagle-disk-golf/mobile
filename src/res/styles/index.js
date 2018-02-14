import {StyleSheet} from 'react-native';
import {COLORS, MARGINS} from './constants';

// text styling
const text = StyleSheet.create({
  textDefault: {
    color: COLORS.white
  },
  textPrimary: {
    color: COLORS.textPrimary
  },
  textSuccess: {
    color: COLORS.accent
  },
  textInfo: {
    // color: COLORS.info
  },
  textWarning: {
    color: COLORS.alert
  },
  textDanger: {
    // color: COLORS.warning
  },
  fontDefault: {
   fontFamily: 'Roboto'
  },
  h1: {
    fontSize: 28
  },
  h2: {
    fontSize: 24
  },
  h3: {
    fontSize: 20
  }
});

// background
const background = StyleSheet.create({
  bgDefault: {
    backgroundColor: COLORS.white
  },
  bgPrimary: {
    backgroundColor: COLORS.primary
  },
  bgSuccess: {
    backgroundColor: COLORS.accent
  },
  bgInfo: {
    // backgroundColor: COLORS.info
  },
  bgWarning: {
    backgroundColor: COLORS.alert
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
  textTop: {
    fontSize: 30

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
    justifyContent: 'center',
  },
});

export const globalStyles = {
  ...helpers,
  ...text,
  ...background,
  ...layout,
  ...buttons
};

