import React, { Component } from 'react';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default class ButtonView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            button: {
                text: 'Hello!'
            }
        };
    }

    updateDisplayText = () => {
        const { text } = this.state.button;

        this.props.updateDisplayText(text);
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity title="" onPress={this.updateDisplayText} >
                    <View>
                        <Text style={styles.text}>Hello!</Text>
                        <Image source={require('./assets/icon.png')} resizeMode="contain" />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const ButtonTitle = () => {
    return (
        <Text style={{paddingTop: 50}}>test</Text>
    )
};

const ButtonImage = () => {
    //const icon = this.props;

    return (
        <Image style={styles.image} source={require('./assets/icon.png')} resizeMode="contain" />
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    text: {
        textAlign: 'center',
    },
    image: {
    }
});