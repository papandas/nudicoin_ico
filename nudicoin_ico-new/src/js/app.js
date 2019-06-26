App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  tokenPrice: 1000000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,

  init: function(){
    console.log("App initialized...");
    App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    //console.log(web3)
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("NudiCoinCrowdsale.json", function(dappTokenSale) {
      App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
      App.contracts.DappTokenSale.setProvider(App.web3Provider);
      App.contracts.DappTokenSale.deployed().then(function(dappTokenSale) {
        console.log("Nude coin Sale Address:", dappTokenSale.address);
      });
    }).done(function() {
      $.getJSON("NudiCoin.json", function(dappToken) {
        App.contracts.DappToken = TruffleContract(dappToken);
        App.contracts.DappToken.setProvider(App.web3Provider);
        App.contracts.DappToken.deployed().then(function(dappToken) {
          console.log("Nude Coin Address:", dappToken.address);
        });

        App.listenForEvents();
        return App.render();
      });
    })
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.DappTokenSale.deployed().then(function(instance) {
      console.log("listenForEvents->", instance)
    })
  },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader  = $('#loader');
    var content = $('#content');

    loader.hide();
    content.show();

    
    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      console.log(err, account)
      if(err === null) {
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    })

    // Load token sale contract
    App.contracts.DappTokenSale.deployed().then(function(instance) {
      dappTokenSaleInstance = instance;
      return dappTokenSaleInstance.rate();
    }).then(function(tokenPrice) {
      App.tokenPrice = tokenPrice;
      //console.log(App.tokenPrice.toNumber().toString())
      //console.log(web3.fromWei(App.tokenPrice.toNumber(), 'ether'))
      $('.token-price').html(web3.utils.fromWei(App.tokenPrice, 'ether'));
      return dappTokenSaleInstance.weiRaised();
    }).then(function(tokensSold) {
      //console.log("Token Sold", tokensSold.toNumber())
      //console.log(web3)
      App.tokensSold = web3.utils.BN(tokensSold).toNumber();
      console.log("Tokens Sold", App.tokensSold)
      $('.tokens-sold').html(App.tokensSold);
      return dappTokenSaleInstance.cap();
    }).then(function(tokensAvailable) {
      App.tokensAvailable = web3.utils.BN(tokensAvailable).toString();
      console.log("Tokens Available", App.tokensAvailable)
      $('.tokens-available').html(App.tokensAvailable);

      var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
      $('#progress').css('width', progressPercent + '%');

      // Load token contract
      App.contracts.DappToken.deployed().then(function(instance) {
        dappTokenInstance = instance;
        return dappTokenInstance.balanceOf(App.account);
      }).then(function(balance) {
        $('.dapp-balance').html(balance.toNumber());
        App.loading = false;
        loader.hide();
        content.show();
      })
    });
  },

  buyTokens: function() {
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.DappTokenSale.deployed().then(function(instance) {
      console.log("numberOfTokens", numberOfTokens)
      console.log("value", (numberOfTokens * App.tokenPrice))
      console.log("From", App.account)
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000 // Gas limit
      });
    }).then(function(result) {
      console.log("Tokens bought...")
      $('form').trigger('reset') // reset number of tokens in form
      // Wait for Sell event
    });
  }
}

$(function() {
  $(window).load(function() {
    App.init();
  })
});