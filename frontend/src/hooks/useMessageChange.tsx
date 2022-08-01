import { Dispatch, SetStateAction, useState } from 'react'

interface UseMessageChangeReturn {
  newMessage: string
  setNewMessage: Dispatch<SetStateAction<string>>
  onMessageChanged: (event: any) => void
}

export const useMessageChange = (): UseMessageChangeReturn => {
  const [newMessage, setNewMessage] = useState<string>('')

  const onMessageChanged = (event: any) => {
    setNewMessage(event.target.value)
  }

  return { newMessage, setNewMessage, onMessageChanged }
}
