import { createGlobalStyle } from 'styled-components'
import { wrapper } from '../src/store'

const GlobalStyle = createGlobalStyle`
 * {
    box-sizing: border-box;
  }
  html {
    height: 100%;
  }
`;


const WrappedApp = ({ Component, pageProps }) => {
  return(
    <React.Fragment>
      <Component {...pageProps} />
      <GlobalStyle />
    </React.Fragment>
  )
}

export default wrapper.withRedux(WrappedApp)