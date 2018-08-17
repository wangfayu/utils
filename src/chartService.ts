const lineType = 'line';
const barType = 'bar';
// const spliterColor = 'C71585';
const spliterColor = '#DFDFDF';
const yAxis0Color = '#AFAFAF';
const yAxis1Color = '#0000ff';
const darkGray = '#333';
const titleColor = '#000';
const fontFamily = 'Microsoft Yahei';
const timeConnector = '-';
import basics from './basics';

// 图表基础类
class ChartOption {

    /**
     * 基础配置
     * @param {object} option 包括  标题title,左y轴名称,线条颜色
     */
    constructor (option) {
        this.title = {
            show: true,
            left: 'center',
            top: 0,
            text: option && option.title
                                        ? option.title
                                        : '',
            textStyle: {
                color: titleColor,
                fontFamily: fontFamily,
                fontSize: 20,
                fontWeight: 'bold'
            }
        };
        this.tooltip = {
            trigger: 'axis',
            // 坐标轴指示器，坐标轴触发有效
            axisPointer: {
                // 默认为直线，可选为：'line' | 'shadow'
                type: 'shadow'
            }
        };
        this.legend = {
            show: true,
            top: 30,
            left: '70%',
            textStyle: {
                color: darkGray
            }
        };

        this.grid = {
            show: true,
            top: '60',
            left: '4%',
            right: '5%',
            bottom: '4%',
            containLabel: true,
            backgroundColor: 'transparent',
            borderColor: 'transparent'
        };
        this.xAxis = [
            {
                type: 'category',
                axisLine: {
                    lineStyle: {
                        color: '#B9C2CA'
                    }
                },
                axisLabel: {
                    fontFamily: fontFamily,
                    fontSize: 12,
                    color: '#000'
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: spliterColor
                    }
                }
            }
        ];
        this.yAxis = [
            {
                show: true,
                type: 'value',
                name: option && option.yAxis0Name
                                                ? option && option.yAxis0Name
                                                : '',
                nameTextStyle: {
                    fontFamily: fontFamily,
                    color: darkGray,
                    fontSize: 16
                },
                axisLabel: {
                    show: true,
                    fontFamily: fontFamily,
                    fontSize: 16,
                    color: '#000',
                    formatter: '{value}'
                },
                axisLine: {
                    lineStyle: {
                        color: yAxis0Color
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: spliterColor
                    }
                }
            }
        ];
        this.series = [];
        // 颜色
        if (option.colors) {
            this.color = option.colors;
        }
    }
}

// 折线图
class LineChartOption extends ChartOption {

    /**
     * 生成柱状图chartOption
     * @param {object} option 包括xData: x轴的数据项，在serie中的data只需给出y轴数值即可
     */
    constructor (option) {
        super(option);
        this.xAxis[0].data = option.xData || [];
    }
}

// 柱状图
class BarChartOption extends ChartOption {

    /**
     * 生成柱状图chartOption
     * @param {object} option 包括xData: x轴的数据项，在serie中的data只需给出y轴数值即可
     */
    constructor (option) {
        super(option);
        this.xAxis[0].data = option.xData || [];
    }
}

// 柱状图堆叠图
class StackChartOption extends ChartOption {

    /**
     * 生成柱状堆叠图的chartOption
     * @param {object} option
     */
    constructor (option) {
        super(option);
        if (option.xData) {
            this.xAxis[0].data = option.xData;
        }
    }
}
// 柱状图折线图混合,折线图使用右侧Y轴
class LinBarChartOption extends ChartOption {

    /**
     * 生成柱状图和折线图混合的chartOption
     * @param {object} option 包括
     * 左y轴的名称（柱状图），右y轴名称（折线图），折线图的纵向原点偏移值
     */
    constructor (option) {
        // debugger;
        super(option);
        if (option.xData) {
            this.xAxis[0].data = option.xData;
        }
        this.yAxis.push({
            type: 'value',
            name: option && option.yAxis1Name
                                        ? option.yAxis1Name
                                        : '',
            nameTextStyle: {
                fontFamily: fontFamily,
                color: darkGray,
                fontSize: 16
            },
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: yAxis1Color
                }
            },
            axisLabel: {
                show: true,
                formatter: '{value}'
            },
            splitLine: {
                show: false
            }
        });
        if (option.yAxis1Min || option.yAxis1Min === 0) {
            this.yAxis[1].min = option.yAxis1Min;
        }
        if (option.yAxis1Max || option.yAxis1Max === 0) {
            this.yAxis[1].max = option.yAxis1Max;
        }
    }
}

// 堆叠图折线图混合
class LineStackChartOption extends LinBarChartOption {

