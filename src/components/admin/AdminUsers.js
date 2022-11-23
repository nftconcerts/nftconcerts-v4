import React, { useState, useEffect } from "react";
import { db, fetchCurrentUser, logout, truncateAddress } from "../../firebase";

import { ref as dRef, set, get, onValue } from "firebase/database";

const AdminUsers = (allUserData) => {
  const switchUserToArtist = (user) => {
    var userTypeRef = dRef(db, "users/" + user + "/userType");
    set(userTypeRef, "artist");
  };
  //show the users in a nice table
  const showUsers = () => {
    var usercount = 0;
    for (var user in allUserData) {
      usercount++;
    }
    return (
      <>
        {allUserData && (
          <div className="admin__user__table">
            <h3>Users - {usercount} Total</h3>
            <div className="users__table">
              <div className="concert__table__headers user__row">
                <div className="concert__thumbnail">IMG</div>
                <div className="user__name__entry">Name</div>
                <div className="user__email__entry">Email</div>
                <div className="user__reg__date__entry">Registration Date</div>
                <div className="user__connection__entry">Connection</div>
                <div className="user__wallet__entry">Wallet</div>
                <div className="user__type__entry">Account</div>
              </div>
              {UserRow()}
            </div>
          </div>
        )}
      </>
    );
  };
  //turn user list into pretty table
  const UserRow = () => {
    var rows = [];
    var usercount = 0;
    for (var user in allUserData) {
      const tempUser = new String(user);
      usercount++;
      console.log("US: ", user);
      var regDate = new Date(allUserData[user].registrationDate);
      rows.push(
        <div className="user__row" key={usercount}>
          <div className="concert__thumbnail">
            <img
              src={allUserData[user].image}
              height="50px"
              className="account__page__concert__thumbnail"
            />
          </div>
          <div className="user__name__entry">{allUserData[user].name}</div>

          <div className="user__email__entry table__hide__moble">
            <a href={"mailto:" + allUserData[user].email}>
              {allUserData[user].email}
            </a>
          </div>
          <div className="user__email__entry table__wallet__icon">
            <a
              href={"mailto:" + allUserData[user].email}
              className="table__wallet__icon"
            >
              <i className="fa-solid fa-envelope user__table__button table__wallet__icon" />
            </a>
          </div>
          <div className="user__reg__date__entry">
            {regDate.toLocaleTimeString()}, {regDate.toLocaleDateString()}
          </div>
          <div className="user__connection__entry">
            {allUserData[user].connectionType}
          </div>
          <div className="user__wallet__entry">
            <button
              name={tempUser}
              onClick={(e) => {
                console.log("button name: ", tempUser);
                exportAddress(tempUser);
              }}
            >
              <span className="table__hide__mobile">
                {truncateAddress(allUserData[user].walletID)}
              </span>

              <i className="fa-solid fa-wallet user__table__button table__wallet__icon" />
            </button>
          </div>
          <div className="user__type__entry">{allUserData[user].userType}</div>
        </div>
      );
    }

    return rows;
  };

  const exportAddress = (user) => {
    console.log("exporting address: ", allUserData[user].walletID);
    navigator.clipboard.writeText(allUserData[user].walletID);
  };

  return showUsers();
};

export default AdminUsers;
