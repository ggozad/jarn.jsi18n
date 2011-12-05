/*global $:false, window:false, jarn:false, jQuery:false, localStorage:false, describe:false, it:false, beforeEach:false, spyOn:false, expect:false, */

var portal_url;

describe('jarn.jsi18n Package', function () {
    var plone_el = {
        'Contributor': 'Συντελεστής',
        'Groups are: ${names}': 'Οι ομάδες είναι {names}'
    };

    var fakeJSON = function (url, success) {
        var result, queryString = {};
        url.replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function ($0, $1, $2, $3) { queryString[$1] = $3; }
        );
        if (queryString.language === 'el' && queryString.domain === 'plone') {
            result = plone_el;
        }
        success(result);
    };

    beforeEach(function () {
        localStorage.clear();
        portal_url  = 'http://localhost';
        spyOn($, 'getJSON').andCallFake(fakeJSON);
    });

    it('can load an i18n message catalog', function () {
        jarn.i18n.loadCatalog('plone', 'el');
        expect(jarn.i18n.catalogs.plone.el).toEqual(plone_el);
    });

    it('can store an i18n message catalog in localstorage', function () {
        jarn.i18n.loadCatalog('plone', 'el');
        expect(localStorage.getItem('plone-el')).toEqual(JSON.stringify(plone_el));
    });


});
