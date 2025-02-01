import React, { useContext, useEffect } from 'react'
import {GoogleSignin, GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { Context } from './Context';

const googleAuth = () => {
    const {token, setToken} = useContext(Context);
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '53347310793-8k85ni90qcnv8h8djl4a8u3vt1vkdafi.apps.googleusercontent.com',
            offlineAccess: true,
            scopes: ['https://www.googleapis.com/auth/calendar']
          });  
      }, []);
    
      const GoogleSignUp = async () => {
        try{
            await GoogleSignin.hasPlayServices();
            const info = await GoogleSignin.signIn();
            setToken(info['data']['serverAuthCode']);
            console.log(info)
        }catch(error){
            console.log(error);
        }
      }
      return (
        <GoogleSigninButton
          style={{ width: 192, height: 48 }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={GoogleSignUp}
        />
      );
}

export default googleAuth