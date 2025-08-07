import React, { useEffect, useState } from 'react';

const PaymentStatusChecker = ({ orderId, onSuccess }) => {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Only check if we have an orderId stored
    if (!orderId) return;
    
    const checkPaymentStatus = async () => {
      setIsChecking(true);
      
      try {
        const response = await fetch(`https://api.ijpl.life/api/orders/${orderId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          // If payment is completed, call onSuccess
          if (data.data.payment.status === 'completed') {
            onSuccess(data.data);
          }
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkPaymentStatus();
  }, [orderId, onSuccess]);

  return null; // This is a non-visual component
};

export default PaymentStatusChecker; 