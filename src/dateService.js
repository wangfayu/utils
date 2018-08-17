/** 本模块定义日期相关操作方法 **/

const zeroSec = ' 00:00:00';
const lastSec = ' 23:59:59';
const connector = '/';
const dayMillSecs = 86400000;

import methods from '@/utils/methods';

/**
 * @param {Date} date 日期
 * @param {Number} AddDayCount 天数
 * @returns {String} 日期字符串
 */
function getDateStr (date, AddDayCount) {
    var result;
    var hour;
    // 获取AddDayCount天后的日期
    date.setDate(date.getDate() + AddDayCount);
    if (date.getMinutes() > 0) {
        date.setHours(date.getHours() + 1);
        hour = date.getHours();
    } else {
        hour = date.getHours();
    }
    var year = date.getFullYear();
    // 获取当前月份的日期
    var month = date.getMonth() + 1;
    var day = date.getDate();
    // var hour = date.getHours();

    result = year.toString() + (month > 9 ? month : '0' + month) + (day > 9 ? day : '0' + day) + (hour > 9 ? hour : '0' + hour) + '00';
    return result;
}

/**
 * @param {Date} date 日期
 * @returns {String} 日期字符串
 */
function getDateStr3 (date) {
    var year = '';
    var month = '';
    var day = '';
    var now = date;
    year = '' + now.getFullYear();
    if ((now.getMonth() + 1) < 10) {
        month = '0' + (now.getMonth() + 1);
    } else {
        month = '' + (now.getMonth() + 1);
    }
    if ((now.getDate()) < 10) {
        day = '0' + (now.getDate());
    } else {
        day = '' + (now.getDate());
    }
    return year + '-' + month + '-' + day;
}

function pad (num, n) {
    return (Array(n).join(0) + num).slice(-n);
}

