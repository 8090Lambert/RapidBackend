#!/bin/bash
BASE_DIR="$(cd "$(dirname "$0")"; pwd)"
NODE_VERSION="v8.11.3"
DIR_VERSION=$1
source "$HOME/.nvm/nvm.sh"

function build(){
    # Install dependencies
    echo "install dependencies"

    if !(hash nvm 2>/dev/null);then
        curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
    fi

    # 切换到依赖的版本
    nvm install $NODE_VERSION
    nvm use $NODE_VERSION
    node --version

    # npm安装依赖 && 编译打包
    npm install --registry=http://registry.npm.xiaojukeji.com
    if  [ x"$DIR_VERSION" != x ] ;then
        npm run build:test
    else
        npm run build
    fi
    
    echo "Done..."
}

build
