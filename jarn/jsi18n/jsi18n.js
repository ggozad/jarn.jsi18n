var jarn = jarn || {};

jarn.i18n = {

    storage: null,
    catalogs: {},
    currentLanguage: null,

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

    _setCatalog: function (domain, language, catalog) {
        var key = domain + '-' + language;
        if (jarn.i18n.storage!==null && !(key in jarn.i18n.storage))
            jarn.i18n.storage.setItem(key, JSON.stringify(catalog));
        if (domain in jarn.i18n.catalogs)
            jarn.i18n.catalogs[domain][language] = catalog;
        else {
            jarn.i18n.catalogs[domain] = {};
            jarn.i18n.catalogs[domain][language] = catalog;
        }
    },

    loadCatalog: function (domain, language) {
        if (typeof(language) === 'undefined')
            language = jarn.i18n.currentLanguage;
        if (jarn.i18n.storage!==null) {
            var key = domain + '-' + language;
            if (key in jarn.i18n.storage) {
                catalog = JSON.parse(jarn.i18n.storage.getItem(key));
                console.log('Loading');
                jarn.i18n._setCatalog(domain, language, catalog);
                return;
            }
        }
        $.getJSON(portal_url+'/jsi18n?' +
            'domain=' + domain + '&language='+language,
            function (catalog) {
                console.log('JSON');
                jarn.i18n._setCatalog(domain, language, catalog);
            });
    },

    MessageFactory: (function () {
        var MessageFactory = function (domain) {
            this.domain = domain;
            this.translate = function (msgid, keywords, language) {
                var msgstr;
                if (typeof(language)==='undefined')
                    language = jarn.i18n.currentLanguage;
                if (!(domain in jarn.i18n.catalogs))
                    msgstr = msgid;
                else if (!(language in jarn.i18n.catalogs[domain]))
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
        return function (domain) {
            return new MessageFactory(domain).translate;
        };
    }) ()
};

jarn.i18n.init();