let dateService = {
    max: function (time) {
        var max = time[0];
        var len = time.length;
        for (var i = 1; i < len; i++) {
            if (time[i] > max) {
                max = time[i];
            }
        }
        return max;
    },
    min: function (time) {
        var min = time[0];
        var len = time.length;
        for (var i = 1; i < len; i++) {
            if (time[i] < min) {
                min = time[i];
            }
        }
        return min;
    },
    maxAdd12h: function (time) {
        var max = time[0];
        var len = time.length;
        for (var i = 1; i < len; i++) {
            if (time[i] > max) {
                max = time[i];
            }
        }
        var nowtimes = new Date(max[0].replace(/-/g, '/'));
        nowtimes.setHours(nowtimes.getHours() + 12);
        return this.YY_mm_dd_hh_mm(nowtimes);
    },
    add: function (timeArry, day) {
        var max = new Date(this.max(timeArry)[0].replace(/-/g, '/'));
        var min = new Date(this.min(timeArry)[0].replace(/-/g, '/'));
        var contrast = (max - min) / dayMillSecs;
        var dValue = day - contrast;
        // var dValue = (day - contrast).toFixed(2);
        var dateAddDays = this.afterAddDays(this.min(timeArry)[0], dValue);
        return [dateAddDays, dValue];
    },
    startadd: function (starttime, timeArry, day) {
        var max = new Date(this.max(timeArry)[0].replace(/-/g, '/'));
        var start = new Date(starttime.replace(/-/g, '/'));
        var contrast = (max - start) / dayMillSecs;
        var dValue = day - contrast;
        var dateAddDays = this.afterAddDays(starttime, dValue);
        return [dateAddDays, dValue];
    },
    difValue: function (starttime, endtime) {
        return ((new Date(endtime.replace(/-/g, '/'))) - (new Date(starttime.replace(/-/g, '/')))) / dayMillSecs;
    },
    // 日期格式化
    YYmm: function (date, con) {
        var month = date.getMonth() + 1;
        con = con || connector;
        return date.getFullYear() + connector +
                                                (month > 9
                                                    ? month
                                                    : '0' + month);
    },
    YYmmdd: function (date, connector) {
        // 传入第2参数，则表示用使用连接符格式化输出，比如传入'/',则输出'2017/10/30',否则输出'20171030'
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        var con = connector || '';
        if (mymonth < 10) {
            mymonth = '0' + mymonth;
        }
        if (myweekday < 10) {
            myweekday = '0' + myweekday;
        }
        return (myyear.toString() + con + mymonth.toString() + con + myweekday.toString());
    },
    YYmmddhhmm: function (date, connector) {
        // 传入第2参数，则表示用使用连接符格式化输出，比如传入'/',则输出'2017/10/30 15:30',否则输出'201710301530'
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        var myhours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
        var myminutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
        var con = connector || '';
        if (mymonth < 10) {
            mymonth = '0' + mymonth;
        }
        if (myweekday < 10) {
            myweekday = '0' + myweekday;
        }
        return (myyear.toString() + con + mymonth.toString() + con + myweekday + (con ? ' ' : '') + myhours.toString() + (con ? ':' : '') + myminutes.toString());
    },
    YYmmdd0000: function (date, connector) {
        // 设置为某天00点00分
        var myyear = date.getFullYear();
        var mymonth = this.fixMonth(date.getMonth() + 1);
        var myweekday = this.fixMonth(date.getDate());
        var con = connector || '';
        return (myyear.toString() + con + mymonth + con + myweekday + (con ? ' 00:00' : '0000'));
    },
    YYmmdd000000: function (date, connector) {
        // 设置为某天00点00分00秒
        var myyear = date.getFullYear();
        var mymonth = this.fixMonth(date.getMonth() + 1);
        var myweekday = this.fixMonth(date.getDate());
        var con = connector || '';
        return (myyear.toString() + con + mymonth + con + myweekday + (con ? ' 00:00:00' : '000000'));
    },
    YYmmdd2359: function (date, connector) {
        // 设置为某天23点59分
        var myyear = date.getFullYear();
        var mymonth = this.fixMonth(date.getMonth() + 1);
        var myweekday = this.fixMonth(date.getDate());
        var con = connector || '';
        return (myyear.toString() + con + mymonth + con + myweekday + (con ? ' 23:59' : '2359'));
    },
    YYmmdd235959: function (date, connector) {
        // 设置为某天23点59分59秒
        var myyear = date.getFullYear();
        var mymonth = this.fixMonth(date.getMonth() + 1);
        var myweekday = this.fixMonth(date.getDate());
        var con = connector || '';
        return (myyear.toString() + con + mymonth + con + myweekday + (con ? ' 23:59:59' : '235959'));
    },
    YYmmddhhmmss: function (date, connector) {
        // 传入第2参数，则表示用使用连接符格式化输出，比如传入'/',则输出'2017/10/30 15:30:01',否则输出'20171030153001'
        var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        var myhours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
        var myminutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
        // 获取秒
        var myss = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
        var con = connector || '';
        if (mymonth < 10) {
            mymonth = '0' + mymonth;
        }
        if (myweekday < 10) {
            myweekday = '0' + myweekday;
        }
        return (myyear.toString() + con + mymonth.toString() + con + myweekday.toString() + (con ? ' ' : '') + myhours.toString() + (con ? ':' : '') + myminutes.toString() + (con ? ':' : '') + myss.toString());
    },
    YY_mm_dd_hh_mm: function (date) {
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
        return (myyear.toString() + '-' + mymonth.toString() + '-' + myweekday.toString() + ' ' + myhours.toString() + ':' + myminutes.toString() + ':' + myseconds.toString());
    },
    YYYY_mm_dd_hh_mm_ss: function (date) {
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
        return (myyear.toString() + '-' + mymonth.toString() + '-' + myweekday.toString() + ' ' + myhours.toString() + ':' + myminutes.toString() + ':' + myseconds.toString());
    },
    mm_dd_hh_mm: function (date) {
        // var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        var myhours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
        var myminutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
        // var myseconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
        if (mymonth < 10) {
            mymonth = '0' + mymonth;
        }
        if (myweekday < 10) {
            myweekday = '0' + myweekday;
        }
        return (mymonth.toString() + '-' + myweekday.toString() + ' ' + myhours.toString() + ':' + myminutes.toString());
    },
    CN_mm_dd_hh_mm: function (date) {
        // var myyear = date.getFullYear();
        var mymonth = date.getMonth() + 1;
        var myweekday = date.getDate();
        var myhours = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours();
        var myminutes = (date.getMinutes() < 10) ? '0' + date.getMinutes() : date.getMinutes();
        // var myseconds = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds();
        if (mymonth < 10) {
            mymonth = '0' + mymonth;
        }
        if (myweekday < 10) {
            myweekday = '0' + myweekday;
        }
        return (mymonth.toString() + '月' + myweekday.toString() + '日 ' + myhours.toString() + ':' + myminutes.toString());
    },
    thirtyDays: function (date) {
        date = date || new Date();
        var timestamp, newDate;
        if (!(date instanceof Date)) {
            date = new Date(date.replace(/-/g, '/'));
        }
        timestamp = date.getTime();
        newDate = new Date(timestamp - 30 * 24 * 3600 * 1000);
        var getFullYear = newDate.getFullYear().toString();
        var getMonth = ((newDate.getMonth() + 1) < 10) ? ('0' + (newDate.getMonth() + 1)) : (newDate.getMonth() + 1).toString();
        var getDate = (newDate.getDate() < 10) ? ('0' + newDate.getDate()) : newDate.getDate();
        var getHours = ((newDate.getHours()) < 10) ? ('0' + newDate.getHours()) : newDate.getHours().toString();
        var getMinutes = (newDate.getMinutes() < 10) ? ('0' + newDate.getMinutes()) : newDate.getMinutes().toString();
        var returnDate = getFullYear + getMonth + getDate + getHours + getMinutes;

        // var returnDate = (newDate.getFullYear()).toString()+(newDate.getMonth() + 1).toString()+(newDate.getHours()).toString()+(newDate.getMinutes()).toString()+(newDate.getSeconds()).toString();
        // return [[newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()].join('/'), [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()].join(':')].join(' ');
        return returnDate;
    },
    sevenDays: function (date) {
        date = date || new Date();
        var timestamp, newDate;
        if (!(date instanceof Date)) {
            date = new Date(date.replace(/-/g, '/'));
        }
        timestamp = date.getTime();
        newDate = new Date(timestamp - 7 * 24 * 3600 * 1000);
        var getFullYear = newDate.getFullYear().toString();
        var getMonth = ((newDate.getMonth() + 1) < 10) ? ('0' + (newDate.getMonth() + 1)) : (newDate.getMonth() + 1).toString();
        var getDate = (newDate.getDate() < 10) ? ('0' + newDate.getDate()) : newDate.getDate();
        var getHours = ((newDate.getHours()) < 10) ? ('0' + newDate.getHours()) : newDate.getHours().toString();
        var getMinutes = (newDate.getMinutes() < 10) ? ('0' + newDate.getMinutes()) : newDate.getMinutes().toString();
        var returnDate = getFullYear + getMonth + getDate + getHours + getMinutes;

        // var returnDate = (newDate.getFullYear()).toString()+(newDate.getMonth() + 1).toString()+(newDate.getHours()).toString()+(newDate.getMinutes()).toString()+(newDate.getSeconds()).toString();
        // return [[newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()].join('/'), [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()].join(':')].join(' ');
        return returnDate;
    },

    /**
     * @param {Date} date,计算的起始日期
     * @param {Number} n,之前几天，默认为1天
     * @returns {string} 结果日期
     */
    lastDay: function (date, n) {
        var now = new Date(date); // 当前日期
        // var nowDayOfWeek = (now.getDay() == 0) ? 7 : now.getDay(); // 今天本周的第几天  从周一算起
        var nowDay = now.getDate(); // 当前日
        var nowMonth = now.getMonth(); // 当前月
        var nowYear = now.getYear(); // 当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        var dayDate = new Date(nowYear, nowMonth, nowDay - (n || 1));
        return this.YYmmddhhmm(dayDate);
    },

    /**
     * @param {Date} date,计算的起始日期
     * @param {Number} n,之前几天，默认为1天
     * @returns {string} 结果日期
     */
    nextDay: function (date, n) {
        var now = new Date(date); // 当前日期
        // var nowDayOfWeek = (now.getDay() == 0) ? 7 : now.getDay(); // 今天本周的第几天  从周一算起
        var nowDay = now.getDate(); // 当前日
        var nowMonth = now.getMonth(); // 当前月
        var nowYear = now.getYear(); // 当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        var dayDate = new Date(nowYear, nowMonth, nowDay + (n || 1));
        return this.YYmmddhhmm(dayDate);
    },

    /**
     * 重写，与移动查询app版不同
     * @param {Date} date,计算的起始日期
     * @param {Number} n,之前几周，默认为1周
     * @returns {string} 结果日期
     */
    lastWeek: function (date, n) {
        let now = null;
        let weekStartDate = null;
        let type = methods.getType(date);
        if (type === 'string') {
            now = new Date(date);
        } else if (type === 'date') {
            now = date;
        } else {
            now = new Date();
        }
        n = n || 1;
        weekStartDate = new Date(now.getTime() - (n * 7 * dayMillSecs));
        return this.YYmmddhhmmss(weekStartDate, connector);
    },
    nextWeek: function (date) {
        var weekValue = date.substring(0, 8);
        var stringWeek = weekValue.replace(/^(\d{4})(\d{2})(\d{2})$/, '$1/$2/$3');
        var now = new Date(stringWeek); // 当前日期
        var nowDayOfWeek = (now.getDay() === 0) ? 7 : now.getDay(); // 今天本周的第几天  从周一算起
        var nowDay = now.getDate(); // 当前日
        var nowMonth = now.getMonth(); // 当前月
        var nowYear = now.getYear(); // 当前年
        nowYear += (nowYear < 2000) ? 1900 : 0; //
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek + 8);
        return this.YYmmddhhmm(weekStartDate);
    },

    /**
     * 重写，与移动查询app版不同
     * @param {Date} date,计算的起始日期
     * @param {Number} n,之前几个月，默认为1月
     * @param {String} connector 连接符：默认为'/'
     * @returns {string} 结果日期
     */
    lastMonth: function (date, n, connector) {
        let now = null;
        let lastMonthStartDate = null;
        let type = methods.getType(date);
        if (type === 'string') {
            now = new Date(date);
        } else if (type === 'date') {
            now = date;
        } else {
            now = new Date();
        }
        n = n || 1;
        let year = now.getFullYear();
        let month = now.getMonth();
        // 超过12个月要对年进行计算
        let subYears = parseInt(n / 12, 10);
        // 要减去的月份
        let subMonth = n % 12;
        let resYear = year - subYears;
        let resMonth = null;
        let day = now.getDate();
        let hh = now.getHours();
        let mm = now.getMinutes();
        let ss = now.getSeconds();
        if (month - subMonth < 0) {
            resYear--;
            resMonth = 11 + month + 1 - subMonth;
        } else {
            resMonth = month - subMonth;
        }
        lastMonthStartDate = new Date(resYear, resMonth, day, hh, mm, ss);
        return this.YYmmddhhmmss(lastMonthStartDate, connector);
    },
    nextMonth: function (date, day, conn) {
        var thisYear;
        var thisMonth;
        var year;
        var nextMonth;
        var res;
        day = day || '01';
        conn = conn || connector;
        if (typeof date === 'object') {
            // 日期对象
            thisYear = date.getFullYear();
            thisMonth = date.getMonth();
        }
        if (thisMonth === 11) {
            year = thisYear + 1;
            nextMonth = '1';
        } else {
            year = thisYear;
            nextMonth = thisMonth + 2;
        }
        res = year + conn +
            (nextMonth > 9
                ? nextMonth
                : '0' + nextMonth) + conn + day;
        return res;
    },

    /**
     * 获取月的第1天
     * @param {String} yearMonth YYYY-mm
     * @return {Date} lastDayOfMonth 月最后一天日期对象
     */
    firstDayOfMonth: function (yearMonth) {
        var firstDayOfMonth = new Date(this.fixDate(yearMonth) + connector + '01' + zeroSec);
        return firstDayOfMonth;
    },

    /**
     * 获取当月最后一天的时间
     * @param {Date} date 日期
     * @return {Date} lastDayOfMonth 月最后一天日期对象
     */
    lastDayOfMonth: function (date) {
        // 获取下月1号的0秒时间字符串
        let nextMonthDay = new Date(this.nextMonth(date) + zeroSec);
        let lastDayOfMonth = new Date(nextMonthDay.getTime() - 1000);
        return lastDayOfMonth;
    },
    dayStartEnd: function (date, con) {
        // 201601300101 字符串日期格式
        // var date = '201612260928';
        con = con
            ? con
            : '';
        date = (date.length > 8) ? date : (date + '0001');
        var stringDay = date.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1/$2/$3 $4:$5');
        var todayYear = (new Date(stringDay)).getFullYear();
        var todayMonth = (new Date(stringDay)).getMonth() + 1;
        var todayDay = (new Date(stringDay)).getDate();

        // 起止日期数组
        var startStop = [];

        // 获得当天00点
        var currentDayStart = todayYear.toString() + con + ((todayMonth >= 10) ? todayMonth : ('0' + todayMonth)) + con +
                ((todayDay >= 10) ? todayDay : ('0' + todayDay)).toString() + (con ? ' 00:00' : '0000');
        // 获得当天24点
        var currentDayEnd = todayYear.toString() + con + ((todayMonth >= 10) ? todayMonth : ('0' + todayMonth)) + con +
                ((todayDay >= 10) ? todayDay : ('0' + todayDay)).toString() + (con ? ' 23:59' : '2359');
        // 添加至数组
        startStop.push(currentDayStart);
        startStop.push(currentDayEnd);
        return startStop;
    },
    // 201601300101 字符串日期格式
    dayStartEnd24: function (date) {
        var res = this.dayStartEnd(date);
        res[1] = res[1].replace('2359', '2400');
        return res;
    },
    // 201601300101 字符串日期格式
    weekStartEnd: function (date) {

        date = (date.length > 8) ? date : (date + '0100');
        var stringWeek = date.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1/$2/$3 $4:$5');
        // 起止日期数组
        var startStop = [];
        // 一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        // 获取当前时间
        var currentDate = new Date(stringWeek);
        // 相对于当前日期AddWeekCount个周的日期
        currentDate = new Date(currentDate.getTime() + (millisecond * 7));
        // 返回date是一周中的某一天
        var week = currentDate.getDay();
        // 返回date是一个月中的某一天
        // var month = currentDate.getDate();
        // 减去的天数
        var minusDay = week !== 0 ? week + 6 : 6;
        // 获得当前周的第一天
        var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay));
        // 获得当前周的最后一天
        var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
        // 添加至数组
        startStop.push(getDateStr3(currentWeekFirstDay));
        startStop.push(getDateStr3(currentWeekLastDay));
        return startStop;
    },
    // 返回输入日期的当周第1天（周一）和最后一天（周日）
    // 返回值精确到秒，形如： ['2017/09/11 00:00:00','2017/09/17 23:59:59']
    weekSecondStartEnd: function (date) {
        // 201601300101 字符串日期格式
        date = (date.length > 8) ? date : (date + '0100');
        var stringWeek;
        var currentDate;
        // 获取当前时间
        if (typeof date === 'object') {
            currentDate = date;
        } else if (typeof date === 'string') {
            if (date.indexOf('/') === -1 && date.indexOf('-') === -1) {
                // 201709120000
                stringWeek = date.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1/$2/$3 $4:$5');
            } else {
                // 2017-09-12 00:00:00
                stringWeek = date;
            }
            currentDate = new Date(stringWeek);
        } else {
            return ['', ''];
        }
        // 起止日期数组
        var startStop = [];
        // 一天的毫秒数
        var millisecond = 1000 * 60 * 60 * 24;
        // 相对于当前日期AddWeekCount个周的日期
        currentDate = new Date(currentDate.getTime() + (millisecond * 7));
        // 返回date是一周中的某一天
        var week = currentDate.getDay();
        // 返回date是一个月中的某一天
        // var month = currentDate.getDate();
        // 减去的天数
        var minusDay = week !== 0 ? week + 6 : 6;
        // 获得当前周的第一天
        var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay));
        // 获得当前周的最后一天
        var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
        // 添加至数组
        startStop.push(getDateStr3(currentWeekFirstDay) + ' 00:00:00');
        startStop.push(getDateStr3(currentWeekLastDay) + ' 23:59:59');
        return startStop;
    },
    // 获取当前月第一天和最后一天
    monthStartEnd: function (date, con) {
        con = con
            ? con
            : '';
        console.log(date);
        // 起止日期数组
        var startStop = [];
        date = (date.length > 8) ? date : (date + '0100');
        var stringMonth = date.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1/$2/$3 $4:$5');
        var currentDate = new Date(stringMonth);
        var year = currentDate.getFullYear();
        var month = currentDate.getMonth() + 1;


        var firstdate = (year.toString()) + con + ((month >= 10) ? month : ('0' + month)) + con + '01';
        var day = new Date(year, month, 0);
        var lastdate = (year.toString()) + con + ((month >= 10) ? month : ('0' + month)) + con + day.getDate();
        // 添加至数组
        startStop.push(firstdate, lastdate);
        console.log(startStop);
        return startStop;

    },
    // 获取当前月第一天
    monthStart: function (date) {
        date = (date.length > 8) ? date : (date + '0100');
        var stringMonth = date.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1/$2/$3 $4:$5');
        var currentDate = new Date(stringMonth);
        var moutbDate = new Date(currentDate);
        moutbDate.setDate(1);
        return this.YYmmdd(moutbDate);
    },
    // 2017-03-08 06:01:00 格式
    frontAddDays: function (dataStr, dayCount) {
        // 日期字符串
        // 把日期字符串转换成日期格式
        var isdate;
        isdate = typeof dataStr === 'string'
            ? new Date(this.fixDate(dataStr))
            : dataStr;
        // 减去一天
        isdate = new Date((isdate / 1000 - (86400 * dayCount)) * 1000);
        var pdate = isdate.getFullYear() + '-' + (pad((isdate.getMonth() + 1), 2)) + '-' + (pad(isdate.getDate(), 2)) + ' ' + (pad(isdate.getHours(), 2)) + ':' + (pad(isdate.getMinutes(), 2)) + ':' + (pad(isdate.getSeconds(), 2));
        return pdate;
    },
    afterAddDays: function (dataStr, dayCount) {
        // 日期字符串
        var strdate = dataStr;
        // 把日期字符串转换成日期格式
        var isdate = new Date(strdate.replace(/-/g, '/'));
        isdate = new Date((isdate / 1000 + (86400 * dayCount)) * 1000);
        var pdate = isdate.getFullYear() + '-' + (pad((isdate.getMonth() + 1), 2)) + '-' + (pad(isdate.getDate(), 2)) + ' ' + (pad(isdate.getHours(), 2)) + ':' + (pad(isdate.getMinutes(), 2)) + ':' + (pad(isdate.getSeconds(), 2));
        return pdate;
    },

    /* A-B做差 */
    disDays: function (dataStrA, dataStrB) {
        var strdateA = dataStrA;
        var isdateA = new Date(strdateA.replace(/-/g, '/'));
        var strdateB = dataStrB;

        var isdateB = new Date(strdateB.replace(/-/g, '/'));
        var isdate = new Date(isdateA - isdateB);
        var pdate = isdate.getFullYear() + '-' + (pad((isdate.getMonth() + 1), 2)) + '-' + (pad(isdate.getDate(), 2)) + ' ' + (pad(isdate.getHours(), 2)) + ':' + (pad(isdate.getMinutes(), 2)) + ':' + (pad(isdate.getSeconds(), 2));
        return pdate;
    },
    // 2个日期间相差的天数,结果向上取整
    difDays: function (start, end) {
        var startDay = null;
        var endDay = null;
        var temp = null;
        var oriToString = Object.prototype.toString;
        startDay = oriToString(start) === 'object Date' ? start : new Date(this.fixDate(start));
        endDay = oriToString(end) === 'object Date' ? end : new Date(this.fixDate(end));
        temp = endDay - startDay;
        return Math.ceil(temp / (1000 * 60 * 60 * 24));
    },
    // 返回时间差，1小时内的返回分钟数，24小时内的返回小时数，24小时以上的返回第一个参数(使用场景为消息推送的时间)
    difTime: function (start, end, formater) {
        var startTime = null;
        var endTime = null;
        var temp = null;
        var res = null;
        var oriToString = Object.prototype.toString;
        startTime = oriToString.call(start) === '[object Date]' ? start : new Date(this.fixDate(start));
        endTime = oriToString.call(end) === '[object Date]' ? end : new Date(this.fixDate(end));
        temp = parseInt((endTime - startTime) / (1000 * 60), 10);
        res = temp >= (24 * 60) ? (formater ? formater(startTime) : start) : temp > 60 ? parseInt(temp / 60, 10) + '小时前' : temp + '分钟前';
        return res;
    },
    // 给现有时间加上天数
    addDays: function (start, days) {
        var startDay = null;
        var res = null;
        if (Object.prototype.toString.call(start) === 'object Date') {
            startDay = start;
        } else {
            try {
                startDay = new Date(this.fixDate(start));
            } catch (e) {
                return 'type err of args[0]';
            }
        }
        if (typeof days !== 'number') {
            return 'type err of args[1]';
        }
        res = new Date(startDay.getTime() + days * 1000 * 60 * 60 * 24);
        return res;
    },

    /**
     * @param {Number} monthNum 月份数字，应是已加1后的月份，1-12
     * @return {String} 返回月份字符串，小于10则前面补0，
     */
    fixMonth: function (monthNum) {
        return monthNum < 10 ? '0' + monthNum : '' + monthNum;
    },
    fixDate: function (dateStr) {
        return typeof dateStr === 'string' ? dateStr.replace(/-/g, '/') : dateStr;
    },
    yesterday: function (date, shiftId) {
        var id = (shiftId && shiftId !== 0) ? parseInt(shiftId, 10) : shiftId;
        var dayString = '';
        switch (typeof (date) === 'string') {
            case true:
                var timeValue = date;
                var stringtime = timeValue.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1/$2/$3 $4:$5');
                var nowTime = new Date(stringtime);
                var yesterdsay = new Date(nowTime.getTime() - dayMillSecs);
                var year = yesterdsay.getYear() + 1900;
                var month = yesterdsay.getMonth() + 1;
                var day = yesterdsay.getDate();
                var hour = yesterdsay.getHours();
                var minutes = yesterdsay.getMinutes();
                var result;
                dayString = year.toString() + (month > 9 ? month : '0' + month) + (day > 9 ? day : '0' + day);
                switch (id) {
                    case 0:
                        // 最近24h
                        result = dayString + (hour > 9 ? hour : '0' + hour) + (minutes > 9 ? minutes : '0' + minutes);
                        break;
                    case 1:
                        // 0~24点
                        result = dayString + '0000';
                        break;
                    case 2:
                        // 白班，6:30
                        result = dayString + '0630';
                        break;
                    case 3:
                        // 夜班，18:30
                        result = dayString + '1830';
                        break;
                    default:
                        // result = dayString + (hour > 9 ? hour : '0' + hour) + (minutes > 9 ? minutes : '0' + minutes);
                        result = dayString + (hour > 9 ? hour : '0' + hour) + (minutes > 9 ? minutes : '0' + minutes);
                }
                return result;
            case false:
                var today = date ? date : new Date();
                yesterdsay = new Date(today.getTime() - dayMillSecs);
                year = yesterdsay.getYear() + 1900;
                month = yesterdsay.getMonth() + 1;
                day = yesterdsay.getDate();
                hour = yesterdsay.getHours();
                minutes = yesterdsay.getMinutes();

                // result = year.toString() + (month > 9 ? month : '0' + month) + (day > 9 ? day : '0' + day) + (hour > 9 ? hour : '0' + hour) + (minutes > 9 ? minutes : '0' + minutes);
                result = year.toString() + (month > 9 ? month : '0' + month) + (day > 9 ? day : '0' + day) + (hour > 9 ? hour : '0' + hour) +
                   (minutes > 9 ? minutes : '0' + minutes);
                return result;
            default:
                return '';
        }
    },
    yesterdayplus: function (date) {
        var result;
        switch (typeof (date) === 'string') {
            case true:
                var timeValue = date;
                var stringtime = timeValue.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1/$2/$3 $4:$5');
                var nowTime = new Date(stringtime);

                return getDateStr(nowTime, -1);
            case false:
                var today = date ? date : new Date();
                var yesterdsay = new Date(today.getTime() - dayMillSecs);
                var year = yesterdsay.getYear() + 1900;
                var month = yesterdsay.getMonth() + 1;
                var day = yesterdsay.getDate();
                var hour = yesterdsay.getHours();
                // var minutes = yesterdsay.getMinutes();
                result = year.toString() + (month > 9 ? month : '0' + month) + (day > 9 ? day : '0' + day) + (hour > 9 ? hour : '0' + hour) + '00';
                return result;
            default:
                return '';
        }
    },
    tomorrow: function (date, shiftId) {
        var id = (shiftId && shiftId !== 0) ? parseInt(shiftId, 10) : shiftId;
        var dayString = '';
        var timeValue = date;
        var stringtime;
        var nowTime;
        var today;
        var yesterdsay;
        var year;
        var month;
        var day;
        var hour;
        var minutes;
        var result;
        switch (typeof (date) === 'string') {
            case true:
                timeValue = date;
                stringtime = timeValue.replace(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})$/, '$1/$2/$3 $4:$5');
                nowTime = new Date(stringtime);
                today = date ? date : new Date();
                yesterdsay = new Date(nowTime.getTime() + dayMillSecs);
                year = yesterdsay.getYear() + 1900;
                month = yesterdsay.getMonth() + 1;
                day = yesterdsay.getDate();
                hour = yesterdsay.getHours();
                minutes = yesterdsay.getMinutes();
                dayString = year.toString() + (month > 9 ? month : '0' + month) + (day > 9 ? day : '0' + day);
                switch (id) {
                    case 0:
                        // 最近24h
                        result = dayString + (hour > 9 ? hour : '0' + hour) + (minutes > 9 ? minutes : '0' + minutes);
                        break;
                    case 1:
                        // 0~24点
                        result = dayString + '0000';
                        break;
                    case 2:
                        // 白班，6:30
                        result = dayString + '0630';
                        break;
                    case 3:
                        // 夜班，18:30
                        result = dayString + '1830';
                        break;
                    default:
                        result = dayString + (hour > 9 ? hour : '0' + hour) + (minutes > 9 ? minutes : '0' + minutes);
                }
                return result;
            case false:
                today = date ? date : new Date();
                yesterdsay = new Date(today.getTime() + dayMillSecs);
                year = yesterdsay.getYear() + 1900;
                month = yesterdsay.getMonth() + 1;
                day = yesterdsay.getDate();
                hour = yesterdsay.getHours();
                minutes = yesterdsay.getMinutes();
                result = year.toString() + (month > 9 ? month : '0' + month) + (day > 9 ? day : '0' + day) + (hour > 9 ? hour : '0' + hour) + (minutes > 9 ? minutes : '0' + minutes);
                return result;
            default:
                return '';
        }
    },
    /* 将subtime格式如 201708181450 转成0点开始的时间格式 201708180000 用于api调用*/
    allDay: function (subtime) {
        var result = subtime;
        if (typeof subtime === 'string' && subtime.length > 7) {
            result = subtime.substr(0, 8) + '0000';
        }
        return result;
    },
    dayShift: function (subtime) {
        var result = subtime;
        if (typeof subtime === 'string' && subtime.length > 7) {
            result = subtime.substr(0, 8) + '0630';
        }
        return result;
    },
    neightShift: function (subtime) {
        var result = subtime;
        if (typeof subtime === 'string' && subtime.length > 7) {
            result = subtime.substr(0, 8) + '1830';
        }
        return result;
    },
    sub: function (time) {
        var nowTime = new Date();
        var oldTime = new Date(Date.parse(time.replace(/-/g, '/')));
        oldTime = oldTime.getTime();
        var HourMsec = nowTime - oldTime;
        var hour = Math.floor(HourMsec / 3600000);
        return hour;
    },
    set: function (time) {
        time = time.replace(/\//g, ':').replace(/-/g, ':').replace(' ', ':');
        time = time.split(':');
        var timeData = time[1] + '-' + time[2] + ' ' + time[3] + ':' + time[4];
        return timeData;
    },

    /**
     * 获取指定日期到n天的时间，如果指定日期是周一，要获取到7天内的数据，最后的截止日期是6天后的 'YYYY/mm/dd' + ' 23:59:59'
     * @param {Date} date 日期对象
     * @param {Number} days 范围天数
     * @returns {String} 截止日期字符串
     */
    prevDay: function (date, days) {
        let day;
        let res;
        day = new Date(date.getTime() + (dayMillSecs * (days - 1)));
        res = new Date(this.YYmmdd(day, connector) + lastSec);
        return res;
    },

    /**
     * 以一周的第1天为基准获取某月中的周数及所有周的起始日期，第1天的设置可更改，以周一为一周的第1天为准进行说明：
     * 从月的第1天搜索（最多搜索7天）直到匹配到周1，以此日开始循环获取7天时间，循环开始时检测周1是否还在该月范围内，最后一周可能包括下个月的开始几天。
     * @param {String} yearMonth 年月，YYYY-mm
     * @param {Number} weekStartDay 以星期几为1周的开始，默认为星期1
     * @param {Number} weekDays 1周天数
     * @returns {array} 数组，[{startDate: 'YYYY-mm-dd 00:00:00', endDate: 'YYYY-mm-dd 23:59:59'},
     *                        {startDate: 'YYYY-mm-dd 00:00:00', endDate: 'YYYY-mm-dd 23:59:59'},
     *                        {startDate: 'YYYY-mm-dd 00:00:00', endDate: 'YYYY-mm-dd 23:59:59'},
     *                        {startDate: 'YYYY-mm-dd 00:00:00', endDate: 'YYYY-mm-dd 23:59:59'}]
     */
    getMonthWeeksByDay: function (yearMonth, weekStartDay, weekDays) {
        let result = [];
        let endFlag = false;
        // let weekIndex = 0;
        // 周的第1天从周几开始计算,默认周1
        weekStartDay = window.projInit && window.projInit.weekStartDay || 1;
        // 一周有几天
        weekDays = window.projInit && window.projInit.weekDays || 7;
        // 月第1天
        let monthStartDay = new Date(this.fixDate(yearMonth) + '/01' + zeroSec);
        // 月第1天是星期几
        let monthStartDayIndex = monthStartDay.getDay();
        let i = 0;
        let month = monthStartDay.getMonth();
        // debugger;
        for (; i < weekDays; i++) {
            if (((monthStartDayIndex + i) % weekDays) === weekStartDay) {
                break;
            }
            monthStartDay.setDate(i + 2);
        }
        // 获取第1周的开始日期
        // let weekFirstDay = this.addDays(monthStartDay, weekDays);
        let weekFirstDay = monthStartDay;
        let weekLastDay;
        let index = 1;
        while (!endFlag) {
            // 循环计算周起止日期并推入结果
            weekLastDay = this.prevDay(weekFirstDay, weekDays);
            result.push({name: '第' + index + '周', startDate: this.YYmmddhhmmss(weekFirstDay), endDate: this.YYmmddhhmmss(weekLastDay)});
            index++;
            // 将周起始日后移
            weekFirstDay = this.addDays(weekFirstDay, weekDays);
            // 检测是否超出月范围

            if (weekFirstDay.getMonth() !== month) {
                endFlag = true;
            }
        }
        return result;
    },

    /**
     * 以月的第1天为基准获取某月中的周数及所有周的起始日期，只要月的起止日期所在周都包含到结果中，如4月1日为周日，则第1周的范围是从3月26日 00:00:00 - 4月1日 23:59:59
     * @param {String} yearMonth 年月，YYYY-mm
     * @param {Number} weekStartDay 以星期几为1周的开始，默认为星期1
     * @param {Number} weekDays 1周天数
     * @returns {array} 数组，[{startDate: 'YYYY-mm-dd 00:00:00', endDate: 'YYYY-mm-dd 23:59:59'},
     *                        {startDate: 'YYYY-mm-dd 00:00:00', endDate: 'YYYY-mm-dd 23:59:59'},
     *                        {startDate: 'YYYY-mm-dd 00:00:00', endDate: 'YYYY-mm-dd 23:59:59'},
     *                        {startDate: 'YYYY-mm-dd 00:00:00', endDate: 'YYYY-mm-dd 23:59:59'}]
     */
    getMonthWeeksByDate: function (yearMonth, weekStartDay, weekDays) {
        let result = [];
        let endFlag = false;
        // let weekIndex = 0;
        // 周一从第几天开始计算
        weekStartDay = weekStartDay || natureWeekStartDay;
        // 一周有几天
        weekDays = weekDays || natureWeekDays;
        // 月第1天
        let monthStartDay = new Date(this.fixDate(yearMonth) + '/01' + zeroSec);
        // 月第1天是星期几
        let monthStartDayIndex = monthStartDay.getDay();
        // 0为周日
        monthStartDayIndex === 0
            ? monthStartDayIndex = 7
            : ++monthStartDayIndex;
        // 月最后一天
        let lastDayOfMonth = this.lastDayOfMonth(monthStartDay);

        let diff = weekStartDay - monthStartDayIndex;
        // 获取第1周的开始日期
        let weekFirstDay = this.addDays(monthStartDay, diff);
        let weekLastDay;
        let index = 1;
        while (!endFlag) {
            // 循环计算周起止日期并推入结果
            weekLastDay = this.prevDay(weekFirstDay, weekDays);
            result.push({name: '第' + index + '周', startDate: this.YYmmddhhmmss(weekFirstDay), endDate: this.YYmmddhhmmss(weekLastDay)});
            index++;
            // 检测是否超出月范围
            if (weekLastDay.getMonth() !== lastDayOfMonth.getMonth() || weekLastDay.getDate() >= lastDayOfMonth.getDate()) {
                endFlag = true;
            } else {
                // 重新设定weekFirstDay
                weekFirstDay = this.addDays(weekFirstDay, natureWeekDays);
            }
        }
        return result;
    },

    /**
     * 获取年的第一天至最后一天的时间范围字符串，精确到秒
     * @param {String} val 年，YYYY或Date对象
     * @param {String | undefined} con 连接符
     * @return {Array} res,[start, end]
     */
    yearRange: function (val, con) {
        let year = null;
        let nextYear = null;
        let res = null;
        con = con || '';
        if (methods.getType(val) === 'string' && val.length > 3) {
            // '2018'
            year = val.substr(0, 4);
        } else if (methods.getType(val) === 'date') {
            // Date对象
            year = val.getFullYear();
        }
        if (year) {
            nextYear = parseInt(year, 10) + 1;
            let startDay = new Date(year + '/01/01');
            let endDay = new Date(new Date(nextYear + '/01/01 00:00:00').getTime() - 1000);
            let start = this.YYmmdd000000(startDay, con);
            let end = this.YYmmdd235959(endDay, con);
            res = {
                startDate: start,
                endDate: end
            };
        }
        return res;
    },

    /**
     * 获取月的第一天至最后一天的时间范围字符串，精确到秒
     * @param {String} val 年，YYYY-mm或Date对象
     * @param {String | undefined} con 连接符
     * @return {Array} res,[start, end]
     */
    monthRange: function (val, con) {
        let start = null;
        let end = null;
        let res = null;
        con = con || '';
        let type = methods.getType(val);
        console.log('val');
        console.log(val);
        if (type === 'string' && val.length > 6) {
            // '2018-04'
            // start = new Date(val.substr(0, 6) + '01');
            start = this.firstDayOfMonth(val, con);
            end = this.lastDayOfMonth(new Date(this.fixDate(val) + '/01'));
        } else if (type === 'date') {
            // Date对象
            start = this.firstDayOfMonth(val.getFullYear() + '/' + this.fixMonth(val.getMonth() + 1));
            end = this.lastDayOfMonth(val, con);
        }
        if (start && end) {
            res = {
                startDate: this.YYmmdd000000(start, con),
                endDate: this.YYmmdd235959(end, con)
            };
        }
        return res;
    },

    /**
     * 获取当天的时间范围，精确到秒
     * @param {String} val 年，YYYY-mm-dd或Date对象
     * @param {String | undefined} con 连接符
     * @return {Array} res,[start, end]
     */
    dayRange: function (val, con) {
        con = con || '';
        if (methods.getType(val) === 'string') {
            val = new Date(val);
        }
        let res = {
            startDate: this.YYmmdd000000(val, con),
            endDate: this.YYmmdd235959(val, con)
        };
        return res;
    },

    /**
     * 自定义格式范围
     * @param {Array} valArr 范围时间字符串数组,形如['YYYY-MM-dd', 'YYYY-MM-dd']
     * @param {String | undefined} con 连接符
     * @return {Array} res,[start, end]
     */
    customRange: function (valArr, con) {
        // 获取起止日期
        let res = {};
        if (valArr.length) {
            let start = valArr[0]
                                ? this.YYmmdd000000(new Date(valArr[0]), con)
                                : '';
            let end = valArr[1]
                                ? this.YYmmdd235959(new Date(valArr[1]), con)
                                : '';
            res.startDate = start;
            res.endDate = end;
        }
        return res;
    }
};
export default dateService;

