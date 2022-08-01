import styled, { css } from 'styled-components'

import { COLOR_TWILIO_RED, COLOR_NAVY_BLUE, COLOR_WHITE } from '../../helpers'
import { MessageDirection } from './MessageBubble'

export const BubbleIconWrapper = styled.div`
  margin-right: 0.5rem;
`

export const BubbleHeader = styled.div`
  display: flex;
`

export const StyledLi = styled.li`
  display: inline-block;
  padding: 0 0 0 10px;
  vertical-align: top;
  width: 92%;
  margin: 1rem 0 1rem;
`

export const BubbleHeaderSpan = styled.span`
  display: block;
  color: ${COLOR_WHITE};
  font-size: 14px;
`

export const BodySpan = styled.span`
  display: block;
  color: ${COLOR_WHITE};
  font-size: 14px;
`

export const DateSpan = styled.span`
  color: ${COLOR_WHITE};
  display: block;
  font-size: 10px;
  margin: 8px 0 0;
`

export const StyledDiv = styled.div<{
  messageDirection: MessageDirection
}>`
  ${({ messageDirection }) =>
    messageDirection === 'incoming'
      ? css`
          background: ${COLOR_NAVY_BLUE} none repeat scroll 0 0;
          float: right;
        `
      : css`
          background: ${COLOR_TWILIO_RED} none repeat scroll 0 0;
        `};
  display: flex;
  flex-direction: column;
  border-radius: 3px;
  color: ${COLOR_WHITE};
  font-size: 14px;
  margin: 0;
  padding: 5px 10px 5px 12px;
  width: 40%;
`
