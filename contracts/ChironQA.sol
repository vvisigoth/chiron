pragma solidity ^0.4.11;

contract ChironQA {

  // How much are you willing to pay for q?
  uint public price;

  // Address of asker
  address public asker;
  // Address of answerer
  address public answerer;

  // State of the question
  enum State { Asked, Locked, Inactive }

  State public state;

  // Put some either in escrow while waiting for answer
  function ChironQA() payable {
    asker = msg.sender;
    price = msg.value / 2;
    // Why?
    require((2 * price) == msg.value);
  }

  modifier condition(bool _condition) {
    require(_condition);
    _;
  }

  modifier onlyAsker() {
    require(msg.sender == asker);
    _;
  }

  modifier onlyAnswerer() {
    require(msg.sender == answerer);
    _;
  }

  modifier inState(State _state) {
    require(state == _state);
    _;
  }

  event Aborted();
  event AnswerSubmitted();
  event AnswerAccepted();

  /// Abort the qustion and reclaim the ether.
  /// Can only be called by the asker before
  /// the contract is locked.
  function abort()
  onlyAsker()
  inState(State.Asked)
  {
    Aborted();
    state = State.Inactive;
    asker.transfer(this.balance);
  }

  /// Submit an answer and await payment
  /// Transaction has to include `2 * price` ether.
  /// The ether will be locked until confirmReceived
  /// is called.
  function submitAnswer()
  inState(State.Asked)
  onlyAnswerer
  //condition(msg.value == (2 * price))
  //payable
  {
    AnswerSubmitted();
    answerer = msg.sender;
    state = State.Locked;
  }

  /// Confirm that you (the asker) accept the answer
  /// This will release the locked ether.
  function confirmAnswered()
  onlyAsker
  inState(State.Locked)
  {
    AnswerAccepted();
    // It is important to change the state first because
    // otherwise, the contracts called using `send` below
    // can call in again here.
    state = State.Inactive;

    // NOTE: This actually allows both the buyer and the seller to
    // block the refund - the withdraw pattern should be used.

    //asker.transfer(price);
    answerer.transfer(this.balance);
  }
}
