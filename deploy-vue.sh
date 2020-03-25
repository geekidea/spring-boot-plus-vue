#! /bin/shell

# Copyright 2019-2029 geekidea(https://github.com/geekidea)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

#======================================================================
# 1. 下载或更新spring-boot-plus-vue版本库
# 2. npm打包
# 3. 将dist目录复制到Nginx静态目录中
# 4. 备份dist目录
# 5. 运行spring-boot-plus-vue
# author: geekidea
# date: 2020-03-06
#======================================================================

NOW=$(date --date='0 days ago' "+%Y-%m-%d-%H-%M-%S")
echo "${NOW}"

if [ ! -d "spring-boot-plus-vue" ]; then
  git clone https://gitee.com/geekidea/spring-boot-plus-vue.git
fi

cd spring-boot-plus-vue
rm -rf package-lock.json

git checkout master
git branch
git pull

rm -rf dist
npm install
npx vue-cli-service build

cd ..
if [ ! -d "spring-boot-plus-vue-back" ]; then
  mkdir spring-boot-plus-vue-back
fi

cp -r -f spring-boot-plus-vue/dist spring-boot-plus-vue-back/spring-boot-plus-vue-back-"${NOW}"
echo "back spring-boot-plus-vue success"

rm -rf /home/www/vue
nginx -s reload
mv spring-boot-plus-vue/dist /home/www/vue
nginx -s reload
echo "Deploy spring-boot-plus-vue success"
