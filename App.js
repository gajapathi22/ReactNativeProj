
import { StyleSheet, Text, View ,Image,Button, ScrollView} from 'react-native';
import 'expo-dev-client';
import { GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import React, { useState, useEffect } from 'react';
import Header from './Header';
import ImageCard from './Card';


export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
 

  const imageUrl1 = require('./assets/reactNative.jpg')
  const imageUrl2 = require('./assets/photo1.jpeg')

  GoogleSignin.configure({
    webClientId: '897948488238-48gd13vs4kodgsgvm3jbusj4ifo1r4c0.apps.googleusercontent.com',
  });

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; 
  }, []);

  const  onGoogleButtonPress = async()=> {
    
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    
    const { idToken } = await GoogleSignin.signIn();
  
  
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    
    const user_sign_in =  auth().signInWithCredential(googleCredential);
    user_sign_in.then((user)=>{
      console.log(user);
    })
    .catch((error)=>{
      console.log(error);
    })
  }

  const signOut = async()=>{
   try{
    await GoogleSignin.revokeAccess();
    await auth().signOut();
   }catch(error){
      console.error(error);
   }
  }

  if (initializing) return null;


  if(!user){
    return (
      <View style={styles.container}>
        <Header/>
        <ImageCard
        title="Image Card"
        description="This is an example of an image card."
        imageUrl={imageUrl1}
      />
        <GoogleSigninButton
          style = {{width:300,height:48,marginTop:300}}
          onPress = {onGoogleButtonPress}
        />
      </View>
    );
  }

  return(
    <ScrollView>
    <View style = {styles.container}>
        
        <View style = {{marginTop:100,alignItems:'center'}}>
            <Text style = {styles.text}>
              Welcome, {user.displayName}
            </Text>
            <Image
              source = {{uri:user.photoURL}}
              style = {{height:300,width:300,borderRadius:150,margin:50}}
            />
             <ImageCard
                 title="Image Card"
                 description="This is an example of an image card."
                 imageUrl={imageUrl2}
             />
            <Button title='Sign Out' onPress ={signOut}/>
        </View>
    </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    
  },
  text:{
    fontSize:23,
    fontWeight:'bold'
  }
});
