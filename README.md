# Carousel / Slider  responsive

> This plugin made with 
>    * Vanilla JavaScript
>    * Css Framwork Bulma (not important)
>    * Sass Preprocessor
>    * Pug template engine
>    * Gulp as task runner
---

###  Required
* nodejs

>
>    visite [Nodejs](http://nodejs.org/) site to install
>

* Gulp in global

```
$ npm install gulp-cli -g

```


### Installation


```
$ cd 'to the folder cloned' 

$ npm i 
or
$ yarn

```



### Developpement Serve

```
$ gulp

```


### Serve the Fully Built & Optimized Site

```
$ gulp build

```
---
Structure on source file
------

>* src
>    - assets
>        1. images
>            - chevron_left.svg
>            - chevron_right.svg
>        2. styles
>            - bulma.sass
>            - main.sass
>            - slider.sass (***minimum style to make the slider work correctly***)
>        3. scripts
>            - slider.js
>            - touchMobile.js
>    - template
>       - index.pug    
>       - slider.pug

How to user
------

### add link to the files
add the slider plugin js to the html file

add the slider plugin css to the html file

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <!-- styles of the slider -->
    <link rel="stylesheet" href="assets/styles/main.css">
    
    <!-- javascript plugin of the slider -->
    <script src="assets/scripts/slider.js" type="module" defer></script>
</head>
<body>
    
</body>
</html>

```
---
### add link to the files

minimal html structure

```HTML
<section>
    <!-- the root element of the slider -->
    <div class="container" id="slider">
        <!-- your slides here ex -->
        <div class="project columns">
            <div class="column">
                <div class="media">
                    <div class="media-content">
                        <p class="title is-4">Title </p>
                    </div>
                </div>
                <div class="content">
                    Lorem ipsum dolor sit amet.
                </div>
                <div class="content">
                    <button class="button is-danger is-outlined">voir plus</button>
                </div>
            </div>
        
            <div class="column">
                <figure class="image is4by3">
                    <img src="" alt='Placeholder image' , height="400">
                </figure>
            </div>
        </div>
        <div class="project columns">
            ...
        </div>
        <div class="project columns">
            ...
        </div>
        <div class="project columns">
            ...
        </div>
    </div>
</section>

```
---

### Init the plugin

add script tag on html and call the class

```HTML
<!DOCTYPE html>
<html lang="en">
<head>
    ...
</head>
<body>
    ...

    <!-- call and init the class -->
    <script>
        // wait until the dom ready
        document.addEventListener('readystatechange', () => {
            let options =  {
                slidesVisible: 2,
                slidesToScroll: 2,
                loop: false,
                infinite: true,
                pagination: true
            }
            // init the slider with #slider as selector
        new Slider(document.querySelector('#slider'), options)

        })
    </script>
</body>
</html>
````
---

### Plugin's options

Default options are :
```JSON
{
      slidesToScroll: 1,
      slidesVisible: 1,
      loop: false,
      pagination: false,
      navigation: true,
      infinite: false
}
```

<dl>
    <dt>SlidesToScroll</dt>
    <dd>Nbr of slides to scroll.</dd>
    <dt>SlidesVisible</dt>
    <dd>Nbr of slides to visible.</dd>
    <dt>Loop</dt>
    <dd>Active looop | <b>if loop active infinit must be false</b></dd>
    <dt>Pagination</dt>
    <dd>Active pagination</dd>
    <dt>Navigation</dt>
    <dd>Active navigation</dd>    
    <dt>Infinite</dt>
    <dd> Active infinite loop | <b>if infinite active loop must be false</b></dd>
</dl>

---

##### Version
1.1

##### License
MIT