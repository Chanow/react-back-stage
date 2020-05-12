import React, { Component } from 'react';
import './Editor.css'
import { post } from '../../utils/api';
// 引入编辑器组件
import BraftEditor from 'braft-editor'
// 引入编辑器样式
import 'braft-editor/dist/index.css'
import { message } from 'antd';


const myUploadFn = (param) => {
    const file = param.file
    const formData = new FormData();
    formData.append('file', file);
    post('file/uploadFile', formData)
        .then(res => {
            if (res.data.state === 1) {
                let url = res.data.data[0].url
                let title = res.data.data[0].title
                if (res.data.state === 1) {
                    param.success({
                        url: url,
                        meta: {
                            id: param.id,
                            title: title,
                            alt: 'xxx',
                            // loop: false, // 指定音视频是否循环播放
                            // autoPlay: false, // 指定音视频是否自动播放
                            // controls: false, // 指定音视频是否显示控制栏
                            // poster: 'http://xxx/xx.png', // 指定视频播放器的封面
                        }
                    })
                } else if (res.data.state === 0) {
                    message.error(res.data.message)
                }
                console.log(res)

            } else if (res.data.state === 0) {
                message.error(res.data.message)
            }
        })
}



export class Editor extends Component {

    constructor(props) {
        super(props)
        this.state = {
            editorState: BraftEditor.createEditorState(null),
        }

    }

    UNSAFE_componentWillMount() {
        // 假设此处从服务端获取html格式的编辑器内容


        // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
        setTimeout(() => {
            const htmlContent = this.props.htmlContent
            console.log(htmlContent)
            this.setState({
                editorState: BraftEditor.createEditorState(htmlContent)
            })
        }, 500)
    }

    // 将富文本传递给父组件
    handleEditorChange = (editorState) => {
        this.setState({ editorState })
        this.props.richtextInput(editorState)
    }



    render() {
        const { editorState } = this.state
        return (
            <div>
                <BraftEditor
                    contentClassName="my-component"
                    value={editorState}
                    onChange={this.handleEditorChange}
                    media={{ uploadFn: myUploadFn }}
                />
            </div>
        )
    }
}

export default Editor;
