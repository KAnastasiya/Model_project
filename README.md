### Типовой проект

#### Общее описание

1. Разметка пишется с помощью [шаблонизатора Pug] (https://github.com/pugjs/pug)
2. Стили пишутся с использованием [препроцессора SCSS] (http://sass-scss.ru/guide/)
3. При написании javaScript используется [синтаксис ES6] (https://babeljs.io/docs/learn-es2015/)
4. Сборка проекта (pug -> html, scss -> css, es6 -> js, оптимизация изображений, создание спрайтов и т.д.) выполняется посредством [сборщика Gulp] (http://gulpjs.com/)
5. Для формирования структуры проекта за основу взята [метология БЕМ] (https://ru.bem.info/methodology/), то есть:
  - вся разметка делится на блоки. Для каждого такого блока создается отдельный каталог, содержащий все ресурсы соответствующего блока - разметку, стили, скрипты и картинки. Название папки с ресурсами блока, а также файла с его разметкой, стилями и скриптами соответствуют названию блока.
  - глобальные стили и скрипты (переменные, сетка, примеси...) вынесены в ежиный каталог.
6. Для стилей и скриптов используется диспетчер подключений, то есть создается отдельный файл, в который импортируются стили/скрипты всех блоков, а также глобальные стили/скрипты. Порядок подключений приведен на примере:
```
    // Variables
    @import './scss/variables';

    // Mixins
    @import './scss/mixins';

    // General settings
    @import './scss/normalize';
    @import './scss/fonts';
    @import './scss/scaffolding';
    @import './scss/button';
    @import './scss/icon';

    // BEM blocks
    @import './blocks/navigation/navigation';
    @import './blocks/header/header';
    @import './blocks/footer/footer';
```

7. В разметке подключение разметки БЕМ-блоков в разметку всех страниц выполняется посредством импорта:
```
    body
      include blocks/header/header
      include blocks/about/about
```


#### Общая структура проекта
*Ниже описана самая полная структура. От проекта к проекту некоторые ее блоки могут опускаться*

```
*--------                         ИСХОДНЫЙ КОД                        --------*
├── **src**
    ├── *СОБРАННЫЙ ПРОЕКТ (структура идентична опубликованному проекту)*
    └── **dev**                                     *// РАБОЧИЙ КАТАЛОГ*
        └── **common**                              *// Общие ресурсы*
            └── **scss**                            *// Общие стили*
                ├── _variables.scss
                ├── _fonts.scss
                ├── _scaffolding.scss
                ├── _grid.scss
                ├── _buttons.scss
                ├── _inputs.scss
                ├── _sprite-template.scss
                ├── _sprite.scss
                ......
                └── _mixins.scss
            └── **js**                              *// Общие скрипты*
                ......
                └── utils.js
            └── **img**                             *// Общие изображения*
                ......
                └── imgZ.{png/jpg/gif}
            └── **icon**                            *// Общие иконки*
                ......
                └── iconY.{png/svg}
        └── **blocks**                              *//БЕМ-блоки*
            └── **block1**
                └── **img**
                    ......
                    └── imgM.{png/jpg/gif}
                └── **icon**
                    ......
                    └── iconN.{png/svg}
                ├── block1.js
                ├── block1.pug
                └── _block1.scss
            ......
            └── **blockM**
        ├── index.pug                     *// Разметка главной страницы*
        ├── page1.pug                     *// Разметка страницы 1*
        ......
        ├── pageK.pug                     *// Разметка страницы K*
        ├── style.scss                    *// Диспетчер подключений стилей*
        └── script.js                     *// Диспетчер подключений скриптов*

*--------         ВЕРСИЯ ДЛЯ ЛОКАЛЬНОГО ЗАПУСКА И ПУБЛИКАЦИИ         --------*
├── **build** *(cтруктура идентична опубликованному проекту)*

*--------             ОПУБЛИКОВАННЫЙ НА gh-pages ПРОЕКТ              --------*
├── **fonts**                             *// Шрифты проекта*
    └── font1.woff
    ├── font1.eof
    ......
    ├── fontN.woff
    └── fontN.eof
├── **img**                            *// Картинки проекта*
    └── **block1**
        └── **img**
            ......
            └── imageX.{png/jpg/gif}
        ......
        └── **blockM**
└── **iсon**                              *// Иконки проекта*
    ├── icon1.{png/jpg/svg/gif}
    ......
    ├── iconU.{png/jpg/svg/gif}
    └── sprite.{png/svg}                  *// Спрайт*
└── **css**                               *// Стили проекта*
    ├── style.css
    └── style.min.css
└── **js**                                *// Скрипты проекта*
    ├── script.js
    └── script.min.js
├── index.html                            *// Главная страница*
├── page_1.html                           *// Страница 1*
......
├── page_K.html                           *// Страница K*
└── favicon.ico                           *// Изображение к заголовке страницы*

*--------               НАСТРОЙКИ ПРОЕКТА И ЕГО СБОРКИ                --------*
├── .editorconfig
├── gulpfile.js
├── package.json
├── .csscomb.json
├── webpack.config.js
├── .eslintrc
├── .eslintignore
├── jsdoc.json
├── .gitignore
└── README.md
```


#### Настройка сборки проекта
1. Установить [Node.js]:
  - для Windows скачать [установщик] (https://nodejs.org/en/)
  - для Ubuntu выполнить команды:
```
    sudo apt-get update
    sudo apt-get install nodejs
    sudo apt-get install npm
```

2. Установить Gulp:
  - глобально: `npm install gulp-cli -g`
  - в проект:  `npm install gulp`
*Для Ubuntu в обеих командах добавить в начало `sudo`*

3. Установить Ruby:
  - для Windows воспользоваться [инсталятором] (http://rubyinstaller.org/).
  -  для Ubuntu выполнить команды:
```
  sudo apt-get update
  sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev

  cd
  git clone https://github.com/rbenv/rbenv.git ~/.rbenv
  echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
  echo 'eval "$(rbenv init -)"' >> ~/.bashrc
  exec $SHELL

  git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
  echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
  exec $SHELL

  rbenv install 2.3.1
  rbenv global 2.3.1
  ruby -v

  gem install bundler
```

4. Установить Sass:
`gem install sass` (для Ubuntu - `sudo gem install sass`)
*[Error: SASS installation for windows] (http://stackoverflow.com/questions/27278966/error-sass-installation-for-windows)*

5. Установить WebPack:
  - глобально: `npm install webpack -g`
  - в проект:  `npm install webpack`
*Для Ubuntu в обеих командах добавить в начало `sudo`*

6. Скопировать в корень проекта конфигурационные файлы:
  ```
  - package.json
  - gulpfile.js
  - .eslintrc
  - .eslintignore
  - .editorconfig
  - jsdoc.json
  - .csscomb.json
  - webpack.config.js
  - .gitignore
```

7. При использовании спрайтов скопировать в `src/dev/common/scss` соответствующий конфигурационный файл `_sprite-template.scss`. При необходимости внести изменения в него.

8. Установить все необходимые плагины для Gulp и WebPack:
`npm install` (для Ubuntu - `sudo npm install`)

9. При необходимости настроить [Sublime Text 3] (https://github.com/KAnastasiya/SublimeText3/blob/master/README.md)


#### Команды для сборки проекта

|         Команда        |                     Назначение                     |
| ---------------------- | -------------------------------------------------- |
| gulp pug | Конвертация pug в html |
| gulp scss | Конвертация scss в css |
| gulp script | Конвертация es2015 в js |
| gulp img | Оптимизация png, jpg, gif и svg |
| gulp pngSprite | Создание png-спрайта |
| gulp svgSprite | Создание svg-спрайта |
| gulp htmllint | Проверка html на соответствие стандартам |
| gulp csslint | Проверка css на соответствие стандартам |
| gulp watch | Поднятие локального сервера и включение режима 'слежения' |
| gulp build | Создание версии для публикации |
| gulp github | Копирование версии для публикации в корень проекта (для просмотра сайта на gh-pages) |
