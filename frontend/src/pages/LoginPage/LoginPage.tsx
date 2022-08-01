import { useContext, useState } from 'react'
import { Layout, Button, Input, Form, Col } from 'antd'

import { ReactComponent as Logo } from '../../assets/twilio-mark-red.svg'
import { ConversationsContext } from '../../contexts'
import {
  StyledCard,
  StyledContent,
  StyledRowContainer,
  StyledRowWrapper,
  StyledUserOutlined
} from './LoginPage.styles'

export const LoginPage = (): JSX.Element => {
  const { setIdentity, setLoggedIn } = useContext(ConversationsContext)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onFinish = (values: any): void => {
    setIsLoading(true)

    const { identity } = values
    setIdentity(identity)
    setLoggedIn(true)
    setIsLoading(false)
  }

  return (
    <Layout>
      <StyledContent>
        <StyledRowContainer justify='space-around' align='middle'>
          <Col span={12} offset={6}>
            <StyledCard>
              <StyledRowWrapper justify='center' align='middle'>
                <Logo />
              </StyledRowWrapper>
              <Form layout='vertical' onFinish={onFinish}>
                <Form.Item
                  label='Please input your chat identity below:'
                  name='identity'
                  rules={[{ required: true }]}
                >
                  <Input
                    prefix={<StyledUserOutlined />}
                    placeholder='Chat Identity'
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    block
                    type='primary'
                    htmlType='submit'
                    loading={isLoading}
                  >
                    Enter
                  </Button>
                </Form.Item>
              </Form>
            </StyledCard>
          </Col>
        </StyledRowContainer>
      </StyledContent>
    </Layout>
  )
}
