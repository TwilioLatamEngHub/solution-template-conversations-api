import { useContext, useEffect, useState } from 'react'
import { Modal } from 'antd'
import { TeamOutlined, UserOutlined } from '@ant-design/icons'

import { ConversationsContext } from '../../../contexts'
import {
  ConvoHeaderContainer,
  FriendlyName,
  ParticipantsButton,
  ParticipantsModalContainer,
  ParticipantsModalRemove,
  ParticipantsModalUsers
} from './ViewParticipantsButton.styles'

export const ViewParticipantsButton = (): JSX.Element => {
  const { conversation, setBadgeStatus, setBadgeText, setIsLoading } =
    useContext(ConversationsContext)
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [participants, setParticipants] = useState<any[] | undefined>(undefined)

  useEffect(() => {
    const getParticipants = async () => {
      const convoParticipants = await conversation?.getParticipants()

      setParticipants(convoParticipants)
    }

    getParticipants()
  }, [participants])

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const handleRemove = async (p: any) => {
    setBadgeStatus('warning')
    setBadgeText('Removing participant')
    setIsLoading(true)
    setIsModalVisible(false)

    try {
      await p.remove()

      setBadgeStatus('success')
      setBadgeText('Participant removed')
      setIsLoading(false)
    } catch (error) {
      console.log(error)

      setBadgeStatus('error')
      setBadgeText(
        'You cannot delete this participant, please ask the conversation creator'
      )
      setIsLoading(false)
    }
  }

  return conversation ? (
    <ConvoHeaderContainer>
      <FriendlyName>{conversation.friendlyName}</FriendlyName>
      <ParticipantsButton onClick={showModal}>
        <TeamOutlined />
        View Participants
      </ParticipantsButton>
      <Modal
        title='Participants'
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {participants &&
          participants.map(p => (
            <ParticipantsModalContainer key={p.sid}>
              <UserOutlined />
              <ParticipantsModalUsers>
                {p.identity || p.bindings.whatsapp.address}
              </ParticipantsModalUsers>
              <ParticipantsModalRemove onClick={() => handleRemove(p)}>
                Remove
              </ParticipantsModalRemove>
            </ParticipantsModalContainer>
          ))}
      </Modal>
    </ConvoHeaderContainer>
  ) : (
    <div />
  )
}
