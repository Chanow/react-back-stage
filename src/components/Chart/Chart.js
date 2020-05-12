import React, { Component } from 'react';
import './Chart.css';
import {
    Chart,
    Geom,
    Axis,
    Tooltip,
    Coord,
} from "bizcharts";
import {post,get} from '../../utils/api';


export class chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataArray : []
        }
    }

        // 获取数据
        getData = (page, condition) => {
            let data = {
                id: '',
                pageCurrent: 1,
                condition: ''
            }
            post('case/getCaseByType', data)
                .then(res => {
                    console.log(res)
                    if (res.status === 201) {
                        localStorage.clear('adminlogin')
                        localStorage.clear('adminInfo')
                        this.props.history.push('/login')
                    }
                    else if (res.data.state === 1) {
                        let cssedata = {
                            country: "案例数量",
                            population: res.data.data.total
                        }
                        get('login/getImgCount')
                        .then(res2 => {
                            if (res2.data.state === 1) {
                                let photodata = {
                                    country: "图片数量",
                                    population: res2.data.data
                                }
                                let dataArray = this.state.dataArray
                                dataArray.push(cssedata)
                                dataArray.push(photodata)
                                this.setState({
                                    dataArray:dataArray
                                })
                            }
                    })
                    }
                }).catch(err => {
                    console.log(err)
                })
        
        }

    componentDidMount() {
        this.getData()
    }
    
    render() {
        const{dataArray} = this.state
        return (
            <div>
                <h1 className='welcome'>欢迎 管理员!</h1>
                <Chart height={300} data={dataArray} forceFit>
                    <Coord transpose />
                    <Axis
                        name="country"
                        label={{
                            offset: 12
                        }}
                    />
                    <Axis name="population" />
                    <Tooltip />
                    <Geom type="interval" position="country*population" />
                </Chart>
            </div>
        );
    }
}

export default chart;
