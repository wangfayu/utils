/**
 * 本模块定义公共方法
 */
let methods = {

    /**
     * 判断数据类型
     * @param {*} obj 要检测类型的对象
     * @return {string} 小写的类型名称：string | number | boolean | object | array | function
     */
    getType (obj) {
        return {}.toString
            .call(obj)
            .match(/\s([a-zA-Z]+)/)[1]
            .toLowerCase();
    },

    /**
     * 参数处理
     *      1. 删除为null的对象属性
     *      2. 字符串参数去掉两侧的空格
     * @param {*} o
     */

    filterNull (o) {
        if (o) {
            for (var key in o) {
                if (Object.prototype.hasOwnProperty.call(o, key)) {
                    if (o[key] === null) {
                        delete o[key];
                    }
                    if (this.getType(o[key]) === 'string') {
                        o[key] = o[key].trim();
                    } else if (this.getType(o[key]) === 'object') {
                        o[key] = this.filterNull(o[key]);
                    } else if (this.getType(o[key]) === 'array') {
                        o[key] = this.filterNull(o[key]);
                    }
                }
            }
        }
    },

    /**
     * 检查obj中的每个属性是否需要转换
     * @param {objcet} obj 要过滤的数据源
     * @param {filtersConfig} filtersConfig 包含有过滤选项配置的对象
     * @returns {*} none
     */
    filterData (obj, filtersConfig) {
        var i,
            j,
            len,
            len2,
            filters,
            factor;
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                if (prop && typeof obj[prop] === 'object') {
                    this.filterData(obj[prop], filtersConfig);
                } else {
                    // 1.0 异常数据处理
                    filters = filtersConfig.nanFilters;
                    if (filters && filters.length && filters.length > 0) {
                        for (i = 0, len = filters.length;i < len;i++) {
                            if (obj[prop] === filters[i].oriValue) {
                                obj[prop] = filters[i].repValue;
                                break;
                            }
                        }
                    }
                    // 2.0 转换，级别、状态等
                    filters = filtersConfig.transFilters;
                    if (filters && filters.length && filters.length > 0) {
                        for (i = 0, len = filters.length;i < len;i++) {
                            if (prop === filters[i].keyName) {
                                for (j = 0, len2 = filters[i].reps.length;j < len2;j++) {
                                    if (obj[prop] === filters[i].reps[j].oriValue) {
                                        obj[prop] = filters[i].reps[j].repValue;
                                        break;
                                    }
                                }
                                break;
                            }
                        }
                    }
                    // 对有效数字进行处理
                    if (prop && typeof obj[prop] === 'number') {
                        // 3.0 处理通用有效数字配置
                        // debugger;
                        let groupFilters = filtersConfig.decimalGroupFilters;
                        // 是否在groupFilter中处理过该字段，如果已处理则不在4.0中处理
                        let flagObj = {
                            fixed: false
                        };
                        if (groupFilters && groupFilters.length && groupFilters.length > 0) {
                            groupFilters.forEach((filter) => {
                                    let i, len;
                                    let ignoreFlag = false;
                                    // 检查是否在忽略名单中
                                    if (filter.ignoreList && filter.ignoreList.length) {
                                        for (i = 0, len = filter.ignoreList.length; i < len; i++) {
                                            if (filter.ignoreList[i] === prop) {
                                                ignoreFlag = true;
                                                break;
                                            }
                                        }
                                    }
                                    if (!ignoreFlag) {
                                        this[filter.method]({
                                            keyword: filter.keyword,
                                            valObj: obj,
                                            objKeyName: prop,
                                            formatter: this[filter.formatter],
                                            len: filter.len
                                        }, flagObj);
                                    }
                                }
                            );
                        }
                        // 4.0 处理单独处理字段小数保留位数
                        if (!flagObj.fixed) {
                            filters = filtersConfig.decimalFilters;
                            if (filters && filters.length && filters.length > 0) {
                                if (('' + obj[prop]).indexOf('.') > -1 && filters.length > 0) {
                                    for (i = 0, len = filters.length;i < len; i++) {
                                        if (prop === filters[i].keyName || i === len - 1) {
                                            // 没有匹配的规则则使用最后一条规则，filters的最后一项应设为默认值
                                            factor = Math.pow(10, filters[i].len);
                                            obj[prop] = Math.round(obj[prop] * factor) / factor;
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    // 5.0 format时间字段
                    filters = filtersConfig.timeFormatFilters;
                    if (filters && filters.length && filters.length > 0) {
                        for (i = 0, len = filters.length;i < len; i++) {
                            if (prop === filters[i].keyName && obj[prop] !== filtersConfig.emptyValue) {
                                // 解决日期格式字符串不能用'-'连接的bug
                                obj[prop] = this.formatDate(new Date(obj[prop].replace(/-/g, '/')), filters[i].modeName);
                            }
                        }
                    }
                }
            }
        }
    },

    /**
     * 返回日期格式字符串
     * @param {datetime} date 日期对象
     * @param {string} mode 模式，默认返回带时分秒的完整格式，'date' 返回yyyy-MM-dd
     * @return {string} yyyy-MM-dd HH:mm:ss
     */
    formatDate: function (date, mode) {
        var res;
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        var myhours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
        var myminutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
        var myseconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
        if (mymonth < 10) {
            mymonth = '0' + mymonth;
        }
        if (myweekday < 10) {
            myweekday = '0' + myweekday;
        }
        switch (mode) {
            case 'date':
                // 精确到天
                res = myyear.toString() + '-' + mymonth.toString() + '-' + myweekday.toString();
                break;
            case 'datetime-noSeconds':
                // 去掉秒
                res = myyear.toString() + '-' + mymonth.toString() + '-' + myweekday.toString() + ' ' + myhours.toString() + ':' + myminutes.toString();
                break;
            default:
                // 默认带秒
                res = myyear.toString() + '-' + mymonth.toString() + '-' + myweekday.toString() + ' ' + myhours.toString() + ':' + myminutes.toString() + ':' + myseconds.toString();
        }
        return res;
    },

    /**
     *
     * @param {object} responseObj 包含错误信息的对象，错误包括http错误码和后台可能返回的查询信息代码
     * @return {string} res 转换后的消息体
     */
    transErrorCode (responseObj) {
        var res = '';
        if (responseObj && responseObj.status !== undefined) {
            switch (responseObj.status) {
                case 400:
                    res = '服务器拒绝了请求';
                    break;
                case 404:
                    res = '未获取到资源';
                    break;
                case 502:
                    res = '服务器内部错误';
                    break;
                default:
                    res = '请求出错，错误代码：' + responseObj.status;
            }
        }
        return res;
    },
    debugMode: true,

    /**
     * 在JSON.stringify函数中作为第2个参数用来替换数值
     * @param {*} key
     * @param {*} value
     */

    replacer (key, value) {
        let type = {}.toString.call(value);
        if (type.indexOf('Number') > -1) {
            if (isNaN(value)) {
                return 'NaN';
            }
        }
        if (type.indexOf('Undefined') > -1) {
            return 'undefined';
        }
        if (type.indexOf('Null') > -1) {
            return 'null';
        }
        if (type.indexOf('Function') > -1) {
            return value.toString();
        }
        return value;
    },

    /**
     * 自定义toString
     *      1.基本类型直接转为string
     *      2.对于object类型和array类型的数据转换成json格式，并将
     * @param {*} obj
     * @return {string} 返回字符串描述
     */

    toString (o) {
        let res;
        let type = this.getType(o);
        // let subType;
        switch (type) {
            case 'string':
                res = o;
                break;
            case 'number':
                isNaN(o) ? res = 'NaN' : res = o + '';
                break;
            case 'boolean':
                res = o ? 'true' : 'false';
                break;
            case 'object':
                res = JSON.stringify(o, this.replacer, ' ');
                break;
            case 'array':
                res = JSON.stringify(o, this.replacer, ' ');
                break;
            case 'null':
                res = 'null';
                break;
            case 'undefined':
                res = 'undefined';
                break;
            default:
                res = 'unknown';
        }
        return res;
    },

    /**
     * log记录
     * @param {*} str 内容
     * @param {*} debugMode debug模式下显示
     * @returns {*} null
     */
    log (str, debugMode) {
        if (debugMode) {
            let now = new Date();
            let nowStr = now.getFullYear() + '/' + now.getMonth() + '/' + now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
            console.log('log' + nowStr + ':' + str);
        }
    },

    /**
     * 获取obj中第1个属性名为propName的值
     * @param {String} propName 属性名
     * @param {any} obj 数据源对象，如果不是Object则忽略
     * @param {Object} res 结果对象，必须具有val属性
     * @return {any} obj中属性名为propName的值
     */
    getPropValueOnce (propName, obj, res) {
        // 第一次执行getPropValue，生成结果对象，如果res存在，则为嵌套调用
        if (res.val) {
            // 如果已存在res.val，则已找到结果，退出嵌套
            // console.log('res already exist, exit loop!');
            return;
        }
        let _this = this;
        let props = Reflect.ownKeys(obj);
        if (props && props.length) {
            for (let i = 0, len = props.length; i < len; i++) {
                if (props[i] === propName) {
                    // console.log('found!');
                    // console.log(obj[propName]);
                    res.val = obj[propName];
                    return;
                }
                if (props[i] !== '__ob__') {
                    let type = _this.getType(obj[props[i]]);
                    // debugger;
                    switch (type) {
                        case 'object':
                            _this.getPropValueOnce(propName, obj[props[i]], res);
                            break;
                        case 'array':
                            obj[props[i]].forEach((item) => {
                                _this.getPropValueOnce(propName, item, res);
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    },

    /**
     * 获取obj中所有属性名为propName的值
     * @param {String} propName 属性名
     * @param {any} obj 数据源对象，如果不是Object则忽略
     * @param {Object} res 结果对象，结果值存在val属性中
     * @return {any} obj中属性名为propName的值
     */
    getPropValues (propName, obj, res) {
        let _this = this;
        let props = Reflect.ownKeys(obj);
        if (props && props.length) {
            for (let i = 0, len = props.length; i < len; i++) {
                if (props[i] === propName) {
                    res.val
                            ? res.val.push(obj[propName])
                            : res.val = [obj[propName]];
                    return;
                }
                if (props[i] !== '__ob__') {
                    let type = _this.getType(obj[props[i]]);
                    // debugger;
                    switch (type) {
                        case 'object':
                            _this.getPropValues(propName, obj[props[i]], res);
                            break;
                        case 'array':
                            obj[props[i]].forEach((item) => {
                                _this.getPropValues(propName, item, res);
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    },

    /**
     * 以propName为键查找依据遍历objArr中的所有对象，将不重复的属性值形成数组返回，用于如图表数据源中获取结果集中的x轴数据等
     * @param {Array} objArr 对象数组
     * @param {String} propName 对象应具有的属性名
     * @return {Array} 由所有非重复的 objArr[index][propName] 组成的结果
     */
    getUniqPropArr (objArr, propName) {
        let uniqObj = {};
        let res = [];
        let index = 0;
        if (objArr && objArr.length) {
            objArr.forEach((item) => {
                if (item[propName] && !uniqObj[propName]) {
                    uniqObj[propName] = index++;
                    res.push(item[propName]);
                }
            });
        }
        return res;
    },


    makeChartDataBySerieNames (objArr, xPropName, serieNameArr) {
        let uniqueData = {};
        let uniqueSerie = {};
        let xData = [];
        let series = [];
        let xIndex = 0;
        let sIndex = 0;
        if (objArr && objArr.length) {
            objArr.forEach((item) => {
                // 1.0 遍历出x轴数据数组 xData
                // x轴数据
                if (item[xPropName] && !uniqueData[item[xPropName]]) {
                    // uniqueData[item[xPropName]] = 'index' + xIndex++;
                    uniqueData[item[xPropName]] = xIndex++;
                    xData.push(item[xPropName]);
                }

                // 2.0 遍历出曲线 uniqueSerie 数组
                // 曲线数组
                if (serieNameArr && serieNameArr.length) {
                    serieNameArr.forEach((serie) => {
                        if (item[serie.serieName]) {
                            // 本数据项有该曲线的数据
                            if (!uniqueSerie[serie.serieName]) {
                                // 没有则新建曲线,并设置曲线配置
                                uniqueSerie[serie.serieName] = {
                                    name: serie.serieLabel,
                                    sIndex: sIndex++,
                                    lineType: serie.lineType,
                                    stack: serie.stack || '',
                                    data: []
                                };
                                series.push(uniqueSerie[serie.serieName]);
                            }
                            // uniqueSerie[key].data.push([item[xPropName], item[group.groupName]]);
                        }
                    });
                }
            });
            // 3.0按升序对xData排序 （避免统计数据中曲线会出现日期前后交替的问题）
            xData.sort();
            // 4.0重新记录序号
            xData.forEach((item, index) => {
                uniqueData[item] = index;
            });
            // 5.0构建初始数据,曲线如果只有部分 xData 日期的数据，其他数据为空
            series.forEach((serie) => {
                serie.data = new Array(xData.length);
            });
            // 6.0 遍历每一项数据，并按xData的序号将值填入到曲线数据中
            objArr.forEach((item) => {
                // 曲线数值填充
                if (serieNameArr && serieNameArr.length) {
                    serieNameArr.forEach((serie) => {
                        if (item[serie.serieName]) {
                            // dataArr数据项有该y轴数据
                            uniqueSerie[serie.serieName].data[uniqueData[item[xPropName]]] = item[serie.serieName];
                        }
                    });
                }
            });
        }
        let res = {
            xData: xData,
            series: series
        };
        return res;
    },

    /**
     * 用于折线图和柱状图的混合图，根据日期生成多条曲线，api实例：api/concretewebquery/mixhntdata/buildingcodegroup/{dataType}/{fromTime}/{toTime}
     * 以 xPropName 为键查找依据遍历objArr中的所有对象，将不重复的属性值形成x轴数据数组
     * 以 seriePropName 为键查找依据遍历objArr中的所有对象，将不重复的 **属性值** 形成系列名数组
     * 以 groupArr 中的每一项为键查找依据遍历objArr中的所有对象，与seriePropName联合形成可重复的数组作为曲线数据
     * @param {Array} objArr 数据源对象数组
     * @param {String} xPropName 对象应具有的属性名(x轴数据所在属性)
     * @param {String} seriePropName 对象应具有的属性名(系列名所在属性)
     * @param {Array} groupArr 对象应具有的属性名(y轴数组（数据项），与系列名做笛卡尔乘积产生serie),每一项要包含曲线的type用来获取折线图或柱状图的曲线设置
     * @param {Array} emptyValue 初始值，没有填充数据的单元格将显示此值
     * @return {Array} 由所有非重复的 objArr[index][propName] 组成的结果
     *
    1.原始api数据：
      [{
            "MixBuildingCode": "DBHL01",
            "ProductTime": "2017年",
            "HntVolume": 377254.0,
            "TotalVolume": 377254.0
        }, {
            "MixBuildingCode": "DBHL01",
            "ProductTime": "2018年",
            "HntVolume": 110726.0,
            "TotalVolume": 487980.0
        }, {
            "MixBuildingCode": "DBHL02",
            "ProductTime": "2017年",
            "HntVolume": 389625.80,
            "TotalVolume": 389625.80
        }, {
            "MixBuildingCode": "DBHL02",
            "ProductTime": "2018年",
            "HntVolume": 128849.50,
            "TotalVolume": 518475.30
        }, {
            "MixBuildingCode": "GBHL01",
            "ProductTime": "2017年",
            "HntVolume": 48586.50,
            "TotalVolume": 48586.50
        }, {
            "MixBuildingCode": "GBHL01",
            "ProductTime": "2018年",
            "HntVolume": 34533.0,
            "TotalVolume": 83119.50
        }, {
            "MixBuildingCode": "GBHL02",
            "ProductTime": "2017年",
            "HntVolume": 59356.50,
            "TotalVolume": 59356.50
        }, {
            "MixBuildingCode": "GBHL02",
            "ProductTime": "2018年",
            "HntVolume": 31803.0,
            "TotalVolume": 91159.50
        }, {
            "MixBuildingCode": "baihetan-1",
            "ProductTime": "2017年",
            "HntVolume": 4913.50,
            "TotalVolume": 4913.50
        }, {
            "MixBuildingCode": "baihetan-1",
            "ProductTime": "2018年",
            "HntVolume": 42.0,
            "TotalVolume": 4955.50
        }]
    }
    2.调用参数（HntVolume显示为柱状图，TotalVolume显示为折线图，x轴显示2017年和2018年2组数据，每一个MixBuildingCode按HntVolume和TotalVolume分别生成2条serie）：
    var groupArr = [
                    {
                        groupName: 'HntVolume',
                        lineType: 'bar'
                    },
                    {
                        groupName: 'TotalVolume',
                        lineType: 'line'
                    }
                ];
    makeChartData(data, 'ProductTime', 'MixBuildingCode', groupArr);
    3.经过处理：
    =>{
        "xData": ["2017年", "2018年"],
        "series": [{
            "groupName": "HntVolume",
            "name": "DBHL01",
            "sIndex": 0,
            "data": [377254, 110726]
        }, {
            "groupName": "TotalVolume",
            "name": "DBHL01",
            "sIndex": 1,
            "data": [377254, 487980]
        }, {
            "groupName": "HntVolume",
            "name": "DBHL02",
            "sIndex": 2,
            "data": [389625.8, 128849.5]
        }, {
            "groupName": "TotalVolume",
            "name": "DBHL02",
            "sIndex": 3,
            "data": [389625.8, 518475.3]
        }, {
            "groupName": "HntVolume",
            "name": "GBHL01",
            "sIndex": 4,
            "data": [48586.5, 34533]
        }, {
            "groupName": "TotalVolume",
            "name": "GBHL01",
            "sIndex": 5,
            "data": [48586.5, 83119.5]
        }, {
            "groupName": "HntVolume",
            "name": "GBHL02",
            "sIndex": 6,
            "data": [59356.5, 31803]
        }, {
            "groupName": "TotalVolume",
            "name": "GBHL02",
            "sIndex": 7,
            "data": [59356.5, 91159.5]
        }, {
            "groupName": "HntVolume",
            "name": "baihetan-1",
            "sIndex": 8,
            "data": [4913.5, 42]
        }, {
            "groupName": "TotalVolume",
            "name": "baihetan-1",
            "sIndex": 9,
            "data": [4913.5, 4955.5]
        }]
    }
     */
    makeChartDataBySerieProp (objArr, xPropName, seriePropName, groupArr, emptyValue) {
        let uniqueData = {};
        let uniqueSerie = {};
        let xData = [];
        let series = [];
        let xIndex = 0;
        let sIndex = 0;
        emptyValue = emptyValue || '--';
        if (objArr && objArr.length) {
            objArr.forEach((item) => {
                // 1.0 遍历出x轴数据数组 xData
                // x轴数据
                if (item[xPropName] && uniqueData[item[xPropName]] === undefined) {
                    // uniqueData[item[xPropName]] = 'index' + xIndex++;
                    uniqueData[item[xPropName]] = xIndex++;
                    xData.push(item[xPropName]);
                }

                // 2.0 遍历出曲线 uniqueSerie 数组
                // 曲线数组
                if (groupArr && groupArr.length) {
                    groupArr.forEach((group) => {
                        // 曲线key
                        let key = group.groupName + item[seriePropName];
                        if (item[group.groupName]) {
                            // dataArr数据项有该y轴数据
                            // 没有则新建曲线
                            if (!uniqueSerie[key]) {
                                uniqueSerie[key] = {
                                    groupName: group.groupName,
                                    name: item[seriePropName] + (group.groupLabel || ''),
                                    sIndex: sIndex++,
                                    lineType: group.lineType,
                                    data: []
                                };
                                series.push(uniqueSerie[key]);
                            }
                            // uniqueSerie[key].data.push([item[xPropName], item[group.groupName]]);
                        }
                    });
                }
            });
            // 3.0按升序对xData排序 （避免统计数据中曲线会出现日期前后交替的问题）
            xData.sort();
            // 4.0重新记录序号
            xData.forEach((item, index) => {
                uniqueData[item] = index;
            });
            // 5.0构建初始数据,曲线如果只有部分 xData 日期的数据，其他数据为空
            series.forEach((serie) => {
                // serie.data = new Array(xData.length);
                serie.data = Array.apply(null, Array(xData.length)).map(() => emptyValue);
            });
            // 6.0 遍历每一项数据，并按xData的序号将值填入到曲线数据中
            objArr.forEach((item) => {
                // 曲线数值填充
                if (groupArr && groupArr.length) {
                    groupArr.forEach((group) => {
                        // 曲线key
                        let key = group.groupName + item[seriePropName];
                        if (item[group.groupName]) {
                            // dataArr数据项有该y轴数据
                            uniqueSerie[key].data[uniqueData[item[xPropName]]] = item[group.groupName];
                        }
                    });
                }
            });
        }
        let res = {
            xData: xData,
            series: series
        };
        // console.log(res);
        return res;
    },

    /**
     * 将chartOption中的曲线数组按时间字段进行时间升序排序
     * @param {Array} dataArr 数据源 series
     * @param {string} arrPropName 数值项列表, serie: {data:[timeValue,value...]}
     * @param {Number} timeValueIndex 数值项为数组，第几项为时间值
     * @return {null} 无返回值
     */
    sortBySerieDate (dataArr, arrPropName, timeValueIndex) {
        timeValueIndex = timeValueIndex || 0;
        dataArr.sort(function (a, b) {
            // debugger;
            if (a[arrPropName].length === 0 && b[arrPropName].length === 0) {
                return 0;
            }
            if (a[arrPropName].length === 0 && b[arrPropName].length > 0) {
                return 1;
            }
            if (a[arrPropName].length > 0 && b[arrPropName].length === 0) {
                return -1;
            }
            // 比对第1项的时间
            if (a[arrPropName][0][timeValueIndex] > b[arrPropName][0][timeValueIndex]) {
                return 1;
            } else if (a[arrPropName][0][timeValueIndex] < b[arrPropName][0][timeValueIndex]) {
                return -1;
            } else {
                return 0;
            }
        });
    },

    /**
     * 对数组中的每一项用该对象的某一属性进行排序，将改变原数组
     * @param {Array} oriArray 要排序的数组
     * @param {string} fieldName 属性名
     * @param {string} sortType 排序方法： desc:降序，asc:升序
     * @returns {Array} 返回排序后的数组
     */
    sortByField (oriArray, fieldName, sortType) {
        if (Array.isArray(oriArray) && fieldName !== '') {
            if (sortType && sortType === 'asc') {
                console.log('升序asc');
                Array.prototype.sort.call(oriArray, function (a, b) {
                    if (a[fieldName] && !b[fieldName]) {
                        return 1;
                    } else if (!a[fieldName] && b[fieldName]) {
                        return -1;
                    } else if (!a[fieldName] && !b[fieldName]) {
                        return 0;
                    } else {
                        return (a[fieldName] > b[fieldName])
                                ? 1
                                : (a[fieldName] === b[fieldName]
                                    ? 0
                                    : -1);
                    }
                });
            } else {
                // 默认降序
                console.log('降序desc');
                Array.prototype.sort.call(oriArray, function (a, b) {
                    if (a[fieldName] && !b[fieldName]) {
                        return -1;
                    } else if (!a[fieldName] && b[fieldName]) {
                        return 1;
                    } else if (!a[fieldName] && !b[fieldName]) {
                        return 0;
                    } else {
                        return (a[fieldName] < b[fieldName])
                                                            ? 1
                                                            : -1;
                    }
                });
            }
        }
    },

    /**
     * 对数组中的项中包含数字的字符串按数字进行排序，比如 ['1月','2月' ... '12月'],解决11月排在9月值前的问题
     * @param {*} options 排序选项
     * options: {
     *      arr: 数组
     *      itemObjProp: 如果数组中的每一项是一个对象，则此项数据为每个对象的属性名如'month',
     *                  arr形如 [{month:'1月'},{month:'11月'},{month:'9月'}],即用month字段进行排序,如果没有此项则表示数组的数据为数字或字符串如['1月','2月','3月','4月']
     *      removePart: 去除掉比对数据中某一部分字符串，如'第1个月'，将'第'去除后使比对数字位于开始位置，再用parseFloat方法转为数字进行比较,支持正则表达式
     * }
     * @returns {Array} res 排序后的数组
     */
    sortByNumInStr (options) {
        let tempArr;
        let res;
        // debugger;
        if (options && options.arr && Array.isArray(options.arr) && options.arr.length) {
            res = options.arr;
            let reg;
            if (options.removePart) {
                reg = new RegExp(options.removePart, 'i');
            }
            // 构造临时数组
            tempArr = options.arr.map((item) => {
                let sortItem = {
                    oriItem: item,
                    compareProp: options.itemObjProp
                                                    ? reg
                                                        ? parseFloat((item[options.itemObjProp] + '').replace(reg, ''))
                                                        : parseFloat(item[options.itemObjProp])
                                                    : reg
                                                        ? parseFloat((item + '').replace(reg, ''))
                                                        : parseFloat(item)
                };
                return sortItem;
            });
            // 用compareProp进行排序,默认升序
            this.sortByField(tempArr, 'compareProp', options.sortType || 'asc');
            // 按排序填充结果数组
            res = tempArr.map((item) => item.oriItem);
        }
        return res;
    },

    /**
     * 显示消息
     * @param {string} msg 消息内容
     * @param {string} title 标题
     * @param {string} type toastr类型 success|info|error|warning
     * @param {object} option 显示配置
     * @returns {*} 无
     */
    showMsg (msg, title, type, option) {
        if (window.toastr) {
            title = title || '';
            type = type || 'info';
            option = option || {
                'closeButton': false, // 显示关闭按钮
                'debug': false, // 启用debug
                'positionClass': 'toast-top-center', // 弹出的位置
                'showDuration': 300, // 显示的时间
                'hideDuration': 1000, // 消失的时间
                'timeOut': 2000, // 停留的时间
                'extendedTimeOut': 1000, // 控制时间
                'showEasing': 'swing', // 显示时的动画缓冲方式
                'hideEasing': 'linear', // 消失时的动画缓冲方式
                'showMethod': 'fadeIn', // 显示时的动画方式
                'hideMethod': 'fadeOut' // 消失时的动画方式
            };
            // debugger;
            window.toastr[type](msg, title, option);
        }
    },

    /**
     * 对数值进行处理
     * @param {Object} options keyword,valObj,objKeyName,保存的长度len，formatter等
     * @param {Object} flagObj 是否在本方法中处理过数据源，可用于屏蔽后续对数据源的同类过滤操作
     * @returns {String} 如果有formatter则返回formatter调用结果，否则返回保留有效数字后的结果
     */
    byContaining (options, flagObj) {
        let res = null;
        // debugger;
        options = options || {};
        let keyword = options.keyword;
        let valObj = options.valObj;
        let objKeyName = options.objKeyName;
        let formatter = options.formatter;
        let len = options.len;
        if (keyword && valObj && valObj.hasOwnProperty(objKeyName)) {
            res = valObj[objKeyName];
            if (objKeyName.indexOf(keyword) > -1) {
                if (typeof valObj[objKeyName] === 'number' && options && len && typeof len === 'number') {
                    if (flagObj) {
                        flagObj.fixed = true;
                    }
                    res = formatter
                                    ? formatter.call(this, valObj[objKeyName], len)
                                    : valObj[objKeyName].toFixed(len);
                }
            }
        }
        if (res !== null) {
            // 修改为过滤后的值
            valObj[objKeyName] = res;
        }
    },

    /**
     * 为百分比数字进行格式化
     * @param {Number|String} val 数值
     * @param {Number} len 保留的小数位数,数据乘以100后要减少2位，应传入不小于2的数值，否则设为保留2位小数
     * @param {Boolean} hideUnit 是否不追加%
     * @returns {String} '30.01%'
     */
    toPercentage (val, len, hideUnit) {
        // 默认保留2位小数
        len = len > 1
                    ? len - 2
                    : 2;
        return (val * 100).toFixed(len).replace('.00', '') + (hideUnit
                                                                    ? ''
                                                                    : '%');
    },

    /**
     * 为百分比数字进行格式化
     * @param {Number|String} val 数值
     * @param {Number} len 保留的小数位数,数据乘以100后要减少2位，应传入不小于2的数值，否则设为保留2位小数
     * @returns {String} '30.01%'
     */
    toPercentageNoUnit (val, len) {
        let _this = this;
        return _this.toPercentage(val, len, true);
    }

};
export default methods;
