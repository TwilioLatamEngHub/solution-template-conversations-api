import { useContext, useState } from 'react'
import { Button, Form, Modal, Select } from 'antd'

import { ConversationMessages } from '../ConversationMessages'
import {
  AddParticipantButton,
  ViewParticipantsButton,
  WA_BINDING,
  SMS_BINDING,
  CHAT_BINDING
} from '../Buttons'
import {
  ButtonsContainer,
  ConversationContainer,
  RemoveButton,
  StyledForm,
  StyledInput
} from './Conversation.styles'
import { ConversationsContext } from '../../contexts'
import { useMessageChange } from '../../hooks'
import { sortArray } from '../../helpers'

const { confirm } = Modal
const { Option } = Select

const templateOne =
  'Thank you for purchasing Stranger! We value your feedback and would like to learn more about your experience.'
const templateTwo =
  'Hi Stranger, were we able to solve the issue that you were facing?'

export const Conversation = (): JSX.Element => {
  const {
    client,
    conversation,
    setConversation,
    setIsLoading,
    setBadgeStatus,
    setBadgeText,
    setLocalSid,
    setConversations
  } = useContext(ConversationsContext)
  const { newMessage, setNewMessage, onMessageChanged } = useMessageChange()
  const [buttonIsLoading, setButtonIsLoading] = useState<boolean>(false)
  // const [formData, setFormData] = useState<FormData | null>(null)

  const sendMessage = async () => {
    setButtonIsLoading(true)

    try {
      if (conversation) {
        await conversation.sendMessage(newMessage)

        setNewMessage('')
        setButtonIsLoading(false)
      }
    } catch (error) {
      console.log(error)
      setButtonIsLoading(false)
    }
  }

  const handleRemove = async () => {
    setBadgeStatus('warning')
    setBadgeText('Removing conversation')
    setIsLoading(true)

    try {
      if (conversation) {
        await conversation.delete()

        if (client) {
          const { items } = await client.getSubscribedConversations()

          setConversation(null)
          setLocalSid('')
          const sortedArr = sortArray(items)
          setConversations(sortedArr)

          setBadgeStatus('success')
          setBadgeText('Conversation removed')
          setIsLoading(false)
        }
      }
    } catch (error) {
      console.log(error)
      setBadgeStatus('error')
      setBadgeText(
        'You cannot delete this conversation, please ask the conversation creator'
      )
      setIsLoading(false)
    }
  }

  const showDeleteConfirm = () => {
    confirm({
      title: 'Are you sure you want to delete this conversation?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        handleRemove()
      }
    })
  }

  const handleSelectChange = (value: string) => {
    setNewMessage(value)
  }

  // TODO: Add feat to send media. Currently antd's Upload is behaving awkwardly,
  // further investigation needed.

  // const handleUpload = async () => {
  //   if (formData) {
  //     setButtonIsLoading(true)
  //     await conversation?.sendMessage(formData)
  //     setButtonIsLoading(false)
  //   }
  // }

  // const props: UploadProps = {
  //   showUploadList: false,
  //   onChange(info) {
  //     const formData = new FormData()
  //     formData.append('file', info.file.originFileObj as Blob)
  //     setFormData(formData)
  //   }
  // }

  return conversation ? (
    <ConversationContainer>
      <ViewParticipantsButton />
      <ConversationMessages />
      <StyledForm size='large' layout='inline' onFinish={sendMessage}>
        <Form.Item>
          <StyledInput
            // prefix={
            //   <Upload {...props}>
            //     <FileImageOutlined style={{ cursor: 'pointer' }} />
            //   </Upload>
            // }
            placeholder={'Type your message here...'}
            type={'text'}
            name={'message'}
            autoComplete={'off'}
            onChange={onMessageChanged}
            value={newMessage}
            disabled={buttonIsLoading}
          />
          <Select
            placeholder={'WhatsApp Templates'}
            style={{ width: '40rem', fontSize: '14px', marginTop: '0.5rem' }}
            onChange={handleSelectChange}
          >
            <Option value={templateOne}>{templateOne}</Option>
            <Option value={templateTwo}>{templateTwo}</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            htmlType='submit'
            style={{ minWidth: '5rem', fontSize: '14px' }}
            loading={buttonIsLoading}
          >
            Enter
          </Button>
        </Form.Item>
      </StyledForm>
      <ButtonsContainer>
        <AddParticipantButton
          conversation={conversation}
          binding={CHAT_BINDING}
        />
        <AddParticipantButton
          conversation={conversation}
          binding={WA_BINDING}
        />
        <AddParticipantButton
          conversation={conversation}
          binding={SMS_BINDING}
        />
        <RemoveButton danger htmlType='submit' onClick={showDeleteConfirm}>
          Delete Conversation
        </RemoveButton>
      </ButtonsContainer>
    </ConversationContainer>
  ) : (
    <div />
  )
}
