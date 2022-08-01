import reducer, { dismiss, set } from './alert'

const newAlert = {
  isActive: true,
  type: 'success',
  title: 'Test Alert Title',
  message: 'Test alert message',
}

const newAlert2 = {
  isActive: true,
  type: 'warning',
  title: 'Test Warn Title',
  message: 'Test alert message',
}

const previousState = {
  alert: {
    isActive: true,
    type: 'success',
    title: 'Test Alert Title',
    message: 'Test alert message',
  },
}

describe('Alert Slice', () => {
  it('should return empty alert at start', () => {
    expect(reducer(undefined, {})).toEqual({
      alert: null,
    })
  })

  it('should accept a new alert', () => {
    expect(reducer(undefined, set({ alert: newAlert }))).toEqual({
      alert: newAlert,
    })
  })

  it('should dismiss a previous alert', () => {
    expect(reducer(previousState, dismiss())).toEqual({
      alert: null,
    })
  })

  it('should update from a previous alert', () => {
    expect(reducer(previousState, set({ alert: newAlert2 }))).toEqual({
      alert: newAlert2,
    })
  })
})
