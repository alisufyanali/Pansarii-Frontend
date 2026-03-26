// app/register/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  FaUser,
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaPhone,
  FaGoogle,
  FaFacebook,
  FaLeaf,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

// JSON structure for register request
interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

// JSON structure for register response
interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      fullName: string;
      email: string;
      phone: string;
      createdAt: string;
    };
    token: string;
  };
  error?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }));
    // Clear error for this field
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: "" }));
    }
  };

  // Enhanced validation that runs on client and can't be bypassed
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // Full Name validation
    if (!formData.fullName || !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    } else if (formData.fullName.trim().length > 50) {
      newErrors.fullName = "Full name must be less than 50 characters";
    }

    // Email validation
    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (formData.email.length > 100) {
      newErrors.email = "Email must be less than 100 characters";
    }

    // Phone validation (Pakistan)
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      // Remove all non-digit characters
      const cleaned = formData.phone.replace(/\D/g, '');
      
      // Pakistan phone number validation
      // Valid formats: 
      // 03XXXXXXXXX (11 digits starting with 03)
      // 3XXXXXXXXX (10 digits starting with 3)
      // +923XXXXXXXXX (13 digits with country code)
      const pakistanPhoneRegex = /^(?:\+92|0)?3[0-9]{9}$/;
      
      if (!pakistanPhoneRegex.test(cleaned)) {
        newErrors.phone = "Please enter a valid Pakistan mobile number (e.g., 03XXXXXXXXX or +923XXXXXXXXX)";
      } else if (cleaned.length === 10 && !cleaned.startsWith('3')) {
        newErrors.phone = "Invalid Pakistan number format";
      } else if (cleaned.length === 11 && !cleaned.startsWith('03')) {
        newErrors.phone = "Invalid Pakistan number format";
      } else if (cleaned.length === 13 && !cleaned.startsWith('923')) {
        newErrors.phone = "Invalid Pakistan number format";
      }
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (formData.password.length > 50) {
      newErrors.password = "Password must be less than 50 characters";
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one uppercase letter";
    } else if (!/\d/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Terms validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");
    
    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // Clean phone number before sending to API
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: cleanedPhone.startsWith('0') ? cleanedPhone : `0${cleanedPhone}`,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          agreeToTerms: formData.agreeToTerms
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Invalid content type:", contentType);
        throw new Error("Server returned an invalid response. Please try again later.");
      }

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        // Handle specific field errors from API
        if (response.status === 409) {
          setErrors({ email: "Email already exists. Please use a different email or login." });
        } else if (response.status === 400) {
          // Handle validation errors from server
          if (data.error) {
            if (data.error.toLowerCase().includes("email")) {
              setErrors({ email: data.error });
            } else if (data.error.toLowerCase().includes("password")) {
              setErrors({ password: data.error });
            } else if (data.error.toLowerCase().includes("phone")) {
              setErrors({ phone: data.error });
            } else {
              setErrors({ submit: data.error });
            }
          } else {
            setErrors({ submit: "Validation failed. Please check your input." });
          }
        } else {
          setErrors({ submit: data.error || data.message || "Registration failed. Please try again." });
        }
        return;
      }

      if (data.success) {
        // Show success message
        setSuccessMessage("Account created successfully! Redirecting to login...");
        
        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          agreeToTerms: false
        });

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          router.push("/login?message=Registration successful! Please login.");
        }, 2000);
      } else {
        setErrors({ submit: data.message || "Registration failed. Please try again." });
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrors({ 
        submit: error.message || "Network error. Please check your connection and try again." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Sign up with ${provider}`);
    setErrors({ submit: "Social login coming soon!" });
  };

  const passwordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "bg-gray-200" };
    
    let strength = 0;
    const checks = [
      password.length >= 8,
      /[a-z]/.test(password) && /[A-Z]/.test(password),
      /\d/.test(password),
      /[@$!%*?&#]/.test(password)
    ];
    
    strength = checks.filter(Boolean).length;

    const labels = ["", "Weak", "Fair", "Good", "Strong"];
    const colors = ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"];
    
    return { 
      strength, 
      label: labels[strength], 
      color: colors[strength],
      checks
    };
  };

  const pwdStrength = passwordStrength(formData.password);

  const formatPakistanPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '');
    
    // Format Pakistan mobile numbers
    if (cleaned.startsWith('92')) {
      // Format with country code: +92 3XX XXXXXXX
      if (cleaned.length >= 3) {
        const code = cleaned.slice(0, 2);
        const operator = cleaned.slice(2, 3);
        const firstPart = cleaned.slice(3, 6);
        const lastPart = cleaned.slice(6, 11);
        if (lastPart) {
          return `+${code} ${operator}${firstPart} ${lastPart}`;
        } else if (firstPart) {
          return `+${code} ${operator}${firstPart}`;
        } else if (operator) {
          return `+${code} ${operator}`;
        }
        return `+${code}`;
      }
    } else if (cleaned.startsWith('0')) {
      // Format without country code: 03XX XXXXXXX
      if (cleaned.length >= 4) {
        const firstPart = cleaned.slice(0, 4);
        const lastPart = cleaned.slice(4, 11);
        if (lastPart) {
          return `${firstPart} ${lastPart}`;
        }
        return firstPart;
      }
    } else if (cleaned.startsWith('3')) {
      // Format without leading zero: 3XX XXXXXXX
      if (cleaned.length >= 4) {
        const firstPart = `0${cleaned.slice(0, 3)}`;
        const lastPart = cleaned.slice(3, 10);
        if (lastPart) {
          return `${firstPart} ${lastPart}`;
        }
        return firstPart;
      }
    }
    
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Allow only digits, spaces, and plus sign
    const cleaned = input.replace(/[^\d\s+]/g, '');
    const formatted = formatPakistanPhoneNumber(cleaned);
    setFormData(prev => ({ ...prev, phone: formatted }));
    
    // Clear phone error if any
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: "" }));
    }
  };

  const getPhonePlaceholder = () => {
    return "03XX XXXXXXX or +92 3XX XXXXXXX";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#197B33] rounded-full flex items-center justify-center">
              <FaLeaf className="text-3xl text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
          <p className="mt-2 text-gray-600">Join Pansari Inn for natural wellness</p>
        </div>

        {/* Register Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 text-sm flex items-center">
                <FaCheckCircle className="mr-2 flex-shrink-0" />
                {successMessage}
              </p>
            </div>
          )}

          {/* Submit Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm flex items-center">
                <FaExclamationTriangle className="mr-2 flex-shrink-0" />
                {errors.submit}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#197B33] focus:border-transparent outline-none transition-all ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#197B33] focus:border-transparent outline-none transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone Field - Pakistan Only */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number (Pakistan) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="text-gray-400" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder={getPhonePlaceholder()}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#197B33] focus:border-transparent outline-none transition-all ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                  required
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
              <p className="mt-1 text-xs text-gray-500">
                Enter Pakistan mobile number (e.g., 03001234567 or +923001234567)
              </p>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#197B33] focus:border-transparent outline-none transition-all ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
              
              {/* Password Requirements */}
              <div className="mt-2 space-y-1">
                <p className="text-xs text-gray-600">Password must contain:</p>
                <ul className="text-xs text-gray-600 space-y-1 ml-2">
                  <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                    <span className="mr-1">•</span> At least 8 characters
                  </li>
                  <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-1">•</span> At least one lowercase letter
                  </li>
                  <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-1">•</span> At least one uppercase letter
                  </li>
                  <li className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
                    <span className="mr-1">•</span> At least one number
                  </li>
                </ul>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-gray-600">Password strength:</span>
                    <span className={`text-xs font-medium ${
                      pwdStrength.strength === 4 ? 'text-green-600' :
                      pwdStrength.strength === 3 ? 'text-yellow-600' :
                      pwdStrength.strength === 2 ? 'text-orange-600' :
                      'text-red-600'
                    }`}>
                      {pwdStrength.label}
                    </span>
                  </div>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded ${
                          level <= pwdStrength.strength ? pwdStrength.color : "bg-gray-200"
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-[#197B33] focus:border-transparent outline-none transition-all ${
                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                  }`}
                  disabled={isLoading}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <p className="mt-1 text-sm text-green-600">✓ Passwords match</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="pt-2">
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className={`h-5 w-5 text-[#197B33] focus:ring-[#197B33] border-gray-300 rounded mt-0.5 ${
                    errors.agreeToTerms ? "border-red-500" : ""
                  }`}
                  disabled={isLoading}
                  required
                />
                <label htmlFor="agreeToTerms" className="ml-3 block text-sm text-gray-700">
                  I agree to the{" "}
                  <Link href="/terms" className="text-[#197B33] hover:text-[#156529] font-medium" target="_blank">
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-[#197B33] hover:text-[#156529] font-medium" target="_blank">
                    Privacy Policy
                  </Link>
                  {" "}*
                </label>
              </div>
              {errors.agreeToTerms && <p className="mt-1 ml-8 text-sm text-red-600">{errors.agreeToTerms}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#197B33] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#156529] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md hover:shadow-lg"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <FaCheckCircle className="mr-2" />
                  Create Account
                </>
              )}
            </button>

            {/* Required Fields Note */}
            <p className="text-xs text-gray-500 text-center mt-2">
              * Required fields
            </p>
          </form>

          {/* Divider */}
          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or sign up with</span>
            </div>
          </div>

          {/* Social Signup Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSocialSignup("google")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-[#197B33] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-red-500" />
              <span className="text-sm font-medium">Google</span>
            </button>
            <button
              onClick={() => handleSocialSignup("facebook")}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-[#197B33] hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaFacebook className="text-blue-600" />
              <span className="text-sm font-medium">Facebook</span>
            </button>
          </div>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="font-medium text-[#197B33] hover:text-[#156529] hover:underline"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-600 hover:text-[#197B33] hover:underline"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>By creating an account, you agree to our terms and privacy policy.</p>
          <p className="mt-1">Need help? <Link href="/contact" className="text-[#197B33] hover:underline">Contact Support</Link></p>
        </div>
      </div>
    </div>
  );
}