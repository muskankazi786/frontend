import { FormEvent, useState } from "react";
import { useErrorBoundary } from "react-error-boundary";
import Stripe from "stripe";
import getStripe from "@/get-stripejs";

import styles from "../../styles/CheckoutForm.module.css";

import ToastModal from "../ToastModal/ToastModal";
import { catchAsyncFetch } from "@/utils/catchAsyncFetch";

const CheckoutForm = () => {
  const [reqResponse, setRequestResponse] = useState<{ error: string } | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(false);

  const { showBoundary } = useErrorBoundary();

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setRequestResponse(null);
    setIsLoading(true);
    setShow(true);

    const res = await catchAsyncFetch("/api/checkout_sessions", showBoundary, {
      method: "POST",
    });

    if (!res) {
      return;
    }

    const data = await res.json();
    let checkoutSession: Stripe.Checkout.Session;

    if (!res.ok) {
      setRequestResponse({ error: data.message });
      setIsLoading(false);
      return;
    }
    checkoutSession = data;

    const stripe = await getStripe();
    const { error } = await stripe!.redirectToCheckout({
      sessionId: checkoutSession.id,
    });

    if (error) {
      setRequestResponse({ error: error.message! });
    }
  };
  return (
    <>
      {reqResponse && show && (
        <ToastModal
          variant="danger"
          header="Error!"
          body={reqResponse.error}
          show={show}
          onClose={() => setShow(false)}
        />
      )}
      <form onSubmit={submitHandler}>
        <button
          className={`${styles.subscribe} ${isLoading ? styles.isLoading : ""}`}
          disabled={isLoading}
        >
          Subscribe
        </button>
      </form>
    </>
  );
};

export default CheckoutForm;
