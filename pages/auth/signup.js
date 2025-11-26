import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../Contexts/globalContext/context";
import { useRouter } from "next/router";
import Link from "next/link";
import { useState } from "react";
import { UserIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from "@heroicons/react/outline";

export default function signup() {
  const { updateAccount } = useGlobalContext();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async (form) => {
    if (!acceptTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("Failed to parse response as JSON:", jsonError);
        alert("Server error: Invalid response. Please check your connection and try again.");
        return;
      }
      
      if (!res.ok && !data.user) {
        const errorMessage = data.message || data.error || `Error: ${res.status} ${res.statusText}`;
        alert(errorMessage);
        return;
      }
      
      if (data.user) {
        const { name, lastname, phone, address } = data.user;
        updateAccount({ name, lastname, phone, address, isAdmin: false });
        router.push("/");
      } else {
        const errorMessage = data.message || data.error || "An error occurred. Please try again.";
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Network error: Could not connect to the server. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-third to-secondary flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-full mb-4 shadow-lg">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-secondary">Join us today and start shopping</p>
        </div>

        {/* Form Card */}
        <div className="bg-third rounded-2xl shadow-2xl border border-gray-200 p-8">
          <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
            {/* Personal Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b border-gray-200 pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    First Name
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter first name"
                    type="text"
                    {...register("name", { required: true, maxLength: 20 })}
                  />
                  {errors.name && (
                    <p className="text-danger text-sm mt-1">
                      {errors.name.type == "required"
                        ? "Please enter your first name"
                        : "Maximum length is 20 characters"}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Last Name
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter last name"
                    type="text"
                    {...register("lastname", { required: true, maxLength: 20 })}
                  />
                  {errors.lastname && (
                    <p className="text-danger text-sm mt-1">
                      {errors.lastname.type == "required"
                        ? "Please enter your last name"
                        : "Maximum length is 20 characters"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b border-gray-200 pb-2">
                Account Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Email Address
                </label>
                <input
                  className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                  placeholder="Enter your email"
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
                      ? "Please enter your email"
                      : "Invalid email address"}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none pr-12"
                    placeholder="Create a password"
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
                      ? "Please enter a password"
                      : "Password must be 6-40 characters with uppercase, lowercase, and numbers"}
                  </p>
                )}
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b border-gray-200 pb-2">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Phone Number
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter phone number"
                    type="tel"
                    {...register("phone", {
                      pattern: /^\d+$/,
                    })}
                  />
                  {errors.phone && (
                    <p className="text-danger text-sm mt-1">Invalid phone number</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Address
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter your address"
                    type="text"
                    {...register("address")}
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center space-x-3">
              <input
                id="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="w-4 h-4 text-accent bg-secondary border-gray-300 rounded focus:ring-accent focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm text-primary">
                I agree to the{" "}
                <Link href="/terms">
                  <a className="text-accent hover:text-green-600 font-medium">
                    Terms and Conditions
                  </a>
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy">
                  <a className="text-accent hover:text-green-600 font-medium">
                    Privacy Policy
                  </a>
                </Link>
              </label>
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
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <Link href="/auth/login">
              <a className="text-accent hover:text-green-600 font-medium transition-colors">
                Already have an account? Sign in
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
