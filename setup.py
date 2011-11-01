from setuptools import setup, find_packages
import os

version = '0.1'

setup(name='jarn.jsi18n',
      version=version,
      description="Plone i18n for JavaScript",
      long_description=open("README.rst").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Framework :: Plone",
        "Intended Audience :: Developers",
        "Programming Language :: Python",
        "Programming Language :: JavaScript",
        ],
      keywords='plone javascript i18n',
      author='Yiorgis Gozadinos',
      author_email='ggozad@jarn.com',
      url='https://github.com/ggozad/jarn.jsi18n',
      license='GPL',
      packages=find_packages(),
      namespace_packages=['jarn',],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
      ],
      extras_require = {
          'test': [
                  'plone.app.testing',
              ]
      },
      entry_points="""
      # -*- Entry points: -*-

      [z3c.autoinclude.plugin]
      target = plone
      """,
      )
