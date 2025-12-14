import { now } from "framework7/shared/utils";

var helper = {};

function generateGUID(str){
    var d = new Date().getTime();

    var uuid = str.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });

    return uuid;
}

function padZero(v) {
    if(v.toString().length == 1) {
        return ('0' + v).substr(-2);
    } else {
        return v;
    }
}

helper.lngStr = null;
helper.lng = function(val) {
    var t;

    //check that val is valid and lang is loaded
    if (/[a-z\.]+/i.test(val) && helper.lngStr) {
        let k = val.split('.');

        t = k.length == 3 ? helper.lngStr[k[0]][k[1]][k[2]] : k.length == 2 ? helper.lngStr[k[0]][k[1]] : helper.lngStr[k[0]];
        
        return t ? t : '_' + val;

    } else if(!helper.lngStr) {
        return val;

    } else {
        return 'invalid-' + val;
    }
};

helper.generateDocId = function () {
    return generateGUID('xxxxxxx-xxxxxxx-xxxxxxxx-xxxxxxx');
};

helper.generateUsrDocId = function (uid) {
    var userId = uid ? uid : app.f7.store.state.user.uId;
    return userId + generateGUID(':xxxxxxxxxxxxxxx');
};

helper.generateUserId = function () {
    return generateGUID('xxxxxxxxxxxxxxx');
};

helper.nl2br = function(str) {
    return str ? str.replace(/\n/g, '<br/>') : '';
};

helper.isReceived = function(obj, expire) {
    var cls = '';
    var exp = expire ? expire : app.f7.store.state.settings.expire;

    if(exp) {
        var dateOffset = (24*60*60*1000) * exp; //days
        var myDate = new Date();
        myDate.setTime(myDate.getTime() + dateOffset);
        myDate.setHours(0);
        myDate.setMinutes(0);
        myDate.setSeconds(0);

        if ((obj.d_appointment && new Date(obj.d_appointment) < myDate) ||
            (obj.d_proposal && (!obj.txt && new Date(obj.d_proposal) < myDate))) {

            cls = 'expired';
        }
        //not d_recieve date
    } else if(!obj.d_replicated) {
        cls = 'notReceived';
    }

    return cls;
};

helper.displayMoney = function (v) {
    let s = v.toString();

    if(s.indexOf('.') == -1)
        s += '.00';
    else
        s += '0';

    v = s.substr(0, s.indexOf('.') + 3);

    return v;
};


helper.displayTime = function (v) {
    return v.length == 4 ? '0' + v : v;
};

helper.getMaps = function () {
    var url;

    // if(typeof cordova == 'undefined' || cordova.platformId == 'android')
    url = 'google';
    // else
    //     url = 'apple';

    return 'http://maps.' + url + '.com?q=';
};

helper.toHex = function (str) {
    var result = '';
    for (var i=0; i<str.length; i++) {
        result += str.charCodeAt(i).toString(16);
    }
    return result;
};
// helper.isClient = function(uid) {
//     return uid == 'client';
// };
helper.getOffset = function(el) {
    var _x = 0;
    var _y = 0;
    while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop; // - el.scrollTop;
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
};

helper.showDate = function(d, format) {
    if(!d) return '-';

    d = new Date(d);

    if(d == 'Invalid Date') return helper.lng('errValid.date');

    if(typeof app != 'undefined' && ((app.f7.store.state.user.doc.format == 'long' && !format) || format == 'long')) {
            return padZero(d.getDate()) + '. ' + d.toLocaleString(app.f7.store.state.iso, {month: 'short'}) + ' ' + d.getFullYear();

    } else if(format == 'short') {
        return padZero(d.getDate()) + '.' + padZero(d.getMonth() + 1) + '.' + (d.getYear()-100);

    //for importer because there is no app instance
    } else {
        return padZero(d.getDate()) + '.' + padZero(d.getMonth() + 1) + '.' + d.getFullYear();
    }
};

helper.showClock = function(d) {
    if(!d) return '';

    if(d == 'Invalid Date') return helper.lng('errDate');

    return padZero(d.getHours()) + ':' + padZero(d.getMinutes()) + ':' + padZero(d.getSeconds());
};

