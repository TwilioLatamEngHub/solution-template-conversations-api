export type Customer = {
  id: string | number
  firstName?: string;
  demoConfig?: DemoConfiguration;
};

export type DemoConfiguration = {
  id: string | number
  activeDemo: unknown;
  jCurrentCustomization?: Customization;
  currentDemoCustomization?: Customization;
  customizations?: unknown;
};

export type Customization = {
  themeOverride?: {};
  actionOverride?: unknown;
  labelOverride?: Label[]
};

export type Label = {
  name: string
  key: string
  override: boolean
  overrideText: string
  default: string
}

export type Action = {
  name: string;
  key: string;
  override: boolean;
  overrideText: string;
  overrideExample: string;
  webhook: boolean;
  webhookUrl: string;
  webhookResponse: string;
  default: string;
};
