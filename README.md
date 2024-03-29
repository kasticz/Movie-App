Суть приложения: частичный аналог кинопоиска, где можно найти информацию о фильмах, сериалах и актёрах.

Использовано: 
HTML
CSS
JavaScript
REST API "The Movie Database"

Особенности:

1) По сути приложение представляет собой графическое отображение на экране информации из базы данных The Movie Database(https://www.themoviedb.org/). Создавалась с целью освоить основы HTTP реквестов.

2) Можно найти фильм, актера или сериал.

3) При поиске фильма на экране появятся первые 20 результатов базы данных в виде карточек, на которых будут отображены название фильма, его постер(если есть), рейтинг, длительность и название студии.
На карточку можно кликнуть и просмотреть расширенную информацию: описание фильма, главных актёров, рекомендации.

4)Категория сериалов практически ничем не отличаются от категории фильмов, кроме того что на карточке отображаются количество эпизодов, а не длительность.

5) При поиске актёра карточка будет содержать информацию об имени человека, его изображении, возраста и количества поисков этого актёра(популярность). Также в расширенном виде отображаются наиболее популярные фильмы актёра.

6) Все изображения актёров/фильмов/сериалов внутри карточек кликабельны.
 При нажатии на ссылку будет высвечена сразу расширенная информация о соответствующем объекте, таким образом из описания любого фильма или актера можно по цепочке переходить ко всё новым описаниям.

 
Приложения НЕ адаптировано под любые другие размеры экрана, кроме 1920x1080.

<!-- К сожалению, через некоторое время после того как приложение было сделано, The Movie Database запретили доступ к изображениям с российских IP. Если у Вас есть VPN, то можете воспользоваться им, тогда все картинки будут загружены нормально. -->


 