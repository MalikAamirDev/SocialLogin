import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';

const App = () => {
  const [userData, setUserData] = useState({});

  const facebookLogin = async () => {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccesToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  };

  const facebookLogout = async () => {
    try {
      await auth().signOut();
      LoginManager.logOut();
      setUserData({});
      console.log('User Logout Success');
    } catch (error) {
      console.log('Error: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facebook Login</Text>
      <View>
        <Text>
          UID: <Text style={styles.title}>{userData?.uid}</Text>
        </Text>
        <Text>
          Email: <Text style={styles.title}>{userData?.email}</Text>
        </Text>
        <Text>
          User Name: <Text style={styles.title}>{userData?.displayName}</Text>
        </Text>
      </View>
      <Pressable
        onPress={() =>
          facebookLogin()
            .then(res => {
              console.log(res);
              setUserData(res.user);
            })
            .catch(error => console.log(error))
        }
        style={styles.fbBtn}>
        <Text style={styles.btnTitle}>Facebook Login</Text>
      </Pressable>
      <Pressable onPress={facebookLogout} style={styles.fbBtn}>
        <Text style={styles.btnTitle}>Facebook Logout</Text>
      </Pressable>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  fbBtn: {
    backgroundColor: '#1399F130',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  btnTitle: {
    fontSize: 22,
    color: '#1399F1',
  },
});
