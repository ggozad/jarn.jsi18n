var jarn = jarn || {};

jarn.i18n = {

    storage: null,
    catalogs: {},
    currentLanguage: null,
    ttl: 24*3600*1000,

    init: function () {
        jarn.i18n.currentLanguage = $('html').attr('lang');
        try {
            if ('localStorage' in window &&
                window.localStorage !== null &&
                'JSON' in window &&
                window.JSON !== null) {
                    jarn.i18n.storage = localStorage;
                }
        } catch(e) {}
    },

    setTTL: function (millis) {
        jarn.i18n.ttl = millis;
    },

    _setCatalog: function (domain, language, catalog) {
        if (domain in jarn.i18n.catalogs)
            jarn.i18n.catalogs[domain][language] = catalog;
        else {
            jarn.i18n.catalogs[domain] = {};
            jarn.i18n.catalogs[domain][language] = catalog;
        }
    },

    _storeCatalog: function (domain, language, catalog) {
        var key = domain + '-' + language;
        if (jarn.i18n.storage!==null) {
            jarn.i18n.storage.setItem(key, JSON.stringify(catalog));
            jarn.i18n.storage.setItem(key + '-updated', Date.now());
        }
    },

    loadCatalog: function (domain, language) {
        if (typeof(language) === 'undefined')
            language = jarn.i18n.currentLanguage;
        if (jarn.i18n.storage!==null) {
            var key = domain + '-' + language;
            if (key in jarn.i18n.storage) {
                if ((Date.now() - parseInt(jarn.i18n.storage.getItem(key + '-updated'), 10))<jarn.i18n.ttl) {
                    catalog = JSON.parse(jarn.i18n.storage.getItem(key));
                    jarn.i18n._setCatalog(domain, language, catalog);
                    return;
                }
            }
        }
        $.getJSON(portal_url+'/jsi18n?' +
            'domain=' + domain + '&language='+language,
            function (catalog) {
                jarn.i18n._setCatalog(domain, language, catalog);
                jarn.i18n._storeCatalog(domain, language, catalog);
            });
    },

    MessageFactory: (function () {
        var MessageFactory = function (domain, language) {
            this.translate = function (msgid, keywords) {
                var msgstr;
                if (!(domain in jarn.i18n.catalogs))
                    msgstr = msgid;
                else if (!(language in jarn.i18n.catalogs[domain]))
                    msgstr = msgid;
                else if (!(msgid in jarn.i18n.catalogs[domain][language]))
                    msgstr = msgid;
                else
                    msgstr = jarn.i18n.catalogs[domain][language][msgid];
                if (typeof(keywords)!=='undefined') {
                    var regexp;
                    for (var keyword in keywords)
                        if (keywords.hasOwnProperty(keyword)) {
                            regexp = RegExp("\\$\\{"+keyword+'\\}', 'g');
                            msgstr = msgstr.replace(regexp, keywords[keyword]);
                        }
                }
                return msgstr;
            };
        };
        return function (domain, language) {
            if (typeof(language)==='undefined')
                language = jarn.i18n.currentLanguage;
            return new MessageFactory(domain, language).translate;
        };
    }) ()
};

jarn.i18n.init();
