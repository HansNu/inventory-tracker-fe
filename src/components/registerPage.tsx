import React, { useEffect, useState } from 'react'
import { Form, Input, Button, Typography, Card, message, Select } from 'antd'
import { UserOutlined, LockOutlined, TeamOutlined, IdcardOutlined } from '@ant-design/icons'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../api/authApi'
import { useAuth } from '../context/authContext'
import { apiConstants, navConstants } from '../constants'
import type { CategoryGroupOption } from '../models/modelIndex'
import axios from 'axios'

const { Title, Text } = Typography
const { Option } = Select

interface RegisterFormValues {
  name: string
  categoryGroup: string
  username: string
  password: string
}

async function getCategoryGroupList(): Promise<CategoryGroupOption[]> {
  const res = await axios.get<CategoryGroupOption[]>(apiConstants.getCategoryGroup)
  return res.data
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate()
  const { login: setAuth } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [groupDdl, setGroupDdl] = useState<CategoryGroupOption[]>([])

  useEffect(() => {
    getCategoryGroupList()
      .then((data) => setGroupDdl(data))
      .catch(() => message.error('Failed to load category groups'))
  }, [])

  const handleSubmit = async (values: RegisterFormValues) => {
    setSubmitting(true)
    try {
      const { token, user } = await register(
        values.name,
        values.categoryGroup,
        values.username,
        values.password
      )
      setAuth(token, user)
      message.success('Account created')
      navigate('/')
    } catch (err: any) {
      message.error(err.response?.data?.error ?? 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Card style={{ maxWidth: 420, width: '100%' }}>
        <Title level={4} style={{ textAlign: 'center', marginBottom: 24 }}>
          Create Account
        </Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input prefix={<IdcardOutlined />} placeholder="e.g. Hafidz" size="large" />
          </Form.Item>
          <Form.Item
            name="categoryGroup"
            label="Category Group"
            rules={[{ required: true, message: 'Category group is required' }]}
            extra="This doubles as your role — 'IT' gets admin access."
          >
            <Select
              placeholder="Select category group"
              size="large"
              suffixIcon={<TeamOutlined />}
            >
              {groupDdl.map((g) => (
                <Option key={g.groupName} value={g.groupName}>
                  {g.groupName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="username" label="Username" rules={[{ required: true, message: 'Username is required' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block size="large" loading={submitting}>
            Register
          </Button>
        </Form>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text>Already have an account? </Text>
          <Link to={navConstants.login}>Log In</Link>
        </div>
      </Card>
    </div>
  )
}

export default RegisterPage