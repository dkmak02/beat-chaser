'use client';

import { Modal, Form, Input, Button } from 'antd';

interface SignUpModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  isLoading?: boolean;
}

export default function SignUpModal({ isOpen, onCancel, onSubmit, isLoading = false }: SignUpModalProps) {
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
      title="Sign Up"
      open={isOpen}
      onCancel={handleCancel}
      footer={null}
      width={400}
    >
      <Form
        form={form}
        name="signup"
        onFinish={handleSubmit}
        layout="vertical"
        style={{ marginTop: 20 }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Please input your email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please input your password!' },
            { min: 6, message: 'Password must be at least 6 characters!' }
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Please confirm your password!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm your password" />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button 
            type="primary" 
            htmlType="submit" 
            style={{ width: '100%' }}
            loading={isLoading}
            disabled={isLoading}
          >
            {isLoading ? 'Tworzenie konta...' : 'Sign Up'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
