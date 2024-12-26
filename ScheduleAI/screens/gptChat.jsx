import React from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, Text,TextInput,View } from 'react-native'

const gptChat = () => {
  const [text, onChangeText] = React.useState('');
  return (
    
    <View>
      <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
        />
        </KeyboardAvoidingView>
    </View>
  )
}
const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    bottom: -520,
  },
});

export default gptChat