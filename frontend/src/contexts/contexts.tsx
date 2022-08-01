import { Client, Conversation, Message } from '@twilio/conversations'
import { PresetStatusColorType } from 'antd/lib/_util/colors'
import React, { createContext, Dispatch, SetStateAction, useState } from 'react'

export interface ConversationsContextData {
  identity: string
  setIdentity: Dispatch<SetStateAction<string>>
  loggedIn: boolean
  setLoggedIn: Dispatch<SetStateAction<boolean>>
  conversation: Conversation | null
  setConversation: Dispatch<SetStateAction<Conversation | null>>
  conversations: Conversation[]
  setConversations: Dispatch<SetStateAction<Conversation[]>>
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
  isLoading: boolean
  setIsLoading: Dispatch<SetStateAction<boolean>>
  messages: Message[]
  setMessages: Dispatch<SetStateAction<Message[]>>
  localSid: string
  setLocalSid: Dispatch<SetStateAction<string>>
  badgeStatus: PresetStatusColorType
  setBadgeStatus: Dispatch<SetStateAction<PresetStatusColorType>>
  badgeText: string
  setBadgeText: Dispatch<SetStateAction<string>>
  client: Client | null
  setClient: Dispatch<SetStateAction<Client | null>>
}

interface ConversationsContentProviderProps {
  children: React.ReactNode
}

export const ConversationsContext = createContext(
  {} as ConversationsContextData
)

export const ConversationsContentProvider = ({
  children
}: ConversationsContentProviderProps) => {
  const [identity, setIdentity] = useState<string>('')
  const [loggedIn, setLoggedIn] = useState<boolean>(false)
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [localSid, setLocalSid] = useState<string>('')
  const [badgeStatus, setBadgeStatus] =
    useState<PresetStatusColorType>('warning')
  const [badgeText, setBadgeText] = useState<string>('Disconnected')
  const [client, setClient] = useState<Client | null>(null)

  const conversationsContextDefaultValue = {
    identity,
    setIdentity,
    loggedIn,
    setLoggedIn,
    conversation,
    setConversation,
    conversations,
    setConversations,
    showModal,
    setShowModal,
    isLoading,
    setIsLoading,
    messages,
    setMessages,
    localSid,
    setLocalSid,
    badgeStatus,
    setBadgeStatus,
    badgeText,
    setBadgeText,
    client,
    setClient
  }

  return (
    <ConversationsContext.Provider value={conversationsContextDefaultValue}>
      {children}
    </ConversationsContext.Provider>
  )
}
