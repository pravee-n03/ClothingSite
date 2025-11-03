import { server } from "../config";
import { useEffect } from "react";
import { useGlobalContext } from "../Contexts/globalContext/context";
import { XIcon, UserIcon, LogoutIcon, LoginIcon, CogIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Profile() {
  const router = useRouter();
  const { updateAccount, account, displayProf, setDisplayProf, lang } =
    useGlobalContext();

  useEffect(async () => {
    const result = await fetch(
      `${server}/api/account`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      [account]
    );
    const data = await result.json();
    if (data.message === "Account found") {
      const { name, lastname, address, phone, isAdmin } = data.account;
      const newAcc = isAdmin
        ? { name, lastname, isAdmin }
        : { name, lastname, address, phone, isAdmin };
      updateAccount(newAcc);
    }
  }, []);

  const logOut = async () => {
    const redirect = account.isAdmin ? "/admin/login" : "/auth/login";
    const result = await fetch(
      `${server}/api/auth/${account.isAdmin ? "admin" : "users"}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await result.json();
    setDisplayProf(false);
    if (data.message == "loged out") {
      updateAccount({});
      router.push(redirect);
    }
  };

  return (
    <div
      className={`${
        displayProf ? "block" : "hidden"
      } fixed top-0 mt-20 ${lang === "en" ? "right-0 mr-[10px]" : "left-0 ml-[10px]"} z-50`}
    >
      {/* Close Button */}
      <div className="absolute -top-2 -right-2 z-10">
        <button
          onClick={() => setDisplayProf(false)}
          className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200"
        >
          <XIcon width={16} />
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-third rounded-2xl shadow-2xl border border-gray-200 w-80 overflow-hidden">
        {account.name ? (
          <div className="p-6">
            {/* Header with Avatar */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4 shadow-lg">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary">
                {account.name} {account.lastname}
              </h3>
              <p className="text-secondary text-sm">
                {account.isAdmin ? "Administrator" : "Customer"}
              </p>
            </div>

            {/* User Info */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-primary font-medium">First Name:</span>
                <span className="text-secondary">{account.name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-primary font-medium">Last Name:</span>
                <span className="text-secondary">{account.lastname}</span>
              </div>
              {!account.isAdmin && (
                <>
                  {account.phone && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-primary font-medium">Phone:</span>
                      <span className="text-secondary">{account.phone}</span>
                    </div>
                  )}
                  {account.address && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-primary font-medium">Address:</span>
                      <span className="text-secondary text-right max-w-32 truncate" title={account.address}>
                        {account.address}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {account.isAdmin && (
                <Link href="/admin/order">
                  <a className="w-full flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg">
                    <CogIcon className="w-5 h-5 mr-2" />
                    Admin Panel
                  </a>
                </Link>
              )}
              <button
                className="w-full flex items-center justify-center px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={logOut}
              >
                <LogoutIcon className="w-5 h-5 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            {/* Guest User */}
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-400 rounded-full mb-4">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Welcome!</h3>
              <p className="text-secondary text-sm">Please sign in to your account</p>
            </div>

            <Link href="/auth/login">
              <a
                className="inline-flex items-center justify-center w-full px-4 py-3 bg-accent hover:bg-green-600 text-white rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                onClick={() => setDisplayProf(false)}
              >
                <LoginIcon className="w-5 h-5 mr-2" />
                Sign In
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
