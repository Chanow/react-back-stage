import React, { Component, Fragment } from 'react';
import './TeamList.css'
import AddTeam from '../AddTeam/AddTeam';
import { Button, Pagination, Checkbox, Modal, message } from 'antd';
import { post } from '../../utils/api';
const {confirm} = Modal

export class TeamList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popModal: false,
            type: 0,                 //0是添加1是编辑
            details: null,
            allchecked: false,
            total: null,              //总数据条数
            ids:[],                   //选中id
            dataArray: []
        }
    }

    // 分页切换
    changePage = (page) => {
        this.getData(page,'')
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

    // 打开弹窗
    openWindow = (index, type) => {
        console.log(123)
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
            this.getData(1)
            this.setState({ popModal: false, details: {} })
        } else if (res === 'fail') {
            this.setState({ popModal: false, details: {} })
        }
        
    }

    // 删除单个成员
    deleteOne = (id, index) => {
        const _this = this
        const { dataArray } = this.state
        confirm({
            title: '是否确定删除该成员?',
            // content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                post('team/deleteMemberById', { ids: [id] })
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


    // 获取数据
    getData = (page) => {
        let data = {
            pageCurrent:page
        }
        post('team/getMemberList', data)
            .then(res => {
                console.log(res)
                if (res.data.state === 1) {
                    for (let i = 0; i < res.data.data.records.length; i++){
                        res.data.data.records[i].checked = false
                    }
                    this.setState({
                        dataArray: res.data.data.records,
                        total:res.data.data.total
                    })
                }
            }).catch(err => {
            console.log(err)
        })
    }
    
    UNSAFE_componentWillMount() {
        this.getData(1)
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
                        <Button
                            className='btn'
                            type='primary'
                            onClick={this.openWindow.bind(this, null, 0)}
                        >添加</Button>
                        <table className='list' cellPadding='10'>
                            <thead>
                                <tr>
                                    <th>
                                        <Checkbox checked={allchecked} onClick={this.allCheck}></Checkbox>
                                    </th>
                                    <th>ID</th>
                                    <th>姓名</th>
                                    <th>照片</th>
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
                                            <td>{item.name}</td>
                                            <td>
                                                <img className='case-cover' src={item.cover} alt="#" />
                                            </td>
                                            <td>
                                                <span
                                                    className='delete'
                                                    onClick={this.deleteOne.bind(this,item.id,index)}
                                                >删除</span>
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
                                pageSize={4}
                                onChange={this.changePage}
                            />
                        </div>
                    </Fragment>
                ) : (
                        <AddTeam type={type} details={details} close={this.closeWindow.bind(this)} />
                    )}


            </div>
        );
    }
}

export default TeamList;
