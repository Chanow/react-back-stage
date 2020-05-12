import React, { Component, Fragment } from 'react';
import './CaseList.css'
import { Button, Pagination, Checkbox, Modal, message } from 'antd';
import AddCase from '../AddCase/AddCase';
import { post } from '../../utils/api';
import Search from 'antd/lib/input/Search';
const { confirm } = Modal

export class CaseList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popModal: false,
            type: 0,                //0为添加1为编辑
            allchecked: false,      //全选
            total: null,             //数据条数
            ids: [],                 //选择id
            details: null,
            dataArray: []
        }
    }

    // 分页切换
    changePage = (page) => {
        this.getData(page, '')
    }

    // 全选
    allCheck = () => {
        const { allchecked, dataArray } = this.state
        let _dataArray = dataArray
        for (let i = 0; i < _dataArray.length; i++) {
            _dataArray[i].checked = !allchecked ? true : false
        }
        this.setState({
            dataArray: _dataArray,
            allchecked: !allchecked
        })
    }

    //选择某项
    check = (index) => {
        const { dataArray } = this.state
        let _dataArray = dataArray
        _dataArray[index].checked = !dataArray[index].checked
        this.setState({
            dataArray: _dataArray
        })
    }

    // 删除单个案例
    deleteOne = (id, index) => {
        const _this = this
        const { dataArray } = this.state
        confirm({
            title: '是否确定删除该案例?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                post('case/deleteCaseById', { ids: [id] })
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

    // 删除多个案例
    deleteList = () => {
        const _this = this
        const { dataArray } = this.state
        let ids = []
        for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i].checked) {
                ids[i] = dataArray[i].id
            }
        }
        confirm({
            title: '是否确定删除该案例?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                post('case/deleteCaseById', { ids: ids })
                    .then(res => {
                        if (res.data.state === 1) {
                            message.success('删除成功')
                            _this.setState({allchecked:false})
                            _this.getData(1)
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
    openWindow = (index, type) => {
        if (type === 0) {
            this.setState({ popModal: true, type: type })
        } else if (type === 1) {
            this.setState({
                popModal: true,
                details: this.state.dataArray[index],
                type: type
            })
        }
    }

    // 关闭弹窗
    closeWindow = (res) => {
        if (res === 'success') {
            this.getData(1,'')
            this.setState({ popModal: false, details: {} })
        } else if (res === 'fail') {
            this.setState({ popModal: false, details: {} })
        }
        
    }

    // 搜索
    search = (value) => {
        this.getData(1,value)
    }

    // 获取数据
    getData = (page, condition) => {
        let data = {
            id: '',
            pageCurrent: page,
            condition: condition
        }
        post('case/getCaseByType', data)
            .then(res => {
                console.log(res)
                if (res.data.state === 1) {
                    for (let i = 0; i < res.data.data.records.length; i++) {
                        res.data.data.records[i].checked = false
                    }
                    this.setState({
                        dataArray: res.data.data.records,
                        total: res.data.data.total
                    })
                    console.log(this.state.dataArray)
                }
            }).catch(err => {
                console.log(err)
            })
    }

    UNSAFE_componentWillMount() {
        this.getData(1, '')
    }

    render() {
        const {
            dataArray,
            popModal,
            details,
            allchecked,
            total,
            type
        } = this.state
        return (
            <div className='tab'>
                {!popModal ? (

                    <Fragment>
                        <Search
                            onSearch={value=>this.search(value)}
                            style={{ width: 200, marginBottom:20 }}
                        />
                        <div>
                        <Button
                            className='delete-btn'
                            type='danger'
                            onClick={this.deleteList}
                            >
                                删除
                            </Button>
                        <Button
                            className='btn'
                            type='primary'
                            onClick={this.openWindow.bind(this, null, 0)}
                            >
                                添加
                            </Button>
                        </div>
                        <table className='list' cellPadding='10'>
                            <thead>
                                <tr>
                                    <th>
                                        <Checkbox checked={allchecked} onClick={this.allCheck}></Checkbox>
                                    </th>
                                    <th>ID</th>
                                    <th>名称</th>
                                    <th>封面</th>
                                    <th>分类</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataArray.map((item, index) => {
                                    return (
                                        <tr key={item.id}>
                                            <th>
                                                <Checkbox checked={item.checked} onClick={this.check.bind(this, index)}></Checkbox>
                                            </th>
                                            <td>{item.id}</td>
                                            <td>{item.title}</td>
                                            <td>
                                                <img className='case-cover' src={item.cover} alt="#" />
                                            </td>
                                            <td>{item.type}</td>
                                            <td>
                                                <span
                                                    className='delete'
                                                    onClick={this.deleteOne.bind(this,item.id,index)}
                                                >
                                                    删除
                                                </span>
                                                <span
                                                    className='edit'
                                                    onClick={this.openWindow.bind(this, index, 1)}
                                                >
                                                    编辑
                                        </span>
                                            </td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>
                        <div className='page'>
                            <span className='count'>共{total}条数据</span>
                            <Pagination
                                defaultCurrent={1}
                                total={total}
                                pageSize={12}
                                onChange={this.changePage}
                            />
                        </div>
                    </Fragment>
                ) : (
                        <AddCase type={type} details={details} close={this.closeWindow.bind(this)} />
                    )}
            </div>
        );
    }
}

export default CaseList;
