import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const OfferContainer = styled.div`
  width: 100%;
  background: #fffff;
  overflow: hidden;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  border-top: 2px solid #aa1f1e;
  border-bottom: 2px solid #aa1f1e;
  position: relative;
`;

const ScrollingText = styled(motion.div)`
  white-space: nowrap;
  display: inline-block;
  color: #aa1f1e;
  border-top: 2px solid #aa1f1e;
  border-bottom: 2px solid #aa1f1e;
  font-weight: 600;
  padding: 10px 0;
  font-size: 1.2em;
  position: absolute;
  width: max-content;
`;

const OfferBar = () => {
  const offers = [
    "Get Premium Access at ₹999 only!",
    "Limited Time Deal - Premium Features Unlocked",
    "Special Discount - Premium Membership",
    "Exclusive Offer - Join Premium Today"
  ];

  // Repeat offers multiple times to ensure continuous scrolling
  const repeatedOffers = [...offers, ...offers, ...offers, ...offers, ...offers];

  return (
    <OfferContainer>
      <ScrollingText
        initial={{ x: 0 }}
        animate={{ x: "-30%" }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop"
        }}
      >
        {repeatedOffers.map((offer, index) => (
          <span key={index} style={{ marginRight: '50px' }}>
            {offer}
          </span>
        ))}
        {repeatedOffers.map((offer, index) => (
          <span key={`repeat-${index}`} style={{ marginRight: '50px' }}>
            {offer}
          </span>
        ))}
      </ScrollingText>
    </OfferContainer>
  );
};

export default OfferBar;
