import React, {useState, PureComponent} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Animated,
  Easing,
  Platform,
  TouchableWithoutFeedback,
  I18nManager,
  Text,
  Button,
  TextInput,
} from 'react-native';
import PropTypes from 'prop-types';

///////////////////////////////////////CENTER///////////////////////////////
export const Center = ({children}) => {
  return (
    // <ScrollView>
    <View style={styles.Center}>{children}</View>
    // </ScrollView>
  );
};

//////////////////////////////////////FORM?///////////////////////////////////////

export const FormInput = ({
  iconName,
  iconColor,
  returnKeyType,
  keyboardType,
  name,
  placeholder,
  ...rest
}) => (
  <View style={styles.inputContainer}>
    <TextInput
      {...rest}
      placeholderTextColor="grey"
      placeholder={placeholder}
      style={{
        borderBottomColor: '#FFCCBC',
      }}
      renderErrorMessage={false}
    />
  </View>
);

export const FormButton = ({title, buttonType, buttonColor, ...rest}) => (
  <Button {...rest} title={title} color={buttonColor} />
);

export const ErrorMessage = ({errorValue}) => (
  <View style={styles.containerError}>
    <Text style={styles.errorText}>{errorValue}</Text>
  </View>
);

///////////////////////////////////////////////////////////RIPPLE//////////////////////////////

export const radius = 10;

const styles = StyleSheet.create({
  Center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  container: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  ripple: {
    width: radius * 2,
    height: radius * 2,
    borderRadius: radius,
    overflow: 'hidden',
    position: 'absolute',
  },
  //////////////////////////
  inputContainer: {
    margin: 15,
    // backgroundColor: 'yellow',
  },
  iconStyle: {
    marginRight: 10,
  },
  containerError: {
    marginLeft: 25,
  },
  errorText: {
    color: 'red',
  },
});

export class Ripple extends PureComponent {
  static defaultProps = {
    ...TouchableWithoutFeedback.defaultProps,

    rippleColor: 'rgb(0, 0, 0)',
    rippleOpacity: 0.3,
    rippleDuration: 400,
    rippleSize: 0,
    rippleContainerBorderRadius: 0,
    rippleCentered: false,
    rippleSequential: false,
    rippleFades: true,
    disabled: false,

    onRippleAnimation: (animation, callback) => animation.start(callback),
  };

  static propTypes = {
    ...Animated.View.propTypes,
    ...TouchableWithoutFeedback.propTypes,

    rippleColor: PropTypes.string,
    rippleOpacity: PropTypes.number,
    rippleDuration: PropTypes.number,
    rippleSize: PropTypes.number,
    rippleContainerBorderRadius: PropTypes.number,
    rippleCentered: PropTypes.bool,
    rippleSequential: PropTypes.bool,
    rippleFades: PropTypes.bool,
    disabled: PropTypes.bool,

    onRippleAnimation: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.onLayout = this.onLayout.bind(this);
    this.onPress = this.onPress.bind(this);
    this.onPressIn = this.onPressIn.bind(this);
    this.onPressOut = this.onPressOut.bind(this);
    this.onLongPress = this.onLongPress.bind(this);
    this.onAnimationEnd = this.onAnimationEnd.bind(this);

    this.renderRipple = this.renderRipple.bind(this);

    this.unique = 0;
    this.mounted = false;

    this.state = {
      width: 0,
      height: 0,
      ripples: [],
    };
  }

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  onLayout(event) {
    let {width, height} = event.nativeEvent.layout;
    let {onLayout} = this.props;

    if ('function' === typeof onLayout) {
      onLayout(event);
    }

    this.setState({width, height});
  }

  onPress(event) {
    let {ripples} = this.state;
    let {onPress, rippleSequential} = this.props;

    if (!rippleSequential || !ripples.length) {
      if ('function' === typeof onPress) {
        requestAnimationFrame(() => onPress(event));
      }

      this.startRipple(event);
    }
  }

