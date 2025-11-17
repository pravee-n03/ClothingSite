import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../Contexts/globalContext/context";
import { useRouter } from "next/router";
import { useState } from "react";
import { ShieldCheckIcon, EyeIcon, EyeOffIcon } from "@heroicons/react/outline";

export default function login() {
  const router = useRouter();
  const { updateAccount } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (form) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form)
      });
      
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("Failed to parse response as JSON:", jsonError);
        alert("Server error: Invalid response. Please check your connection and try again.");
        return;
      }
      
      console.log("Response status:", res.status, "Data:", data);
      
      if (data.account) {
        const { name, lastname } = data.account;
        updateAccount({ name, lastname, isAdmin: true });
        router.push("/admin/order");
      } else {
        let errorMessage = "An error occurred. Please try again.";
        if (data.message) {
          if (typeof data.message === 'object' && data.message.message) {
            errorMessage = data.message.message;
          } else if (typeof data.message === 'string') {
            errorMessage = data.message;
          }
        } else if (data.error) {
          errorMessage = data.error;
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Admin login error:", error);
      alert("Network error: Could not connect to the server. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-third to-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4 shadow-lg">
            <ShieldCheckIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Admin Login</h1>
          <p className="text-secondary">Access the administration panel</p>
        </div>

        {/* Form Card */}
        <div className="bg-third rounded-2xl shadow-2xl border border-gray-200 p-8">
          {/* Security Notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="w-5 h-5 text-yellow-600 mr-2" />
              <p className="text-sm text-yellow-800 font-medium">
                Authorized personnel only
              </p>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              This area is restricted to administrators. All access is monitored.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Admin Email Address
              </label>
              <input
                className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                placeholder="Enter admin email"
                type="email"
                {...register("email", {
                  required: true,
                  pattern:
                    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                })}
              />
              {errors.email && (
                <p className="text-danger text-sm mt-1">
                  {errors.email.type == "required"
                    ? "Please enter your admin email"
                    : "This email seems to be invalid"}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">
                Admin Password
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none pr-12"
                  placeholder="Enter admin password"
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: true,
                    pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,40}$/,
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-danger text-sm mt-1">
                  {errors.password.type == "required"
                    ? "Please enter your admin password"
                    : "Password must be between 6 and 40 characters with capital letters and numbers"}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              className="w-full bg-accent hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Authenticating...
                </div>
              ) : (
                "Access Admin Panel"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <a
              href="/"
              className="text-accent hover:text-green-600 font-medium transition-colors block"
            >
              ← Back to Store
            </a>
            <p className="text-xs text-secondary">
              Need admin access? Contact your system administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
