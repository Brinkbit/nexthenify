# nexthenify

> Useful for developing asynchronous express middleware

Turn this:

```javascript
foo( 'someValue' )
.then(function bar() {
    // we finished
});
```

into this:

```javascript
// bar expects a callback where the last argument is a `done` or `next` callback
bar( 'someValue', function( someValue, next ) {
    foo( someValue, next );
});
```

# Install

```
npm i --save nexthenify
```

# Examples

Basic usage

```javascript
const nexthenify = require( 'nexthenify' );

function foo( value ) {
    return new Promise(( resolve, reject ) => {
        if ( value === 1 ) resolve( 'is 1' );
        else reject( 'not 1' );
    });
}

bar( 'someValue', nexthenify( foo ));
```

Optionally pass a context to use:

```javascript
bar( 'someValue', nexthenify( foo, this ));
```

# Tests

Requires gulp: `npm i -g gulp`

```
npm test
```
