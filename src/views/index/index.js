import $                from 'jquery'
import Http             from '../../assets/lib/http'
import Toast            from '../../assets/lib/toast'

// 列表控制器
const ListController = {
    init () {
        this.getParamsByUrl();
        this.addEvent();
    },
    getParamsByUrl () {
        let str = location.search.substring(location.search.indexOf('?'));
        let obj = {};
        if (!str) return this.params = obj;
        let ary = str.substr(1).split('&');
        ary.forEach((item) => {
            let subAry = item.split('=');
            obj[subAry[0]] = decodeURIComponent(subAry[1]);
        });
        this.params = obj;
        console.log(this.params);
        $('#strong').text(this.params.bannerName);
    },
    addEvent() {
        $('#from').on('click', '.from-code', this.sendCode.bind(this))
            .on('click', '.from-button', this.applyCreditCard.bind(this))
    },
    sendCode () {
        let type = $('.from-code').hasClass('from-code-disabled');
        if (type) return;
        let applyMobile = $('#phone').val();
        if (!applyMobile) return Toast.msg('请输入手机号');
        if (!/^1\d{10}$/.test(applyMobile)) return Toast.msg('请输入正确的手机号');
        Toast.show('loading');
        let options = {
            url: 'exchange/creditcard/v1/smsSend',
            loading: '加载中...',
            data: {
                applyMobile
            }
        };
        Http(options).then((data) => {
            let {errMsg, result, success} = data;
            if (!success) throw errMsg;
            $('.from-code').addClass('from-code-disabled');
            Toast.msg('发送验证码成功');
            this.countDown();
        }).catch((err) => {
            Toast.msg(err);
        }).finally(() => {
            Toast.hide();
        })
    },
    countDown(time = 60) {
        let $el = $('.from-code span');
        $el.text(`${time} s`);
        time--;
        if (time <= 1) {
            $('.from-code').removeClass('from-code-disabled');
            return $el.text('获取');
        }
        setTimeout(() => {
            this.countDown(time);
        }, 1000)
    },
    applyCreditCard () {
        let applyUserName = $('#name').val();
        let applyMobile = $('#phone').val();
        // let applyIdCard = $('#card').val();
        let smsCode = $('#code').val();
        if (!applyUserName) return Toast.msg('请输入申请人');
        // if (!applyIdCard) return Toast.msg('请输入身份证号');
        // if (!/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(applyIdCard)) return Toast.msg('请输入正确的身份证号');
        if (!applyMobile) return Toast.msg('请输入手机号');
        if (!/^1\d{10}$/.test(applyMobile)) return Toast.msg('请输入正确的手机号');
        if (!smsCode) return Toast.msg('请输入验证码');
        let options = {
            url: 'exchange/creditcard/v1/apply',
            loading: '加载中...',
            data: {
                refereeUserNo: this.params.refereeUserNo,
                applyUserName,
                applyMobile,
                applyIdCard: '',
                bannerNo: this.params.bannerNo,
                applyType: 'RECOMMEND',
                smsCode,
            }
        };
        Http(options).then((data) => {
            let {errMsg, result, success} = data;
            if (!success) throw errMsg;
            $('#name').val('');
            $('#phone').val('');
            $('#card').val('');
            $('#code').val('');
            window.open(this.params.linkUrl, '_self')
        }).catch((err) => {
            Toast.msg(err);
        })
    },
};
ListController.init();
