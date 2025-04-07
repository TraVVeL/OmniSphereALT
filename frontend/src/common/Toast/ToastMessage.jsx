import { useEffect, useRef } from "react";
import { useToast } from "./Toast";

const ToastMessage = ({ message, variant, duration }) => {
  const { showToast } = useToast();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (message && !hasShownToast.current) {
      showToast(variant, message, duration);
      hasShownToast.current = true;
    }
    
    if (!message) {
      hasShownToast.current = false;
    }
  }, [message, variant, duration, showToast]);
  
  return null;
};

export default ToastMessage;