import { Button, Typography } from 'antd'
import styled from 'styled-components'

import {
  COLOR_NAVY_BLUE,
  COLOR_TWILIO_RED,
  COLOR_WHITE
} from '../../../helpers'

const { Text } = Typography

export const ConvoHeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 7rem;
  background-color: ${COLOR_TWILIO_RED};
`

export const FriendlyName = styled(Text)`
  color: ${COLOR_WHITE};
  font-weight: bold;
  font-size: 16px;
  margin-left: 1rem;
`

export const ParticipantsButton = styled(Button)`
  color: ${COLOR_NAVY_BLUE} !important;
  border-color: ${COLOR_NAVY_BLUE} !important;
  width: 100%;
  margin-top: 0.8rem;
`

export const ParticipantsModalContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 1rem 0;
`

export const ParticipantsModalUsers = styled.p`
  margin: 0 0.5rem;
`

export const ParticipantsModalRemove = styled.a`
  position: absolute;
  right: 0;
  margin: 0 1rem;
  color: ${COLOR_TWILIO_RED};
`
