# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [0.11.0](https://www.github.com/amplience/dc-delivery-sdk-js/compare/v0.10.0...v0.11.0) (2021-11-15)


### Features

* adds Fresh API and fetch multiple content items support ([#58](https://www.github.com/amplience/dc-delivery-sdk-js/issues/58)) ([323736b](https://www.github.com/amplience/dc-delivery-sdk-js/commit/323736b8a50e41c98db870d10648041c2aa19330))

## [0.10.0](https://www.github.com/amplience/dc-delivery-sdk-js/compare/v0.9.2...v0.10.0) (2021-07-21)


### Features

* adding helper functions for constructing filterBy requests. added tests and documentation. ([5ef12c6](https://www.github.com/amplience/dc-delivery-sdk-js/commit/5ef12c6c365069a6a7b323029f38cda32d179203))

### [0.9.2](https://www.github.com/amplience/dc-delivery-sdk-js/compare/v0.9.1...v0.9.2) (2021-05-21)


### Bug Fixes

* **cd1:** tree walker is trying to walk null values which is resulting in an exception being thrown ([d73b651](https://www.github.com/amplience/dc-delivery-sdk-js/commit/d73b651462093947ebe9f017ea2ec0fbf74475a5))

### [0.9.1](https://www.github.com/amplience/dc-delivery-sdk-js/compare/v0.9.0...v0.9.1) (2021-05-06)


### Bug Fixes

* **deps:** bump axios from 0.19.2 to 0.21.1 ([#29](https://www.github.com/amplience/dc-delivery-sdk-js/issues/29)) ([e48fb27](https://www.github.com/amplience/dc-delivery-sdk-js/commit/e48fb27643b9ef37415ad4de9866f074bf81297a))

## [0.9.0](https://www.github.com/amplience/dc-delivery-sdk-js/compare/v0.8.1...v0.9.0) (2021-03-17)


### ⚠ BREAKING CHANGES

* **getContentItemById:** prefer cd2 over cd1 if both options are supplied (#40)

### Bug Fixes

* **getContentItemById:** prefer cd2 over cd1 if both options are supplied ([#40](https://www.github.com/amplience/dc-delivery-sdk-js/issues/40)) ([c9d6471](https://www.github.com/amplience/dc-delivery-sdk-js/commit/c9d647157f8f3d5c142eed373b5ab28a1df569e6))

### [0.8.1](https://www.github.com/amplience/dc-delivery-sdk-js/compare/v0.8.0...v0.8.1) (2021-02-23)


### Bug Fixes

* **docs:** url to push docs too ([360b46c](https://www.github.com/amplience/dc-delivery-sdk-js/commit/360b46cc83c7e2e979d29cd335722f8aa4e4a0b7))

## [0.8.0](https://www.github.com/amplience/dc-delivery-sdk-js/compare/v0.7.1...v0.8.0) (2021-02-23)


### ⚠ BREAKING CHANGES

* add custom error tyoes for http errors and empty content responses (#35)

### Features

* add custom error tyoes for http errors and empty content responses ([#35](https://www.github.com/amplience/dc-delivery-sdk-js/issues/35)) ([73856a0](https://www.github.com/amplience/dc-delivery-sdk-js/commit/73856a01b99a851f01d41630cdbf28c609c8ef8b))
* add timeout option for the content client ([#34](https://www.github.com/amplience/dc-delivery-sdk-js/issues/34)) ([8bc7fec](https://www.github.com/amplience/dc-delivery-sdk-js/commit/8bc7fecae593449d2581dcbb3bfc411ee2177024))
* **automated releases:** migrated from travis to github actions using release-please ([51a2a5e](https://www.github.com/amplience/dc-delivery-sdk-js/commit/51a2a5e2096bc8963a369d858c2cb6710918250f))

### [0.7.1](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.7.0...v0.7.1) (2021-02-04)


### Features

* **env:** updating i1, c1, default, and virtual-staging urls ([#31](https://github.com/amplience/dc-delivery-sdk-js/issues/31)) ([c0f6eaf](https://github.com/amplience/dc-delivery-sdk-js/commit/c0f6eaf011dfd7712c92ce59b9889eef0c4cb658))


### Bug Fixes

* **json walker:** updated to check that value is not null as null is an object ([642feb2](https://github.com/amplience/dc-delivery-sdk-js/commit/642feb2f22101a732ec794538983df6422cfaa40))

## [0.7.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.6.0...v0.7.0) (2020-10-05)


### Features

* **content meta:** exposing content meta hierachy content item property ([f4ec9aa](https://github.com/amplience/dc-delivery-sdk-js/commit/f4ec9aa684137a62d10cacfccb53045bb3acb12a))

## [0.6.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.5.0...v0.6.0) (2020-06-24)


### Features

* **content delivery v2:** get by id and key support ([#16](https://github.com/amplience/dc-delivery-sdk-js/issues/16)) ([52f950f](https://github.com/amplience/dc-delivery-sdk-js/commit/52f950f4c5160a2f3562acd64bc1f4efa62a74e6))

<a name="0.5.0"></a>
# [0.5.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.4.0...v0.5.0) (2020-03-04)


### Features

* **content-meta:** exposes the delivery key property ([#6](https://github.com/amplience/dc-delivery-sdk-js/issues/6)) ([696a218](https://github.com/amplience/dc-delivery-sdk-js/commit/696a218))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.3.1...v0.4.0) (2020-02-17)


### Features

* **vse:** added a vse domain factory ([#4](https://github.com/amplience/dc-delivery-sdk-js/issues/4)) ([a393d57](https://github.com/amplience/dc-delivery-sdk-js/commit/a393d57))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.3.0...v0.3.1) (2020-02-12)


### Bug Fixes

* **docs:** logo update ([721599f](https://github.com/amplience/dc-delivery-sdk-js/commit/721599f))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.2.0...v0.3.0) (2019-07-17)


### Bug Fixes

* **CMP-5384:** linting and formatting ([b881552](https://github.com/amplience/dc-delivery-sdk-js/commit/b881552))
* **CMP-5384:** removed name as it's not immutable therefore not worth adding to the reference. ([60a4fbe](https://github.com/amplience/dc-delivery-sdk-js/commit/60a4fbe))
* **tests:** removed name from expected output. ([43d7bdd](https://github.com/amplience/dc-delivery-sdk-js/commit/43d7bdd))


### Features

* **CMP-5384:** Moved content reference from media to content/models ([0910b3f](https://github.com/amplience/dc-delivery-sdk-js/commit/0910b3f))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.1.1...v0.2.0) (2019-03-15)


### Features

* added npm badge ([4b182ee](https://github.com/amplience/dc-delivery-sdk-js/commit/4b182ee))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.1.0...v0.1.1) (2019-03-08)



<a name="0.1.0"></a>
# 0.1.0 (2019-03-08)


### Features

* Build status button ([301536c](https://github.com/techiedarren/dc-delivery-sdk-js/commit/301536c))
* travis-ci integration ([a521367](https://github.com/techiedarren/dc-delivery-sdk-js/commit/a521367))
