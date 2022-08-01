import reducer, { setAuth } from './auth'

describe('Auth Slice', () => {
  it('should return empty auth at start', () => {
    expect(reducer(undefined, {})).toEqual({
      accessToken: null,
      idToken: null,
      user: null,
      email: null,
      error: null,
      loading: true,
    })
  })

  it('should set auth values', () => {
    const newAuth = {
      accessToken: 'test token',
      idToken: 'test id token',
      user: { email: 'testUser@twilio.com' },
    }
    expect(reducer(undefined, setAuth(newAuth))).toEqual({
      accessToken: 'test token',
      idToken: 'test id token',
      user: { email: 'testUser@twilio.com' },
      email: 'testUser@twilio.com',
      loading: false,
      error: undefined,
    })
  })
})
