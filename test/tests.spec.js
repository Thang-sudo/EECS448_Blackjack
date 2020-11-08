//for test

var should = chai.should();

describe("Start Multiplayer Mode Test",function(){
    it("If number not equal -1",function(){
        var number=startMultiPlayerMode();
        should.equal(number,playerNum)
    });
});

describe("Hit function Test",function(){
    it("if Hit",function(){
        var number=Hit();
        should.equal(number,playerNum)
    });
});

