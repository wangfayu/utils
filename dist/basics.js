var Basics;
(function (Basics) {
    // 项目参数设置
    var emptyValue = '--';
    var config = {
        NaDecimal: -2147483648,
        NaDateTime: '0001-01-01 00:00:00',
        emptyValue: emptyValue,
        toFixedLen: 2,
        percentNum: 100,
        // 以周1为一周的第1天
        weekStartDay: 1,
        weekDays: 7,
        // 用于选择某个月的第几周，最多显示5周
        weekList: [
            {
                name: '第1周',
                value: 0
            },
            {
                name: '第2周',
                value: 1
            },
            {
                name: '第3周',
                value: 2
            },
            {
                name: '第4周',
                value: 3
            },
            {
                name: '第5周',
                value: 4
            }
        ],
        monthList: [
            {
                name: '1月',
                value: 0
            },
            {
                name: '2月',
                value: 1
            },
            {
                name: '3月',
                value: 2
            },
            {
                name: '4月',
                value: 3
            },
            {
                name: '5月',
                value: 4
            },
            {
                name: '6月',
                value: 5
            },
            {
                name: '7月',
                value: 6
            },
            {
                name: '8月',
                value: 7
            },
            {
                name: '9月',
                value: 8
            },
            {
                name: '10月',
                value: 9
            },
            {
                name: '11月',
                value: 10
            },
            {
                name: '12月',
                value: 11
            }
        ],
        lineColors: [
            '#4F81BD',
            '#2F4554',
            '#61A0A8',
            '#D48265',
            '#749F83',
            '#C71585',
            '#91C7AE',
            '#054BDB',
            '#6F294D',
            '#279031',
            '#908B27',
            '#E05A0D',
            '#5A6AA7',
            '#8E5AA7',
            '#3E3443',
            '#478986',
            '#156FB9',
            '#741A5F',
            '#39AF4D',
            '#AF3939'
        ],
        nanFilters: [
            // 异常值
            {
                oriValue: '-2147483648',
                repValue: '\'' + emptyValue + '\'' // 转换为字符串，否则转换JSON对象会出错
            },
            {
                oriValue: -2147483648,
                repValue: emptyValue // 转换为字符串，否则转换JSON对象会出错
            },
            {
                oriValue: '0001-01-01 00:00:00',
                repValue: emptyValue
            }
        ],
        transFilters: [
            // 需要进行转换的数值，oriValue为接口为原始值,字符串,repValue为要替换成的值
            {
                keyName: 'StateName',
                reps: [
                    {
                        oriValue: 0,
                        repValue: '未开始'
                    },
                    {
                        oriValue: 1,
                        repValue: '备仓中'
                    },
                    {
                        oriValue: 2,
                        repValue: '已开仓'
                    },
                    {
                        oriValue: 3,
                        repValue: '已收仓'
                    },
                    {
                        oriValue: 4,
                        repValue: '已验收'
                    }
                ]
            },
            {
                keyName: 'QualityLevel',
                reps: [
                    {
                        oriValue: 0,
                        repValue: emptyValue
                        // repValue: '优良'
                    },
                    {
                        oriValue: 1,
                        repValue: '优良'
                    },
                    {
                        oriValue: 2,
                        repValue: '合格'
                    },
                    {
                        oriValue: 3,
                        repValue: '不合格'
                    }
                ]
            },
            {
                keyName: 'IntervalDays',
                reps: [
                    {
                        oriValue: 0,
                        repValue: emptyValue
                    }
                ]
            },
            {
                keyName: 'Age',
                reps: [
                    {
                        oriValue: 0,
                        repValue: emptyValue
                    }
                ]
            },
            {
                keyName: 'DesignHnt',
                reps: [
                    {
                        oriValue: 0,
                        repValue: emptyValue
                    }
                ]
            },
            {
                keyName: 'PourHour',
                reps: [
                    {
                        oriValue: 0,
                        repValue: emptyValue
                    }
                ]
            },
            {
                keyName: 'AvgPourHnt',
                reps: [
                    {
                        oriValue: 0,
                        repValue: emptyValue
                    }
                ]
            },
            {
                keyName: 'FactHnt',
                reps: [
                    {
                        oriValue: 0,
                        repValue: emptyValue
                    }
                ]
            },
            {
                keyName: 'WaterFlux',
                reps: [
                    {
                        oriValue: 0,
                        repValue: emptyValue
                    }
                ]
            }
        ],
        // this.filterData方法对某一类共性数据进行过滤,包含Rate的字段值将按byContaining方法返回4位有效数字,过滤时优先搜索Group选项
        // 如果在decimalGroupFilters中处理过，则不在decimalFilters中处理
        decimalGroupFilters: [
            {
                // 含有'Rate'字符串的key名
                keyword: 'Rate',
                // 都用methods中的byContaining方法处理
                method: 'byContaining',
                // 保留4位有效数字
                len: 4,
                // methods中的格式化方法，百分比，即4位有效数字 * 100 后加'%',返回字符串
                formatter: 'toPercentage',
                // 要忽略的字段，加入此数组的字段将不做处理，可在decimalFilters中定制过滤策略
                ignoreList: ['CurrentRate', 'TotalRate']
            },
            {
                // 含有'Rate'字符串的key名
                keyword: 'TotalRate',
                // 都用methods中的byContaining方法处理
                method: 'byContaining',
                // 保留4位有效数字
                len: 4,
                // methods中的格式化方法，百分比，即4位有效数字 * 100 后加'%',返回字符串
                formatter: 'toPercentageNoUnit',
                // 要忽略的字段，加入此数组的字段将不做处理，可在decimalFilters中定制过滤策略
                ignoreList: ['CurrentRate']
            }
        ],
        // 小数点,len为小数点后保留位数,
        // default选项必须在最后
        decimalFilters: [
            // {
            //     keyName: 'GoodRate',
            //     len: 4
            // },
            {
                keyName: 'IntervalDays',
                len: 1
            },
            {
                keyName: 'PourHour',
                len: 1
            },
            {
                keyName: 'TotalAvgSpan',
                len: 1
            },
            {
                keyName: 'WaitAvgSpan',
                len: 1
            },
            {
                keyName: 'LoadAvgSpan',
                len: 1
            },
            {
                keyName: 'TransAvgSpan',
                len: 1
            },
            {
                keyName: 'AimCellAvgSpan',
                len: 1
            },
            {
                keyName: 'UnLoadAvgSpan',
                len: 1
            },
            {
                keyName: 'PourAvgSpan',
                len: 1
            },
            {
                keyName: 'BackAvgSpan',
                len: 1
            },
            {
                keyName: 'Span',
                len: 1
            },
            {
                keyName: 'AvgSpan',
                len: 1
            },
            {
                keyName: 'default',
                len: 2
            }
        ],
        timeFormatFilters: [
            {
                keyName: 'OpenTime',
                modeName: 'datetime-noSeconds' // 去掉秒
            },
            {
                keyName: 'CloseTime',
                modeName: 'datetime-noSeconds' // 去掉秒
            }
        ]
    };
    function getConfig() {
        return config;
    }
    Basics.getConfig = getConfig;
})(Basics || (Basics = {}));
