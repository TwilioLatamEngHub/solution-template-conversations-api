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
  updateActionOverrideSaga,
} from './actionOverride'
import { updateGlobalCustomization } from './customer'
import { set as setAlert } from './alert'

const testDefaultActions = [
  {
    name: 'Test Action One',
    key: 'test-action-1',
    override: false,
    overrideText: '',
    overrideExample: '',
    webhook: false,
    webhookUrl: '',
    webhookResponse: '',
    default: 'Hello there from test',
  },
  {
    name: 'Test Action Two',
    key: 'test-action-2',
    override: false,
    overrideText: '',
    overrideExample: '',
    webhook: false,
    webhookUrl: '',
    webhookResponse: '',
    default: 'Hello there from test # 2',
  },
]

const testOverrideActions = [
  {
    name: 'Test Action',
    key: 'test-action',
    override: false,
    overrideText: '',
    overrideExample: '',
    webhook: false,
    webhookUrl: '',
    webhookResponse: '',
    default: 'Hello there from test',
  },
  {
    name: 'Test Action Two',
    key: 'test-action-2',
    override: true,
    overrideText: 'Howdy from an override',
    overrideExample: '',
    webhook: false,
    webhookUrl: '',
    webhookResponse: '',
    default: 'Hello there from test # 2',
  },
]

describe('Action Override Slice', () => {
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
      reducer(undefined, setDefault({ actions: testDefaultActions })),
    ).toEqual({
      override: [],
      default: testDefaultActions,
      error: null,
      loading: true,
      updating: false,
    })
  })

  it('should set overrides on fetched', () => {
    expect(
      reducer(undefined, fetched({ actions: testOverrideActions })),
    ).toEqual({
      override: testOverrideActions,
      default: [],
      error: null,
      loading: false,
      updating: false,
    })
  })

  it('should set updating on update', () => {
    let updatedOverrideActions = cloneDeep(testOverrideActions)
    updatedOverrideActions[0].override = true
    expect(
      reducer(undefined, updateStart({ actions: testOverrideActions })),
    ).toEqual({
      override: [],
      default: [],
      error: null,
      loading: true,
      updating: false,
    })

    expect(
      reducer(undefined, update({ actions: testOverrideActions })),
    ).toEqual({
      override: [],
      default: [],
      error: null,
      loading: true,
      updating: true,
    })
  })

  it('should update error message on updateFail', () => {
    let updatedOverrideActions = cloneDeep(testOverrideActions)
    updatedOverrideActions[0].override = true
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
    let updatedOverrideActions = cloneDeep(testOverrideActions)
    updatedOverrideActions[0].override = true
    expect(
      reducer(undefined, updateSuccess({ override: updatedOverrideActions })),
    ).toEqual({
      override: updatedOverrideActions,
      default: [],
      error: null,
      loading: false,
      updating: false,
    })
  })
})

jest.mock('axios')

describe('Action Override Saga', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call update api on update saga', async () => {
    axios.put.mockResolvedValue({ data: {} })

    const dispatched = []
    const updatePayload = {
      newActions: [],
      newDemoConfig: {},
      accessToken: '',
      userApi: '',
      currentDemo: '',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateActionOverrideSaga,
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
      newActions: [],
      newDemoConfig: {},
      accessToken: '',
      userApi: '',
      currentDemo: '',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateActionOverrideSaga,
      update(updatePayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(updateStart.type)
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(updateFail.type)
  })
})
