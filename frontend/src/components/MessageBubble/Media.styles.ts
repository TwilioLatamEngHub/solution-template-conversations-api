import { EyeOutlined } from '@ant-design/icons'
import styled, { css } from 'styled-components'

import { COLOR_NAVY_BLUE, COLOR_TWILIO_RED } from '../../helpers'
import { MessageDirection } from './MessageBubble'

export const MediaWrapper = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  min-height: 8rem;
  margin-top: 1rem;
`

export const PictureContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

export const StyledImage = styled.img`
  width: 100%;
  height: 100%;
`

export const WarningWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

export const StyledEyeOutlined = styled(EyeOutlined)`
  font-size: 3rem;
`

export const PicturePreviewContainer = styled.div<{
  messageDirection: MessageDirection
}>`
  display: flex;
  flex-direction: column;
  -webkit-transition: color 0.5s ease-out !important;
  -moz-transition: color 0.5s ease-out !important;
  -o-transition: color 0.5s ease-out !important;
  transition: color 0.5s ease-out !important;

  ${({ messageDirection }) =>
    messageDirection === 'incoming'
      ? css`
          &:hover {
            color: ${COLOR_TWILIO_RED} !important;
          }
        `
      : css`
          &:hover {
            color: ${COLOR_NAVY_BLUE} !important;
          }
        `};
`
