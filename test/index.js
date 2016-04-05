'use strict';

const chai = require( 'chai' );
const sinonChai = require( 'sinon-chai' );
const chaiaspromised = require( 'chai-as-promised' );
const sinon = require( 'sinon' );

const unthenify = require( '../src' );

const expect = chai.expect;
chai.use( sinonChai );
chai.use( chaiaspromised );
chai.config.includeStack = true;

describe( 'unthenify', function() {
    const arity1 = ( param1 ) => {
        return new Promise(( resolve, reject ) => {
            if ( param1 === 'error' ) reject( 'Test Error' );
            else resolve( param1 );
        });
    };

    const arity5 = ( param1, param2, param3, param4, param5 ) => {
        return new Promise(( resolve, reject ) => {
            if ( param1 === 'error' ) reject( 'Test Error' );
            else resolve({ param1, param2, param3, param4, param5 });
        });
    };

    describe( 'arity functions', function() {
        it( 'arity1 should resolve', function() {
            return expect( arity1( 'param1' )).to.eventually.equal( 'param1' );
        });

        it( 'arity5 should resolve', function() {
            return expect( arity5( 'param1', 'param2', 'param3', 'param4', 'param5' )).to.eventually.deep.equal({
                param1: 'param1',
                param2: 'param2',
                param3: 'param3',
                param4: 'param4',
                param5: 'param5',
            });
        });
    });

    it( 'should convert to any-arity node-style callback without error', function( done ) {
        const spy = sinon.spy();
        const arity2 = unthenify( arity1 );
        arity2( 'param1', spy );
        setTimeout(() => {
            expect( spy ).to.have.been.called;
            expect( spy ).to.have.been.calledWith( null, 'param1' );
            done();
        }, 10 );
    });

    it( 'should convert to any-arity node-style callback and error', function( done ) {
        const spy = sinon.spy();
        const arity2 = unthenify( arity1 );
        arity2( 'error', spy );
        setTimeout(() => {
            expect( spy ).to.have.been.called;
            expect( spy ).to.have.been.calledWith( 'Test Error' );
            done();
        }, 10 );
    });

    it( 'should convert to any-arity node-style callback without error', function( done ) {
        const spy = sinon.spy();
        const arity6 = unthenify( arity5 );
        arity6( 'param1', 'param2', 'param3', 'param4', 'param5', spy );
        setTimeout(() => {
            expect( spy ).to.have.been.called;
            expect( spy ).to.have.been.calledWith( null, {
                param1: 'param1',
                param2: 'param2',
                param3: 'param3',
                param4: 'param4',
                param5: 'param5',
            });
            done();
        }, 10 );
    });

    it( 'should convert to any-arity node-style callback and error', function( done ) {
        const spy = sinon.spy();
        const arity6 = unthenify( arity5 );
        arity6( 'error', spy );
        setTimeout(() => {
            expect( spy ).to.have.been.called;
            expect( spy ).to.have.been.calledWith( 'Test Error' );
            done();
        }, 10 );
    });

    it( 'should default to context of generated function', function( done ) {
        const context = {};
        const arity2 = unthenify( function callback() {
            expect( this ).to.equal( context );
            return Promise.resolve();
        }).bind( context );
        arity2( 'param1', done );
    });

    it( 'should accept a context as an additional parameter', function( done ) {
        const context = {};
        const context2 = {};
        const arity2 = unthenify( function callback() {
            expect( this ).to.equal( context2 );
            return Promise.resolve();
        }, context2 ).bind( context );
        arity2( 'param1', done );
    });
});
