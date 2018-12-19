import React from 'react'
import firebase from 'firebase'
import { StyleSheet,SafeAreaView,Alert} from 'react-native'
import { Text,Form,Input,Item,Button,Label} from 'native-base'
// import { LoginScreen } from './Screens/LoginScreen'

const config = {
  apiKey: 'AIzaSyD4yWh96ZIL3OMzFOPd4WOtAzjyA3Czvuo',
  authDomain: 'reactnative-project-9fe45.firebaseapp.com',
  databaseURL: 'https://reactnative-project-9fe45.firebaseio.com',
  projectId: 'reactnative-project-9fe45',
  storageBucket: 'reactnative-project-9fe45.appspot.com',
  messagingSenderId: '238674326109',
}
firebase.initializeApp(config)

interface IState {
  email: string
  password: string
}
export default class App extends React.Component<{}, IState> {
  state = {
    email: '',
    password: '',
  }

  constructor(props: {}) {
    super(props)
  }

  verifyEmail = () => {
    firebase
      .auth()
      .currentUser!.sendEmailVerification()
      .then(() => {
        console.log('Email Verification Sent')
        Alert.alert(
          'Email Verification',
          "We've sent a user verification email. Please click the link in your email inbox to be verified as a user",
          [
            {
              text: 'OK',
              onPress: () => console.log('OK'),
              style: 'cancel',
            },
          ],
          { cancelable: false }
        )
      })
      .catch(error => console.log(error))
  }

  signUpUser = async (email: string, password: string) => {
    // sign up from firebase
    await firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(obj => {
        if (obj !== null && !obj.user!.emailVerified) {
          // send email verification
          this.verifyEmail()
        }
      })
      .catch(error => {
        const errorCode = error.code
        const errorMessage = error.message
        if (errorCode === null) {
          Alert.alert('success')
        } else if (errorCode === 'auth/weak-password') {
          Alert.alert('The password is too weak.')
        } else if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('This email already has an account.')
        } else if (errorCode === 'auth/invalid-email') {
          Alert.alert('Please enter a valid email.')
        } else {
          Alert.alert(errorMessage)
        }
      })
  }

  loginUser = async (email: string, password: string) => {
    // sign up from firebase
    await firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(obj => {
        if (obj !== null && obj.user!.emailVerified) {
          // Go to another Screen!
          console.log('Login!')
        } else {
          throw new Error('Email not verified')
        }
      })
      .catch(error => Alert.alert(error.message))
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input
              onChangeText={email => this.setState({ email })}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input
              onChangeText={password => this.setState({ password })}
              secureTextEntry={true}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </Item>
          <Button
            style={{ marginTop: 50, margin: 10 }}
            full
            rounded
            success
            onPress={() =>
              this.loginUser(this.state.email, this.state.password)
            }
          >
            <Text>Login</Text>
          </Button>
          <Button
            style={{ margin: 10 }}
            full
            rounded
            primary
            onPress={() =>
              this.signUpUser(this.state.email, this.state.password)
            }
          >
            <Text>Sign Up</Text>
          </Button>
        </Form>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
})