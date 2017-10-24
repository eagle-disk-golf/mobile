import {StyleSheet} from 'react-native';
import {COLORS, MARGINS} from './constants'; 




// text styling
const text = StyleSheet.create({
  textPrimary: {
    color: COLORS.primary
  },
  textSuccess: {
    color: COLORS.success
  },
  textInfo: {
    color: COLORS.info
  },
  textWarning: {
    color: COLORS.warning
  },
  textDanger: {
    color: COLORS.warning
  }
});

// background
const background = StyleSheet.create({
  bgPrimary: {
    backgroundColor: COLORS.primary
  },
  bgSuccess: {
    backgroundColor: COLORS.success
  },
  bgInfo: {
    backgroundColor: COLORS.info
  },
  bgWarning: {
    backgroundColor: COLORS.warning
  },
  bgDanger: {
    backgroundColor: COLORS.warning
  }
})


// helper classes
const helpers = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
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
  textCenter: {
    justifyContent: 'center'
  }
});

const layout = StyleSheet.create({
  verticalMargin: {
    marginTop: MARGINS.marginXs,
    marginBottom: MARGINS.marginXs
  }
});

const buttons = StyleSheet.create({
  buttonRounded: {
    borderRadius: 100,
    width: 100,
    height: 100,
    justifyContent: 'center'
  }
});


export const styles = {
  ...helpers,
  ...text,
  ...background,
  ...layout,
  ...buttons
};