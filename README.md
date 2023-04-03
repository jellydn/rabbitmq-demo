# Welcome to rabbitmq-demo 👋

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)
[![Twitter: jellydn](https://img.shields.io/twitter/follow/jellydn.svg?style=social)](https://twitter.com/jellydn)

> Receiving messages based on a pattern (topics)

## Install

Run below commadn with [antfu/ni: 💡 Use the right package manager](https://github.com/antfu/ni)

```sh
ni 
```

## Usage 1: Receiving messages base on pattern

Open 1st terminal with below command

```sh
nr receive "info.*"
```

Then open other terminal to emit message to rabbit mq

```sh
nr emit info.1 hello
nr emit info.2 demo
```

## Run tests

```sh
nr test
```

## Author

👤 **Huynh Duc Dung**

- Website: https://productsway.com/
- Twitter: [@jellydn](https://twitter.com/jellydn)
- Github: [@jellydn](https://github.com/jellydn)

## Show your support

Give a ⭐️ if this project helped you!

