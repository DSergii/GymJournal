'use strict';
	
	var gulp = require('gulp'),
		webserver = require('gulp-webserver'),
		sass = require('gulp-sass'),
		concat = require('gulp-concat'),
		csso = require('gulp-csso');

var bc = './bower_components/';
	
	gulp.task('js', function() {
	  gulp.src('development/app/**/*.js')
		.pipe(concat('app.js'))
		.pipe(gulp.dest('dist/app/'))
	});
	
	gulp.task('html', function() {
		gulp.src('development/**/*.html')
		.pipe(gulp.dest('dist/'))
	});
	
	gulp.task('sass', function () {
		gulp.src('development/sass/**/*')
		.pipe(sass())
		.pipe(concat('style.min.css'))
		.pipe(csso())
		.pipe(gulp.dest('dist/css/'));
	});
	
	gulp.task('img', function() {
	  gulp.src('development/img/**/*')
		.pipe(gulp.dest('dist/img/'));
	});
	
	gulp.task('watch', function() {
		 gulp.watch('development/app/**/*.js', ['js']);
		gulp.watch('development/sass/**/*', ['sass']);
		gulp.watch('development/**/*.html', ['html']);
		gulp.watch('development/img/**/*', ['img']);
	});
	
	gulp.task('libs', function() {
		gulp.src(bc+'jquery/dist/jquery.js')
		.pipe(gulp.dest('./dist/libs/jquery/'));
		
		gulp.src(bc+'bootstrap/dist/**/*.*')
		.pipe(gulp.dest('./dist/libs/bootstrap/'));
		
		gulp.src(bc+'bootstrap-material-design/dist/**/*.*')
		.pipe(gulp.dest('./dist/libs/bootstrap-material-design/'));
		
		gulp.src([bc+'angular/angular.js',
		bc+'angular-animate/angular-animate.js',
		bc+'angular-cookies/angular-cookies.js',
		bc+'angular-i18n/angular-locale_ru-ru.js',
		bc+'angular-loader/angular-loader.js',
		bc+'angular-resource/angular-resource.js',
		bc+'angular-route/angular-route.js',
		bc+'angular-sanitize/angular-sanitize.js',
		bc+'angular-touch/angular-touch.js',
		bc+'firebase/firebase.js',
		bc+'angularfire/dist/angularfire.js',
		])
		.pipe(gulp.dest('./dist/libs/angular/'));
	});
	
	gulp.task('webserver', function() {
		gulp.src('dist/')
			.pipe(webserver({
			livereload: true,
			open: true
		}));
	});
	
	gulp.task('default', [
		'libs',
		'html',
		'img',
		'js',
		'sass',
		'webserver',
		'watch'
	]);