import React, { useEffect } from "react";
import './footerpages.css'
const TermsConditions = () => {
    useEffect(()=>{
        window.scrollTo({
            top:0,
            behavior:'smooth'
        })
    })
 const data = [
  {
    heading: "General Information",
    listItems: [
      "These Terms & Conditions govern your access to and use of the CAKENPETALS website and services.",
      "CAKENPETALS is a premium cake and dessert brand dedicated to creating beautifully designed, handcrafted cakes using high-quality ingredients.",
    ],
  },
  {
    heading: "Acceptance of Terms",
    listItems: [
      "By accessing our website or placing an order, you agree to be bound by these Terms & Conditions.",
      "If you do not agree with any part of these terms, please refrain from using our website or services.",
    ],
  },
  {
    heading: "Orders & Customization",
    listItems: [
      "All orders placed with CAKENPETALS are subject to availability and confirmation.",
      "Custom designs are created based on customer preferences; minor variations in color, texture, or design may occur due to the handcrafted nature of our cakes.",
      "Once an order is confirmed, changes or cancellations may not be possible depending on the preparation stage.",
    ],
  },
  {
    heading: "Pricing & Payments",
    listItems: [
      "All prices listed are in INR and inclusive/exclusive of applicable taxes as mentioned at checkout.",
      "Full payment is required at the time of order placement to confirm your order.",
      "We accept secure payments via cards, UPI, wallets, and other supported payment methods.",
    ],
  },
  {
    heading: "Ingredients & Allergens",
    listItems: [
      "CAKENPETALS uses fresh and premium-quality ingredients to ensure exceptional taste and quality.",
      "Some products may contain allergens such as nuts, dairy, gluten, or eggs.",
      "Customers are responsible for reviewing product descriptions and informing us of any allergies before placing an order.",
    ],
  },
  {
    heading: "Delivery & Pickup",
    listItems: [
      "We offer delivery within selected service areas. Delivery charges and timelines are displayed at checkout.",
      "Customers may also opt for store pickup at the selected time slot.",
      "CAKENPETALS is not responsible for delays caused by incorrect address details, weather conditions, traffic, or unforeseen circumstances.",
    ],
  },
  {
    heading: "Cancellations & Refunds",
    listItems: [
      "Cancellations are allowed within a limited time after order placement, provided preparation has not begun.",
      "As cakes are perishable and custom-made, refunds are applicable only in cases of damaged or incorrect orders.",
      "Any issues must be reported within 12 hours of delivery along with clear photographic evidence.",
    ],
  },
  {
    heading: "Intellectual Property",
    listItems: [
      "All content on the CAKENPETALS website, including logos, images, designs, and text, is the intellectual property of CAKENPETALS.",
      "Unauthorized use, reproduction, or distribution of our content is strictly prohibited.",
    ],
  },
  {
    heading: "Limitation of Liability",
    listItems: [
      "CAKENPETALS shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website, except as required by law.",
    ],
  },
  {
    heading: "Updates to Terms",
    listItems: [
      "CAKENPETALS reserves the right to modify these Terms & Conditions at any time without prior notice.",
      "Continued use of our website after changes are posted signifies your acceptance of the updated terms.",
    ],
  },
];


  return (
    <>
        <div className="termsConditions">
      <div className="container">
        <div className="termsConditionsContent">
        <h3>CAKENPETALS</h3>
<h1>Terms & Conditions</h1>

          <hr />
          <p className="introText">
  Welcome to <span className="highlighted">CAKENPETALS</span>. By using our
  website and placing orders with us, you agree to follow the terms and
  conditions outlined below. These terms help ensure a smooth, delightful,
  and transparent experience for every celebration.
</p>

          <div className="lastUpdate">
            Last Updated:{" "}
            <span>{new Date("2024-01-12").toLocaleDateString()}</span>
          </div>
          {data.map((item, index) => (
            <section key={index} className="termsSection">
              <h4>{item.heading}</h4>
              <ul>
                {item.listItems.map((listItem, listIndex) => (
                  <li key={listIndex}>{listItem}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
    </>
  );
};

export default TermsConditions;
