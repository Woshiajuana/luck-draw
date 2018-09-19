import $                from 'jquery'
import Toast            from './toast'
import Config           from 'config/env.config'
function Http (options) {
    this.method = options.method || 'post';
    this.data = {
        reqBody: options.reqBody,
        reqHeader: {},
    };
    this.url = Config.API_URL + options.url;
    return this[this.method]();
}

Http.prototype.post = function () {
    return new Promise((resolve, reject) => {
        console.log(this.url + '请求 => ', this.data);
        $.ajax({
            type: 'POST',
            timeout: 60 * 1000,
            url: this.url,
            data: JSON.stringify(this.data),
            contentType: "application/json; charset=utf-8",
            dataType: 'json',
            success: (response) => {
                resolve(response);
            },
            error: (err) => {
                reject(err);
            }
        })
    });
};

export default (options) => {
    let {loading} = options;
    if (loading) Toast.show(loading);
    return new Http(options).finally(() => {
        loading && Toast.hide();
    });
}
