'use strict';

const gulp = require( 'gulp' );
const mocha = require( 'gulp-mocha' );
const isparta = require( 'isparta' );
const istanbul = require( 'gulp-istanbul' );
const documentation = require( 'gulp-documentation' );

gulp.task( 'pre-test', () => {
    return gulp.src( 'src/**/*.js' )
    .pipe( istanbul({
        instrumenter: isparta.Instrumenter,
    }))
    .pipe( istanbul.hookRequire());
});

gulp.task( 'docs', () => {
    return gulp.src( 'src/**/*.js' )
    .pipe( documentation({ format: 'md' }))
    .pipe( gulp.dest( 'docs' ));
});

gulp.task( 'test', ['pre-test'], () =>
    gulp.src( 'test/**/*.js', { read: false })
    .pipe( mocha())
    .pipe( istanbul.writeReports())
    .once( 'error', error => {
        console.log( error.message, error.stack ); // eslint-disable-line no-console
        process.exit( 1 );
    })
    .once( 'end', () => {
        process.exit( 0 );
    })
);
