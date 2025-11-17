import { useForm } from "react-hook-form";
import { useGlobalContext } from "../../Contexts/globalContext/context";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ShieldCheckIcon, EyeIcon, EyeOffIcon, UserGroupIcon } from "@heroicons/react/outline";

export default function signup() {
  const router = useRouter();
  const { updateAccount } = useGlobalContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [requiresVerification, setRequiresVerification] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const checkAdminCount = async () => {
      try {
        const res = await fetch("/api/auth/admin-count");
        const data = await res.json();
        setRequiresVerification(data.count > 0);
      } catch (error) {
        console.error("Error checking admin count:", error);
      }
    };
    checkAdminCount();
  }, []);

  const submitHandler = async (form) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.account) {
        const { name, lastname } = data.account;
        updateAccount({ name, lastname, isAdmin: true });
        router.push("/admin/order");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
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
            <UserGroupIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-2">Create Admin Account</h1>
          <p className="text-secondary">Register a new administrator</p>
        </div>

        {/* Form Card */}
        <div className="bg-third rounded-2xl shadow-2xl border border-gray-200 p-8">
          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <ShieldCheckIcon className="w-5 h-5 text-blue-600 mr-2" />
              <p className="text-sm text-blue-800 font-medium">
                Administrator Registration
              </p>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              This form requires verification from an existing administrator.
            </p>
          </div>

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
                    placeholder="Create admin password"
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

            {/* Role Selection Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-primary border-b border-gray-200 pb-2">
                Administrator Role
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="admin"
                    name="role"
                    value="admin"
                    type="radio"
                    className="w-4 h-4 text-accent bg-secondary border-gray-300 focus:ring-accent focus:ring-2"
                    {...register("role", {
                      required: true,
                    })}
                  />
                  <label className="ml-3 text-sm font-medium text-primary" htmlFor="admin">
                    Admin - Standard administrator privileges
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="master"
                    name="role"
                    value="master"
                    type="radio"
                    className="w-4 h-4 text-accent bg-secondary border-gray-300 focus:ring-accent focus:ring-2"
                    {...register("role", {
                      required: true,
                    })}
                  />
                  <label className="ml-3 text-sm font-medium text-primary" htmlFor="master">
                    Master - Advanced administrator privileges
                  </label>
                </div>
                {errors.role && (
                  <p className="text-danger text-sm mt-1">Please select a role</p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="root"
                  name="root"
                  type="checkbox"
                  className="w-4 h-4 text-accent bg-secondary border-gray-300 rounded focus:ring-accent focus:ring-2"
                  {...register("root")}
                />
                <label className="ml-3 text-sm font-medium text-primary" htmlFor="root">
                  Root Access - Full system access (use with caution)
                </label>
              </div>
            </div>

            {/* Verification Section */}
            {requiresVerification && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-primary border-b border-gray-200 pb-2">
                  Administrator Verification
                </h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    To create a new admin account, an existing administrator must verify this registration.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Existing Admin Email
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none"
                    placeholder="Enter existing admin email"
                    type="email"
                    {...register("adminEmail", {
                      required: requiresVerification,
                      pattern:
                        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    })}
                  />
                  {errors.adminEmail && (
                    <p className="text-danger text-sm mt-1">
                      {errors.adminEmail.type == "required"
                        ? "Please enter existing admin email"
                        : "Invalid email address"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary mb-2">
                    Existing Admin Password
                  </label>
                  <div className="relative">
                    <input
                      className="w-full px-4 py-3 bg-secondary border border-gray-300 rounded-xl focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-200 outline-none pr-12"
                      placeholder="Enter existing admin password"
                      type={showAdminPassword ? "text" : "password"}
                      {...register("adminPassword", {
                        required: requiresVerification,
                        pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,40}$/,
                      })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                    >
                      {showAdminPassword ? (
                        <EyeOffIcon className="w-5 h-5" />
                      ) : (
                        <EyeIcon className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  {errors.adminPassword && (
                    <p className="text-danger text-sm mt-1">
                      {errors.adminPassword.type == "required"
                        ? "Please enter existing admin password"
                        : "Password must be 6-40 characters with uppercase, lowercase, and numbers"}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              className="w-full bg-accent hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Admin Account...
                </div>
              ) : (
                "Create Admin Account"
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center">
            <a
              href="/admin/login"
              className="text-accent hover:text-green-600 font-medium transition-colors"
            >
              Already have an admin account? Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
