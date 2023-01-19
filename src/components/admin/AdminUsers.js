import React from "react";
import { truncateAddress } from "../../firebase";

const AdminUsers = (allUserData) => {
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
        if (dir === "asc") {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            //if so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else if (dir === "desc") {
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
        if (switchcount === 0 && dir === "asc") {
          dir = "desc";
          switching = true;
        }
      }
    }
  };

  const countUsers = () => {
    if (allUserData) {
      console.log("Counting UD: ", allUserData);
      console.log("Count: ", Object.keys(allUserData).length);
      return Object.keys(allUserData).length;
    } else {
      return 5;
    }
  };

  //show the users in a nice table
  const showUsers = () => {
    return (
      <>
        {allUserData && (
          <div className="admin__user__table">
            <h3>Users - {countUsers()} Total</h3>
            <table className="users__table" id="userTable">
              <tr className="concert__table__headers user__row">
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
                    sortTable(2);
                  }}
                  className="user__email__entry"
                >
                  Email
                </th>
                <th
                  onClick={() => {
                    sortTable(3);
                  }}
                  className="user__reg__date__entry"
                >
                  Registration Date
                </th>
                <th
                  onClick={() => {
                    sortTable(4);
                  }}
                  className="user__connection__entry"
                >
                  Connection
                </th>
                <th
                  onClick={() => {
                    sortTable(5);
                  }}
                  className="user__wallet__entry"
                >
                  Wallet
                </th>
                <th
                  onClick={() => {
                    sortTable(6);
                  }}
                  className="user__type__entry"
                >
                  Account
                </th>{" "}
                <th
                  onClick={() => {
                    sortTable(7);
                  }}
                  className="user__pt__entry"
                >
                  PT Rank
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

    for (var user in allUserData) {
      const tempUser = user;
      var regDate = new Date(allUserData[user].registrationDate);
      rows.push(
        <tr className="user__row" key={user}>
          <td className="concert__thumbnail">
            <img
              src={allUserData[user].image}
              height="50px"
              className="account__page__concert__thumbnail"
              alt="User Thumbnail"
            />
          </td>
          <td className="user__name__entry">{allUserData[user].name}</td>

          <td className="user__email__entry table__hide__moble">
            <a href={"mailto:" + allUserData[user].email}>
              {allUserData[user].email}
            </a>
          </td>

          <td className="user__reg__date__entry">
            {regDate.toLocaleTimeString()}, {regDate.toLocaleDateString()}
          </td>
          <td className="user__connection__entry">
            {allUserData[user].connectionType}
          </td>
          <td className="user__wallet__entry">
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
          </td>

          <td className="user__type__entry">{allUserData[user].userType}</td>
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

  const exportAddress = (user) => {
    console.log("exporting address: ", allUserData[user].walletID);
    navigator.clipboard.writeText(allUserData[user].walletID);
  };

  return showUsers();
};

export default AdminUsers;