helper.showTime = function(d, tz) {
    if(!d) return '';

    d = new Date(d);

    if(d == 'Invalid Date') return helper.lng('errDate');

    if(tz == 'utc') {
        return padZero(d.getUTCHours()) + ':' + padZero(d.getUTCMinutes());

    } else {
        return padZero(d.getHours()) + ':' + padZero(d.getMinutes());
    }
};

helper.showDateTime = function(d, format) {
    return helper.showDate(d, format) + ' ' + helper.showTime(d);
};

helper.showDateTimeDuration = function(doc, field) {
    let until = new Date(doc[field]).getTime() + (doc.duration * 60000);
    return helper.showDateTime(doc[field]) + ' - ' + helper.showTime(until);
};

helper.showDateUntil = function(st, en, noDate) {
    if(!st) {
        st = '?';
    } else {
        st = new Date(st);
    }

    if(!en) {
        en = '?';
    } else {
        en = new Date(en);
    }

    let s = (typeof st != 'object') ? st : padZero(st.getDate()) + '.' + padZero(st.getMonth() + 1) + '.' + (st.getYear()-100);
    let e = (typeof en != 'object') ? en : padZero(en.getDate()) + '.' + padZero(en.getMonth() + 1) + '.' + (en.getYear()-100);

    //same day
    if (s != '?' && s == e || en != '?' && en.getHours() == '00' && en.getMinutes() == '00' && en.getTime() - st.getTime() < 24 * 3600000) {
        if(noDate) {
            return helper.showTime(st) + '-' + helper.showTime(en);

        } else {
            return s + ' ' + helper.showTime(st) + '-' + helper.showTime(en);
        }
    } else if(e == '?') {
        return s + ' ' + helper.showTime(st) + ' - ' + e;

    } else {
        return s + ' - ' + e;
    }
};

helper.showDateDiff = function(st, en) {
    let diff = new Date(en).getTime() - new Date(st).getTime();
    return Math.floor(diff / 3600000 / 24);
};

helper.showDay = function(d, short) {
    d = new Date(d);
    return (!short ? d.getDate() + '. ' : '') + helper.lng('d_' + d.getDay()).substr(0, 2);
};

helper.showHalfDay = function(d) {
    return new Date(d).getHours() < 12 ? helper.lng('mornings') : helper.lng('afternoons');
};

helper.showHM = function(d) {
    if(d == '?') {
        return d;
    }
    
    let minus = d < 0;
    d = d / 60000; //transform to minutes

    let h = d / 60;
    let m = d % 60;

    //minus
    if (h < 0) {
        h = Math.ceil(h);
        m = Math.ceil(m) * -1;

    } else {
        h = Math.floor(h);
        m = Math.floor(m);
    }

    return (minus && h == 0 ? '-00' : padZero(h)) + ':' + padZero(m);
};

helper.showM = function(d) {
    if(!d) return '0';

    d = d / 60000; //transform to minutes

    return d;
};

helper.getDateInfos = function(d) {
    if(!d) return '';

    d = new Date(d);

    if(d == 'Invalid Date') return helper.lng('errDate');

    return {
        day: helper.lng('d_' + d.getDay()),
        date: d.getDate(),
        month: helper.lng('m_' + d.getMonth()),
        time: padZero(d.getHours()) + ":" + padZero(d.getMinutes())
    };
};

helper.age = function(d)  {
    let m = new Date(new Date() - new Date(d)).getMonth() + 1;
    switch(m) {
        case 1:
        case 2:
        case 3:
            return 3;

        case 4:
        case 5:
        case 6:
            return 6;

        default:
            return 0;
    }
}

helper.isSameDay = function(a, b) {
    a = new Date(a);
    a.setHours(0);
    a.setMinutes(0);
    a.setSeconds(0);
    a.setMilliseconds(0);

    b = new Date(b);
    b.setHours(0);
    b.setMinutes(0);
    b.setSeconds(0);
    b.setMilliseconds(0);

    return a.getTime() == b.getTime();
};

helper.dateRangeOverlaps = function(a_start, a_end, b_start, b_end) {
    if (a_start < b_start && b_start < a_end) return true; // b starts in a
    if (a_start < b_end   && b_end   < a_end) return true; // b ends in a
    if (b_start <=  a_start && a_end <= b_end) return true; // a in b
    return false;
};

