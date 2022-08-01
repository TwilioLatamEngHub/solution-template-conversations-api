import { List, Typography } from 'antd'
import styled from 'styled-components'

import { COLOR_TWILIO_RED, COLOR_NAVY_BLUE, COLOR_WHITE } from '../../helpers'

const { Text } = Typography

export const StyledList = styled<any>(List)`
  cursor: pointer;

  &:active {
    background-color: ${COLOR_NAVY_BLUE};
  }
`

export const ConversationsListItem = styled(List.Item)<{
  $isItemActive: boolean
}>`
  background-color: ${props =>
    props.$isItemActive ? COLOR_NAVY_BLUE : COLOR_TWILIO_RED};
  -webkit-transition: background-color 0.5s ease-out;
  -moz-transition: background-color 0.5s ease-out;
  -o-transition: background-color 0.5s ease-out;
  transition: background-color 0.5s ease-out;

  &:hover {
    cursor: pointer;
    background-color: ${COLOR_NAVY_BLUE};
    margin-right: -2px;
    margin-left: -1px;
  }
`

export const StyledText = styled(Text)`
  color: ${COLOR_WHITE};
`
