

/**
 * 深度merge对象
 * https://github.com/xiongwilee/koa-grace
 *
 *
 * @param  {object} dest 要merge到的对象
 * @param  {object} src  要从这个对象merge
 * @return {object}      merge后的对象
 */
exports.merge = function merge (dest, src) {
    function isLast(obj) {
        if (Object.prototype.toString.call(obj) == '[object Object]') {
            let ret = false;
            for (var key in obj) {
                ret = obj.key === undefined ? ret : true;
            }
            return ret;
        } else {
            return true;
        }
    }

    function update(obj, key, last, value) {
        let keys = key.split('.');
        let now = obj;
        keys.forEach(item => {
            now = now[item]
        });
        now[last] = value
    }

    let index = -1;
    let lines = [{
        old: dest,
        obj: src,
        key: ''
    }];

    if (isLast(src)) return dest;

    while (index < lines.length - 1) {
        index ++;
        let item = lines[index];
        for (var k in item.obj) {
            if (isLast(item.obj[k]) || item.old[k] === undefined) {
                update(dest, item.key, k, item.obj[k]);
            } else {
                lines.push({
                    old: item.old[k],
                    obj: item.obj[k],
                    key: item.key + (item.key ? '.' : '') + k
                })
            }
        }
    }

    return dest
};

