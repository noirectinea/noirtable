import { Suspense } from "react";
import { OrderSuccessPage } from "@/components/OrderSuccessPage";

export default function OrderSuccess() {
  return (
    <Suspense>
      <OrderSuccessPage />
    </Suspense>
  );
}
