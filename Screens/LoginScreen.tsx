import React from 'react'
import {
  Text,
  TextInput,
  AsyncStorage,
  View,
  Button,
  StyleSheet,
} from 'react-native'
import { login } from '../api'
interface IState {
  username: string
  password: string
  err: string
}
export class LoginScreen extends React.Component<{}, IState> {
  state = {
    username: '',
    password: '',
    err: '',
  }
  constructor(props: {}) {
    super(props)
    this._fetchData()
  }
  _storeData = async (username: string, password: string) => {
    try {
      await AsyncStorage.setItem(username, password)
    } catch (error) {
      // Error Saving data
    }
  }

  _fetchData = async () => {
    try {
      const value = await AsyncStorage.getItem('username')
      if (value !== null) {
        console.log(value)
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  _loggingIn = async () => {
    try {
      const success = await login(this.state.username, this.state.password)
      await this._storeData(this.state.username, this.state.password)
      this.setState({ err: 'Success!' })
    } catch (err) {
      const errMessage = err.message
      this.setState({ err: errMessage })
    }
  }

  _handlePasswordUpdate = (password: string) => {
    this.setState({ password })
  }

  _handleUsernameUpdate = (username: string) => {
    this.setState({ username })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{this.state.err}</Text>
        <TextInput
          style={styles.input}
          placeholder=" Username"
          value={this.state.username}
          onChangeText={this._handleUsernameUpdate}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder=" Password"
          value={this.state.password}
          onChangeText={this._handlePasswordUpdate}
          secureTextEntry
        />
        <Button title="Press to Log In" onPress={this._loggingIn} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
  input: {
    margin: 10,
    borderRadius: 5,
    borderColor: 'grey',
    borderStyle: 'solid',
    borderWidth: 2,
    height: 50,
    fontSize: 20,
  },
  error: {
    textAlign: 'center',
    color: 'red',
  },
})
