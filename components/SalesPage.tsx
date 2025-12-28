'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import pricingTop from '../public/assets/pricing-top.png';
import { RiPlantFill } from 'react-icons/ri';
import { FaFileAlt, FaHandshake, FaChevronDown } from "react-icons/fa";
import {useAuth} from '../lib/authContext';
import { db } from '../lib/firebase/init';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';

type Plan = {
  id: "monthly" | "yearly";
  title: string;
  price: string;
  priceId: string;
  subText: string;
};

const plans: Plan[] = [
  {
    id: "yearly",
    title: "Premium Plus Yearly",
    price: "$99.99/year",
    priceId: "price_1Sj5TfA2Cwzhc0rRuqElbN70",
    subText: "7-day free trial included",
  },
  {
    id: "monthly",
    title: "Premium Monthly",
    price: "$9.99/month",
    priceId: "price_1Sj5UqA2Cwzhc0rRzsiSIcwb",
    subText: "No trial included",
  },
];

const accordionData = [
  {
    title: "How does the free 7-day trial work?",
    content: "Begin your complimentary 7-day trial with a Summarist annual membership. You are under no obligation to continue your subscription, and you will only be billed when the trial period expires. With Premium access, you can learn at your own pace and as frequently as you desire, and you may terminate your subscription prior to the conclusion of the 7-day free trial."
  },
  {
    title: "Can I switch subscriptions from monthly to yearly, or yearly to monthly?",
    content: "While an annual plan is active, it is not possible to switch to a monthly plan. However, once the current month's trial period expires, transitioning from a monthly plan to an annual plan is an option."
  },
  {
    title: "What's included in the Premium plan?",
    content: "Premium membership provides you with the ultimate Summarist experience, including unrestricted entry to many best-selling books high-quality audio, the ability to download titles for offline reading, and the option to send your reads to your Kindle."
  },
  {
    title: "Can I cancel during my trial or subscription?",
    content: "You will not be charged if you cancel your trial before its conclusion. While you will not have complete access to the entire Summarist library, you can still expand your knowledge with one curated book per day."
  }
];

