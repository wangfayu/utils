/** 本服务以i-table为基础进行表格绘制 **/
class TableOption {
    constructor (name) {
        this.name = name;
        this.columns = [];
        this.datas = [];
    }
}
import methods from './methods';
let tableService = {
    getTableOption () {
        return new TableOption();
    },

    /**
     * 组织table数据
     * @param {Array} columnArr 表头和数据源字段(属性的对应关系)
     * columnArr: [
     *      {
     *          title: 'col1',  // 显示的列头
     *          key: 'age'     // data数据源中对应的属性名
     *      },
     *      {
     *          title: 'col2',
     *          // 子列表，col2为2列的合并表头
     *          children: [
     *              {
     *                  title: 'col2-1'
     *                  key: 'firstName'
     *              },
     *              {
     *                  title: 'col2-2'
     *                  key: 'lastName'
     *              }
     *          ]
     *      }
     * ]
     * @param {Array} datas 数据源数组
     * [
     *      {
     *          age: 20,
     *          firstName: 'Micheal',
     *          lastName: 'Jackson'
     *          nationality: 'U.S.A'
     *      }
     * ]
     * @param {Array} additionalOption 额外选项
     *
     * @return {Array} dataArr 返回结果中第0项为表头对象，dataArr为填充数据
     *
     * dataArr: [
     *      {
     *          age: 20,
     *          firstName: 'Micheal',
     *          lastName: 'Jackson'
     *      }
     * ]
     */
    makeTableData (columnArr, datas) {
        let res = [];
        // debugger;
        if (datas && datas.length && columnArr && columnArr.length) {
            datas.forEach((item) => {
                let resItem = {};
                let tableBindingProp = 'key';
                let props = {val: null};
                // 获取columnArr中所有属性为key的值，即数据源集中的字段名
                methods.getPropValues(tableBindingProp, columnArr, props);
                if (props.val && props.val.length) {
                    props.val.forEach((prop) => {
                        let propValue = {val: ''};
                        methods.getPropValueOnce(prop, item, propValue);
                        // 生成行数据
                        resItem[prop] = propValue.val;
                    });
                }
                res.push(resItem);
            });
        }
        console.log('makeTableData', res);
        return res;
    },

    /**
     * 将碎片化的数据形成table所需的行数据数组 api实例：揽机运行趋势分析 api/cablerun/analyse/single/cable/trend/{begin}/{endTime} 任务号：10801
     * 按option中提供的方法将数据以对象形式（中间结果集）进行存储
     * middleObj:
     * {
     *      row1: {
     *          col1: val,
     *          col2: val,
     *          col3: val,
     *          ...
     *      },
     *      row2: {
     *          col1: val,
     *          col2: val,
     *          col3: val,
     *          ...
     *      }
     *      ...
     * }
     * 最终将中间对象转为行数据数组
     * result:
     * [
     *      {
     *          col1: val,
     *          col2: val,
     *          col3: val,
     *          ...
     *      },
     *      {
     *          col1: val,
     *          col2: val,
     *          col3: val,
     *          ...
     *      }
     * ]
     * @param {Object} option 如何进行组织行数据的方法
     * {
     *      rowKey: String|Function, // 字符串则表示 datas 中的每一项应具有以该字符串为名的属性作为中间结果集，
     *                                    如果是function则将datas遍历时的对象作为参数传入，得到rowKey内容，再进行检测是否新建行
     *      colOptions: [
     *           // 列数组
     *           {
     *              colKey: String|Function, String|Function, // 列标志用于确定datas遍历项是否有rowKey行的某列的数据，有2种类型，
     *                      1. 如果是String类型，则如果datas遍历项含有该字符串为名的属性，则把属性值填入，后值覆盖，
     *                      2. 如果是Function类型，则将datas遍历项作为参数传入该方法，返回值不为undefined则填入单元格数据(function 返回值中包含colName和colValue)
     *              colName: String, //结果集中的属性名（列名，与TableColumn数组配置中的key对应，渲染table时使用，result例子中的col1,col2,col3）,colKey为string类型时有效
     *              confilict: 'override'|'ignore', // 已存在相同的rowKey和col属性的值时，覆盖或忽略，忽略则只保存第一次写入的值，默认为override
     *           }
     *      ],
     *
     *      additionalRow: 'sum'|'avg'|undefined, //是否要在最后一行添加 合计 或 平均值
     *      additionalRowName: 最后一行的行头显示文字,additionalRow有效才时有效
     * }
     *
     * @param {Array} datas 数据源
     * @param {Array} emptyValue 初始值,如果未传入此参数，将忽略没有值的单元格
     * @return {Array} 行数据集合
     */
    makeTableDataByPiece (option, datas, emptyValue) {
        // 中间结果对象
        let mid = {};
        // 结果数组,rowData为行数据数组，colData为所有colKey为function即动态获取的列头
        let res = {
            rowData: [],
            colData: []
        };
        // 确保行的顺序按结果数据遍历rowKey的顺序
        let rows = [];
        let key = option.rowKey;
        let keyType = methods.getType(key);
        let uniqColData = new Set();
        // debugger;
        if (datas && datas.length && option.rowKey && option.colOptions && option.colOptions.length) {
            datas.forEach((item) => {
                // 获取rowKey
                let rowKeyStr;
                if (keyType === 'string') {
                    if (item[key] !== undefined) {
                        rowKeyStr = key;
                    }
                } else if (keyType === 'function') {
                    let rKey = key(item);
                    if (rKey !== undefined) {
                        rowKeyStr = rKey;
                    }
                }
                if (item[rowKeyStr] !== undefined) {
                    let rowName = 'row' + item[rowKeyStr];
                    if (mid[rowName] === undefined) {
                        // 添加行
                        mid[rowName] = {};
                        rows.push(rowName);
                    }
                    // 遍历colOptions，填充单元格数据
                    option.colOptions.forEach((colOption) => {
                        let colKeyType = methods.getType(colOption.colKey);
                        let colVal;
                        let colName;
                        if (colKeyType === 'string') {
                            colVal = item[colOption.colKey];
                            colName = colOption.colName;
                        } else if (colKeyType === 'function') {
                            [colName, colVal] = colOption.colKey(item);
                        }
                        if (mid[rowName][colName] && colVal) {
                            if (colOption.confilict && colOption.confilict === 'ignore') {
                                return;
                            }
                        }
                        if (colName) {
                            if (!uniqColData.has(colName)) {
                                // 将列头保存到结果
                                uniqColData.add(colName);
                                res.colData.push(colName);
                            }
                            mid[rowName][colName] = colVal || '';
                        }
                    });
                }
            });
            // 如果传入emptyValue,需要检查mid中每一行是否有空值单元格，即mid[rowName]对象不包含属性名uniqColData[x]
            if (emptyValue) {
                for (let col of uniqColData.keys()) {
                    for (let row in mid) {
                        if (mid.hasOwnProperty(row) && !mid[row][col]) {
                            mid[row][col] = emptyValue;
                        }
                    }
                }
            }
            // 将中间结果转换为最终结果
            if (rows.length) {
                rows.forEach((row) => {
                    res.rowData.push(mid[row]);
                });
            }
        }
        return res;
    }
};
export default tableService;
