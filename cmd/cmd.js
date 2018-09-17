
import copy          from './copy.cmd'
import release       from './release.cmd'
const parameters = process.argv.splice(2);

const arr = [
    copy,
    release,
];

(function fireFun(index) {
    arr[index] && arr[index](parameters).then(() => {
        return fireFun(++index);
    })
})(0);
