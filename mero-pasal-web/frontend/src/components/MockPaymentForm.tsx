"use client";
import React, { useState } from "react";
import { CreditCard, Lock, CheckCircle, X, Crown } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

interface MockPaymentFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function MockPaymentForm({
  onClose,
  onSuccess,
}: MockPaymentFormProps) {
  const { upgradeToPro } = useUser();
  const [step, setStep] = useState(1); // 1: form, 2: processing, 3: success
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    cardNumber: "4242 4242 4242 4242", // Pre-filled demo card
    expiryDate: "12/25",
    cvv: "123",
    name: "Demo User",
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setStep(2);

    try {
      // Process the "payment"
      await upgradeToPro(formData);
      setStep(3);

      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      console.error("Payment failed:", error);
      setStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    if (step === 3) {
      // If successful, reload the page to show Pro features
      window.location.reload();
    } else {
      onClose();
    }
  };

  // Success Step
  if (step === 3) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
          </div>

          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-500 mr-2" />
            <h3 className="text-2xl font-bold text-gray-900">
              Welcome to Pro!
            </h3>
          </div>

          <p className="text-gray-600 mb-6">
            Your account has been successfully upgraded to Pro. You now have
            access to all premium features!
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              🎭 <strong>Demo Mode:</strong> This was a simulated transaction.
              No actual payment was processed.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Advanced Analytics Unlocked
            </div>
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Market Predictions Access
            </div>
            <div className="flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              Priority Support
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            Access Pro Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Processing Step
  if (step === 2) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Processing Payment...
          </h3>
          <p className="text-gray-500 mb-4">
            Please wait while we upgrade your account
          </p>
          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-600">
              🔄 Validating payment details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Payment Form Step
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Crown className="h-6 w-6 text-yellow-500 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">
              Upgrade to Pro
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Demo Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Lock className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <p className="text-sm text-blue-800 font-medium">
                Demo Payment Mode
              </p>
              <p className="text-xs text-blue-600 mt-1">
                This is a demonstration. No actual payment will be processed.
                Use the pre-filled card details.
              </p>
            </div>
          </div>
        </div>

        {/* Pricing Info */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-6 border border-yellow-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">NPR 2,999</div>
            <div className="text-sm text-gray-600">per month</div>
            <div className="text-xs text-yellow-600 mt-1">
              ✨ Pro Features Included
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number
              <span className="text-xs text-gray-500 ml-1">
                (Demo: 4242 4242 4242 4242)
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cardNumber: formatCardNumber(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-10 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="4242 4242 4242 4242"
                maxLength={19}
                required
              />
              <CreditCard className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiryDate: formatExpiryDate(e.target.value),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="MM/YY"
                maxLength={5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVV
              </label>
              <input
                type="text"
                value={formData.cvv}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cvv: e.target.value.replace(/\D/g, ""),
                  })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="123"
                maxLength={4}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder="John Doe"
              required
            />
          </div>

          <div className="flex space-x-3 pt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-medium transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Processing..." : "Subscribe Now"}
            </button>
          </div>
        </form>

        {/* Features Preview */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            Included in Pro:
          </h4>
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Advanced Market Analytics
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Price Prediction Models
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Export Data & Reports
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              Priority Customer Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
