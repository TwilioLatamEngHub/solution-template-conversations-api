import { FC, useEffect } from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import GlobalStyles from './styles'
import { ConversationsContentProvider } from './contexts'

const MainComponent: FC = (props: Record<string, string>) => {
  useEffect(() => {
    for (const [key, value] of Object.entries(props)) {
      process.env[key] = value
    }
  }, [])
  return (
    <ConversationsContentProvider>
      <GlobalStyles />
      <App />
    </ConversationsContentProvider>
  )
}

const container = document.getElementById('root')
if (container) {
  ReactDOM.render(<MainComponent />, container)
}

export default MainComponent
