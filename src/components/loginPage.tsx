import React, { useState } from 'react'
import { Form, Input, Button, Typography, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../api/authApi'
import { useAuth } from '../context/authContext'
import { navConstants } from '../constants'

const { Title, Text } = Typography

interface LoginFormValues {
  username: string
  password: string
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: LoginFormValues) => {
    setSubmitting(true)
    try {
      const { token, user } = await login(values.username, values.password)
      setAuth(token, user)
      message.success(`Welcome back, ${user.name}`)
      navigate('/')
    } catch (err: any) {
      message.error(err.response?.data?.error ?? 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card style={{ maxWidth: 400, width: '100%' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          IT Asset Inventory
        </Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Username is required' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Password is required' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
            Log In
          </Button>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>Don't have an account? </Text>
          <Link to={navConstants.register}>Register</Link>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage