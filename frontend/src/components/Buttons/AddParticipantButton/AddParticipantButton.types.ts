import {
  Conversation as ConversationType,
  ParticipantType
} from '@twilio/conversations'

export const WA_BINDING = 'whatsapp'
export const SMS_BINDING = 'sms'
export const CHAT_BINDING = 'chat'

export interface AddParticipantButtonProps {
  binding: ParticipantType
  conversation: ConversationType
}
