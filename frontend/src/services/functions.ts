import { ParticipantType } from '@twilio/conversations'


const handleFetches = async (url: string, queries?: string) => {
  console.log({url})
  const fetchUrl = queries ? `${url}${queries}` : url
  return await fetch(fetchUrl)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        throw new Error(data.error)
      } else {
        return data
      }
    })
}

interface AddParticipantParams {
  participantType: ParticipantType
  conversationSid: string
  identity?: string
  number?: string
}

interface AddParticipantReturn {
  participantSid: string
}

interface GetTokenReturn {
  accessToken: string
}

export const addParticipant = async ({
  participantType,
  conversationSid,
  identity,
  number
}: AddParticipantParams): Promise<AddParticipantReturn> => {
  let queries = `?participantType=${participantType}&conversationSid=${conversationSid}`

  if (number) {
    queries += `&number=${number}`
  }

  if (identity) {
    queries += `&identity=${identity}`
  }

  return (
    process.env.REACT_APP_ADD_PARTICIPANT_URL && (await handleFetches(process.env.REACT_APP_ADD_PARTICIPANT_URL, queries))
  )
}

export const getToken = async (identity: string): Promise<GetTokenReturn> => {
  const queries = `?identity=${identity}`

  return process.env.REACT_APP_GET_TOKEN && (await handleFetches(process.env.REACT_APP_GET_TOKEN, queries))
}
