import React from "react";
import styles from "../../styles/FAQS.module.css";

const FAQS = () => {
  return (
    <div className={`d-flex flex-column ${styles.faqsContainer}`}>
      <div className={styles.label}>FAQs</div>
      
      <div className={styles.question}>
        <p>What is Dhaaga?</p>
        <p>
          Dhaaga is a search portal for Desi people living in the United States for certain businesses listings specific to the Desi community. Dhaaga shows 7 categories of business listings, namely restaurants, homemade food, jewelry, clothing, roommates, and henna. You get everything at your fingertip. We created a platform to make your life easy for all your desi needs at one platform. Desi users can sign up for a regular user account for searching for the nearest Desi business or sign up for a business account for listing their own business on Dhaaga or claiming an existing business on Dhaaga.
        </p>
      </div>
      
      <div className={styles.question}>
        <p>What is defined by “Desi” in Dhaaga platform?</p>
        <p>
          Desi is a loosely defined term. On Dhaaga platform, we use Desi to indicate people originally belonging to (but not limited to) south Asian countries of India, Pakistan, Bangladesh, or Nepal.
        </p>
      </div>

      <div className={styles.question}>
        <p>Do I need to create an account?</p>
        <p>Yes, you need to create an account on Dhaaga to use it. You can sign up and create either a regular user account or a business user account on Dhaaga to use it.</p>
      </div>

      <div className={styles.question}>
        <p>What is the difference between a regular user account and a business user account?</p>
        <p>
          A regular user account can be created for free and lets you search for any information related to given categories. A business user account gives access to premium features and can be created through a subscription plan and lets you list your business on Dhaaga or claim an existing business.
        </p>
      </div>

      <div className={styles.question}>
        <p>What is “favorites” on Dhaaga?</p>
        <p>
          “Favorites” section on Dhaaga allows users to mark and save certain listings to refer later.
        </p>
      </div>

      <div className={styles.question}>
        <p>How can I change my password?</p>
        <p>
          If you need to change your account password for any reason, please go to the sign-in page and click on “Forgot my password” to send a reset link to your registered email address. Use this reset link to create a new password for your account.
        </p>
      </div>

      <div className={styles.question}>
        <p>How do I create a business listing on Dhaaga?</p>
        <p>
          If you are a business owner and you don’t see your business listed on Dhaaga already, please go to “create business account,” complete the information form to fill-in all your business details, and select an appropriate subscription payment plan. As soon as payment goes through, your business account is created, and the business is listed on Dhaaga platform.
        </p>
      </div>

      <div className={styles.question}>
        <p>What is the advantage of having a paid subscription for a Business account?</p>
        <p>
          A business account, which is a paid subscription on Dhaaga platform, gives you access to additional features not included in the regular user account, such as owning or claiming a business listing, adding/editing business description, responding to user reviews, adding/editing business images, adding a business contact phone number, and business address. Additionally, having a business account shows your listing highlighted as a Premium listing with a “purple tick” and is shown at the top in the search results, thus improving your chances of reaching more customers.
        </p>
      </div>

      <div className={styles.question}>
        <p>If I cancel my subscription after a few months, does my business listing still have all the information that I added with a Business Account?</p>
        <p>
          If you decide to cancel your subscription, you will be asked whether your business listing should remain or be removed. If you decide not to remove the listing, your business title, phone number, and address will be visible to Dhaaga users, but some features will be lost without an active paid subscription.
        </p>
      </div>

      <div className={styles.question}>
        <p>If I have a Dhaaga subscription for a few months, and then cancel it for a month and then resubscribe again, do you save all the information with the “premium” features that can be enabled again, or do I need to manually enter it again?</p>
        <p>
          Any information added during a paid subscription is stored for 12 months and can be re-used if the user decides to update their account to a business user account. After 12 months, any upgrades to a business account will have to re-enter the data again.
        </p>
      </div>

      <div className={styles.question}>
        <p>If I have a Business User Account, can I delete any reviews on my business listing?</p>
        <p>
          Unfortunately, no. At Dhaaga, we believe as well as encourage in keeping the reviews fair and honest. Hence, we do not allow, even with paid business accounts, to manipulate or delete user reviews.
        </p>
      </div>

      <div className={styles.question}>
        <p>If I see my business already listed on Dhaaga, why do I still need a Business Account?</p>
        <p>
          We have many of the Desi businesses listed already on Dhaaga, and we try to keep our database updated based on public information. Keeping data updated is imperative for the business. However, our business account allows for many premium features which you may miss if you decide not to create one if your business is already listed. In order to experience the full potential of the Dhaaga platform, we encourage all Desi business owners to create a business account on our platform and utilize all of the premium features to increase their reach among fellow Desi audience.
        </p>
      </div>

      {/* Add more questions and answers following the same pattern */}
      {/* ... */}
    </div>
  );
};

export default FAQS;
