'use strict';

var gulp = require('gulp'),
clean = require('gulp-clean'),
sass = require('gulp-sass'),
concat = require('gulp-concat'),
pug = require('gulp-pug'),
autoprefixer = require('gulp-autoprefixer'),
browserSync = require('browser-sync').create(),
sourcemaps = require('gulp-sourcemaps'),
src = './app',
autoprefixerOptions = {browsers: ['last 2 versions', '> 5%', 'Firefox ESR']};


//Task para limpar o dist, caso seja necessário!
gulp.task('clean', function () {
	return gulp.src('./dist/', {read: false})
	.pipe(clean());
}); 
// Task para enviar as imagens do app para o dist.
gulp.task('image', () =>
gulp.src(src + '/images/**')
.pipe(gulp.dest('dist/images'))
);
// Caso o projeto necessite de fonts externas!
gulp.task('fonts', () =>
gulp.src(src + '/scss/fonts/**')
.pipe(gulp.dest('dist/css/fonts'))
);
// Compila o Pug em html!
gulp.task('pages', function() {	
	gulp.src(src + '/*.pug')
	.pipe(pug({
		pretty: true
	}))
	.pipe(gulp.dest('./dist/'))
	.pipe(browserSync.stream());
});
// compila o Sass em css
gulp.task('sass', function () {
	return gulp.src(src + '/scss/*.scss')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'}))
	.on('error', function(err){
		browserSync.notify(err.message, 3000);
		this.emit('end');
	})
	.pipe(autoprefixer(autoprefixerOptions))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./dist/css/'))
	.pipe(browserSync.stream());
});

// Complia o javascript em apenas um script
gulp.task('scripts', function() {
	return gulp.src(src + '/js/*.js')
	.pipe(sourcemaps.init())
	.pipe(concat('main.js'))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./dist/js'))
	.pipe(browserSync.stream());
});

// Envia jSon que o projeto necessite para rodar!
gulp.task('scripts_json', function() {
	return gulp.src(src + '/js/*.json')
	.pipe(gulp.dest('./dist/js'))
	.pipe(browserSync.stream());
});

gulp.task('serve', ['sass', 'pages','image', 'scripts', 'fonts', 'scripts_json'], function() {
	browserSync.init({
		server: "./dist"
	});
	gulp.watch(src + "/scss/**/*.scss", ['sass']);
	gulp.watch(src + '/**/*.pug', ['pages']);
	gulp.watch(src + '/images/', ['image']);
	gulp.watch(src + '/js/**.{js,json}', ['scripts']);
	gulp.watch(src + '/js/**.json', ['scripts_json']);
});

gulp.task('default', ['serve']);