  onLongPress(event) {
    let {onLongPress} = this.props;

    if ('function' === typeof onLongPress) {
      requestAnimationFrame(() => onLongPress(event));
    }

    this.startRipple(event);
  }

  onPressIn(event) {
    let {onPressIn} = this.props;

    if ('function' === typeof onPressIn) {
      onPressIn(event);
    }
  }

  onPressOut(event) {
    let {onPressOut} = this.props;

    if ('function' === typeof onPressOut) {
      onPressOut(event);
    }
  }

  onAnimationEnd() {
    if (this.mounted) {
      this.setState(({ripples}) => ({ripples: ripples.slice(1)}));
    }
  }

  startRipple(event) {
    let {width, height} = this.state;
    let {
      rippleDuration,
      rippleCentered,
      rippleSize,
      onRippleAnimation,
    } = this.props;

    let w2 = 0.5 * width;
    let h2 = 0.5 * height;

    let {locationX, locationY} = rippleCentered
      ? {locationX: w2, locationY: h2}
      : event.nativeEvent;

    let offsetX = Math.abs(w2 - locationX);
    let offsetY = Math.abs(h2 - locationY);

    let R =
      rippleSize > 0
        ? 0.5 * rippleSize
        : Math.sqrt(Math.pow(w2 + offsetX, 2) + Math.pow(h2 + offsetY, 2));

    let ripple = {
      unique: this.unique++,
      progress: new Animated.Value(0),
      locationX,
      locationY,
      R,
    };

    let animation = Animated.timing(ripple.progress, {
      toValue: 1,
      easing: Easing.out(Easing.ease),
      duration: rippleDuration,
      useNativeDriver: true,
    });

    onRippleAnimation(animation, this.onAnimationEnd);

    this.setState(({ripples}) => ({ripples: ripples.concat(ripple)}));
  }

  renderRipple({unique, progress, locationX, locationY, R}) {
    let {rippleColor, rippleOpacity, rippleFades} = this.props;

    let rippleStyle = {
      top: locationY - radius,
      [I18nManager.isRTL ? 'right' : 'left']: locationX - radius,
      backgroundColor: rippleColor,

      transform: [
        {
          scale: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.5 / radius, R / radius],
          }),
        },
      ],

      opacity: rippleFades
        ? progress.interpolate({
            inputRange: [0, 1],
            outputRange: [rippleOpacity, 0],
          })
        : rippleOpacity,
    };

    return <Animated.View style={[styles.ripple, rippleStyle]} key={unique} />;
  }

  render() {
    let {ripples} = this.state;
    let {
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      hitSlop,
      pressRetentionOffset,
      children,
      rippleContainerBorderRadius,
      testID,
      nativeID,
      accessible,
      accessibilityHint,
      accessibilityLabel,

      onPress,
      onLongPress,
      onLayout,
      onRippleAnimation,

      rippleColor,
      rippleOpacity,
      rippleDuration,
      rippleSize,
      rippleCentered,
      rippleSequential,
      rippleFades,

      ...props
    } = this.props;

    let touchableProps = {
      delayLongPress,
      delayPressIn,
      delayPressOut,
      disabled,
      hitSlop,
      pressRetentionOffset,
      testID,
      accessible,
      accessibilityHint,
      accessibilityLabel,
      onLayout: this.onLayout,
      onPress: this.onPress,
      onPressIn: this.onPressIn,
      onPressOut: this.onPressOut,
      onLongPress: onLongPress ? this.onLongPress : undefined,

      ...('web' !== Platform.OS ? {nativeID} : null),
    };

    let containerStyle = {
      borderRadius: rippleContainerBorderRadius,
    };

    return (
      <TouchableWithoutFeedback {...touchableProps}>
        <Animated.View {...props} pointerEvents="box-only">
          {children}
          <View style={[styles.container, containerStyle]}>
            {ripples.map(this.renderRipple)}
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}
