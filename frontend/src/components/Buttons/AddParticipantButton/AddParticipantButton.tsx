import { useContext, useEffect, useState } from 'react'
import { Modal, Button, Input } from 'antd'
import {
  WhatsAppOutlined,
  MessageOutlined,
  MobileOutlined
} from '@ant-design/icons'
import styled from 'styled-components'

import {
  AddParticipantButtonProps,
  CHAT_BINDING,
  SMS_BINDING,
  WA_BINDING
} from './AddParticipantButton.types'
import { ConversationsContext } from '../../../contexts'
import { COLOR_NAVY_BLUE } from '../../../helpers'
import { addParticipant } from '../../../services/functions'

const StyledButton = styled(Button)`
  color: ${COLOR_NAVY_BLUE} !important;
  border-color: ${COLOR_NAVY_BLUE} !important;
`

export const AddParticipantButton = ({
  binding,
  conversation
}: AddParticipantButtonProps): JSX.Element => {
  const { isLoading, setIsLoading, setBadgeStatus, setBadgeText } =
    useContext(ConversationsContext)
  const [isVisible, setIsVisible] = useState<boolean>(false)
  const [participant, setParticipant] = useState<string>('')
  const [buttonText, setButtonText] = useState<string>('')
  const [buttonIcon, setButtonIcon] = useState<JSX.Element>(<div />)
  const [modalTitle, setModalTitle] = useState<string>('')

  useEffect(() => {
    switch (binding) {
      case WA_BINDING:
        setButtonText('Add WhatsApp Participant')
        setButtonIcon(<WhatsAppOutlined />)
        setModalTitle('Add WhatsApp Participant')
        break
      case SMS_BINDING:
        setButtonText('Add SMS Participant')
        setButtonIcon(<MobileOutlined />)
        setModalTitle('Add SMS Participant')
        break
      case CHAT_BINDING:
        setButtonText('Add Chat Participant')
        setButtonIcon(<MessageOutlined />)
        setModalTitle('Add Chat Participant')
        break
      default:
        break
    }
  }, [])

  const showModal = () => {
    setIsVisible(true)
  }

  const handleCancel = () => {
    setIsVisible(false)
  }

  const handleChange = (event: any) => {
    setParticipant(event.target.value)
  }

  const handleAddParticipant = async () => {
    setIsLoading(true)
    setBadgeStatus('warning')
    setBadgeText('Adding participant')
    setIsVisible(false)

    try {
      if (binding === CHAT_BINDING) {
        await addParticipant({
          participantType: binding,
          conversationSid: conversation.sid,
          identity: participant
        })
      } else {
        await addParticipant({
          participantType: binding,
          conversationSid: conversation.sid,
          number: participant
        })
      }

      setIsLoading(false)
      setBadgeStatus('success')
      setBadgeText('Participant added')
      setParticipant('')
    } catch (error: any) {
      console.log(error)
      setIsLoading(false)
      setBadgeStatus('error')

      if (error.message) {
        setBadgeText(error.message)
      } else {
        setBadgeText(
          'You cannot add participants, please ask the conversation creator'
        )
      }
    }
  }

  return (
    <>
      <StyledButton
        type='primary'
        ghost
        htmlType='submit'
        style={{ minWidth: '5rem', background: '#fff' }}
        onClick={showModal}
      >
        {buttonIcon}
        {buttonText}
      </StyledButton>
      <Modal
        visible={isVisible}
        title={modalTitle}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleCancel}>
            Return
          </Button>
        ]}
      >
        <Input.Group compact>
          <Input
            style={{ width: 'calc(100% - 200px)' }}
            placeholder={
              binding === CHAT_BINDING ? 'Chat Identity' : 'E.164 Number Format'
            }
            value={participant}
            onChange={handleChange}
          />
          <Button
            type='primary'
            loading={isLoading}
            onClick={handleAddParticipant}
          >
            Submit
          </Button>
        </Input.Group>
        {binding === WA_BINDING && (
          <p style={{ marginTop: '1em' }}>
            <strong>IMPORTANT:</strong> After you submit your number, you need
            to send a WhatsApp message to +5511952130034 in order to participate
            in the conversation, otherwise your number will be only reachable
            through WhatsApp Templates.{' '}
            <a
              href='https://www.twilio.com/docs/conversations/using-whatsapp-conversations'
              target='_blank'
              rel='noopener noreferrer'
            >
              More info on how to use WhatsApp with Conversations here.
            </a>
          </p>
        )}
      </Modal>
    </>
  )
}