helper.showReceived = function(d) {
    return d.origin == 'user' ? '' : '<i class="f7-icons received" title="'+ (d.d_replicated ? helper.showDateTime(d.d_replicated) : helper.lng('notReceived'))+'">' + (d.d_replicated ? 'checkmark' : 'hourglass_tophalf_fill') + '</i>';
};

helper.showOpened = function(d, d_lastOpened) {
    return d.origin == 'user' || d.origin != 'user' && !d.d_replicated ? '' : '<i class="f7-icons seen" title="'+ (d_lastOpened > d.d_created ? helper.showDateTime(d_lastOpened) : helper.lng('notRead')) +'">' + (d_lastOpened > d.d_created ? 'checkmark' : 'hourglass_tophalf_fill') + '</i>';
};

helper.hasAnswer = function(a) {
    let has = false;

    if(a.needAnswer != 'comment') {
        a.messages.forEach(msg => {
            if (msg.replyYesNo != undefined) { //msg.origin == 'user' &&
                has = true;
            }
        });
        
    } else {
        a.messages.forEach(msg => {
            if (msg.origin == 'user') { //msg.origin == 'user' &&
                has = true;
            }
        });
    }

    return has;
};

helper.showUserContact = function(doc) {
    return '<div class="display-flex justify-content-space-between"><span class="user" title="' + helper.lng('contact') + ': ' + doc.contact + '">' + doc.user + '</span><span class="copyEl">' + doc.userId + '</span></div>';
};

helper.showUpdatedAt = function(doc) {
    let d = new Date();
    let d2 = new Date(doc.d_updated ? doc.d_updated : doc.d_created);

    if ((d - d2) / (1000 * 3600 * 24 * 365) <= 2) {
        return app.f7.mod.helper.lng('d_updated') + ': ' + helper.showDate(d2);
    } else {
        return '';
    }
};

helper.setConfirmLang = function() {
    let b = app.f7.$('.dialog .dialog-button');
    b[0].innerText = helper.lng('cancel').toUpperCase();
    b[1].innerText = helper.lng('yes').toUpperCase();
};

helper.getAnswer = function(a) {
    let has = false;
    let need = a.needAnswer;

    if(!need) return false;

    a.messages.every(msg => {
        if (need != 'yesNo' && need != 'offer' && msg.origin == 'user') {
            has = {
                txt: msg.txt ? msg.txt : app.f7.mod.helper.lng('photo'),
                d: msg.d_created,
                tmpPics: msg.tmpPics,
                pics: msg.pics
            };

            return false;

        } else if ((need == 'yesNo' || need == 'offer') && msg.replyYesNo != undefined) {
            has = {
                txt: app.f7.mod.helper.lng(msg.replyYesNo === true ? 'yes' : 'no'),
                d: msg.d_created,
                tmpPics: msg.tmpPics,
                pics: msg.pics
            };

            return false;
        }

        return true;
    });

    return has ? has : need;
};

helper.getAttach = function(a, i) {
    return '<img src="data:' + a[i].type + ';base64,' + a[i].data + '"/>';
};

helper.debounce = function(func, wait, immediate) {
    var timeout;

    return function () {
        var context = this, args = arguments;

        var later = function () {
            timeout = null;
                            //if autocomplete was destroyed dont trigger again
            if (!immediate && !context.destroyed) func.apply(context, args); // args[1] -> onInputChange(items) sets isDirty
        };

        var callNow = immediate && !timeout;

        clearTimeout(timeout);

        timeout = setTimeout(later, wait);

        if (callNow) func.apply(context, args);
    };
};

helper.stripHtml = function(txt) {
    return txt.replace(/(<([^>]+)>)/gi, ' ');
};

helper.cutText = function(txt) {
    if(txt.length > 350) {
        let pos = txt.substr(350).indexOf(' ');
        return txt.substr(0, 350 + pos) + `... <a href="#" class="tab-link more">${helper.lng('more')}</a>`;

    } else
        return txt;
};

helper.formatOpeningTimes = function(txt) {
    let out = '';

    if(txt) {
        let lines = txt.split("\n");

        lines.forEach(o => {
            let pos = o.indexOf('$');

            if (pos != -1) {
                out += '<div class="line"><span>' + o.substr(0, pos) + '</span><span>' + o.substr(pos + 1) + '</span></div>';

            } else {
                out += o + '<br/>';
            }
        });
    }

    return out;
};

export default helper;