"use client";

import React, { useState } from "react";
import { useAuth } from "../lib/authContext";
import { IoClose } from "react-icons/io5";
import styles from "../app/Modal.module.css";
import { RxPerson } from "react-icons/rx";

const AuthModal = () => {
  const {isModalOpen, closeModal, login, register, guestLogin } = useAuth();
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!isModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoginView) {
      await login(email, password);
    } else {
      await register(email, password);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={closeModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
              <button className={styles.closeBtn} onClick={closeModal}>
          <IoClose size={24} />
          </button>
       
       <div className={styles.authFormContainer}>
          <h2>
            {isLoginView ? "Log in to Summarist" : "Sign up to Summarist"}
          </h2>

          <button className={styles.guestBtn} onClick={guestLogin}>
            <div className={styles.iconWrapper}>
              <RxPerson size={20} />
            </div>
            <span>Login as a Guest</span>
          </button>

          <div className={styles.divider}>
          <span className={styles.dividerText}>or</span>
          </div>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className={styles.submitBtn}>
              {isLoginView ? "Login" : "Sign up"}
            </button>
          </form>

          <button
            className={styles.toggleViewBtn}
            onClick={() => setIsLoginView(!isLoginView)}
          >
            {isLoginView
              ? "Don't have an account?"
              : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
    
  );
};

export default AuthModal;
