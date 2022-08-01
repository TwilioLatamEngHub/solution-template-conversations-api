import { useEffect } from 'react'
import { Spin, Modal } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { Message } from '@twilio/conversations'

import {
  MediaWrapper,
  PictureContainer,
  PicturePreviewContainer,
  StyledEyeOutlined,
  StyledImage,
  WarningWrapper
} from './Media.styles'
import { MessageDirection } from './MessageBubble'

interface MediaProps {
  hasFailed: boolean
  url: string | null
  message: Message
  messageDirection: MessageDirection
}

export const Media = ({
  hasFailed,
  url,
  message,
  messageDirection
}: MediaProps): JSX.Element => {
  useEffect(() => {
    document.getElementById(message.sid)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <MediaWrapper
      onClick={() => {
        Modal.info({
          centered: true,
          icon: null,
          okText: 'Close',
          content: (
            <PictureContainer>
              {url && <StyledImage src={url} alt={'an alternative'} />}
            </PictureContainer>
          )
        })
      }}
    >
      {!url && !hasFailed && <Spin />}
      {hasFailed && (
        <WarningWrapper>
          <WarningOutlined style={{ fontSize: '5em' }} />
          <p>Failed to load media</p>
        </WarningWrapper>
      )}
      {!hasFailed && url && (
        <PicturePreviewContainer messageDirection={messageDirection}>
          <StyledEyeOutlined />
          <p>Click here to see the media</p>
        </PicturePreviewContainer>
      )}
    </MediaWrapper>
  )
}
