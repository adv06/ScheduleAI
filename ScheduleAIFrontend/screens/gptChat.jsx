import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useHeaderHeight } from '@react-navigation/elements';
import React, { useContext, useEffect } from 'react'
import { FlatList, Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'

import { SafeAreaView } from 'react-native-safe-area-context';
import { Context } from './Context';

const gptChat = () => {
  const [text, onChangeText] = React.useState('');
  const [data, setData] = React.useState([]);
  const height = useHeaderHeight();
  const {token, setToken} = useContext(Context);
  const gptUpdate = async () => {
    
    try{
      const updatedText = "Take the following data and make a list with a colon of the following information (calendar entry): summary, location, description, attendees, due date, duration. Don't add any extra information, add each data point on a new line, no bullet points. If there is missing information, just dont put anything beside that the description, colon, blank. Give the due date in the form DD/MM/YYYY followed by the time. Here is the data: "
      const response =  await fetch(`http://10.39.102.115:8000/api/`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({text: updatedText+text, token: token})
      });
      const res = await response.json();
      console.log(res.text);
      setData(prevData => [...prevData, {message: res.text, key: prevData.length+1, user: 1}]);
   } catch (error) {
      console.error('Error:', error); 
    }
    
  }
  
  const send = () => {
    console.log("SENDING: " + text);
    setData(prevData => [...prevData, {message: text, key: prevData.length+1, user: 0}]);
  // const iter = (data) => {
    //   for (let i = 0; i < data.length; i++) {
    //     console.log("Entry " + i + " " + data[i].message);
    //   }
    // }

    // iter(data);
    gptUpdate();
    onChangeText('');
    
  } 

  return (
    <SafeAreaView style={{ flex: 1, flexDirection: 'column' }}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          KeyboardVerticalOffset: height+40,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.wrap}>
              <View style={styles.inner}>
              <FlatList 
                style={{ marginTop: 10}}
                data={data}
                renderItem={({item}) => (
                  <Text 
                    style={item.user ? styles.bubbleLeft: styles.bubbleRight}
                    
                    >{item.message}</Text>
                )}
              />
                  <TextInput
                    style={[styles.input, {height: 40}]}
                    onChangeText={onChangeText}
                    value={text}
                    multiline={true}
                    
                    
                  />
                <TouchableOpacity onPress={send}>
                  <MaterialIcons name="send" size={24} color="black" style={styles.arrow}/>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    margin: 12,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginRight: 70,
    flexDirection: 'row',
    marginBottom: 130,
  },
  inputRow: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginHorizontal: 10,
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end',
    
  },
  arrow: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginRight: 30,
    marginBottom: 140,
  },
  wrap: {
    flex: 1,
    flexDirection: 'column',
  },
  bubbleRight: {
    backgroundColor: 'lightblue',
    borderRadius: 20,
    marginBottom: 10,
    padding: 10, 
    fontSize: 18, 
    marginRight: 10,
    maxWidth: '80%',
    alignSelf: 'flex-end',
    flex: 1,
    flexWrap: 'wrap',
    overflow: 'visible'
  },
  bubbleLeft: {
    backgroundColor: 'lightgreen',
    borderRadius: 20,
    marginBottom: 10,
    paddingHorizontal: 11, 
    paddingVertical: 10,
    fontSize: 18, 
    marginLeft: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    minWidth: 50,

  }

});

export default gptChat