import cloneDeep from 'lodash/cloneDeep'
import axios from 'axios'
import { runSaga } from 'redux-saga'
import reducer, {
  setDefault,
  fetched,
  update,
  updateStart,
  updateFail,
  updateSuccess,
  updateLabelOverrideSaga,
} from './labelOverride'
import { updateGlobalCustomization } from './customer'
import { set as setAlert } from './alert'

const testDefaultLabels = [
  {
    name: 'Test Title',
    key: 'pages.test.title',
    override: false,
    overrideText: '',
    default: 'Here is my Page Title',
  },
  {
    name: 'Test Description',
    key: 'pages.test.description',
    override: false,
    overrideText: '',
    default: 'Here is a paper section!',
  },
]

const testOverrideLabels = [
  {
    name: 'Test Title',
    key: 'pages.test.title',
    override: true,
    overrideText: 'Yo, here is my overriden title',
    default: 'Here is my Page Title',
  },
  {
    name: 'Test Description',
    key: 'pages.test.description',
    override: false,
    overrideText: '',
    default: 'Here is a paper section!',
  },
]

describe('Label Override Slice', () => {
  it('should return empty array  at start', () => {
    expect(reducer(undefined, {})).toEqual({
      override: [],
      default: [],
      error: null,
      loading: true,
      updating: false,
    })
  })

  it('should set defaults', () => {
    expect(
      reducer(undefined, setDefault({ labels: testDefaultLabels })),
    ).toEqual({
      override: [],
      default: testDefaultLabels,
      error: null,
      loading: true,
      updating: false,
    })
  })

  it('should set overrides on fetched', () => {
    expect(reducer(undefined, fetched({ labels: testOverrideLabels }))).toEqual(
      {
        override: testOverrideLabels,
        default: [],
        error: null,
        loading: false,
        updating: false,
      },
    )
  })

  it('should set updating on update', () => {
    let updatedOverrideLabels = cloneDeep(testOverrideLabels)
    updatedOverrideLabels[0].override = true
    expect(
      reducer(undefined, updateStart({ labels: testOverrideLabels })),
    ).toEqual({
      override: [],
      default: [],
      error: null,
      loading: true,
      updating: false,
    })

    expect(reducer(undefined, update({ labels: testOverrideLabels }))).toEqual({
      override: [],
      default: [],
      error: null,
      loading: true,
      updating: true,
    })
  })

  it('should update error message on updateFail', () => {
    let updatedOverrideLabels = cloneDeep(testOverrideLabels)
    updatedOverrideLabels[0].override = true
    expect(
      reducer(undefined, updateFail({ error: 'some error message' })),
    ).toEqual({
      override: [],
      default: [],
      error: 'some error message',
      loading: false,
      updating: false,
    })
  })

  it('should update overrides on updateSuccess', () => {
    let updatedOverrideLabels = cloneDeep(testOverrideLabels)
    updatedOverrideLabels[0].override = true
    expect(
      reducer(undefined, updateSuccess({ override: updatedOverrideLabels })),
    ).toEqual({
      override: updatedOverrideLabels,
      default: [],
      error: null,
      loading: false,
      updating: false,
    })
  })
})

jest.mock('axios')

describe('Label Override Saga', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call update api on update saga', async () => {
    axios.put.mockResolvedValue({ data: {} })

    const dispatched = []
    const updatePayload = {
      newLabel: [],
      newDemoConfig: {},
      accessToken: '',
      userApi: '',
      currentDemo: '',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateLabelOverrideSaga,
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
      newLabel: [],
      newDemoConfig: {},
      accessToken: '',
      userApi: '',
      currentDemo: '',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateLabelOverrideSaga,
      update(updatePayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(updateStart.type)
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(updateFail.type)
  })
})
