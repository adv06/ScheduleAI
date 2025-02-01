import React from 'react'
import HomeTabs from "../navigators/HomeTabs"
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from '@/screens/Context';
const Page = () => {
  return ( 
      <Provider>
        <HomeTabs />
      </Provider>
   
  )
}

export default Page

