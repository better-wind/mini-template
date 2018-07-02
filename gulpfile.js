const fs = require('fs');
const path = require('path');

const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const del = require('del');
const runSequence = require('run-sequence');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');

var callfile = require('child_process'); 
var notifier = require('gulp-notify');
var colors = require('colors'); 
var onError = function(err) {
    console.log(err)
    notifier.onError({
        title: 'Gulp',
        subtitle: 'Failure!',
        message: 'Error: <%= error.message %>',
        timeout: 5,
        sound: 'Beep'
    })(err);
}

var base64 = require('gulp-base64');
var plumber = require('gulp-plumber');


const plugins = gulpLoadPlugins();

const env = process.env.NODE_ENV || 'dev';
const isProduction = () => env === 'dev';

gulp.task('clean', del.bind(null, ['dist/*']))

gulp.task('compile:js', () =>
    gulp.src(['src/**/*.js','!src/utils/config.js','!src/utils/config.dev.js'])
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(plugins.babel())
        // .pipe(plugins.if(isProduction, plugins.uglify()))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))

)

gulp.task('compile:xml', () =>
     gulp.src(['src/**/*.xml'])
        // .pipe(plugins.sourcemaps.init())
        .pipe(plugins.if(isProduction, plugins.htmlmin({
            removeComments: true,   // 删除注释
        })))
        .pipe(plugins.rename({ extname: '.wxml' }))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
)
gulp.task('compile:less', () =>
    gulp.src(['src/**/*.less', '!src/common/*'])
        // .pipe(plugins.sourcemaps.init())
        .pipe(base64({
            extensions: ['svg', 'png', 'jpg'],
            maxImageSize: 1024 * 1024 * 1024 * 1024
        }))
        .pipe(plugins.less())
        .pipe(autoprefixer())
        .on("error", notifier.onError(function(error) {
            return "Message to the notifier: " + error.message;
        }))

        // .pipe(plugins.if(isProduction, plugins.cssnano({ compatibility: '*' })))
        .pipe(plugins.rename({ extname: '.wxss' }))
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
    // .pipe(notifier("Gulp down"))
    // .pipe(notifier("Gulp down"))

)
gulp.task('compile:json', () =>
    gulp.src(['src/**/*.json'])
        // .pipe(plugins.sourcemaps.init())
        .pipe(plugins.jsonminify())
        .pipe(plugins.sourcemaps.write('.'))
        .pipe(gulp.dest('dist'))
)
gulp.task('compile:img', () =>
    gulp.src(['src/icon/**/*.{jpg,jpeg,png,gif}'])
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist'))
)
gulp.task('compile', ['clean'], next => {
    runSequence([
        'compile:js',
        'compile:xml',
        'compile:less',
        'compile:json',
        'compile:img'
    ], next)
})
gulp.task('extras', [], () =>
    gulp.src([
            'src/**/*.*',
            '!src/**/*.js',
            '!src/**/*.xml',
            '!src/**/*.less',
            '!src/**/*.json',
            '!src/**/*.{jpeg,png,gif}'
        ])
        .pipe(gulp.dest('dist'))
        .pipe(notifier("Gulp down"))

)
gulp.task('build', next => runSequence(['compile', 'extras'], next))

gulp.task('config', [], () => {
    var src;
    if(env=='dev'){
        src = 'project.config.dev.json'
    }else{
        src = 'project.config.json'
    }
        
    return gulp.src(src)
        .pipe(rename({
            basename:'project.config'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(notifier("Gulp down"))
        // child_process.exec(cmd, [options], callback)
})

gulp.task('openTool',[],()=>{

   var wechartToolPath="";

    // var ishave = fs.existsSync('wechartToolPath.js');
    // if(ishave){
    //     var wechartpatr = require('./wechartToolPath');
    //     wechartToolPath = wechartpatr.path
    //
    // }else{
    //     fs.writeFileSync('wechartToolPath.js',`const wechartTool={ \n path:'' \n} \n module.exports=wechartTool;`)
    //     console.log('打开失败请在wechartToolPath.js中填写路径'.red)
    // }

    var ishave = fs.existsSync('wechartToolPath.js');
    if(!ishave){
        try{
            fs.writeFileSync('wechartToolPath.js',`const wechartTool={ \n path:'' \n} \n module.exports=wechartTool;`)
            console.log('打开失败请在wechartToolPath.js中填写路径'.red)
            return
        } catch (e) {
            console.log(e)
        }

    }

    var wechartpatr = require('./wechartToolPath');
    wechartToolPath = wechartpatr.path



    var projectPath = __dirname+'/dist';
    callfile.execFile(`${wechartToolPath}/Contents/Resources/app.nw/bin/cli`,['-o',projectPath],(err,stdout,stderr)=>{
            if(err){
                console.log(('打开失败：\n'+err).red)
                return
            }
            if(stderr){
                console.log(('工具内报错\n'+stderr).red)
                return
            }
            console.log(('工具打开成功 \n'+stdout).green)
            
        })
    })


gulp.task('addConfig',[],()=>{
   var src;
    if(env=='dev'){
        src = 'src/utils/config.dev.js'
    }else{
        src = 'src/utils/config.js'
    }

    return gulp.src(src,{ base: 'src' })
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(plugins.babel())
        // .pipe(plugins.if(isProduction, plugins.uglify()))

        .pipe(plugins.sourcemaps.write('.'))
        .pipe(rename({
            basename:'config'
        }))
        .pipe(gulp.dest('dist'))  

})

gulp.task('watchProcess', next => {
    runSequence(['build','config','addConfig','openTool'], next)
})

gulp.task('watch', ['watchProcess'], () => {
    gulp.watch('src/**/*.{jpe?g,png,gif}', ['compile:img'])
    // gulp.watch('src/**/*.js', ['compile:js'])
    gulp.watch('src/**/*.js', (res) => {
        var _path = __dirname;
        var pagepath = res.path.replace(_path + '/', '');

        gulp.src(pagepath, { base: 'src' })
            .pipe(plumber({
                errorHandler: onError
            }))
            .pipe(plugins.babel())
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest('dist'))
            .pipe(notifier("Gulp down"))
    })

    gulp.watch('src/**/*.xml', ['compile:xml'])
    gulp.watch('src/**/*.less', (res)=>{
        var _path = __dirname;
        var pagepath = res.path.replace(_path + '/', '');

         return gulp.src(pagepath, { base: 'src' })
            .pipe(base64({
                extensions: ['svg', 'png', 'jpg'],
                maxImageSize: 1024 * 1024 * 1024 * 1024
            }))
            .pipe(plugins.less())
            .pipe(autoprefixer())
            .on("error", notifier.onError(function(error) {
                console.log(1111111111)
                return "Message to the notifier: " + error.message;
            }))
            .pipe(plugins.rename({ extname: '.wxss' }))
            .pipe(plugins.sourcemaps.write('.'))
            .pipe(gulp.dest('dist'))
            .pipe(notifier("Gulp down"))

    })
    gulp.watch('src/**/*.json', ['compile:json'])

})
gulp.task('default', ['watch'])