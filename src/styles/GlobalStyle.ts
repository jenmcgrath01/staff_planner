import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  body {
    font-family: ${props => props.theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${props => props.theme.colors.background.main};
    color: ${props => props.theme.colors.text.primary};
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100vw;
    max-width: 100%;
  }

  button {
    font-family: inherit;
  }
`; 