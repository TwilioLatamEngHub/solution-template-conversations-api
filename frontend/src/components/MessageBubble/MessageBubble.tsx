import { useEffect, useState } from 'react'
import {
  WhatsAppOutlined,
  MessageOutlined,
  MobileOutlined
} from '@ant-design/icons'
import { ParticipantType, Message } from '@twilio/conversations'

import {
  BodySpan,
  BubbleHeader,
  BubbleHeaderSpan,
  BubbleIconWrapper,
  DateSpan,
  StyledDiv,
  StyledLi
} from './MessageBubble.styles'
import { Media } from './Media'
import { CHAT_BINDING, SMS_BINDING, WA_BINDING } from '../Buttons'

const handleBubbleIcon = (type: ParticipantType) => {
  if (type) {
    switch (type) {
      case CHAT_BINDING:
        return <MessageOutlined style={{ fontSize: '16px' }} />
      case WA_BINDING:
        return <WhatsAppOutlined style={{ fontSize: '16px' }} />
      case SMS_BINDING:
        return <MobileOutlined />
      default:
        break
    }
  }
}

export type MessageDirection = 'outgoing' | 'incoming'

interface MessageBubbleProps {
  messageDirection: MessageDirection
  message: Message
}

export const MessageBubble = ({
  messageDirection,
  message
}: MessageBubbleProps): JSX.Element => {
  const [participantType, setParticipantType] =
    useState<ParticipantType>('chat')
  const [hasMedia, setHasMedia] = useState<boolean>(false)
  const [mediaDownloadFailed, setMediaDownloadFailed] = useState<boolean>(false)
  const [mediaUrl, setMediaUrl] = useState<string | null>(null)

  const messageDateCreated = message.dateCreated?.toLocaleString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })

  useEffect(() => {
    const fetchType = async () => {
      try {
        const participant = await message.getParticipant()
        setParticipantType(participant.type)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchMedia = async () => {
      try {
        const mediaArr = message.attachedMedia
        if (mediaArr && mediaArr[0]) {
          setHasMedia(true)
          const url = await mediaArr[0].getContentTemporaryUrl()
          setMediaUrl(url)
        }
      } catch (error) {
        console.log(error)
        setMediaDownloadFailed(true)
      }
    }

    fetchType()
    fetchMedia()

    document.getElementById(message.sid)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <StyledLi id={message.sid}>
      <StyledDiv messageDirection={messageDirection}>
        <BubbleHeader>
          <BubbleIconWrapper>
            {participantType && handleBubbleIcon(participantType)}
          </BubbleIconWrapper>
          <BubbleHeaderSpan>{` ${message.author}`}</BubbleHeaderSpan>
        </BubbleHeader>
        <BodySpan>{message.body}</BodySpan>
        {hasMedia && (
          <Media
            hasFailed={mediaDownloadFailed}
            url={mediaUrl}
            message={message}
            messageDirection={messageDirection}
          />
        )}
        <DateSpan>{messageDateCreated}</DateSpan>
      </StyledDiv>
    </StyledLi>
  )
}
