import $                from 'jquery'
import Swiper           from 'swiper'
import Http             from '../../assets/lib/http'
import Toast            from '../../assets/lib/toast'

// 列表控制器
const ListController = {
    init () {
        this.getParamsByUrl();
        this.fetchBannerList();
        this.fetchCreditCardList();
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
    },
    addEvent() {
        let _that = this;
        $('#swiper-wrapper').on('click', '.swiper-slide', function () {
            _that.handleClick($(this))
        });
        $('#list').on('click', '.item', function () {
            _that.handleClick($(this))
        });
    },
    handleClick($el) {
        let bannerNo = $el.data('no');
        let linkUrl = $el.data('url');
        let bannerName = $el.data('name');
        let refereeUserNo = this.params.refereeUserNo;
        if (!linkUrl) return;
        window.open(`./verification.html?bannerNo=${encodeURIComponent(bannerNo)}&linkUrl=${encodeURIComponent(linkUrl)}&bannerName=${encodeURIComponent(bannerName)}&refereeUserNo=${refereeUserNo}`,'_self')
    },
    fetchBannerList () {
        let options = {
            url: 'exchange/creditcard/v1/banner',
            loading: '加载中...',
            data: {
                pageIndex: '1',
                count: '99',
                bannerGroup: 'WXCREDITCARDBANNER',
            }
        };
        Http(options).then((data) => {
            let {errMsg, result, success} = data;
            if (!success) throw errMsg;
            let arr = result || [];
            let html = '';
            arr.forEach((item) => {
                let {
                    bannerName,
                    bannerNo,
                    iconPath,
                    linkUrl,
                } = item;
                html += `<div class="swiper-slide" data-no="${bannerNo}" data-url="${linkUrl}" data-name="${bannerName}">
                    <img src="${iconPath}" alt="${bannerName}">
                </div>`
            });
            $('#swiper-wrapper').html(html);
            this.sWiperStart();
        }).catch((err) => {
            Toast.msg(err);
        })
    },
    fetchCreditCardList () {
        let options = {
            url: 'exchange/creditcard/v1/banner',
            loading: '加载中...',
            data: {
                pageIndex: '1',
                count: '99',
                bannerGroup: 'RECOMMEND',
            }
        };
        Http(options).then((data) => {
            let {errMsg, result, success} = data;
            if (!success) throw errMsg;
            let arr = result || [];
            let html = '';
            arr.forEach((item) => {
                let {
                    bannerName,
                    bannerNo,
                    iconPath,
                    linkUrl,
                } = item;
                html += `<li class="item" data-no="${bannerNo}" data-url="${linkUrl}" data-name="${bannerName}">
                        <img class="icon" src="${iconPath}" alt="${bannerName}">
                        <span class="name">${bannerName}</span>
                </li>`
            });
            $('#list').html(html);
        }).catch((err) => {
            Toast.msg(err);
        })
    },
    sWiperStart () {
        // 轮播图
        new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 0,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });
    }
};
ListController.init();

