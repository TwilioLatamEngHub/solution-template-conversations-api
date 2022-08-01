import { Layout, Row, Card } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const { Content } = Layout

export const StyledContent = styled(Content)`
  height: 100vh;
`

export const StyledRowContainer = styled(Row)`
  height: 100%;
`

export const StyledCard = styled(Card)`
  max-width: 25rem;
`

export const StyledRowWrapper = styled(Row)`
  margin-bottom: 2rem;
`

export const StyledUserOutlined = styled(UserOutlined)`
  color: rgba(0, 0, 0, 0.25);
`
