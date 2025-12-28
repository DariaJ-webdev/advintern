'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../app/Settings.module.css';
import loginImage from '../public/assets/login.png';
import { useAuth } from '../lib/authContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { db } from '../lib/firebase/init';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const YEARLY_PRICE_ID = 'price_1Sj5TfA2Cwzhc0rRuqElbN70';
const MONTHLY_PRICE_ID = 'price_1Sj5UqA2Cwzhc0rRzsiSIcwb';

const Settings: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get('query') || '';
  const { user, openModal, loading: authLoading } = useAuth();

  const [subscriptionPlan, setSubscriptionPlan] = useState<string>('Basic');
  const [loadingSubscription, setLoadingSubscription] = useState<boolean>(() => !!user);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'customers', user.uid, 'subscriptions'),
      where('status', 'in', ['trialing', 'active'])
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const subData = snapshot.docs[0].data() as {
          items?: { price?: { id?: string } }[];
        };

        const priceId = subData.items?.[0]?.price?.id;

        if (priceId === YEARLY_PRICE_ID) {
          setSubscriptionPlan('Premium-Plus');
        } else if (priceId === MONTHLY_PRICE_ID) {
          setSubscriptionPlan('Premium');
        } else {
          setSubscriptionPlan('Premium-Plus');
        }
      } else {
        setSubscriptionPlan('Basic');
      }

      setLoadingSubscription(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpgradeClick = () => {
    // Check if user is anonymous
    if (user?.isAnonymous) {
      // Anonymous user - open modal with upgrade redirect
      openModal('upgrade');
    } else if (user) {
      // Real user - go directly to choose-plan
      router.push('/choose-plan');
    } else {
      // Not logged in - open modal with upgrade redirect
      openModal('upgrade');
    }
  };

  return (
    <div className={styles.wrapper}>
      {queryParam && <div className={styles.search_results_header} />}

      <div className={styles.container}>
        <h1 className={`${styles.section__title} ${styles.page__title}`}>
          Settings
        </h1>

        {!user ? (
          <div className={styles['settings__login--wrapper']}>
            <Image src={loginImage} alt="Login" width={460} height={317} priority />
            <div className={styles['settings__login--text']}>
              Log in to your account to see your details.
            </div>
            <button
              className={`${styles.btn} ${styles['settings__login--btn']}`}
              onClick={() => openModal()}
            >
              Login
            </button>
          </div>
        ) : (
          <div className={styles.settings__content}>
            {authLoading || loadingSubscription ? (
              <div className={styles.skeleton_container} />
            ) : (
              <div className={styles.settings__details}>
                <div className={styles.settings__section}>
                  <div className={styles.settings__label}>
                    Your Subscription Plan
                  </div>
                  <div className={styles.settings__value}>
                    {subscriptionPlan}
                  </div>

                  {subscriptionPlan === 'Basic' && (
                    <button
                      className={`${styles.btn} ${styles.settings__upgradeBtn}`}
                      onClick={handleUpgradeClick}
                    >
                      Upgrade Plan
                    </button>
                  )}
                </div>

                <div className={styles.settings__section}>
                  <p className={styles.settings__label}>Email</p>
                  <p className={styles.settings__value}>
                    {user.isAnonymous ? 'Guest User' : (user.email ?? '—')}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;