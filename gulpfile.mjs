import gulp from 'gulp'
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import purgeCSS from 'gulp-purgecss';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import optipng  from 'imagemin-optipng';
import svgo from 'imagemin-svgo';

gulp.task('minify-css',()=>{
    return gulp.src('src/app/**/*.css') // select all css files
    .pipe(purgeCSS({ content :['src/app/**/*.html', 'src/app/**/*.ts'],
        safelist:['active','show','hidden','^mat-/'],
        keyframes: true 
    })) // Remove unused CSS
    .pipe(cleanCSS({level:{ 2: {all:true}}})) // Aggressive compression
    .pipe(rename({suffix: '.min'})) // Rename minified files
    .pipe(gulp.dest('src/app')); // save optimized css
})

gulp.task('optimize-images',()=>{
    return gulp.src('src/assets/**/*.{png,jpg,jpeg,gif,svg}')
    .pipe(imagemin([
        mozjpeg({ quality: 80, progressive: true}), // Compress JPEG
        optipng({ optimizationLevel: 10}), // compress PNG
        svgo({ plugins :[{ removeViewBox: false}]}) //optimize SVG
    ]))
    .pipe(gulp.dest('src/assets'));
})
gulp.task('default',gulp.series('minify-css', 'optimize-images'));