    /**
     * 生成堆叠图和折线图混合的chartOption
     * @param {object} option 包括
     * 左y轴的名称（堆叠图），右y轴名称（折线图）
     */
    constructor (option) {
        // debugger;
        super(option);
        // 堆叠设置在series中完成
    }
}

// 饼图
class PieChartOption extends ChartOption {

    /**
     * 生成饼图chartOption
     * @param {object} option 
     */
    constructor (option) {
        // debugger;
        super(option);
        // legend 设置为右侧显示
        this.legend = {
            show: true,
            type: 'scroll',
            orient: 'vertical',
            right: 10,
            top: 20,
            bottom: 20,
            textStyle: {
                color: darkGray
            }
        };
        this.xAxis = [];
        this.yAxis = [];
    }
}

/** 曲线基类 **/
class SerieOption {
    constructor (option) {
        this.name = option.name;
        this.data = option.data || null;
    }
}
// 折线图曲线
class LineSerieOption extends SerieOption {
    constructor (option) {
        super(option);
        this.type = 'line';
        this.label = option.label || {
            normal: {
                show: false,
                position: 'top',
                color: '#FFF'
            }
        };
        this.lineStyle = {
            // color: option && option.color
            //                             ? option.color
            //                             : '#000',
            width: 3
        };
        this.connectNulls = true;
    }
}
// 柱状图/堆叠图曲线
class BarSerieOption extends SerieOption {
    constructor (option) {
        super(option);
        this.type = 'bar';
        if (option.stack) {
            this.stack = option.stack;
        }
        if (option.barWidth) {
            this.barWidth = option.barWidth;
        }

        // 最大宽度
        // this.barMaxWidth = 30;
    }
}

class PieSerieOption extends SerieOption {
    constructor (option) {
        super(option);
        this.type = 'pie';
        this.radius = '55%';
        this.center = ['50%', '50%'];
        this.labelLine = {
            // normal: {
            //     smooth: 0.2,
            //     length: 10,
            //     length2: 20
            // }
        };
        this.itemStyle = {
            normal: {
                // shadowBlur: 200
            }
        };
        this.animationType = 'scale';
        this.animationEasing = 'elasticOut';
        this.animationDelay = function (idx) {
            return Math.random() * 200;
        };
    }
}

class GanttChart {
    constructor (dataArr) {
        this.option = {
            tasks: null,
            selectedRow: 0,
            canWrite: false,
            canDelete: false,
            canWriteOnParent: false,
            canAdd: false
        };
        // 组织数据
        // if (dataArr && dataArr.length) {
        //     let tasks = [];
        //     dataArr.forEach((item) => {
        //         if (!item.PourOpenDate || item.PourOpenDate === basics.emptyValue) {
        //             log('甘特图数据错误：' + 'id为' + item.RowNum + '的记录没有开仓时间');
        //         }
        //         tasks.push({
        //             'id': item.RowNum,
        //             '仓名称': item.Name,
        //             '浇筑量(m³)': item.FactVolume,
        //             '开仓时间': item.PourOpenDate && (item.PourOpenDate !== basics.emptyValue)
        //                                                                                     ? dateService.YYmmddhhmm(item.PourOpenDate, timeConnector)
        //                                                                                     : basics.emptyValue,
        //             '收仓时间': item.PourCloseDate && (item.PourCloseDate !== basics.emptyValue)
        //                                                                                     ? dateService.YYmmddhhmm(item.PourCloseDate, timeConnector)
        //                                                                                     : basics.emptyValue,
        //             '历时(h)': item.PourHour,
        //             '浇筑强度(m³/h)': item.PourSpeed,
        //             '缆机台数': item.CableAmount,
        //             '缆机台时': item.CableHour,
        //             '缆机入仓强度(m³/h)': item.CableSpeed
        //         });
        //     });
        // }

    }
}

let chartService = {
    chartOptions: {
        getLineChartOption (option) {
            return new LineChartOption(option);
        },
        getBarChartOption (option) {
            return new BarChartOption(option);
        },
        getLineBarMixOption (option) {
            // 折线图+柱状图混合
            return new LinBarChartOption(option);
        },
        getLineStackChartOption (option) {
            // 堆叠图折线图混合
            return new LineStackChartOption(option);
        },
        getStackChartOption (option) {
            // 柱状堆叠图
            return new StackChartOption(option);
        },
        getPieChartOption (option) {
            // 饼图
            return new PieChartOption(option);
        }
    },
    serieOptions: {
        getLineSerieOption (option) {
            // 折线图曲线
            return new LineSerieOption(option);
        },
        getBarSerieOption (option) {
            // 柱状图曲线
            return new BarSerieOption(option);
        },
        getStackSerieOption (option) {
            // 堆叠图曲线
            return new BarSerieOption(option);
        },
        getPieSerieOption (option) {
            return new PieSerieOption(option);
        }
    }
};
export default chartService;
