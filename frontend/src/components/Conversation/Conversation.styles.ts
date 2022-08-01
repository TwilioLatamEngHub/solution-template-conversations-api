import styled from 'styled-components'
import { Form, Input, Button } from 'antd'

import { COLOR_TWILIO_RED, COLOR_NAVY_BLUE } from '../../helpers'

export const ConversationContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  overflow-y: auto;
`

export const StyledForm = styled(Form)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 8rem;
  background-color: ${COLOR_TWILIO_RED};
`

export const StyledInput = styled(Input)`
  display: flex;
  flex-direction: row-reverse;
  width: 40rem;
  font-size: 14px;
`

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 5rem;
  background-color: ${COLOR_NAVY_BLUE};
`

export const RemoveButton = styled(Button)`
  min-width: 5rem;
`
