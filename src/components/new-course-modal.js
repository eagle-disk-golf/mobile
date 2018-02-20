import React, {Component} from 'react';
import { Text, View, Button, Modal, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
/** https://docs.nativebase.io/Components.html#Form */
import {Form, Item, Input} from 'native-base';
import {COLORS} from '../res/styles/constants';

/**
 * This is not used.
 * Modal that takes a name of a place as an input from an user.
 */
export default class NewCourseModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      text: ''
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
      const { visible } = this.props;

      if (visible) this.openModal();
  }

  componentWillReceiveProps(nextProps) {
    const {visible} = nextProps;

    if (visible && (this.state.visible !== visible)) {
      this.openModal();
    } else if (!visible && (this.state.visible !== visible)) {
      this.closeModal();
    }
  }

  openModal() {
    this.setState({modalVisible: true});
  }

  handleSuccess() {
    const {text} = this.state;
    const {onSuccess} = this.props;

    onSuccess(text);
    this.closeModal();
  }

  handleCancel() {
    const {onCancel = () => null} = this.props;

    onCancel();
    this.closeModal();
  }

  closeModal() {
    this.setState({modalVisible: false});
  }

  render() {
    const {modalVisible} = this.state;
    const {children, placeholderText} = this.props;

    if (!modalVisible) {
      return <TouchableOpacity onPress={() => this.openModal()}>{children}</TouchableOpacity>;
    }

    return (
      <View style={styles.container}>
        <Modal
          transparent={true}
          visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={() => this.closeModal()}
        >
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <Text>Give name for your game</Text>
              <Text style={[styles.verticalMargin, {fontSize: 8}]}>For example, name of the location etc</Text>
              <TextInput style={[styles.verticalMargin, {width: '60%'}]} placeholder="Name, location"  defaultValue={placeholderText} onChangeText={(text) => this.setState({text})}></TextInput>
              <Button onPress={this.handleSuccess} title='Done' color={COLORS.textDark} style={[styles.button]}></Button>

              <View style={[styles.cancelButton]}>
              <Button
                color={COLORS.success}
                onPress={this.handleCancel}
                title='Cancel'
                style={[styles.verticalMargin]}
              >
              </Button>
              </View>

            </View>
          </View>
        </Modal>

        {this.props.children}
        {/* <Button
          onPress={() => this.openModal()}
          title="Open modal"
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  verticalMargin: {
    marginBottom: '10%'
  },
  button: {
    color: COLORS.white
  },
  cancelButton: {
    marginTop: '40%'
    // alignSelf: 'flex-end',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'grey',
  },
  innerContainer: {
    alignItems: 'center',
  },
});
