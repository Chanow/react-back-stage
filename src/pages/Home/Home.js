import React, { Component } from 'react';
import './Home.css'
import Nav from '../../components/Nav/Nav';
import Tab from '../../components/Tab/Tab';
import { Layout, Avatar, message } from 'antd';
import CaseList from '../../components/CaseList/CaseList';
import TeamList from '../../components/TeamList/TeamList';
import WebPhoto from '../../components/WebPhoto/WebPhoto';
import Chart from '../../components/Chart/Chart';
import { get } from '../../utils/api';
import cookie from 'react-cookies'

const { Header, Content, Footer } = Layout;


export class Home extends Component {
    state = {
        collapsed: false,
        index: 0,
    };

    onCollapse = collapsed => {
        console.log(collapsed);
        this.setState({ collapsed });
    };

    getChoose = (index) => {
        console.log(index)
        this.setState({
            index: index
        })
    }

    // 登出
    logout = () => {
        get('login/logOut')
            .then(res => {
                console.log(res)
                if (res.data.state === 1) {
                    message.success('登出成功')
                    localStorage.clear('adminlogin')
                    localStorage.clear('adminInfo')
                    cookie.remove('token')
                    console.log(cookie.loadAll())
                    this.props.history.push('/login')
                } else if(res.data.state === 0) {
                    message.error(res.data.message)
                }
        })
    }

    componentDidMount() {
        let login = localStorage.getItem('adminlogin')
        if (!login) {
            this.props.history.push('/login')
        }
    }


    render() {
        const { index } = this.state
        return (
            <Layout style={{ minHeight: '100vh' }}>
                <Nav getChoose={index => this.getChoose(index)} />
                <Layout>
                    <Header className='header'>
                        <h1 className='header-title'>分寸设计后台管理系统</h1>
                        <div className='pop'>
                            <Avatar className='header-avatar' icon='user' />
                            <div className='header-pop'>
                                <span className='header-name'>admin</span>
                                <span className='header-logout' onClick={this.logout}>登出</span>
                            </div>
                        </div>
                    </Header>
                    <Content style={{ margin: '0 16px' }}>
                        {index === 0 && (
                            <Chart history={this.props.history} />
                        )}
                        {index === 1 && (
                            <Tab />
                        )}
                        {index === 2 && (
                            <CaseList />
                        )}
                        {index === 3 && (
                            <TeamList />
                        )}
                        {index === 4 && (
                            <WebPhoto />
                        )}
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                    Ant Design ©2018 Created by Ant UED
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}


export default Home;
