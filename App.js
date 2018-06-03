import React, { Component } from 'react';
import { StatusBar, StyleSheet, View, Modal, TouchableHighlight, Text, TextInput, Dimensions } from 'react-native';
import Expo from 'expo';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

import MainView from './components/MainView';
import ButtonImage from './components/Button/ButtonImage';
import buttons from './data/buttons';
import normalize from './utils/normalize';

const MAX_DISPLAY_WORDS = 16;

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // View mode
            displayText: '',
            displayWords: [],
            buttons: buttons,

            // Edit mode
            isEditButtonModalVisible: false,
            buttonToEdit_id: undefined,
            buttonToEdit_text: '',
            buttonToEdit_imageURL: ''
        };
    }

    // life cycle method - ensures component is mounted before turning screen
    componentDidMount() {
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.LANDSCAPE_RIGHT);
    }

    componentWillUnmount() {
        Expo.ScreenOrientation.allow(Expo.ScreenOrientation.Orientation.PORTRAIT);
    }

    // Display Text
    clearDisplayText = () => {
        this.setState({
            ...this.state,

            displayText: '',
            displayWords: []
        });
    }

    updateDisplayText = (text) => {
        // Make a copy of array
        let displayWords = this.state.displayWords.slice();

        if (displayWords.length < MAX_DISPLAY_WORDS) {
            displayWords.push(text);

        } else {
            displayWords.shift();
            displayWords.push(text);

        }

        this.setState({
            ...this.state,

            displayText: `${displayWords.join(' ')}`,
            displayWords
        });
    }

    // Set edit button to visible
    launchEditButtonModal = (id) => {
        this.setState({
            ...this.state,

            isEditButtonModalVisible: true,
            buttonToEdit_id: id,
            buttonToEdit_text: this.state.buttons[id].text,
            buttonToEdit_imageURL: this.state.buttons[id].imageURL,
        });
    }

    // Save changes to button
    saveEditButton = () => {
        const { buttonToEdit_id: id, buttons } = this.state;
        const index = buttons.findIndex(button => button.id === id);

        this.setState({
            ...this.state,

            buttons: [
                // Keep everything before
                ...buttons.slice(0, index),

                // Insert the new state
                {
                    ...this.state.buttons[index],
                    text: this.state.buttonToEdit_text
                },

                // Keep everything after
                ...buttons.slice(index + 1)
            ],

            // Reset
            isEditButtonModalVisible: false,
            buttonToEdit_id: undefined,
            buttonToEdit_text: '',
            buttonToEdit_imageURL: ''
        });
    }

    // Discard changes to button
    cancelEditButton = () => {
        this.setState({
            ...this.state,

            // Reset
            isEditButtonModalVisible: false,
            buttonToEdit_id: undefined,
            buttonToEdit_text: '',
            buttonToEdit_imageURL: ''
        });
    }

    render() {
        if (this.state.isEditButtonModalVisible) {
            const { buttonToEdit_id: id } = this.state;
            let button = this.state.buttons[id];

            return (
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isEditButtonModalVisible}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.innerModal}>
                            <StatusBar hidden={true} />
                            <Text style={styles.modalTitle}>Edit Button Details</Text>
                            <View style={styles.outerFormContainer}>
                                <View style={styles.formItemContainer}>
                                    <Text style={styles.label}>Button Text:</Text>
                                    <TextInput
                                        style={styles.textInput}
                                        autoFocus={true}
                                        placeholder="Please enter a text for this button."
                                        value={this.state.buttonToEdit_text}
                                        onChangeText={(newName) => {
                                            this.setState({
                                                ...this.state,
                                                buttonToEdit_text: newName
                                            });
                                        }}
                                    />
                                </View>

                                <View style={styles.formItemContainer}>
                                    <Text style={styles.label}>Select Image:</Text>
                                    <View style={styles.imageContainer}>
                                        <ButtonImage path={this.state.buttonToEdit_imageURL}/>
                                    </View>
                                </View>

                                <View style={styles.formCancelButtons}>
                                    <TouchableHighlight onPress={this.cancelEditButton} style={[styles.modalButton, styles.cancelEditButton]}>
                                        <Text style={styles.modalButtonText}>Cancel</Text>
                                    </TouchableHighlight>

                                    <TouchableHighlight onPress={this.saveEditButton} style={[styles.modalButton, styles.saveEditButton]}>
                                        <Text style={styles.modalButtonText}>Save</Text>
                                    </TouchableHighlight>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            );

        } else {
            return (
                <View>
                    <StatusBar hidden={true} />
                    <MainView
                        clearDisplayText={this.clearDisplayText}
                        updateDisplayText={this.updateDisplayText}
                        toggleEditButton={this.toggleEditButton}
                        launchEditButtonModal={this.launchEditButtonModal}

                        displayText={this.state.displayText}
                        isEditButtonModalVisible={this.state.isEditButtonModalVisible}

                        buttons={this.state.buttons}
                    />
                </View>
            );

        }
    }
}


// CSS styling
const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerModal: {
        height: screenHeight * 0.6,
        width: screenWidth * 0.7,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: normalize(40),
        marginBottom: 12
    },
    label: {
        fontSize: normalize(20),
        fontWeight: 'bold',
        marginBottom: 8
    },
    textInput: {
        fontSize: normalize(20),
        width: screenHeight * 0.2,
        width: screenWidth * 0.36,
    },
    outerFormContainer: {
        alignItems: 'flex-start',
    },
    formItemContainer: {
        marginBottom: 16
    },
    imageContainer: {
        paddingBottom: 8,
        alignItems: 'center'
    },
    formCancelButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    modalButton: {
        height: screenHeight * 0.08,
        width: screenWidth * 0.18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelEditButton: {
        backgroundColor: 'red'
    },
    saveEditButton: {
        backgroundColor: 'green'
    },
    modalButtonText: {
        fontSize: normalize(20)
    }
});
