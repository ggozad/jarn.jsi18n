/*global $:false, window:false, portal_url:false, jarn:false, jQuery:false, localStorage:false, */

(function (jarn, $) {

    jarn.i18n = {

        storage: null,
        catalogs: {},
        currentLanguage: null,
        ttl: 24 * 3600 * 1000,

        init: function () {
            // Internet Explorer 8 does not know Date.now() which is used in e.g. loadCatalog, so we "define" it
            if (!Date.now) {
                Date.now = function() {
                    return new Date().valueOf();
                }
            }
            
            jarn.i18n.currentLanguage = $('html').attr('lang');
            try {
                if ('localStorage' in window && window.localStorage !== null && 'JSON' in window && window.JSON !== null) {
                    jarn.i18n.storage = localStorage;
                }
            } catch (e) {}
        },

        setTTL: function (millis) {
            jarn.i18n.ttl = millis;
        },

        _setCatalog: function (domain, language, catalog) {
            if (domain in jarn.i18n.catalogs) {
                jarn.i18n.catalogs[domain][language] = catalog;
            } else {
                jarn.i18n.catalogs[domain] = {};
                jarn.i18n.catalogs[domain][language] = catalog;
            }
        },

        _storeCatalog: function (domain, language, catalog) {
            var key = domain + '-' + language;
            if (jarn.i18n.storage !== null &&
                catalog !== null) {
                jarn.i18n.storage.setItem(key, JSON.stringify(catalog));
                jarn.i18n.storage.setItem(key + '-updated', Date.now());
            }
        },

        loadCatalog: function (domain, language) {
            if (typeof (language) === 'undefined') {
                language = jarn.i18n.currentLanguage;
            }
            if (jarn.i18n.storage !== null) {
                var key = domain + '-' + language;
                if (key in jarn.i18n.storage) {
                    if ((Date.now() - parseInt(jarn.i18n.storage.getItem(key + '-updated'), 10)) < jarn.i18n.ttl) {
                        var catalog = JSON.parse(jarn.i18n.storage.getItem(key));
                        jarn.i18n._setCatalog(domain, language, catalog);
                        return;
                    }
                }
            }
            $.getJSON(portal_url + '/jsi18n?' +
                'domain=' + domain + '&language=' + language,
                function (catalog) {
                    if (catalog === null) {
                        return;
                    }
                    jarn.i18n._setCatalog(domain, language, catalog);
                    jarn.i18n._storeCatalog(domain, language, catalog);
                });
        },

        MessageFactory: function (domain, language) {
            language = language || jarn.i18n.currentLanguage;

            return function translate (msgid, keywords) {
                var msgstr;
                if ((domain in jarn.i18n.catalogs) && (language in jarn.i18n.catalogs[domain]) && (msgid in jarn.i18n.catalogs[domain][language])) {
                    msgstr = jarn.i18n.catalogs[domain][language][msgid];
                } else {
                    msgstr = msgid;
                }
                if (keywords) {
                    var regexp, keyword;
                    for (keyword in keywords) {
                        if (keywords.hasOwnProperty(keyword)) {
                            regexp = RegExp("\\$\\{" + keyword + '\\}', 'g');
                            msgstr = msgstr.replace(regexp, keywords[keyword]);
                        }
                    }
                }
                return msgstr;
            };
        }
    };

    jarn.i18n.init();

})(window.jarn = window.jarn || {}, jQuery);
