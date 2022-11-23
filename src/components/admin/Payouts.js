import React, { useState, useEffect } from "react";
import FormBox from "../form/FormBox";
import "./Payouts.css";
import "./Admin.css";
import "../register/MyAccount.css";
import { useNavigate } from "react-router-dom";
import { db, fetchCurrentUser, truncateAddress } from "../../firebase";
import {
  ref as dRef,
  set,
  get,
  onValue,
  runTransaction,
} from "firebase/database";
import dateFormat from "dateformat";

const Payouts = () => {
  let navigate = useNavigate();
  const [poolBalance, setPoolBalance] = useState("0.00");
  const [showConfirm, setShowConfirm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [adminUser, setAdminUser] = useState(false);
  const [userData, setUserData] = useState();
  const [payoutData, setPayoutData] = useState();
  const [concertData, setConcertData] = useState();
  const [adminView, setAdminView] = useState(2);

  const [cid, setCid] = useState();
  const [price, setPrice] = useState();
  const [txDate, setTxDate] = useState();
  const [tx, setTx] = useState();

  var capDate = new Date(txDate);

  const [reviewTx, setReviewTx] = useState(false);

  //set current user
  useEffect(() => {
    setCurrentUser(fetchCurrentUser());
  }, []);

  //get user data
  useEffect(() => {
    if (currentUser) {
      var userDataRef = dRef(db, "users/" + currentUser.user.uid);
      onValue(userDataRef, (snapshot) => {
        var data = snapshot.val();
        setUserData(data);
      });
    }
  }, [currentUser]);

  //Check if user is admin
  useEffect(() => {
    if (userData?.userType === "admin") {
      setAdminUser(true);
    } else setAdminUser(false);
  }, [currentUser, userData]);

  //get concert data && payout data
  useEffect(() => {
    var concertDataRef = dRef(db, "concerts/");
    onValue(concertDataRef, (snapshot) => {
      var cData = snapshot.val();
      setConcertData(cData);
    });
    var payoutDataRef = dRef(db, "payouts/");
    onValue(payoutDataRef, (snapshot) => {
      var pData = snapshot.val();
      setPayoutData(pData);
    });
  }, []);

  const confirmPayout = async () => {
    var payoutIdRef = dRef(db, "payouts/payoutID");
    runTransaction(payoutIdRef, (payoutID) => {
      if (payoutID) {
        pushPayout(payoutID);
        payoutID++;
      }
      return payoutID;
    });
  };

  const pushPayout = async (id) => {
    console.log("pushing wiht id: ", id);
    var payoutDateString = dateFormat(capDate, "mm/dd/yyyy, hh:MM:ss TT Z ");
    var payoutRef = dRef(db, "payouts/" + parseInt(id));
    var concertPayoutRef = dRef(
      db,
      "concerts/" + cid + "/payouts/" + parseInt(id)
    );
    set(payoutRef, {
      concertID: cid,
      amount: price,
      date: payoutDateString,
      tx: tx,
    }).then(
      set(concertPayoutRef, {
        concertID: cid,
        amount: price,
        date: payoutDateString,
        tx: tx,
      }).then(() => {
        setReviewTx(false);
        setCid();
        setPrice();
        setTxDate();
        setTx();
        alert(`Transaction #${id} Added to DB`);
      })
    );
  };

  const getPayout = () => {
    var paymentcount = 0;
    var totalpayments = 0;

    for (var pays in payoutData) {
      paymentcount++;
      totalpayments = totalpayments + parseFloat(payoutData[pays].amount);
    }
    return totalpayments;
  };

  const getArtistIncome = () => {
    var totalIncome = 0;

    for (var concert in concertData) {
      var price = parseFloat(concertData[concert].concertPrice);
      for (var sale in concertData[concert].sales) {
        console.log(
          "concert #",
          concert,
          " adding ",
          price,
          " to ",
          totalIncome
        );
        totalIncome = totalIncome + price;
      }
    }
    return totalIncome * 0.8;
  };

  const [totalPayout, setTotalPayout] = useState(0);
  const showPayouts = () => {
    var paymentcount = 0;
    var totalpayments = 0;

    for (var pays in payoutData) {
      paymentcount++;
      totalpayments = totalpayments + parseFloat(payoutData[pays].amount);
    }

    return (
      <>
        <div className="admin__user__table">
          <h3>
            Payments - {paymentcount} Total - {totalpayments.toFixed(3)} ETH
          </h3>
          <div className="users__table">
            <div className="concert__table__headers user__row">
              <div className="user__name__entry">P-ID</div>
              <div className="concert__thumbnail">IMG</div>
              <div className="user__name__entry">Artist</div>
              <div className="user__name__entry">Amount</div>
              <div className="user__email__entry table__hide__moble">Date</div>
              <div className="user__reg__date__entry">Tx</div>
            </div>
            {concertData && payoutData && PayoutRow()}
          </div>
        </div>
      </>
    );
  };

  const PayoutRow = () => {
    var rows = [];
    var paymentcount = 0;
    for (var payout in payoutData) {
      console.log("py: ", payout);
      console.log(payoutData[payout].date);
      const tempPayout = new String(payout);
      paymentcount++;
      const payDate = new Date(payoutData[payout].date);
      const etherscan = "https://etherscan.io/tx/" + payoutData[payout].tx;
      rows.push(
        <div className="user__row" key={paymentcount}>
          <div className="user__name__entry">P-{payout}</div>
          <div className="concert__thumbnail">
            <img
              src={concertData[payoutData[payout].concertID].concertTokenImage}
              height="50px"
              className="payout__concert__thumbnail"
            />
          </div>
          <div className="user__name__entry">
            {concertData[payoutData[payout].concertID].concertArtist}
          </div>
          <div className="user__name__entry">
            {parseFloat(payoutData[payout].amount)}
          </div>

          <div className="user__email__entry table__hide__moble">
            {payDate.toLocaleTimeString()}, {payDate.toLocaleDateString()}
          </div>

          <div className="user__reg__date__entry">
            <a href={etherscan} rel="noreferrer" target="_blank">
              {truncateAddress(payoutData[payout].tx)}
            </a>
          </div>
        </div>
      );
    }

    return rows.reverse();
  };
  return (
    <>
      {currentUser === null && (
        <FormBox>
          <div className="no__user">
            <h3>No Current User. </h3>
            <p>Please Register or Login </p>
            <button
              className="login__button"
              onClick={() => {
                navigate("/login");
              }}
            >
              Go To Login Page
            </button>
            <button
              className="login__button"
              onClick={() => {
                navigate("/register");
              }}
            >
              New User? Sign Up
            </button>
          </div>
        </FormBox>
      )}
      {!adminUser && currentUser && (
        <FormBox>
          <div className="no__user">
            <h3>You're not Admin! </h3>
            <p>Good luck with your attack. </p>
            <button
              className="login__button"
              onClick={() => {
                navigate("/my-account");
              }}
            >
              Go To Account Page
            </button>
            <button
              className="login__button"
              onClick={() => {
                navigate("/");
              }}
            >
              Go Home
            </button>
          </div>
        </FormBox>
      )}
      {adminUser && concertData && (
        <div className="admin__page">
          <div className="admin__page__content">
            <div className="user__info__div">
              <div className="name__div">
                <span className="bold__text welcome__text account__details">
                  Welcome {userData?.name} - Admin Portal
                </span>
                <br />

                <>
                  <div className="first__letter account__details">
                    <button
                      onClick={() => {
                        navigate("/admin");
                      }}
                      className="admin__control__button"
                    >
                      View Users
                    </button>

                    <button
                      onClick={() => {
                        navigate("/admin/concerts");
                      }}
                      className="admin__control__button"
                      disabled={adminView === 1}
                    >
                      View Concerts
                    </button>

                    <button
                      onClick={() => {
                        navigate("/admin/payouts");
                      }}
                      className="admin__control__button"
                      disabled={true}
                    >
                      Artist Payouts
                    </button>

                    <button
                      onClick={() => {
                        navigate("/admin/partners");
                      }}
                      className="admin__control__button"
                    >
                      Partner Payouts
                    </button>
                  </div>
                </>
              </div>

              <div className="account__image">
                <div
                  className="account__image__hover"
                  onClick={() => {
                    navigate("/my-account/image");
                  }}
                >
                  <i className="fa-solid fa-pen account__image__hover" />
                </div>
                <img src={userData?.image} className="account__image" />
              </div>
            </div>
          </div>
          <div className="payout__container">
            <div className="add__payout__box">
              <h3>Add New Payout</h3>
              <div className="payout__form__div">
                <form className="payout__form__div">
                  <input
                    type="number"
                    min="0"
                    max="99"
                    maxlength="2"
                    placeholder="Concert ID"
                    className="payout__num__input"
                    onChange={(e) => {
                      setCid(e.target.value);
                    }}
                    disabled={reviewTx}
                  />
                  <input
                    type="number"
                    placeholder="Amount"
                    className="payout__num__input"
                    onChange={(e) => {
                      setPrice(e.target.value);
                    }}
                    disabled={reviewTx}
                  />
                  <input
                    type="string"
                    placeholder="Date"
                    className="payout__text__input"
                    onChange={(e) => {
                      setTxDate(e.target.value);
                    }}
                    disabled={reviewTx}
                  />
                  <input
                    type="string"
                    placeholder="TX #"
                    className="payout__text__input"
                    onChange={(e) => {
                      setTx(e.target.value);
                    }}
                    disabled={reviewTx}
                  />
                </form>
              </div>
              {!reviewTx && (
                <button
                  className="payout__form__submit__button"
                  onClick={() => {
                    setReviewTx(true);
                  }}
                >
                  Review TX
                </button>
              )}

              {reviewTx && (
                <>
                  <button
                    className="payout__form__submit__button"
                    onClick={() => {
                      setReviewTx(false);
                    }}
                  >
                    Edit TX
                  </button>
                  <div className="tx__review__div">
                    <div className="tx__review__item">Concert #: {cid}</div>
                    <div className="tx__review__item">
                      Price:{" "}
                      <img
                        src="/media/eth-logo.png"
                        height={15}
                        className="c__eth__logo"
                      />{" "}
                      {price}
                    </div>
                    <div className="tx__review__item">
                      TX Date: {capDate.toString() || "error with date"}
                    </div>
                    <div className="tx__review__item">TX #: {tx}</div>
                  </div>

                  <button
                    className="payout__form__submit__button"
                    onClick={() => {
                      confirmPayout();
                    }}
                  >
                    Confirm TX
                  </button>
                </>
              )}
            </div>

            <div className="payout__header">
              <div className="payout__highlight">
                <h3 className="highlight__h3">Total Artist Income</h3>
                <p className="highlight__res">
                  {" "}
                  <img
                    src="/media/eth-logo.png"
                    height={25}
                    className="c__eth__logo"
                  />
                  {getPayout().toFixed(3)}
                </p>
              </div>
              <div className="payout__highlight">
                <h3 className="highlight__h3">Total Artist Payouts</h3>
                <p className="highlight__res">
                  {" "}
                  <img
                    src="/media/eth-logo.png"
                    height={25}
                    className="c__eth__logo"
                  />
                  {getArtistIncome().toFixed(3)}
                </p>
              </div>
              <div className="payout__highlight final__highlight">
                <h3 className="highlight__h3">Artist Pool - Current Balance</h3>
                <p className="highlight__res">
                  {" "}
                  <img
                    src="/media/eth-logo.png"
                    height={25}
                    className="c__eth__logo"
                  />
                  {poolBalance}
                </p>
              </div>
            </div>
          </div>
          <div className="payouts__container">{showPayouts()}</div>
        </div>
      )}
    </>
  );
};

export default Payouts;
