'use client';

import { Modal, Form, Input, Button } from 'antd';

interface LoginModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  isLoading?: boolean;
}

export default function LoginModal({ isOpen, onCancel, onSubmit, isLoading = false }: LoginModalProps) {
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const handleSubmit = (values: any) => {
    onSubmit(values);
    // Don't reset form here - let parent handle it after successful submission
  };

  return (
    <Modal
      title="Login"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={400}
    >
      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            { required: true, message: 'Please input your username!' }
          ]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            style={{ width: '100%' }}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Logowanie...' : 'Login'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
