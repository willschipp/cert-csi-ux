import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Grid, View , defaultTheme, Provider, Content, ToastContainer } from '@adobe/react-spectrum';

import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import Menu from './components/Menu';
import Home from './components/Home';
import Certify from './components/Certify';


function App() {

  return (
    <Provider theme={defaultTheme}>
      <Router>
        <Grid 
          areas={['header header', 'sidebar content','footer footer']} 
          columns={['1fr','3fr']} 
          rows={['size-1000','auto','size-1000']} 
          height="100vh" 
          gap="size-100"
          justifyContent="center">
            <View gridArea="header">
              <AppHeader/>
            </View>
            <View gridArea="sidebar">
              <Menu/>
            </View>
            <View gridArea="content" overflow="scroll"> 
              <Content>
                <Routes>
                  <Route exact path="/" element={<Home/>}/>
                  <Route path="/certify" element={<Certify/>}/>
                </Routes>
              </Content>
            </View>
            <View gridArea="footer">
              <AppFooter/>
            </View>
        </Grid>
      </Router>
      <ToastContainer placement='top'/>
    </Provider>
  )
}

export default App
