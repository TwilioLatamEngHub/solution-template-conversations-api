import cloneDeep from 'lodash/cloneDeep'
import axios from 'axios'
import { runSaga } from 'redux-saga'
import reducer, {
  setDefaultCustomization,
  fetch,
  fetchStart,
  fetchSuccess,
  fetchFail,
  updateDemoConfig,
  updateDemoConfigStart,
  updateDemoConfigFail,
  updateDemoConfigSuccess,
  updateCustomization,
  updateCustomizationStart,
  updateCustomizationFail,
  updateCustomizationSuccess,
  fetchCustomerSaga,
  updateDemoConfigSaga,
  updateCustomizationSaga,
} from './customer'
import { set as setAlert } from './alert'
import { fetched as themeFetched } from './themeOverride'
import { fetched as actionFetched } from './actionOverride'
import { fetched as labelFetched } from './labelOverride'

const accessToken = 'eyJraWQ'
const userApi = 'https://api.owldemo.com/api/'
const email = 'trobinson@twilio.com'
const activeDemo = 'websiteTemplate'

describe('Customer Slice', () => {
  it('should return default state  at start', () => {
    expect(reducer(undefined, {})).toEqual({
      customer: {},
      customization: {},
      demoConfig: {},
      demoData: {},
      defaultCustomization: null,
      error: null,
      loading: true,
    })
  })

  it('should set default customization', () => {
    const defaultCustomization = {
      segmentEnabled: false,
      segmentKey: '',
      language: 'en',
    }
    expect(
      reducer(undefined, setDefaultCustomization({ defaultCustomization })),
    ).toEqual({
      customer: {},
      customization: {},
      demoConfig: {},
      demoData: {},
      defaultCustomization,
      error: null,
      loading: true,
    })
  })

  describe('should handle fetch', () => {
    it('should set loading on fetchStart', () => {
      expect(reducer(undefined, fetchStart())).toEqual({
        customer: {},
        customization: {},
        demoConfig: {},
        demoData: {},
        defaultCustomization: null,
        error: null,
        loading: true,
      })
    })

    it('should set error on fetchFail', () => {
      expect(
        reducer(undefined, fetchFail({ error: 'some error message' })),
      ).toEqual({
        customer: {},
        customization: {},
        demoConfig: {},
        demoData: {},
        defaultCustomization: null,
        loading: false,
        error: 'some error message',
      })
    })

    describe('should handle fetchSuccess', () => {
      it('should update customer and customization', () => {
        const customer = {
          firstName: 'Tom',
        }

        const customization = {
          segmentEnabled: true,
          segmentKey: '',
          language: 'es',
        }

        let demoData = {
          demoData: { ...customization },
          customer,
        }
        expect(
          reducer(undefined, fetchSuccess({ customer, customization })),
        ).toEqual({
          customer,
          customization,
          demoConfig: {},
          demoData,
          defaultCustomization: null,
          error: null,
          loading: false,
        })
      })

      it('should transform demoConfig', () => {
        const customer = {
          firstName: 'Tom',
          demoConfig: {
            activeCrm: 'zd',
            activeDemo: 'pubsec',
          },
        }

        const customization = {
          segmentEnabled: true,
          segmentKey: '',
          language: 'es',
        }

        const outputCustomer = cloneDeep(customer)
        delete outputCustomer.demoConfig

        let demoData = {
          demoData: { ...customization },
          customer: { ...outputCustomer },
        }
        expect(
          reducer(undefined, fetchSuccess({ customer, customization })),
        ).toEqual({
          customer: outputCustomer,
          customization,
          demoConfig: customer.demoConfig,
          demoData,
          defaultCustomization: null,
          error: null,
          loading: false,
        })
      })

      it('should transform demoData', () => {
        const customer = {
          firstName: 'Tom',
        }

        const customization = {
          segmentEnabled: true,
          segmentKey: '',
          language: 'es',
          actionOverride: {
            actions: [
              {
                name: 'test action',
              },
            ],
          },
        }

        const outputCustomization = cloneDeep(customization)
        delete outputCustomization.actionOverride

        let demoData = {
          demoData: { ...outputCustomization },
          customer,
        }
        expect(
          reducer(undefined, fetchSuccess({ customer, customization })),
        ).toEqual({
          customer,
          customization,
          demoConfig: {},
          demoData,
          defaultCustomization: null,
          error: null,
          loading: false,
        })
      })
    })
  })

  describe('should handle updateCustomization', () => {
    it('should set loading on updateStart', () => {
      expect(reducer(undefined, updateCustomizationStart())).toEqual({
        customer: {},
        customization: {},
        demoConfig: {},
        demoData: {},
        defaultCustomization: null,
        error: null,
        loading: true,
      })
    })

    it('should set error on updateFail', () => {
      expect(
        reducer(
          undefined,
          updateCustomizationFail({ error: 'some error message' }),
        ),
      ).toEqual({
        customer: {},
        customization: {},
        demoConfig: {},
        demoData: {},
        defaultCustomization: null,
        loading: false,
        error: 'some error message',
      })
    })

    it('should set new customization on updateSuccess', () => {
      const customization = { language: 'pt-br' }
      expect(
        reducer(undefined, updateCustomizationSuccess({ customization })),
      ).toEqual({
        customer: {},
        customization,
        demoConfig: {},
        demoData: {},
        defaultCustomization: null,
        loading: false,
        error: null,
      })
    })
  })

  describe('should handle updateDemoConfig', () => {
    it('should set loading on updateStart', () => {
      expect(reducer(undefined, updateDemoConfigStart())).toEqual({
        customer: {},
        customization: {},
        demoConfig: {},
        demoData: {},
        defaultCustomization: null,
        error: null,
        loading: true,
      })
    })

    it('should set error on updateFail', () => {
      expect(
        reducer(
          undefined,
          updateDemoConfigFail({ error: 'some error message' }),
        ),
      ).toEqual({
        customer: {},
        customization: {},
        demoConfig: {},
        demoData: {},
        defaultCustomization: null,
        loading: false,
        error: 'some error message',
      })
    })

    it('should set new demoConfig on updateSuccess', () => {
      const demoConfig = { activeDemo: 'anotherDemo' }
      expect(
        reducer(undefined, updateDemoConfigSuccess({ demoConfig })),
      ).toEqual({
        customer: {},
        customization: {},
        demoConfig,
        demoData: {},
        defaultCustomization: null,
        loading: false,
        error: null,
      })
    })
  })
})

