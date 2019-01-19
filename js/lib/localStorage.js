var myLocalStorage = function () {
    var t = function () {
        try {
            var e = "localStorage" in window;
            return e && (localStorage.setItem("mystorage", ""), localStorage.removeItem("mystorage")), e
        } catch (t) {
            return !1
        }
    }();
    return {
        setItem: function (e) {
            if (t) {
                var r = {value: e.value};
                e.ttl && (r.expire = +new Date + 1e3 * e.ttl), localStorage.setItem(e.key, JSON.stringify(r))
            }
        }, getItem: function (e) {
            var r = null;
            if (t)try {
                var o = JSON.parse(localStorage.getItem(e));
                null === o ? r = null : o.expire && o.expire < +new Date ? (this.removeItem(e), r = null) : r = o.value
            } catch (l) {
                console.log("getItem:" + l)
            }
            return r
        }, removeItem: function (e) {
            t && localStorage.removeItem(e)
        }, isSupportLs: t
    }
};