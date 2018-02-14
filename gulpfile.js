var     gulp           = require('gulp'),
		gutil          = require('gulp-util' ),
		sass           = require('gulp-sass'),
		browserSync    = require('browser-sync'),
		concat         = require('gulp-concat'),
		uglify         = require('gulp-uglify'),
		cleanCSS       = require('gulp-clean-css'),
		rename         = require('gulp-rename'),
		del            = require('del'),
		imagemin       = require('gulp-imagemin'),
		cache          = require('gulp-cache'),
		autoprefixer   = require('gulp-autoprefixer'),
		ftp            = require('vinyl-ftp'),
		notify         = require("gulp-notify"),
		gcmq 		   = require('gulp-group-css-media-queries'),
		rsync          = require('gulp-rsync');

// общий файл js
gulp.task('common-js', function() {
	return gulp.src([
		'app/js/common.js',
		])
	.pipe(concat('common.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'));
});

// весь набор js скриптов
gulp.task('js', ['common-js'], function() {
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		'app/libs/bootstrap-4.0.0-dist/js/bootstrap.min.js',
		'app/js/common.min.js', // Всегда в конце
		])
	.pipe(concat('scripts.min.js'))
	// .pipe(uglify()) // Минимизировать весь js (на выбор)
	.pipe(gulp.dest('app/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('browser-sync', function() {
	browserSync({
		// server: {
		// 	baseDir: 'app'
		// },
		notify: false,
		proxy: "test1.loc",
		// tunnel: true,
		// tunnel: "projectmane", //Demonstration page: http://projectmane.localtunnel.me
	});
});

// компиляция sass
gulp.task('sass', function() {
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({outputStyle: 'expand'}).on("error", notify.onError()))
	.pipe(gcmq())
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(autoprefixer(['last 15 versions']))
	// .pipe(cleanCSS()) // Опционально, закомментировать при отладке
	.pipe(gulp.dest('app/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('watch', ['sass', 'js', 'browser-sync'], function() {
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch(['libs/**/*.js', 'app/js/common.js'], ['js']);

	// gulp.watch('*.html', browserSync.reload);
	gulp.watch('*.php', browserSync.reload);
});

// генерация сетки smartgrid
var smartgrid = require('smart-grid');
gulp.task('grid', function() {
	/* It's principal settings in smart grid project */
	var settings = {
	    outputStyle: 'sass', /* less || scss || sass || styl */
	    columns: 12, /* number of grid columns */
	    offset: '30px', /* gutter width px || % */
	    mobileFirst: false, /* mobileFirst ? 'min-width' : 'max-width' */
	    container: {
	        maxWidth: '1134px', /* max-width оn very large screen */
	        fields: '15px' /* side fields */
	    },
	    breakPoints: {
	        md: {
	            width: '1134px', /* -> @media (max-width: 1134px) */
	        },
	        sm: {
	            width: '972px', /* -> @media (max-width: 1024px) */ 
	        },
	        xs: {
	            width: '714px', /* -> @media (max-width: 714px) */
	            fields: '15px' /* set fields only if you want to change container.fields */
	        },
	        // xs: {
	        //     width: '560px'
	        // }
	        /* 
	        We can create any quantity of break points.
	 
	        some_name: {
	            width: 'Npx',
	            fields: 'N(px|%|rem)',
	            offset: 'N(px|%|rem)'
	        }
	        */
	    }
	};
	 
	smartgrid('app/libs/', settings);	
});		