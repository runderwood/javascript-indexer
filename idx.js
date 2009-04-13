indexer = function(lol, o) {
    for(var i=0, lst=[]; i<lol.length; lst[i] = lol[i++]);
    this.list = lst;
    var o = o || {};
    this.config = {};
    for(k in o) this.config[k] = o[k];
    this._idx = this.index(this.list);
}
indexer.prototype = {
    'index': function(lol) {
        var idx = {};
        while(lol.length) {
            var v = lol.shift();
            var k = v.shift();
            var str = k.toLowerCase().replace(/[\W&\.]+/, ' ').split(' ');
            while(str.length) {
                var s = str.shift();
                var ctx = idx; 
                for(c in s) {
                    if(!ctx[s.charAt(c)]) ctx[s.charAt(c)] = {};
                    ctx = ctx[s.charAt(c)];
                }
                if(!ctx.__v) ctx.__v = [];
                ctx.__v.push(v);
            }
        }
        return idx;
    },
    'get_vals': function(idx) {
        var vals = idx.__v ? idx.__v : [];
        for(k in idx) {
            if(k != '__v') {
                vals = vals.concat(this.get_vals(idx[k]));
            }
        }
        return vals;
    },
    'search': function() {
        var str = [];
        for(var s=0; s<arguments.length; str.push(arguments[s++]));
        var idx = this._idx;
        var h = [];
        for(var s in str) {
            var ctx = idx;
            var c = 0;
            var str_ = str[s];
            while(c < str_.length) {
                ctx = ctx[str_.charAt(c++)];
                if(!ctx) return h;
            }
            if(ctx.__v) {
                h = h.concat(ctx.__v);
            }
            h = h.concat(this.get_vals(ctx, str_));
        }
        return h;
    },
    'remove_dupes': function(l_) {
        for(var i=0, l=[]; i<l_.length; l[i] = l_[i++]);
        if(!l.length) return [];
        l.sort();
        var u = [l[0]];
        for(var i=1; i<l.length; i++) if(l[i] != l[i-1]) u.push(l[i]);
        return u;
    }
}
indexer_test = function(no) {
    var no = no || 100;
    function rndchar() {
        var r = Math.round(Math.random()*25)+65;
        return String.fromCharCode(r);
    }
    function rndstr() {
        var l = Math.round(Math.random()*12)+3;
        for(var s=""; l--; s += rndchar());
        return s;
    }
    for(var lst=[]; no>0; no--) {
        var st = rndstr()+', '+rndstr();
        lst.push([st, st, no]);
    }
    lst.push(["test", "Testy Testerton", 999999]);
    var idx = new indexer(lst);
    return idx;
}
