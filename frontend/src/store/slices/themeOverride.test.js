import cloneDeep from 'lodash/cloneDeep'
import axios from 'axios'
import { runSaga } from 'redux-saga'
import reducer, {
  fetched,
  computeStart,
  computeFail,
  computedTheme,
  update,
  updateStart,
  updateFail,
  updateSuccess,
  updateThemeSaga,
} from './themeOverride'
import { updateGlobalCustomization } from './customer'
import { set as setAlert } from './alert'

const testOverrideThemes = {
  useOverrideTheme: false,
  selectedTheme: 'watermelon',
  logo: {
    img: '',
  },
}

describe('Theme Override Slice', () => {
  it('should return empty array  at start', () => {
    expect(reducer(undefined, {})).toEqual({
      override: {},

      error: null,
      updating: false,
      computing: false,
    })
  })

  it('should set overrides on fetched', () => {
    expect(
      reducer(undefined, fetched({ override: testOverrideThemes })),
    ).toEqual({
      override: testOverrideThemes,
      error: null,
      updating: false,

      computing: false,
    })
  })

  it('should set updating on update', () => {
    expect(reducer(undefined, updateStart())).toEqual({
      override: {},
      error: null,
      updating: true,
      computing: false,
    })
  })

  it('should update error message on updateFail', () => {
    expect(
      reducer(undefined, updateFail({ error: 'some error message' })),
    ).toEqual({
      override: {},
      error: 'some error message',
      updating: false,

      computing: false,
    })
  })

  it('should update overrides on updateSuccess', () => {
    const updatedOverrideThemes = cloneDeep(testOverrideThemes)
    updatedOverrideThemes.useOverrideTheme = true
    expect(
      reducer(undefined, updateSuccess({ override: updatedOverrideThemes })),
    ).toEqual({
      override: updatedOverrideThemes,
      error: null,
      updating: false,

      computing: false,
    })
  })

  it('should update computing on computeStart', () => {
    expect(reducer(undefined, computeStart())).toEqual({
      override: {},
      error: null,
      updating: false,

      computing: true,
    })
  })

  it('should set error on computeFail', () => {
    expect(
      reducer(undefined, computeFail({ error: 'some error message' })),
    ).toEqual({
      override: {},
      error: 'some error message',
      updating: false,

      computing: false,
    })
  })

  it('should update computing on computeSuccess', () => {
    expect(reducer(undefined, computedTheme())).toEqual({
      override: {},
      error: null,
      updating: false,

      computing: false,
    })
  })
})

jest.mock('axios')

describe('Theme Override Saga', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call update api on update saga', async () => {
    axios.put.mockResolvedValue({ data: {} })

    const dispatched = []
    const updatePayload = {
      newTheme: {},
      newDemoConfig: {},
      accessToken: '',
      userApi: '',
      currentDemo: '',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateThemeSaga,
      update(updatePayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(updateStart.type)
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(updateSuccess.type)
    expect(dispatched[2].type).toEqual(updateGlobalCustomization.type)
    expect(dispatched[3].type).toEqual(setAlert.type)
  })

  it('should handle error message on api error', async () => {
    axios.put.mockImplementation(() => {
      throw new Error('some error message')
    })

    const dispatched = []
    const updatePayload = {
      newTheme: {},
      newDemoConfig: {},
      accessToken: '',
      userApi: '',
      currentDemo: '',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateThemeSaga,
      update(updatePayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(updateStart.type)
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(updateFail.type)
  })
})
