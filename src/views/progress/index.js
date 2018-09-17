import $                from 'jquery'
import Http             from '../../assets/lib/http'
import Toast            from '../../assets/lib/toast'

// 列表控制器
const ListController = {
    init () {
        this.fetchCreditCardProgressList();
    },
    fetchCreditCardProgressList () {
        let options = {
            url: 'exchange/creditcard/v1/banner',
            loading: '加载中...',
            data: {
                pageIndex: '1',
                count: '99',
                bannerGroup: 'CREDITCARDSPEEDQ',
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
                html += `<li class="item">
                    <a href="${linkUrl}">
                        <img class="icon" src="${iconPath}" alt="${bannerName}">
                        <span class="name">${bannerName}</span>
                    </a>
                </li>`
            });
            $('#list').html(html);
        }).catch((err) => {
            Toast.msg(err);
        })
    },
};
ListController.init();
