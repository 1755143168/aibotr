
import md5 from 'crypto-js/md5'
import sha256 from 'crypto-js/sha256'
import moment from 'moment'

const app_info = {
    APPID: '1574835326096',
    SECRET_KEY : 'W0qJeOCigr6iKVUNcTbN7TfK3geJ31TD'
}  
const signature = (timestamp,nonce,signtype = 'MD5') => {
    let preSignStr='APPID='+app_info.APPID+'&NONCE='+nonce+'&SIGNTYPE='+signtype+'&TIMESTAMP='+timestamp+'&SECRET_KEY='+app_info.SECRET_KEY
    // debugger
    if(signtype==='SHA256'){
        return sha256(preSignStr).toString().toUpperCase()
    }
    return md5(preSignStr).toString().toUpperCase()
}

const getTimeStamp = ()=>{
    let time = moment(new Date()).format('YYYYMMDDHHmmss')
    return time
}

const str16 = () => _supplyFunc(_randStr(), 16);
const _randStr = () => Math.random().toString(36).substr(2);
const _supplyFunc = (str, len) => {
    if(str.length > len) return str.substr(0, len);
    if(str.length < len) return _supplyFunc(str + _randStr(), len);
    return str;
}

Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,(this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o) if (new RegExp("(" + k + ")").test(format))format = format.replace(RegExp.$1,RegExp.$1.length == 1 ? o[k] :("00" + o[k]).substr(("" + o[k]).length));
    return format;
}

export{signature,getTimeStamp,app_info,str16}