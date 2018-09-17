import $                from 'jquery'

export default {
    show () {
        let html = `<div class="pop-wrap"><span class="pop-icon"></span></div>`;
        $('body').append(html);
    },
    hide() {
        $('.pop-wrap').remove();
    },
    msg (text) {
        let html = `<div class="pop-msg-wrap"><span class="pop-prompt">${text}</span></div>`;
        $('body').append(html);
        setTimeout(() => {
            $('.pop-msg-wrap').remove();
        }, 2000);
    }
}
