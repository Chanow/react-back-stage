import React, { Component } from 'react';
import './Tab.css';
import { Button, Checkbox, Modal, Input, message } from 'antd';
import { get, post } from '../../utils/api';
const { confirm } = Modal


export class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popModal: false,
            inputText: '',
            type: 0,             //0为添加1为编辑
            editId: null,         //编辑分类id
            dataArray: []
        }
    }

    // 获取输入框内容
    tabInput = (e) => {
        this.setState({
            inputText: e.target.value
        })
    }

    postData = () => {
        const { type } = this.state
        if (type === 0) {
            this.addType()
        } else if (type === 1) {
            this.editType()
        }
    }

    // 添加分类
    addType = () => {
        let data = {
            type: this.state.inputText
        }
        post('type/addType', data)
            .then(res => {
                if (res.data.state === 1) {
                    message.success('添加成功')
                    this.setState({
                        inputText: '',
                        popModal: false
                    })
                    this.getData()
                } else if (res.data.state === 0) {
                    message.error(res.data.message)
                }
            })
    }

    // 编辑分类
    editType = () => {
        const { inputText, editId } = this.state
        let data = {
            type: inputText,
            id: editId
        }
        post('type/updateType', data)
            .then(res => {
                if (res.data.state === 1) {
                    message.success('修改成功')
                    this.setState({
                        popModal: false,
                        inputText: ''
                    })
                    this.getData()
                } else if (res.data.state === 0) {
                    message.error(res.data.message)
                }
            })
    }

    // 删除分类
    deleteType = (id, index) => {
        const _this = this
        const { dataArray } = this.state
        confirm({
            title: '是否确定删除该分类?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                post('type/deleteTypeById', { ids: [id] })
                    .then(res => {
                        if (res.data.state === 1) {
                            message.success('删除成功')
                            let _dataArray = dataArray
                            _dataArray.splice(index, 1)
                            _this.setState({
                                dataArray: _dataArray
                            })
                        } else if (res.data.state === 0) {
                            message.error(res.data.message)
                        }
                    }).catch(err => {
                        console.log(err)
                    })
            },
            onCancel() {

            },
        });
    }


    // 打开弹窗
    openWindow = (value, type, id) => {
        this.setState({ inputText: value, type: type, popModal: true, editId: id })
    }

    // 关闭弹窗
    closeWindow = () => {
        this.setState({ inputText: '', popModal: false })
    }

    // 获取数据
    getData = () => {
        get('type/getType')
            .then(res => {
                if (res.data.state === 1) {
                    this.setState({
                        dataArray: res.data.data
                    })
                } else if (res.data.state === 0) {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
            })
    }

    UNSAFE_componentWillMount() {
        this.getData()
    }


    render() {
        const { dataArray, inputText, popModal } = this.state
        return (
            <div className='tab'>
                <Button
                    className='btn'
                    type='primary'
                    onClick={this.openWindow.bind(this, '', 0)}
                >
                    添加
                </Button>
                <table className='list' cellPadding='10'>
                    <thead>
                        <tr>
                            <th>
                                <Checkbox onChange={this.onChangeAll}></Checkbox>
                            </th>
                            <th>ID</th>
                            <th>名称</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dataArray.map((item, index) => {
                            return (
                                <tr key={item.id}>
                                    <th>
                                        <Checkbox index={index} onChange={this.onChange}></Checkbox>
                                    </th>
                                    <td>{item.id}</td>
                                    <td>{item.type}</td>
                                    <td>
                                        <span
                                            className='delete'
                                            onClick={this.deleteType.bind(this,item.id,index)}
                                        >
                                            删除
                                        </span>
                                        {item.valid !== 0 && (
                                            <span
                                                className='edit'
                                                onClick={this.openWindow.bind(this, item.type, 1, item.id)}
                                            >
                                                编辑
                                        </span>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}

                    </tbody>
                </table>

                {/* 添加窗口 */}
                <Modal
                    visible={popModal}
                    title={'分类添加'}
                    okText={'确定'}
                    cancelText={'取消'}
                    onCancel={this.closeWindow}
                    onOk={this.postData}
                >
                    <div
                        className='modal-item'
                    >
                        <p className='modal-item-title'>分类名称</p>
                        <Input
                            value={inputText}
                            maxLength={5}
                            onInput={this.tabInput}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}

export default Tab;
