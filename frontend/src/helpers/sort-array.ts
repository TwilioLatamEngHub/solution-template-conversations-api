import { Conversation } from '@twilio/conversations'

export const sortArray = (conversations: Conversation[]): Conversation[] => {
  return conversations.sort((a, b) => {
    if (a.dateCreated && b.dateCreated) {
      return a.dateCreated < b.dateCreated ? 1 : -1
    }
    return 0
  })
}