jest.mock('axios')

describe('Customer Fetch Saga', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call fetch api', async () => {
    axios.get.mockResolvedValue({
      data: {
        firstName: 'Ted',
        demoConfig: {
          activeDemo,
          jCurrentCustomization: {},
        },
      },
    })

    const dispatched = []
    const fetchPayload = {
      accessToken,
      email,
      userApi,
      currentDemo: 'websiteTemplate',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchCustomerSaga,
      fetch(fetchPayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(fetchStart.type)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(themeFetched.type)
    expect(dispatched[2].type).toEqual(actionFetched.type)
    expect(dispatched[3].type).toEqual(labelFetched.type)
    expect(dispatched[4].type).toEqual(fetchSuccess.type)
  })

  it('should call fetch api twice when activeDemo does not match', async () => {
    axios.get.mockResolvedValue({
      data: {
        firstName: 'Ted',
        demoConfig: {
          activeDemo,
          jCurrentCustomization: {},
        },
      },
    })

    const dispatched = []
    const fetchPayload = {
      accessToken,
      email,
      userApi,
      currentDemo: 'anotherDemo',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchCustomerSaga,
      fetch(fetchPayload),
    ).toPromise()

    expect(axios.get).toHaveBeenCalledTimes(2)
  })

  it('should handle error message on api error', async () => {
    axios.get.mockImplementation(() => {
      throw new Error('some error message')
    })

    const dispatched = []
    const fetchPayload = {
      accessToken,
      email,
      userApi,
      currentDemo: 'websiteTemplate',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchCustomerSaga,
      fetch(fetchPayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(fetchStart.type)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(fetchFail.type)
  })

  it('should call fetchedTheme when themeOverride is present', async () => {
    const themeOverride = {
      logo: { img: 'someImg' },
    }
    axios.get.mockResolvedValue({
      data: {
        firstName: 'Ted',
        demoConfig: {
          activeDemo,
          jCurrentCustomization: {
            themeOverride,
          },
        },
      },
    })

    const dispatched = []
    const fetchPayload = {
      accessToken,
      email,
      userApi,
      currentDemo: activeDemo,
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchCustomerSaga,
      fetch(fetchPayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(fetchStart.type)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(themeFetched.type)
    expect(dispatched[1].payload).toEqual({ override: themeOverride })
  })

  it('should call fetchedAction when actionOverride is present', async () => {
    const actionOverride = [
      {
        name: 'Simple SMS Send',
        key: 'usecase-sms-sendAction',
        override: true,
        overrideText: 'Yo',
        overrideExample: '',
        webhook: false,
        webhookUrl: '',
        webhookResponse: '',
        default: 'Website template Text! Hello {{customer.name}}!',
      },
    ]
    axios.get.mockResolvedValue({
      data: {
        firstName: 'Ted',
        demoConfig: {
          activeDemo,
          jCurrentCustomization: {
            actionOverride,
          },
        },
      },
    })

    const dispatched = []
    const fetchPayload = {
      accessToken,
      email,
      userApi,
      currentDemo: activeDemo,
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchCustomerSaga,
      fetch(fetchPayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(fetchStart.type)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(dispatched[2].type).toEqual(actionFetched.type)
    expect(dispatched[2].payload).toEqual({ override: actionOverride })
  })

  it('should call fetchedLabel when labelOverride is present', async () => {
    const labelOverride = [
      {
        name: 'Brand Name',
        key: 'nav.brand.title',
        override: true,
        overrideText: 'Twilio.land',
        default: '',
      },
    ]
    axios.get.mockResolvedValue({
      data: {
        firstName: 'Ted',
        demoConfig: {
          activeDemo,
          jCurrentCustomization: {
            labelOverride,
          },
        },
      },
    })

    const dispatched = []
    const fetchPayload = {
      accessToken,
      email,
      userApi,
      currentDemo: activeDemo,
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      fetchCustomerSaga,
      fetch(fetchPayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(fetchStart.type)
    expect(axios.get).toHaveBeenCalledTimes(1)
    expect(dispatched[3].type).toEqual(labelFetched.type)
    expect(dispatched[3].payload).toEqual({ override: labelOverride })
  })
})

describe('Customer Update DemoConfig Saga', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call update api', async () => {
    axios.put.mockResolvedValue({
      data: {
        id: 10001,
        activeDemo,
        jCurrentDemoCustomization: {},
      },
    })

    const dispatched = []
    const customization = {
      segmentEnabled: false,
      segmentKey: 'undefined',
      language: 'es',
    }
    const putPayload = {
      newCustomization: customization,
      newDemoConfig: {
        id: 10001,
        currentDemoCustomization: JSON.stringify(customization),
      },
      accessToken,
      userApi,
      currentDemo: 'websiteTemplate',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateCustomizationSaga,
      updateCustomization(putPayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(updateCustomizationStart.type)
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(updateCustomizationSuccess.type)
  })

  it('should handle error message on api error', async () => {
    axios.put.mockImplementation(() => {
      throw new Error('some error message')
    })

    const dispatched = []
    const customization = {
      segmentEnabled: false,
      segmentKey: 'undefined',
      language: 'es',
    }
    const putPayload = {
      newCustomization: customization,
      newDemoConfig: {
        id: 10001,
        currentDemoCustomization: JSON.stringify(customization),
      },
      accessToken,
      userApi,
      currentDemo: 'websiteTemplate',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateCustomizationSaga,
      updateCustomization(putPayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(updateCustomizationStart.type)
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(updateCustomizationFail.type)
  })

  it('should set alert on success', async () => {
    axios.put.mockResolvedValue({
      data: {
        id: 10001,
        activeDemo,
        jCurrentDemoCustomization: {},
      },
    })

    const dispatched = []
    const customization = {
      segmentEnabled: false,
      segmentKey: 'undefined',
      language: 'es',
    }
    const putPayload = {
      newCustomization: customization,
      newDemoConfig: {
        id: 10001,
        currentDemoCustomization: JSON.stringify(customization),
      },
      accessToken,
      userApi,
      currentDemo: 'websiteTemplate',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateCustomizationSaga,
      updateCustomization(putPayload),
    ).toPromise()

    console.log(setAlert.type)
    expect(dispatched[2].type).toEqual(setAlert.type)
  })
})

describe('Customer Update Customization Saga', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should call update api', async () => {
    axios.put.mockResolvedValue({
      data: {
        id: 10001,
        activeDemo,
        jCurrentDemoCustomization: {},
      },
    })

    const dispatched = []
    const putPayload = {
      id: 10001,
      accessToken,
      userApi,
      currentDemo: 'websiteTemplate',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateDemoConfigSaga,
      updateDemoConfig(putPayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(updateDemoConfigStart.type)
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(updateDemoConfigSuccess.type)
  })

  it('should handle error message on api error', async () => {
    axios.put.mockImplementation(() => {
      throw new Error('some error message')
    })

    const dispatched = []
    const putPayload = {
      id: 10001,
      accessToken,
      userApi,
      currentDemo: 'websiteTemplate',
    }
    await runSaga(
      { dispatch: (action) => dispatched.push(action) },
      updateDemoConfigSaga,
      updateDemoConfig(putPayload),
    ).toPromise()

    expect(dispatched[0].type).toEqual(updateDemoConfigStart.type)
    expect(axios.put).toHaveBeenCalledTimes(1)
    expect(dispatched[1].type).toEqual(updateDemoConfigFail.type)
  })
})
