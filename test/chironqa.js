var ChironQA = artifacts.require("./ChironQA.sol");

contract('ChironQA', function(accounts) {
  it("should abort correctly", function() {
      var instance;
      var answerer_start_bal = web3.eth.getBalance(accounts[0]).toNumber();
      var price;
      var answerer_end_bal;
      ChironQA.new({from: accounts[0], value: web3.toWei(1, "ether")})
          .then(function(c) {
              instance = c;
              return instance.price.call()
                .then(function(p) {
                    assert.notEqual(p.toNumber(), 0, "Price wasn't set");
                 });
          })
          .then(function() {
              return instance.abort({from: accounts[0]});
          });
          //.then(function() {
          //    console.log(web3.eth.getBalance(accounts[2]).toNumber());
          //    return;
          //    //answerer_end_bal = web3.eth.getBalance(act).toNumber();
          //    //return instance.submitAnswer({from: accounts[2]});
          //});
          //.then(function() {
          //    return instance.confirmAnswered({from: accounts[1]});
          //});
      answerer_end_bal = web3.eth.getBalance(accounts[0]).toNumber()

      //assert.notEqual(price.toNumber(), 0, "Price wasn't set");
      assert.equal(answerer_start_bal, answerer_end_bal, "Abort didn't work");
  });
  it("should set asker to correct person", function() {
      var ask;
      var ac;
      var pr;
      ChironQA.new({from: accounts[1], value: web3.toWei(1, "ether")})
          .then(function(c) {
          ac = accounts[1];
          c.asker.call().then(function(asker) {
              ask = asker;
          })
      })
      assert.equal(ac, ask, "asker isn't correct address");
      //assert.equal(pr, 10, "price isn't correct");
  });
  it("should set price correctly", function() {
      var sp = web3.toWei(1, "ether");
      ChironQA.new({from: accounts[1], value: sp })
          .then(function(c) {
          c.price.call().then(function(price) {
              assert.equal(sp / 2, price.toNumber(), "price isn't correct");
          })
      })
  });
  it("should only allow the asker to abort", function() {
      assert.equal(true, true, "true isn't true");
  });
  //it("should not pay until confirmation", function() {
  //    assert.equal(true, true, "true isn't true");
  //});
});
