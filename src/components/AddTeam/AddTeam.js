import React, { Component } from 'react';
import './AddTeam.css'
import { post } from '../../utils/api';
import Editor from '../Editor/Editor';
import { Upload, Button, Icon, message, Input } from 'antd'
const { TextArea } = Input

export class AddTeam extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileCover: null,
            fileContent: null,
            uploading: false,
            editorState: '',
            htmlContent: '',
            id: null,
            name: '',
            desc: '',
            job:'',
            cover: null,
            content: null
        }
    }

    // 获取名字
    nameInput = (e) => {
        this.setState({ name: e.target.value })
    }

    // 获取职位
    jobInput = (e) => {
        this.setState({job: e.target.value})
    }

    // 获取介绍
    descInput = (e) => {
        this.setState({ desc: e.target.value })
    }

    // 获取富文本
    richtextInput = (editorState) => {
        this.setState({ editorState: editorState })
    }

    // 上传图片
    handleUpload = () => {
        const { cover, content, fileCover, fileContent } = this.state
        if (cover === null && fileCover === null) {   //判断是否已有封面
            message.warn('请选择图片')
        } else if(content === null && fileContent === null) {   //判断是否已有主图
            message.warn('请选择图片')
        } else {
            this.upCover()
        }
    }

    // 上传封面
    upCover = () => {
        const { fileCover } = this.state;
        const formDataCover = new FormData();
        formDataCover.append('file', fileCover);
        if(fileCover !== null){
        post('file/uploadFile', formDataCover)
            .then(res => {
                console.log(res)
                if (res.data.state === 1) {
                    this.setState({
                        cover: res.data.data[0].url
                    })
                    this.upContent()
                }
            })
        } else {
            this.upContent()
        }
    }

    // 上传主图
    upContent = () => {
        const { fileContent } = this.state;
        const formDataCotent = new FormData();
        formDataCotent.append('file', fileContent);
        if(fileContent !== null){
        post('file/uploadFile', formDataCotent)
            .then(res => {
                console.log(res)
                if (res.data.state === 1) {
                    this.setState({
                        content: res.data.data[0].url
                    })
                    this.postData()
                }
            })
        } else {
            this.postData()
        }
    }

    // 提交表单
    postData = () => {
        const { id, name, job, desc, editorState, cover, content } = this.state
        let data = {
            id: id,
            cover: cover,
            name: name,
            job: job,
            sex: '男',
            des: desc,
            detail: editorState.toHTML(),
            photo: content
        }
        if (this.props.type === 1) {
            //修改
            post('team/updateMember', data)
                .then(res => {
                    console.log(res)
                    if (res.data.state === 1) {
                        message.success('修改成功')
                        this.setState({
                            fileContent: null,
                            fileCover: null,
                            name: '',
                            desc: '',
                            uploading: false,
                            editorState: '',
                            cover: null,
                            content:null
                        })
                        this.props.close('success')
                    } else if (res.data.state === 0) {
                        this.setState({uploading:false})
                        message.error(res.data.message)
                    }
                })
        } else {
            // 新增
            post('team/addMember', data)
                .then(res => {
                    console.log(res)
                    if (res.data.state === 1) {
                        message.success('添加成功')
                        this.setState({
                            fileContent: null,
                            fileCover: null,
                            name: '',
                            desc: '',
                            uploading: false,
                            editorState: '',
                            cover: null,
                            content:null
                        })
                        this.props.close('success')
                    } else if (res.data.state === 0) {
                        this.setState({uploading:false})
                        message.error(res.data.message)
                    }
                })
        }
    }

    /**
     * 
     *  修改成员
     * 
     */

    // 获取成员详情
    getDetail = () => {
        if (this.props.type === 1) {
            let id = this.props.details.id
            post('team/getMemberDetail', { id: id })
                .then(res => {
                    console.log(res)
                    if (res.data.state === 1) {
                        this.setState({
                            id: res.data.data.id,
                            htmlContent: res.data.data.detail,
                            name: res.data.data.name,
                            job:res.data.data.job,
                            desc: res.data.data.des,
                            cover: res.data.data.cover,
                            content: res.data.data.photo
                        })
                    }
                }).catch(err => {
                    console.log(err)
                })
        }
    }

    // 删除封面
    deleteCover = () => {
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

    // 删除封面
    deleteContent = () => {
        const { content } = this.state
        post('file/deleteFile', { urls: [content] })
            .then(res => {
                if (res.data.state === 1) {
                    this.setState({ content: null })
                } else if (res.data.state === 0) {
                    message.error(res.data.message)
                }
            })
    }

    UNSAFE_componentWillMount() {
        setTimeout(() => {
            this.getDetail()
        }, 50)
    }


    // 关闭表单
    cancel = () => {
        this.props.close('fail')
    }

    render() {
        const {
            fileCover,
            fileContent,
            uploading,
            cover,
            content,
            htmlContent,
            name,
            desc,
            job
        } = this.state

        // 列表图配置
        const propsCover = {
            // 移除图片
            onRemove: fileCover => {
                this.setState({
                    fileCover: null
                });
            },
            // 选择图片
            beforeUpload: fileCover => {
                this.setState({
                    fileCover: fileCover
                });
                return false;
            },
            fileCover,
        };

        // 正文图配置
        const propsContent = {
            onRemove: fileContent => {
                this.setState({
                    fileContent: null
                });
            },
            beforeUpload: fileContent => {
                this.setState({
                    fileContent: fileContent
                });
                return false;
            },
            fileContent,
        };

        return (
            <div className='addteam'>
                <div>
                    <Button className='top-cancel' type='primary' onClick={this.cancel}>
                        返回
                    </Button>
                </div>
                <Upload className='upload-input' {...propsCover}>
                    <Button disabled={fileCover !== null || cover !== null}>
                        <Icon type="upload" /> 选择封面
                    </Button>
                </Upload>

                {cover !== null && (
                    <div className='urllist'>
                        <Icon className='urllist-icon' type="paper-clip" />
                        <span className='urllist-title'>{cover}</span>
                        <Icon className='urllist-delete' type="delete" onClick={this.deleteCover} />
                    </div>
                )}

                <div className='add-item'>
                    <p className='add-item-text'>成员姓名：</p>
                    <Input
                        className='add-item-input'
                        maxLength={5}
                        onInput={this.nameInput}
                        value={name}
                    />
                </div>

                <div className='add-item'>
                    <p className='add-item-text'>成员职位：</p>
                    <Input
                        className='add-item-input'
                        maxLength={5}
                        onInput={this.jobInput}
                        value={job}
                    />
                </div>

                <div className='add-item'>
                    <p className='add-item-text'>列表介绍：</p>
                    <TextArea
                        rows={3}
                        onInput={this.descInput}
                        value={desc}
                    />
                </div>

                <Upload className='upload-input' {...propsContent}>
                    <Button disabled={fileContent !== null || content !== null}>
                        <Icon type="upload" /> 选择主图
                    </Button>
                </Upload>

                {content !== null && (
                    <div className='urllist'>
                        <Icon className='urllist-icon' type="paper-clip" />
                        <span className='urllist-title'>{content}</span>
                        <Icon className='urllist-delete' type="delete" onClick={this.deleteContent} />
                    </div>
                )}

                <div className='add-item'>
                    <p className='add-item-text'>正文介绍：</p>
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

export default AddTeam;
