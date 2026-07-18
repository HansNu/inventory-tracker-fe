import React, { useState } from 'react'
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  message,
} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { apiConstants } from '../constants'
import axios from 'axios'

const { Title } = Typography

async function addCategoryGroup(payload: Record<string, unknown>): Promise<void> {
  await axios.post(apiConstants.addCategoryGroup, payload)
}

const AddCategoryGroupPage: React.FC = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSubmitting(true)
    try {
      const payload = {
        groupName: values.groupName
      }

      await addCategoryGroup(payload)
      message.success('Category group added successfully')
      navigate(-1)
    } catch (err: unknown) {
      message.error(err instanceof Error ? err.message : 'Failed to add category group')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>

      <Card style={{ maxWidth: '600px', width: '100%', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ marginRight: 8 }}/>
          <Title level={4} style={{ margin: 0 }}>
            Add Category Group
          </Title>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark="optional">
          <Form.Item
            label="Group Name"
            name="groupName"
            rules={[
              { required: true, message: 'Group name is required' }
            ]}
          >
            <Input
              placeholder="Enter category group name"
              size="large"
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: 16 }}>
            <Button onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={submitting}>
              Add Group
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default AddCategoryGroupPage