'use strict';

module.exports = function unthenify( fn, context ) {
    return function callback() {
        const args = [].slice.call( arguments, 0, arguments.length - 1 );
        const done = arguments[arguments.length - 1];
        fn.apply( context || this, args )
        .then( res => done( null, res ))
        .catch( done );
    };
};
