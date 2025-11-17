import Link from "next/link";
import { useGlobalContext } from "../../Contexts/globalContext/context";

export default function Check({ total: subtotal, cartToggler }) {
  const {translate : t, lang} = useGlobalContext();

  // Calculate tax (assuming 18% GST)
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + tax;

  return (
    <div className={`my-3 text-sm font-mono capitalize`} style={{direction:`${lang==="fa"?"rtl":"ltr"}`}}>
      <div className="min-w-full min-h-[1px] bg-primarycont my-2 -mx-10"></div>

      {/* Subtotal */}
      <div className="flex flex-row justify-between mb-2">
        <div className="text-gray-600">{t('subtotal')}</div>
        <div className="font-medium">₹{subtotal.toLocaleString()}</div>
      </div>

      {/* Tax */}
      <div className="my-1 flex flex-row justify-between mb-2">
        <div className="text-gray-600">{t('Tax')} (GST 18%)</div>
        <div className="font-medium">₹{tax.toLocaleString()}</div>
      </div>

      {/* Shipping */}
      <div className="flex flex-row justify-between mb-3">
        <div className="text-gray-600">{t("Shipping")}</div>
        <div className="font-medium text-green-600">{t("FREE")}</div>
      </div>

      <div className="min-w-full min-h-[1px] bg-hover my-2"></div>

      {/* Total */}
      <div className="flex flex-row justify-between text-lg font-bold text-gray-900 mb-4">
        <div>{t("Total")}</div>
        <div>₹{total.toLocaleString()}</div>
      </div>

      {/* Proceed to Checkout Button */}
      <div className="w-full">
        <button
          onClick={cartToggler}
          className="w-full bg-accent hover:bg-green-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Link href="/checkout" className="block w-full h-full">
            {t("proceed_checkout")}
          </Link>
        </button>
      </div>
    </div>
  );
}
