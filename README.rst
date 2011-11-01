Introduction
============

While internationalization in Zope/Plone is very mature there is no generally accepted way of doing i18n in JavaScript. Typically packages that contain Javascript code expose i18n by having hard-coded dictionaries or templates that dynamically create these dictionaries. While this is fine for small i18n catalogs, it easily gets tedious and is hard to update.

This package provides the essentials for leveraging the i18n infrastructure in Plone inside your JavaScript code:

  * Allows you to load arbitrary gettext catalogs from Plone.
  * Provides you with `Message Factories` very similar to the ones used in your python code.
  * Makes use of the `local storage` available in modern browsers to avoid reloading message catalogs.

Usage
-----
Your package should depend on ``jarn.jsi18n`` and include it in its meta-data dependencies.

In order to instantiate a ``MessageFactory`` and use it you will need to load the i18n catalog. Typically, this will be done in a way similar to::

  $(document).ready(function () {
      jarn.i18n.loadCatalog('plone', 'el');
      _ = jarn.i18n.MessageFactory('plone')
  });

The second parameter in ``loadCatalog`` specifying the language is optional, when omitted the ``lang`` attribute in the ``html`` tag is used. 

Now that we have a message factory we can use it to get translated strings::

  > _('Contributor');
  Συντελεστής

or with keyword parameters::

  > _('Groups are: ${names}', {names: 'Jarnians'})
  "Οι ομάδες είναι: Jarnians "

You can if you wish load multiple catalogs (or languages for the same catalog) and instantiate their respective factories, for instance::

  > jarn.i18n.loadCatalog('plone', 'es');
  > _es = jarn.i18n.MessageFactory('plone', 'es');
  > _es('Contributor');
  "Contribuyente"

Caching
-------

If the client browser supports local storage it will be used to store the catalogs that you load. This makes it possible to avoid making an ajax request every time in order to load the full catalog. The stored catalog is by default valid for 24 hours. You can set the time-to-live by calling ``jarn.i18n.setTTL(millis)`` passing in milliseconds for how long the local storage cache should remain valid. Note that if local storage *is* supported, and the cache has not expired, the browser will NOT reload a catalog even if it changes in the filesystem.
