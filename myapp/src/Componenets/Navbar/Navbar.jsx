import React from "react";
import { Link } from "react-router-dom";
import { logout } from "../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../store/authSlice";
import styles from "./Navigation.module.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const { isAuth, user } = useSelector((state) => state.auth);
  //this will logout the user by deleting his data and removing accessToken and refreshToken from the cookies
  async function logoutUser() {
    try {
      const { data } = await logout();
      dispatch(setAuth(data));
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <nav className={`${styles.navbar} ${styles.container}`}>
      <Link className={styles.brandStyle} to="/">
        <img src="/images/couch.png" alt="logo" />
        <span className={styles.logoText}>CouchCritic</span>
      </Link>
      {isAuth && (
        <div className={styles.navRight}>
          <h3>{user?.name}</h3>
          <Link to="/">
            <img
              className={styles.avatar}
              src={user.avatar ? user.avatar : "/images/Ellipse 5.png"}
              width="40"
              height="40"
              alt="avatar"
            />
          </Link>
          <button className={styles.logoutButton} onClick={logoutUser}>
            <span>logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};
