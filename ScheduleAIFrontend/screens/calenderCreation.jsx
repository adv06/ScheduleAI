import React from 'react'
import { Text,View } from 'react-native'
import WebView from 'react-native-webview'

const CalenderCreation = () => {
    return (
        <WebView source={{uri: "https://calendar.google.com/calendar/u/0/r"}} />
      )
}

export default CalenderCreation