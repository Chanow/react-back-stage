import React, { Component } from 'react';
import './Login.css'
import { Form, Icon, Input, Button, message } from 'antd';
import {post} from '../../utils/api';

class Login extends Component {

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let data = {
          username: values.username,
          password: values.password
          }
        post('login/doLogin', data).then(res => {
          if (res.data.state === 1) {
            message.success('登录成功')
            localStorage.setItem('adminlogin', true)
            localStorage.setItem('adminInfo',JSON.stringify(res.data.data))
            setTimeout(() => {
              this.props.history.push('/home')
            },1000)
          } else if (res.data.state === 0) {
            message.error(res.data.message)
          }
        }).catch(error => {
          console.log(error)
        })
      }
    });
  };

  componentDidMount() {
    if (localStorage.getItem('adminlogin')) {
      console.log(123)
      this.props.history.push('/home')
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
        <div className='login'>
            <h1 className='title'>后台管理系统</h1>
        <Form onSubmit={this.handleSubmit} className="login-form">
          <Form.Item>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: '请输入您的用户名!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />,
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('password', {
              rules: [{ required: true, message: '请输入您的密码!' }],
            })(
              <Input
                prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />,
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
              </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}


export default Form.create()(Login);