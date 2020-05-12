import React, { Component } from 'react';
import './WebPhoto.css'
import { post, get } from '../../utils/api';
import { Button, Modal, Upload, Icon, message } from 'antd';

export class WebPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popModal: false,
            file: null,
            uploading: false,
            dataArray: [
                {
                    id: 0,
                    url: 'http://10.13.4.153:3001/assets/top.jpg',
                    name: '团队顶部图'
                }
            ]
        }
    }

    // 打开弹窗
    openWindow = () => {
        this.setState({ popModal: true })
    }

    // 关闭弹窗 
    closeWindow = () => {
        this.setState({ popModal: false, file: null })
    }

    // 上传图片
    handleUpload = () => {
        const { file } = this.state;
        const formData = new FormData();
        formData.append('file', file);

        this.setState({
            uploading: true,
        });
        console.log(file)
        post('file/uploadFile', formData)
            .then(res => {
                console.log(res)
                if (res.data.state === 1) {
                    this.postData(res.data.data[0].url)
                } else if (res.data.state === 0) {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
                this.setState({uploading:false})
        })
    }

    // 提交表单
    postData = (url) => {
        let data = {
            url: url,
            name:'团队顶部图'
        }
        post('team/updateBanner', data)
            .then(res => {
                console.log(res)
                if (res.data.state === 1) {
                    message.success('修改成功')
                    this.setState({
                        popModal: false,
                        file: null,
                        uploading:false
                    })
                    this.getData()
                } else if (res.data.state === 0) {
                    message.error(res.data.message)
                    this.setState({ uploading: false })
                    this.getData()
                }
            }).catch(err => {
                console.log(err)
                this.setState({uploading:false})
        })
    }

    // 获取数据
    getData = () => {
        get('team/getTeamBanner')
            .then(res => {
                console.log(res)
                if (res.data.state === 1) {
                    this.setState({
                        dataArray:[res.data.data]
                    })
                }
            }).catch(err => {
            console.log(err)
        })
    }

    UNSAFE_componentWillMount() {
        this.getData()
    }

    render() {
        const { dataArray, popModal, file, uploading } = this.state
        const props = {
            // 移除图片
            onRemove: file => {
                this.setState({
                    file: null
                });
            },
            // 选择图片
            beforeUpload: file => {
                this.setState({
                    file: file
                });
                return false;
            },
            file,
        };
        return (
            <div className='tab'>
                {/* <Button
                    className='btn'
                    type='primary'
                    onClick={this.openWindow}
                    disabled={dataArray.length > 0}
                >
                    添加
                </Button> */}
                <table className='list' cellPadding='10'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>名称</th>
                            <th>缩略图</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataArray.map((item, index) => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>
                                        <img className='case-cover' src={item.url} alt="#" />
                                    </td>
                                    <td>
                                        <span className='delete' onClick={this.openWindow}>修改</span>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {/* 添加窗口 */}
                <Modal
                    visible={popModal}
                    title={'图片添加'}
                    okText={'确定'}
                    cancelText={'取消'}
                    onCancel={this.closeWindow}
                    confirmLoading={uploading}
                    onOk={this.handleUpload}
                >
                    <Upload className='upload-input' {...props}>
                        <Button disabled={file !== null}>
                            <Icon type="upload" /> 选择图片
                        </Button>
                    </Upload>
                </Modal>
            </div>
        );
    }
}

export default WebPhoto;
