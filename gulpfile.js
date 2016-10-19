var gulp        = require('gulp'), 
    less        = require('gulp-less'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglifyjs'),
    cssnano     = require('gulp-cssnano'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    imagemin    = require('gulp-imagemin'),
    pngquant    = require('imagemin-pngquant'),
    cache       = require('gulp-cache'),
    autoprefixer= require('gulp-autoprefixer');   

//назва строго як в json файлі

//task
/*
gulp.task('mytask', function(){
    return gulp.src('source-files')  //src повернення виборки
    .pipe(plugin())  //pipe визов якоїсь команди / плагіна
    .pipe(gulp.dest('folder')) //dest шлях призначення
});
*/

gulp.task('less', function() {
    return gulp.src(['!app/less/part.less','app/less/**/*.less']) 
    //  ('!app/less/main.less') щоб виключити цей файл з вибірки
    //  (['!app/less/main.less','app/less/*.less']) усі файли лесс крім main.less
    .pipe(less())
    .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(gulp.dest('app/css')) //не можна писати .файл, бо створить нову папку
    .pipe(browserSync.reload({stream: true}))
});


gulp.task('scripts', function() {
    return gulp.src([
        'app/libs/jquery/dist/jquery.min.js',
        'app/libs/magnific-popup/dist/jquery.magnific-popup.min.js',
    ])
    // [ , , , ] можна перечислити усі бібліотеки через ,   
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'));
});


gulp.task('css-libs', ['less'], function(){   // потестити чи коректно робить //less викликається
    return gulp.src('app/css/libs.css')
    .pipe(cssnano())
    .pipe(rename({suffix: ".min"}))
    .pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function() {
   browserSync({
       server: {
           baseDir: 'app'
       },
       notify: false //виключення повідомлень
   }); 
});

gulp.task('img', function(){
    return gulp.src('app/img/**/*')
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});


//таск для слідкування за змінами файлів
gulp.task('watch', ['browser-sync', 'css-libs', 'scripts'] ,function(){ // [ ] - виконується до того як виконається основна функція
    gulp.watch('app/less/**/*.less', ['less']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    
});

//чистить кеш
gulp.task('clear', function(){
    return cache.clearAll();
});

//чистить папку dist
gulp.task('clean', function(){
    return del.sync('dist/*');
});

gulp.task('build',['clean', 'img' ,'less', 'scripts'], function(){
    var buildCss = gulp.src([
       'app/css/main.css', 
       'app/css/libs.min.css', 
    ])
    .pipe(gulp.dest('dist/css'));
    
    var buildFonts = gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
    
    var buildJs = gulp.src('app/js/**/*')
    .pipe(gulp.dest('dist/js'));
    
    var buildHtml = gulp.src('app/*.html')
    .pipe(gulp.dest('dist'));
    
    var buildLibs = gulp.src('app/libs/*')
    .pipe(gulp.dest('dist/libs'));
});

