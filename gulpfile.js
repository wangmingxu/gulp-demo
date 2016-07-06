var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),
    rev = require('gulp-rev'),
    concat = require('gulp-concat'),
    revReplace = require('gulp-rev-replace'),
    useref = require('gulp-useref'),
    revReplace = require('gulp-rev-replace'),
    revCollector = require('gulp-rev-collector'),
    rename=require('gulp-rename'),
    sass = require('gulp-sass'),
    // connect = require('gulp-connect'),
    browserSync = require('browser-sync').create();

//清空文件夹，避免资源冗余
gulp.task('clean',function(){
    return gulp.src('dist',{read:false}).pipe(clean());
});

//css文件压缩，更改版本号，并通过rev.manifest将对应的版本号用json表示出来
gulp.task('css',function(){
    return gulp.src('app/styles/*.css')
    //.pipe( concat('wap.min.css') )
    .pipe(minifyCss())
    .pipe(rev())
    .pipe(gulp.dest('dist/app/styles/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/css'));
});

//js文件压缩，更改版本号，并通过rev.manifest将对应的版本号用json表示出
gulp.task('js',function(){
    return gulp.src('app/scripts/*.js')
    //.pipe( concat('wap.min.js') )
    .pipe(jshint())
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest('dist/app/scripts/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/rev/js'));
});

//通过hash来精确定位到html模板中需要更改的部分,然后将修改成功的文件生成到指定目录
gulp.task('rev',['css','js'],function(){
    return gulp.src(['dist/rev/**/*.json','app/pages/*.html'])
    .pipe( revCollector() )
    .pipe(gulp.dest('dist/app/pages/'));
});

//合并html页面内引用的静态资源文件
gulp.task('bundle',['rev'], function () {
    return gulp.src('dist/app/pages/*.html')
    .pipe(useref())
    .pipe(rev())
    .pipe(revReplace())
    .pipe(gulp.dest('dist/bundle/'));
});

gulp.task('rename', function () {
    return gulp.src('dist/bundle/index-*.html')
    .pipe(rename("index.html"))
    .pipe(gulp.dest("dist/bundle"));
});

gulp.task('sass', function() {
  gulp.src('app/sass/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('app/styles'));
});

gulp.task('watch',function(){
  gulp.watch('app/sass/*.scss',function(){
      gulp.run('sass');
  });
});

// //使用connect启动一个Web服务器
// gulp.task('connect', function () {
//   connect.server({
//     root: 'dist/bundle',
//     port:3000,
//     livereload: true
//   });
// });


// Static server
gulp.task('browser-sync', function() {
    var files = [
    'app/**/*.html',
    'app/**/*.css',
    'app/**/*.js'
    ];
    browserSync.init(files,{
        server: {
            baseDir: "app/"
        }
    });
});

gulp.task('default',['watch'],function(){
  gulp.run('browser-sync');
});