const SalesPage: React.FC = () => {
  const [selectedPlan, setSelectedPlan] = useState<Plan['id']>("yearly");
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const { user, openModal } = useAuth();

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleCheckout = async (): Promise<void> => {
  if (!user || user.isAnonymous) {
    openModal(); // Or redirect to signup
    return;
  }


    const priceId =
    selectedPlan === "yearly"
      ? "price_1Sj5TfA2Cwzhc0rRuqElbN70"
      : "price_1Sj5UqA2Cwzhc0rRzsiSIcwb";

      // Build checkout data safely
      const checkoutData: {
        price: string;
        success_url: string;
        cancel_url: string;
        trial_period_days?: number;
      } = {
        price: priceId,
        success_url: `${window.location.origin}/settings`,
        cancel_url: `${window.location.origin}/choose-plan`,
      };

      // ONLY add trial if yearly
     if (selectedPlan === "yearly") {
        checkoutData.trial_period_days = 7;
      }

      try {
        const docRef = await addDoc(
          collection(db, "customers", user.uid, "checkout_sessions"),
          checkoutData
        );

      // Listen for the session URL
      onSnapshot(docRef, (snap) => {
          const data = snap.data();

          if (data?.error) {
            console.error("Stripe Error:", data.error);
            alert(data.error.message || "Checkout failed");
            return;
          }

          if (data?.url) {
            window.location.assign(data.url);
          }
        });
      } catch (error) {
        console.error("Checkout error:", error);
        alert("Failed to start checkout. Please try again.");
      }
    };

  return (
    <div style={{ position:'absolute', width:'100%', maxWidth: '100vw', margin: 0, padding: 0, boxSizing: 'border-box', overflow: 'hidden' }}>
      {/* HEADER SECTION */}
      <section style={{ width: '100%', marginBottom: '40px', boxSizing: 'border-box' }}>
        <div style={{ backgroundColor: '#032b41', borderBottomLeftRadius: '180px', borderBottomRightRadius: '180px', padding: '48px 24px 0', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto', color: '#fff', textAlign: 'center' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 700, marginBottom: '16px' }}>Get unlimited access to many amazing books to read</h1>
            <p style={{ fontSize: '20px', marginBottom: '24px' }}>Turn ordinary moments into amazing learning opportunities</p>
            <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '340px', margin: '0 auto' }}>
              <Image src={pricingTop} alt="Reading illustration" style={{ borderRadius: '180px 180px 0 0', overflow: 'hidden' }} width={340} height={285} priority />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section style={{ display: 'flex', justifyContent: 'center', gap: '40px', textAlign: 'center', padding: '0 24px 40px', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '40px', color: '#032b41', marginBottom: '16px' }}>
            <FaFileAlt size={40} />
          </div>
          <p><strong>Key ideas in few min</strong> with many books to read</p>
        </div>
        
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '40px', color: '#032b41', marginBottom: '16px' }}>
            <RiPlantFill size={40} />
          </div>
          <p><strong>3 million</strong> people growing with Summarist everyday</p>
        </div>
        
        <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: '40px', color: '#032b41', marginBottom: '16px' }}>
            <FaHandshake size={40} />
          </div>
          <p><strong>Precise recommendations</strong> collections curated by experts</p>
        </div>
      </section>

      {/* PLANS */}
      <section style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', maxWidth: '600px', margin: '0 auto 40px', padding: '0 24px' }}>
        {plans.map((plan, index) => (
          <React.Fragment key={plan.id}>
            <div
              onClick={() => setSelectedPlan(plan.id)}
              style={{
                display: 'flex',
                width: '100%',
                padding: '24px',
                border: selectedPlan === plan.id ? '4px solid #2bd97c' : '2px solid #bac8ce',
                borderRadius: '4px',
                backgroundColor: '#f1f6f4',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid #000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '16px'
                }}>
                  {selectedPlan === plan.id && (
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: '#000',
                      borderRadius: '50%'
                    }} />
                  )}
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '20px', color: '#032b41', marginBottom: '8px', fontWeight: 600 }}>{plan.title}</h3>
                <p style={{ fontSize: '24px', fontWeight: 700, color: '#032b41', marginBottom: '4px' }}>{plan.price}</p>
                <p style={{ fontSize: '14px', color: '#394547' }}>{plan.subText}</p>
              </div>
            </div>

            {index === 0 && (
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', color: '#6b7280' }}>
                <div style={{ flex: 1, borderBottom: '1px solid #bac8ce', marginRight: '10px' }} />
                or
                <div style={{ flex: 1, borderBottom: '1px solid #bac8ce', marginLeft: '10px' }} />
              </div>
            )}
          </React.Fragment>
        ))}

        <button 
          onClick={handleCheckout}
          style={{
            width: '100%',
            maxWidth: '300px',
            minHeight: '40px',
            padding: '12px 16px',
            background: '#2bd97c',
            color: '#032b41',
            border: 'none',
            borderRadius: '4px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'background 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {selectedPlan === 'yearly' ? 'Start your free 7-day trial' : 'Start your first month'}
        </button>
        
        <p style={{ fontSize: '14px', color: '#394547', textAlign: 'center', marginTop: '8px' }}>
          {selectedPlan === 'yearly' ? 'Cancel your trial at any time before it ends, and you won\'t be charged.' : '30-day money back guarantee, no questions asked.'}
        </p>
      </section>

      {/* ACCORDIONS */}
      <section style={{ maxWidth: '1000px', margin: '0 auto 40px', padding: '0 24px' }}>
        <div style={{ width: '100%', borderTop: '1px solid #e1e7ea' }}>
          {accordionData.map((item, index) => (
            <div key={index} style={{ borderBottom: '1px solid #e1e7ea' }}>
              <div
                onClick={() => toggleAccordion(index)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  padding: '24px 0',
                  gap: '8px'
                }}
              >
                <h3 style={{
                  fontWeight: 500,
                  fontSize: '24px',
                  margin: 0,
                  color: '#032b41'
                }}>
                  {item.title}
                </h3>
                <FaChevronDown 
                  size={24}
                  style={{
                    transform: openAccordion === index ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s ease',
                    flexShrink: 0
                  }}
                />
              </div>
              <div style={{
                maxHeight: openAccordion === index ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.35s ease'
              }}>
                <div style={{
                  paddingBottom: '24px',
                  color: '#394547',
                  lineHeight: '1.5'
                }}>
                  {item.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#f5f7f8', marginTop: '40px', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ padding: '40px 24px', boxSizing: 'border-box' }}>
          <div style={{ maxWidth: '1070px', margin: '0 auto', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '32px', marginBottom: '40px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 200px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#032b41', marginBottom: '8px' }}>Actions</div>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Summarist Magazine</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Cancel Subscription</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Help</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Contact us</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 200px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#032b41', marginBottom: '8px' }}>Useful Links</div>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Pricing</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Summarist Business</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Gift Cards</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Authors & Publishers</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 200px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#032b41', marginBottom: '8px' }}>Company</div>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>About</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Careers</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Partners</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Code of Conduct</a>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: '1 1 200px' }}>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#032b41', marginBottom: '8px' }}>Other</div>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Sitemap</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Legal Notice</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Terms of Service</a>
                <a style={{ fontSize: '14px', color: '#394547', cursor: 'pointer' }}>Privacy Policies</a>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '20px', borderTop: '1px solid #e1e7ea' }}>
              <div style={{ fontSize: '14px', color: '#6b757b' }}>
                Copyright © 2023 Summarist.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SalesPage;