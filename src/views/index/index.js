import $                from 'jquery'
import Http             from '../../assets/lib/http'
import Toast            from '../../assets/lib/toast'
import Stars            from '../../assets/lib/Star'
import Meteor           from '../../assets/lib/Meteor'
import Moon           from '../../assets/lib/Moon'


const CanvasController = {
    init () {
        let canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d'),
            width = window.innerWidth,
            height = window.innerHeight,
            moon = new Moon(ctx, width, height),
            stars = new Stars(ctx, width, height, 100),
            meteors = [],
            count = 0;
        canvas.width = width;
        canvas.height = height;
        const meteorGenerator = ()=> {
            let x = Math.random() * width + 200;
            if (meteors.length < 1) meteors.push(new Meteor(ctx, x, height));
            setTimeout(()=> {
                meteorGenerator()
            }, Math.random() * 6000)
        };
        const frame = ()=> {
            count++;
            count % 10 === 0 && stars.blink();
            moon.draw();
            stars.draw();
            meteors.forEach((meteor, index, arr)=> {
                if (meteor.flow()) {
                    meteor.draw()
                } else {
                    arr.splice(index, 1)
                }
            });
            requestAnimationFrame(frame)
        };
        meteorGenerator();
        frame()
    }
};
CanvasController.init();

const Prize = {
    init () {
        this.addEvent();
    },
    addEvent() {
        $('body')
            .on('click', '.from-code', this.handleSend.bind(this))
            .on('click', '.from-button', this.handleCheck.bind(this))
            .on('click', '.prize-btn', this.handleLottery.bind(this))
    },
    handleLottery () {
        let options = {
            url: 'drawLottery',
            loading: '加载中...',
            reqBody: {
                mobileNo: this.mobileNo,
                identityID: this.identityID,
                appUser: 'jf',
            }
        };
        Http(options).then((res) => {
            res = res || {};
            let { respBody, respHeader } = res;
            if (!respHeader) throw '请求失败';
            let { respCode, respMessage } = respHeader;
            if (respCode !== '0000') throw respMessage;
            console.log(respBody)
            let value = respBody.value || 0;
            $('.prize-wrap').addClass('hidden');
            $('.result').removeClass('hidden');
            $('.amount-num').text('￥' + value / 100);
        }).catch((err) => {
            Toast.msg(err);
        })
    },
    handleCheck () {
        let userName = $('#name').val();
        let mobileNo = $('#phone').val();
        let identityID = $('#card').val();
        let validateCode = $('#code').val();
        if (!userName)
            return Toast.msg('请输入申请人');
        if (!identityID)
            return Toast.msg('请输入身份证号');
        if (!/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(identityID))
            return Toast.msg('请输入正确的身份证号');
        if (!mobileNo)
            return Toast.msg('请输入手机号');
        if (!/^1\d{10}$/.test(mobileNo))
            return Toast.msg('请输入正确的手机号');
        if (!validateCode)
            return Toast.msg('请输入验证码');
        let options = {
            url: 'login',
            loading: '加载中...',
            reqBody: {
                userName,
                mobileNo,
                validateCode,
                identityID,
                appUser: 'jf',
            }
        };
        Http(options).then((res) => {
            res = res || {};
            let { respBody, respHeader } = res;
            if (!respHeader) throw '请求失败';
            let { respCode, respMessage } = respHeader;
            if (respCode !== '0000') throw respMessage;
            this.mobileNo = mobileNo;
            this.identityID = identityID;
            $('#name').val('');
            $('#phone').val('');
            $('#card').val('');
            $('#code').val('');
            console.log(respBody)
            if (!respBody) {
                $('.from-wrap').addClass('hidden');
                $('.prize-wrap').removeClass('hidden');
            } else {
                let value = respBody.value || 0;
                $('.from-wrap').addClass('hidden');
                $('.result').removeClass('hidden');
                $('.amount-num').text('￥' + value / 100);
            }
        }).catch((err) => {
            Toast.msg(err);
        })
    },
    handleSend () {
        let type = $('.from-code').hasClass('from-code-disabled');
        if (type) return;
        let mobileNo = $('#phone').val();
        let identityID = $('#card').val();
        if (!mobileNo) return Toast.msg('请输入手机号');
        if (!/^1\d{10}$/.test(mobileNo)) return Toast.msg('请输入正确的手机号');
        if (!identityID)
            return Toast.msg('请输入身份证号');
        if (!/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/.test(identityID))
            return Toast.msg('请输入正确的身份证号');
        Toast.show('loading');
        let options = {
            url: 'sendMsg',
            loading: '加载中...',
            reqBody: {
                mobileNo,
                appUser: 'jf',
                identityID,
            }
        };
        Http(options).then((res) => {
            res = res || {};
            let { respBody, respHeader } = res;
            if (!respHeader) throw '请求失败';
            let { respCode, respMessage } = respHeader;
            if (respCode !== '0000') throw respMessage;
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
};

Prize.init();

