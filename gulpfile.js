var gulp        = require('gulp'), 
    less        = require('gulp-less'),
    browserSync = require('browser-sync'),
    concat      = require('gulp-concat'),
    uglify     = require('gulp-uglifyjs');  
//назва строго як в json файлі

//task
/*
gulp.task('mytask', function(){
    return gulp.src('source-files')  //src повернення виборки
    .pipe(plugin())  //pipe визов якоїсь команди / плагіна
    .pipe(gulp.dest('folder')) //dest шлях призначення
});
*/

gulp.task('less', function(){
    return gulp.src('app/less/main.less') 
    //  ('!app/less/main.less') щоб виключити цей файл з вибірки
    //  (['!app/less/main.less','app/less/*.less']) усі файли лесс крім main.less
    .pipe(less())
    .pipe(gulp.dest('app/css')) //не можна писати .файл, бо створить нову папку
    .pipe(browserSync.reload({stream: true}))
});

gulp.task("scripts", function(){
   return gulp.src('app/libs/jquery/dest/jquery.min.js') 
       // [ , , , ] можна перечислити усі бібліотеки через ,   
   .pipe(concat('libs.min.js'))
   .pipe(uglify())
   .pipe(gulp.dest('app/js')); 
});

gulp.task('browser-sync', function(){
   browserSync({
       server: {
           baseDir: 'app'
       },
       notify: false //виключення повідомлень
   }); 
});

//таск для слідкування за змінами файлів
gulp.task('watch', ['browser-sync', 'less'] ,function(){ // [ ] - виконується до того як виконається основна функція
    gulp.watch('app/less/**/*.less', ['less']);
    gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    
});

