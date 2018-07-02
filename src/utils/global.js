/**
 *
 * @returns {{append: append, clear: clear}}
 * @constructor
 */
function Interval(){
    var insterval = 0,allData = {};
    function append(key, fun,time){
        if(time||time==0){
            var newtime=(+time)
            allData[key] = {"callBack" : fun,"time":newtime};
        }else{
            allData[key] = {"callBack" : fun};
        }
        create();
    }
    function create(){
        if(!insterval){
            insterval = setInterval(function(){
                for(var key in allData){
                    if(allData[key]){
                        if(allData[key].time!=undefined){
                            var timedom = allData[key].time;
                            var totumin = timedom%3600;
                            var hour = parseInt(timedom/3600);
                            var min = parseInt(totumin/60);
                            var second = totumin%60;
                            typeof allData[key].callBack=="function"  && allData[key].callBack(second,min,hour);
                            allData[key].time--;
                            if(allData[key].time<0){
                                clear(key)
                            }
                        }else{
                            typeof allData[key].callBack=="function"  && allData[key].callBack();
                        }
                    }
                }
            }, 1000);
        }
    }
    function clear(name){ //
        clearInterval(insterval);
        insterval = 0;
        if(name){
            delete allData[name];
            for(var key in allData){
                if(allData[key]){
                    create();
                }
            }
        }else{
            allData = {};
        }
    }
    return {
        "append" : append,
        "clear" : clear
    }
}

/**
 *
 */
class WPT{
    /**
     * 千元以上加上 ‘，’
     * @param n
     * @returns {string}
     */
    thousandPar(n){
        var ns = n.toString();
        var mm = ns.match(/\d{1,3}(?=(\d{3})+$)/g);
        if (mm == null) return ns;
        mm.push(ns.replace(mm.join(""), ""));
        return mm.join(",");
    }

    /**
     * 处理金额,保留两位小数
     * @param x
     * @returns {*}
     */
    dealPrice(x){
        var f_x = parseFloat(x);
        if (isNaN(f_x)) {
            return false;
        }
        var f_x = Math.round(x * 100) / 100;
        var s_x = f_x.toString();
        var pos_decimal = s_x.indexOf('.');
        if (pos_decimal < 0) {
            pos_decimal = s_x.length;
            s_x += '.';
        }
        while (s_x.length <= pos_decimal + 2) {
            s_x += '0';
        }
        var s_x_arr = s_x.split('.');
        var s_x_arr_one =s_x_arr[0];
        s_x_arr[0] = this.thousandPar(s_x_arr_one);
        var s_x_s = s_x_arr.join('.')
        return s_x_s;
    }

    /**
     * 转化时间戳
     * @param time
     * @returns {{year: String, month: *, day: *, hour: *, min: *, second: *}}
     */
    timeStamp(time){
        var jstime = parseInt(time)*1000;
        var realtime = new Date(jstime);

        return {
            year:new String(realtime.getFullYear()),
            month:(realtime.getMonth()+1)<10?'0'+(realtime.getMonth()+1):(realtime.getMonth()+1),
            day:realtime.getDate()<10?'0'+realtime.getDate():realtime.getDate(),
            hour:realtime.getHours()<10?'0'+realtime.getHours():realtime.getHours(),
            min:realtime.getMinutes()<10?'0'+realtime.getMinutes():realtime.getMinutes(),
            second:realtime.getSeconds()<10?'0'+realtime.getSeconds():realtime.getSeconds()
        }
    }

}
WPT.Interval = Interval()
export default WPT
