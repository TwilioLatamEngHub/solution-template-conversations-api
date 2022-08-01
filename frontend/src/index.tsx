import { FC } from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import GlobalStyles from './styles'
import { ConversationsContentProvider } from './contexts'

const MainComponent: FC = () => (
  <ConversationsContentProvider>
    <GlobalStyles />
    <App />
  </ConversationsContentProvider>
)

ReactDOM.render(<MainComponent />, document.getElementById('root'))
