import React, { Component } from 'react';
import './Nav.css'
import { Layout, Menu, Icon } from 'antd';
const { Sider } = Layout;
const { SubMenu } = Menu;


export class Nav extends Component {
    state = {
        collapsed: false,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    choose = (index) => {
        this.props.getChoose(index)
    }

    render() {
        return (
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
                <div className="logo" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" onClick={this.choose.bind(this, 0)}>
                        <Icon type="desktop" />
                        <span>首   页</span>
                    </Menu.Item>
                    <SubMenu
                        key="sub1"
                        title={
                            <span>
                                <Icon type="folder" />
                                <span>案例管理</span>
                            </span>
                        }
                    >
                        <Menu.Item key="2" onClick={this.choose.bind(this, 1)}>案例分类</Menu.Item>
                        <Menu.Item key="3" onClick={this.choose.bind(this, 2)}>案例列表</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="4" onClick={this.choose.bind(this, 3)}>
                        <Icon type="user" />
                        <span>团队列表</span>
                    </Menu.Item>
                    <Menu.Item key="5" onClick={this.choose.bind(this, 4)}>
                        <Icon type="file-image" />
                        <span>网站图片</span>
                    </Menu.Item>
                </Menu>
            </Sider>
        );
    }
}

export default Nav;
