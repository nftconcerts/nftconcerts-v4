import React, { useState, useEffect } from "react";
import { ref as dRef, set, get, onValue } from "firebase/database";
import { db, fetchCurrentUser, logout, truncateAddress } from "../../firebase";
import "./Collectors.css";
import { editionDropAddress } from "../../scripts/getContract.mjs";
import { useContract, useOwnedNFTs } from "@thirdweb-dev/react";

const Collectors = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState();
  const [allUserData, setAllUserData] = useState();

  //get owned NFTs by user
  const { contract } = useContract(editionDropAddress);
  const {
    data: ownedNFTs,
    isLoading3,
    error3,
  } = useOwnedNFTs(contract, userData?.walletID);

  console.log("Owned", ownedNFTs);

  const calcTotal = async (address) => {

  }

  const sortTable = (n) => {
    var table,
      rows,
      switching,
      i,
      x,
      y,
      shouldSwitch,
      dir,
      switchcount = 0;
    table = document.getElementById("userTable");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < rows.length - 1; i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[n];
        y = rows[i + 1].getElementsByTagName("TD")[n];
        /*check if the two rows should switch place,
        based on the direction, asc or desc:*/
        if (dir == "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir == "desc") {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
        //Each time a switch is done, increase this count by 1:
        switchcount++;
      } else {
        /*If no switching has been done AND the direction is "asc",
        set the direction to "desc" and run the while loop again.*/
        if (switchcount == 0 && dir == "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  };

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
      var allUserDataRef = dRef(db, "users");
      onValue(allUserDataRef, (snapshot) => {
        var data = snapshot.val();
        setAllUserData(data);
      });
    }
  }, [currentUser]);

  //show the users in a nice table
  const showUsers = () => {
    var usercount = 0;
    for (var user in allUserData) {
      usercount++;
    }
    return (
      <>
        {allUserData && (
          <div className="collector__user__table">
            <h3>Users - {usercount} Total</h3>
            <table className="collectors__table" id="userTable">
              <tr className="collectors__table__headers collector__row">
                <th
                  onClick={() => {
                    sortTable(0);
                  }}
                  className="concert__thumbnail"
                >
                  IMG
                </th>
                <th
                  onClick={() => {
                    sortTable(1);
                  }}
                  className="user__name__entry"
                >
                  Name
                </th>
                <th
                  onClick={() => {
                    sortTable(1);
                  }}
                  className="user__name__entry"
                >
                  Wallet
                </th>
                <th
                  onClick={() => {
                    sortTable(3);
                  }}
                  className="user__reg__date__entry"
                >
                  Joined
                </th>
                <th
                  onClick={() => {
                    sortTable(4);
                  }}
                  className="user__connection__entry"
                >
                  <i className="fa-solid fa-walkie-talkie admin__pt__icons admin__pl__icon" />
                </th>
                <th
                  onClick={() => {
                    sortTable(4);
                  }}
                  className="user__connection__entry"
                >
                  <i className="fa-solid fa-wrench admin__pt__icons" />
                </th>
              </tr>
              {UserRow()}
            </table>
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

      var regDate = new Date(allUserData[user].registrationDate);
      rows.push(
        <tr className="collector__row" key={usercount}>
          <td className="collector__thumbnail">
            <img
              src={allUserData[user].image}
              height="50px"
              className="collector__image"
            />
          </td>
          <td className="user__name__entry">{allUserData[user].name}</td>
          <td className="user__wallet__entry">
            {truncateAddress(allUserData[user].walletID)}
          </td>

          <td className="user__reg__date__entry">
            Joined {regDate.toLocaleDateString()}
          </td>

          <td className="user__pt__entry">
            {parseInt(allUserData[user]?.productionRank) === 1 && (
              <i className="fa-solid fa-wrench admin__pt__icons" />
            )}
            {parseInt(allUserData[user]?.productionRank) === 2 && (
              <i className="fa-solid fa-walkie-talkie admin__pt__icons admin__pl__icon" />
            )}
          </td>
        </tr>
      );
    }

    return rows;
  };

  return <div className="collector__page">{showUsers()}</div>;
};

export default Collectors;
