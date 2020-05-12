import React, { Component } from 'react';
import './AddCase.css'
import { post, get } from '../../utils/api';
import Editor from '../Editor/Editor';
import { Upload, Button, Icon, message, Input, Radio } from 'antd'
const { TextArea } = Input

export class AddCase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            uploading: false,
            htmlContent: '',
            editorState: '',//案例富文本
            id: null,
            value: 0,        //案例分类
            title: '',      //案例名称
            desc: '',        //案例介绍
            cover: null,      //案例封面
            tabList: []
        }
    }

    // 获取案例名称
    titleInput = (e) => {
        this.setState({ title: e.target.value })
    }

    // 获取案例介绍
    descInput = (e) => {
        this.setState({ desc: e.target.value })
    }

    // 获取富文本
    richtextInput = (editorState) => {
        this.setState({ editorState: editorState })
    }

    // 分类选择
    onChange = e => {
        console.log(e.target.value)
        this.setState({
            value: e.target.value,
        });
    };

    // 上传图片
    handleUpload = () => {
        const _this = this
        const { file, cover } = this.state;
        const formData = new FormData();
        formData.append('file', file);

        this.setState({
            uploading: true,
        });
        console.log(file)
        if (file === null && cover === null) {
            message.warn('请添加封面')
            this.setState({
                uploading: false
            })
        } else {
            if (file === null) {
                _this.postData()
            } else if (cover === null) {
                post('file/uploadFile', formData)
                    .then(res => {
                        console.log(res)
                        _this.setState({
                            cover: res.data.data[0].url
                        })
                        _this.postData()
                    }).catch(err => {
                        console.log(err)
                    })
            }
        }
    }

    // 提交表单
    postData = () => {
        const _this = this
        const { title, desc, editorState, value, id, cover } = this.state
        let data = {
            id: id,
            title: title,
            cover: cover,
            des: desc,
            detail: editorState.toHTML(),
            typeId: value
        }
        if (this.props.type === 1) {
            post('case/updateCase', data)
                .then(res => {
                    if (res.data.state === 1) {
                        message.success('修改成功')
                        _this.setState({
                            title: '',
                            value: 0,
                            desc: '',
                            editorState: '',
                            uploading: false,
                            file: null,
                            cover: null
                        })
                        _this.props.close('success')
                    }
                    else if (res.data.state === 0) {
                        message.success(res.data.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
        } else {
            post('case/addCase', data)
                .then(res => {
                    if (res.data.state === 1) {
                        message.success('添加成功')
                        _this.setState({
                            title: '',
                            value: 0,
                            desc: '',
                            editorState: '',
                            uploading: false,
                            file: null,
                            cover:null
                        })
                        _this.props.close('success')
                    }
                    else if (res.data.state === 0) {
                        message.success(res.data.message)
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }

    // 关闭表单
    cancel = () => {
        this.props.close('fail')
    }

    // 获取分类
    getData = () => {
        get('type/getType')
            .then(res => {
                if (res.data.state === 1) {
                    this.setState({
                        tabList: res.data.data
                    })
                } else if (res.data.state === 0) {
                    message.error(res.data.message)
                }
            }).catch(err => {
                console.log(err)
            })
    }


    /**
     * 
     *  修改案例
     * 
     */

    // 获取案例详情
    getDetail = () => {
        console.log(this.props.details)
        if (this.props.type === 1) {
            let id = this.props.details.id
            post('case/getCaseDetailById', { id: id })
                .then(res => {
                    console.log(res)
                    if (res.data.state === 1) {
                        this.setState({
                            id: res.data.data.id,
                            htmlContent: res.data.data.detail,
                            value: res.data.data.typeId,
                            title: res.data.data.title,
                            desc: res.data.data.des,
                            cover: res.data.data.cover,
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }

    // 删除图片
    deleteUrl = () => {
        const { cover } = this.state
        post('file/deleteFile', { urls: [cover] })
            .then(res => {
                if (res.data.state === 1) {
                    this.setState({ cover: null })
                } else if (res.data.state === 0) {
                    message.error(res.data.message)
                }
            })
    }

    UNSAFE_componentWillMount() {
        this.getData()
        setTimeout(() => {
            this.getDetail()
        }, 50)
    }

    render() {
        const {
            file,
            uploading,
            tabList,
            cover,
            title,
            desc,
            htmlContent
        } = this.state

        // 列表图配置
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
            <div className='addteam'>
                <div>
                    <Button className='top-cancel' type='primary' onClick={this.cancel}>
                        返回
                    </Button>
                </div>
                <Upload className='upload-input' {...props}>
                    <Button disabled={file !== null || cover !== null}>
                        <Icon type="upload" /> 选择封面
                    </Button>
                </Upload>
                {cover !== null && (
                    <div className='urllist'>
                        <Icon className='urllist-icon' type="paper-clip" />
                        <span className='urllist-title'>{cover}</span>
                        <Icon className='urllist-delete' type="delete" onClick={this.deleteUrl} />
                    </div>
                )}
                <div className='add-item'>
                    <p className='add-item-text'>案例标题：</p>
                    <Input
                        className='add-item-input'
                        maxLength={30}
                        value={title}
                        onInput={this.titleInput}
                    />
                </div>

                <div className='add-item'>
                    <p className='add-item-text'>案例介绍：</p>
                    <TextArea
                        rows={3}
                        maxLength={300}
                        value={desc}
                        onInput={this.descInput}
                    />
                </div>

                <div className='add-item'>
                    <p className='add-item-text'>案例分类：</p>
                    <Radio.Group onChange={this.onChange} value={this.state.value}>
                        {tabList.map((item, index) => {
                            if(item.id !== 1){
                            return (
                                <Radio key={item.id} value={item.id}>{item.type}</Radio>
                                )
                            } else {
                                
                            }
                        })}
                    </Radio.Group>
                </div>

                <div className='add-item'>
                    <p className='add-item-text'>案例正文：</p>
                    <Editor htmlContent={htmlContent} richtextInput={this.richtextInput.bind(this)} />
                </div>

                <div className='add-btn'>
                    <Button className='add-btn-cancel' onClick={this.cancel}>
                        取消
                    </Button>
                    <Button
                        type="primary"
                        loading={uploading}
                        onClick={this.handleUpload}
                    >
                        {uploading ? '' : '确定'}
                    </Button>
                </div>

            </div>
        );
    }
}

export default AddCase;
