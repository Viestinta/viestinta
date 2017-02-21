/**
 * Created by jacob on 20.02.17.
 */
//Hack for pg issues
var pg = require('pg');
delete pg.native;

var User = require('../server/models/').User
var assert = require('assert')

//Extra test frameworks:
//var should = require('should');


//Defines alphabet to be used
var s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";


//Defines the function to generate the names to be used for the test
//Returns a random String with N length and based on the alphabet s

var testNameGenerator = function (N) {
    return Array(N).join().split(',').map(function() { return s.charAt(Math.floor(Math.random() * s.length)); }).join('');
}

//Unique first_name and last_name for each test
var first_name1 = testNameGenerator(10);
var last_name1 = testNameGenerator(10);
var first_name2 = testNameGenerator(10);
var last_name2 = testNameGenerator(10);
var first_name3 = testNameGenerator(10);
var last_name3 = testNameGenerator(10);


//Builds the User object with the corresponding name. Does not save the User objects to the database.
var testUser1 = User.build({first_name: first_name1, last_name: last_name1});
var testUser2 = User.build({first_name: first_name2, last_name: last_name2});
var testUser3 = User.build({first_name: first_name3, last_name: last_name3});

//Creates a tuple array for the test
var testArray = [   [testUser1, first_name1 + " " + last_name1],
                    [testUser2, first_name2 + " " + last_name2],
                    [testUser3, first_name3 + " " + last_name3]
    ];

//Test1
testArray.forEach(function(arrElement, callback) {
    describe('Build test for name: ' + arrElement[0].first_name + " " + arrElement[0].last_name, function() {
        it('Name to local User object is identical to name generated', function(done) {
            assert.equal(arrElement[0].first_name + " " + arrElement[0].last_name, arrElement[1])
            done();
        });
    });
});

//WORK IN PROGRESS

/*

//Creates the User object with the corresponding name. Saves the User objects to the database.
User.create({first_name: first_name1, last_name: last_name1});
User.create({first_name: first_name2, last_name: last_name2});
User.create({first_name: first_name3, last_name: last_name3});


//Get the User object from the database
var test2User1 = User.get();

//Creates a tuple array for the test
var test2Array = [   [test2User1, first_name1 + " " + last_name1],
    [test2User2, first_name2 + " " + last_name2],
    [test2User3, first_name3 + " " + last_name3]
];

//Test2
test2Array.forEach(function(arrElement, callback) {
    describe('Database test for name: ' + arrElement[0].first_name + " " + arrElement[0].last_name, function() {
        it('Name to User object in database is identical to name generated', function(done) {
            assert.equal(arrElement[0].first_name + " " + arrElement[0].last_name, arrElement[1])
            done();
        });
    });
});
*/



/*
describe('User', function () {
    describe('#create()', function () {
        it('should be able to create User', function () {

            user1 = User.build({first_name: 'Jacob', last_name: 'Tørring'});
            assert.equal(user1.first_name + " " + user1.last_name, 'Jacob Tørring');
            assert.equal(user1.first_name + " " + user1.last_name, 'Jacob Tørring');
        });
    });
});

*/

/*
describe('User', function () {
    describe('#create()', function () {
        it('should create without error', function(done) {
            User
                .build({firstName: 'Jacob', lastName: 'Tørring'})
                .save()
                .then(function (anotherTask) {
                    assert.equal(anotherTask.fullName(), 'Jacob Tørring');
                    done()
                }).catch(function (error) {
                    console.error(error);
                    done()
                });
        });
    });
});

*/