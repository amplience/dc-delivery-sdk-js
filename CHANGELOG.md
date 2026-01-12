# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.3.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v1.2.1...v1.3.0) (2026-01-12)


### Features

* Preview Key support ([a9895fc](https://github.com/amplience/dc-delivery-sdk-js/commit/a9895fc7918e6b37d3ec86a2200c5ec0e57c151b))

## [1.2.1](https://github.com/amplience/dc-delivery-sdk-js/compare/v1.2.0...v1.2.1) (2026-01-07)


### Bug Fixes

* check if delivery key list includes root id before throwing ([e3d3b71](https://github.com/amplience/dc-delivery-sdk-js/commit/e3d3b719ca6cb42a5a10fae84fa2f8aeb18e8af0))

## [1.2.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v1.1.0...v1.2.0) (2025-11-19)


### Features

* update project to support node 24 ([33eae0f](https://github.com/amplience/dc-delivery-sdk-js/commit/33eae0f03bcca50e91b5f938348758eb793d2302))


### Bug Fixes

* add babel plugins to support the use of static properties and static block properties ([799a00c](https://github.com/amplience/dc-delivery-sdk-js/commit/799a00c3917a4cfa5cfef730dcccbecab2fb8ed9))

## [1.1.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v1.0.0...v1.1.0) (2025-05-27)


### Features

* added support for config locale in get-by descendents ([8b89f17](https://github.com/amplience/dc-delivery-sdk-js/commit/8b89f171c29c9e726bda453792bee1c79abd3923))

## [1.0.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.15.0...v1.0.0) (2025-04-09)


### ⚠ BREAKING CHANGES

* Breaking changes in the hierarchies and filterBy contract to add support for byKey delivery

### Features

* added support for filter by hierarchy using delivery key ([b318db4](https://github.com/amplience/dc-delivery-sdk-js/commit/b318db495af4691cdd22bf4d4b1cac75b80ec6d9))
* added test for by key heirachies and fixed failing tests ([421f0e9](https://github.com/amplience/dc-delivery-sdk-js/commit/421f0e9579c320c8f14127fef3667273012ce51f))
* Breaking changes in the hierarchies and filterBy contract to add support for byKey delivery ([7362d51](https://github.com/amplience/dc-delivery-sdk-js/commit/7362d51436133f91c5afbdc38b18aa3c08fa0d6a))
* implement by key support on hierarchies endpoint ([a607319](https://github.com/amplience/dc-delivery-sdk-js/commit/a607319b661350bb1c7603ed6dba3526285ef325))


### Miscellaneous Chores

* release 1.0.0 ([6f90f97](https://github.com/amplience/dc-delivery-sdk-js/commit/6f90f97966a5f2a4682d5223fc6d9f9e56cddcc9))

## [0.15.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.14.0...v0.15.0) (2025-01-29)


### Features

* Exposing mimeType ([6e8999f](https://github.com/amplience/dc-delivery-sdk-js/commit/6e8999f3c8bd0dc95bf4f266af8caeae271c8911))

## [0.14.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.13.0...v0.14.0) (2025-01-20)


### Features

* updated axios ([0b3ca49](https://github.com/amplience/dc-delivery-sdk-js/commit/0b3ca4934c3699656d078b9bfc23712e4845792c))

## [0.13.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.12.3...v0.13.0) (2024-10-30)


### Features

* **release:** This change exposes the new parameters in the hierarchies endpoint for custom sort. (https://github.com/amplience/dc-delivery-sdk-js/pull/108)

## [0.12.3](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.12.2...v0.12.3) (2024-10-23)


### Bug Fixes

* changed filter method to remove content on truthy result content on ([5b2a66f](https://github.com/amplience/dc-delivery-sdk-js/commit/5b2a66f8576e27a71d53b140bc14850f114e71df))
* stripped functions off of returned object ([10f8a51](https://github.com/amplience/dc-delivery-sdk-js/commit/10f8a51e2d268ad74fd977ae25dc32cacc522364))

## [0.12.2](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.12.1...v0.12.2) (2024-10-08)


### Bug Fixes

* **readme:** TRIT-583 - testing.

## [0.12.1](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.12.0...v0.12.1) (2023-10-27)


### Bug Fixes

* **release:** set registry-url for setup-node ([#98](https://github.com/amplience/dc-delivery-sdk-js/issues/98)) ([ed924a0](https://github.com/amplience/dc-delivery-sdk-js/commit/ed924a0a4d18f0f51c297ed4e5c190a3c79867ce))

## [0.12.0](https://github.com/amplience/dc-delivery-sdk-js/compare/v0.11.0...v0.12.0) (2023-10-27)


### Features

* remove Amplience DC header logo from README ([ab94334](https://github.com/amplience/dc-delivery-sdk-js/commit/ab9433464476ff248e0e46b7b543a94095c5138f))
* remove DC header asset ([911c8de](https://github.com/amplience/dc-delivery-sdk-js/commit/911c8dedc9e33d03a1ff03aa071029f5f72d330b))
* support nodejs 16, 18 & 20 ([#95](https://github.com/amplience/dc-delivery-sdk-js/issues/95)) ([84fef32](https://github.com/amplience/dc-delivery-sdk-js/commit/84fef32f2c7d87acc9756f8ad2362841434d60fb))


### Bug Fixes

* **meta fragment:** include optional name ([#96](https://github.com/amplience/dc-delivery-sdk-js/issues/96)) ([2056d2d](https://github.com/amplience/dc-delivery-sdk-js/commit/2056d2dfb29f976bdbdb296d92eb347a4c84f765))

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
