import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  CreditCard,
  User,
  Mail,
  Phone,
  Home,
  MapPin,
  Building,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/hooks/authContentfulUser";
import { useCart } from "@/store/Cart";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import { useProducts } from "@/hooks/useProducts";
import InputField from "@/components/ui/InputField";
import StateInput from "@/components/State/StateInput";
import { StateCode } from "@components/shipping/stateUtils";
import AddressErrorPopup from "@/components/AddressErrorPopup";
import ShippingOptions from "@components/shipping/ShippingOptions";
import { type ShippingRate } from "@/types/shipping";

interface Product {
  name: string;
  price: number;
  image: {
    fields: {
      file: {
        url: string;
      };
    };
  };
}

const ShippingForm: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const { items, subTotal } = useCart();
  const TAX_RATE = 0.06; // 6% tax rate
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const { products } = useProducts();
  const [randomProduct, setRandomProduct] = useState<Product | null>(null);
  const [isErrorPopupOpen, setIsErrorPopupOpen] = useState(false);
  const [currentError, setCurrentError] = useState("");
  const [selectedShippingRate, setSelectedShippingRate] = useState<
    ShippingRate | undefined
  >();
  const [showShippingOptions, setShowShippingOptions] = useState(false);

  const [formData, setFormData] = useState({
    fullName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    firm: "",
    streetAddress: "",
    secondaryAddress: "",
    city: "",
    state: "",
    urbanization: "",
    zipCode: "",
    zipPlus4: "",
  });

  const [formErrors, setFormErrors] = useState({
    streetAddress: "",
    secondaryAddress: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [verifiedFields, setVerifiedFields] = useState({
    streetAddress: false,
    secondaryAddress: false,
    city: false,
    state: false,
    zipCode: false,
  });

  // Calculate total with tax and shipping
  const calculateTotal = (subtotal: number, shippingRate?: ShippingRate) => {
    const tax = subtotal * TAX_RATE;
    const shipping = shippingRate?.totalPrice || 0;
    return subtotal + tax + shipping;
  };

  useEffect(() => {
    if (items.length === 0) {
      router.push("/checkout");
    }
  }, [items, router]);

  useEffect(() => {
    if (products && products.length > 0) {
      const randomIndex = Math.floor(Math.random() * products.length);
      setRandomProduct(products[randomIndex]);
    }
  }, [products]);

  const handleStateSelect = (stateCode: StateCode) => {
    setFormData((prev) => ({
      ...prev,
      state: stateCode,
    }));

    setVerifiedFields((prev) => ({
      ...prev,
      state: false,
    }));
    setFormErrors((prev) => ({
      ...prev,
      state: "",
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset verification when field changes
    if (
      [
        "streetAddress",
        "secondaryAddress",
        "city",
        "state",
        "zipCode",
      ].includes(name)
    ) {
      setVerifiedFields((prev) => ({
        ...prev,
        [name]: false,
      }));
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateAddress = async () => {
    setIsValidating(true);
    setFormErrors({
      streetAddress: "",
      secondaryAddress: "",
      city: "",
      state: "",
      zipCode: "",
    });

    try {
      // Limpieza inicial de datos
      const cleanStreet = formData.streetAddress.trim();
      const cleanCity = formData.city.trim();
      const cleanState = formData.state.trim().toUpperCase();
      const cleanZip = formData.zipCode.trim();

      // Validaciones básicas
      let hasErrors = false;
      const newErrors = {
        streetAddress: "",
        secondaryAddress: "",
        city: "",
        state: "",
        zipCode: "",
      };

      // Validar campos requeridos
      if (!cleanStreet) {
        newErrors.streetAddress = "Street address is required";
        hasErrors = true;
      }

      if (!cleanState) {
        newErrors.state = "State is required";
        hasErrors = true;
      }

      if (!cleanCity && !cleanZip) {
        newErrors.city = "Either city or ZIP code is required";
        newErrors.zipCode = "Either city or ZIP code is required";
        hasErrors = true;
      }

      // Validar ZIP si está presente
      if (cleanZip && !/^\d{5}$/.test(cleanZip)) {
        newErrors.zipCode = "ZIP code must be 5 digits";
        hasErrors = true;
      }

      if (hasErrors) {
        const firstError = Object.entries(newErrors).find(
          ([, value]) => value !== ""
        );
        if (firstError) {
          setCurrentError(firstError[1]);
          setIsErrorPopupOpen(true);
        }
        setFormErrors(newErrors);
        return false;
      }

      const response = await fetch("/api/validate-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firm: formData.firm.trim(),
          streetAddress: cleanStreet,
          secondaryAddress: formData.secondaryAddress.trim(),
          city: cleanCity,
          state: cleanState,
          urbanization: formData.urbanization.trim(),
          ZIPCode: cleanZip,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        const errorMessage = data.error?.message || "Error validating address";
        setCurrentError(errorMessage);
        setIsErrorPopupOpen(true);
        setFormErrors((prev) => ({
          ...prev,
          streetAddress: errorMessage,
        }));
        return false;
      }
      if (data.address) {
        setFormData((prev) => ({
          ...prev,
          streetAddress: data.address.streetAddress,
          city: data.address.city,
          state: data.address.state,
          zipCode: data.address.ZIPCode,
          zipPlus4: data.address.ZIPPlus4 || "",
        }));

        setVerifiedFields({
          streetAddress: true,
          secondaryAddress: true,
          city: true,
          state: true,
          zipCode: true,
        });

        setShowShippingOptions(true);
        toast.success("Address verified successfully!");
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error validating address:", error);
      setCurrentError("Error validating address. Please try again.");
      setIsErrorPopupOpen(true);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedShippingRate) {
      toast.error("Please select a shipping method");
      return;
    }
    const isValid = await validateAddress();
    if (!isValid) {
      toast.error("Please verify your address before proceeding");
      return;
    }

    setIsSubmitting(true);

    if (subTotal <= 0) {
      toast.error("The cart total is invalid. Please check your cart.");
      setIsSubmitting(false);
      return;
    }

    const purchaseId = uuidv4();
    const tax = subTotal * TAX_RATE;
    const total = calculateTotal(subTotal, selectedShippingRate);

    try {
      const stripeData = {
        // Convert all monetary values to cents for Stripe
        amount: Math.round(total * 100), // Convert to cents
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          description: item.description || "",
          image_url: item.image_url,
        })),
        customerEmail: formData.email,
        customerName: formData.fullName,
        tax: Math.round(tax * 100), // Convert tax to cents
        shipping: Math.round(selectedShippingRate.totalPrice * 100), // Convert shipping to cents
        shippingAddress: {
          firm: formData.firm.trim(),
          address: formData.streetAddress.trim(),
          secondaryAddress: formData.secondaryAddress.trim(),
          city: formData.city.trim(),
          state: formData.state.trim().toUpperCase(),
          urbanization: formData.urbanization.trim(),
          zipCode: formData.zipCode.trim(),
          zipPlus4: formData.zipPlus4.trim(),
          phone: formData.phone.trim(),
        },
        metadata: {
          purchaseId,
          subtotal: Math.round(subTotal * 100), // Add subtotal in cents
          tax: Math.round(tax * 100), // Include tax in metadata
          shipping: Math.round(selectedShippingRate.totalPrice * 100), // Include shipping in metadata
        },
      };

      localStorage.setItem(
        "pendingOrder",
        JSON.stringify({
          purchaseId,
          ...stripeData,
          total,
          subtotal: subTotal,
          tax,
          shippingCost: selectedShippingRate.totalPrice,
        })
      );

      const response = await fetch("/api/generateStripeUrl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stripeData),
      });

      if (!response.ok) {
        throw new Error("Error creating payment session");
      }

      const data = await response.json();

      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Invalid response from payment server");
      }
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error(
        "There was an error processing your order. Please try again."
      );
      setIsSubmitting(false);
    }
  };
  const totalItemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="flex items-center justify-start min-h-screen bg-[#936DAD] p-4 relative overflow-hidden">
      <AnimatePresence>
        {randomProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={`https:${randomProduct.image.fields.file.url}`}
              alt={randomProduct.name}
              layout="fill"
              objectFit="cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-purple-600 opacity-70"></div>
      <Image
        src="/images/SVG/LogoTransparent.svg"
        alt="Logo"
        width={600}
        height={600}
        className="absolute top-4 right-4 z-10 opacity-30 hidden lg:block"
      />
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md z-10 ml-4 sm:ml-8 md:ml-16 lg:ml-24"
      >
        <motion.div
          className="bg-[#ECEACA] bg-opacity-90 rounded-3xl shadow-2xl overflow-hidden"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-8 pt-8 pb-6 bg-[#D1D550] flex items-center justify-center"
          >
            <Image
              src="/images/SVG/LogoOnPurple.svg"
              alt="Logo"
              width={100}
              height={100}
              className="mr-4"
            />
            <div className="h-12 w-px bg-white mx-4"></div>
            <div className="flex-1 flex flex-col justify-center items-center">
              <motion.h2
                className="text-3xl font-extrabold text-white"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
              >
                Shipping Information
              </motion.h2>
            </div>
          </motion.div>

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <InputField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                icon={<User />}
              />
              <InputField
                label="Business/Company Name (Optional)"
                name="firm"
                value={formData.firm}
                onChange={handleChange}
                icon={<Building />}
              />
              <InputField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                type="email"
                icon={<Mail />}
              />
              <InputField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                type="tel"
                icon={<Phone />}
              />
              <InputField
                label="Street Address"
                name="streetAddress"
                value={formData.streetAddress}
                onChange={handleChange}
                required
                icon={<Home />}
                error={formErrors.streetAddress}
                verified={verifiedFields.streetAddress}
                disabled={verifiedFields.streetAddress}
              />
              <InputField
                label="Apt, Suite, Unit, etc. (Optional)"
                name="secondaryAddress"
                value={formData.secondaryAddress}
                onChange={handleChange}
                error={formErrors.secondaryAddress}
                verified={verifiedFields.secondaryAddress}
                disabled={verifiedFields.secondaryAddress}
              />
              <InputField
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                icon={<MapPin />}
                error={formErrors.city}
                verified={verifiedFields.city}
                disabled={verifiedFields.city}
              />
              <StateInput
                value={formData.state}
                onChange={(value) =>
                  handleChange({
                    target: { name: "state", value },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
                onStateSelect={handleStateSelect}
                error={formErrors.state}
                verified={verifiedFields.state}
                disabled={verifiedFields.state}
              />
              <InputField
                label="ZIP Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
                error={formErrors.zipCode}
                verified={verifiedFields.zipCode}
                disabled={verifiedFields.zipCode}
              />
              <InputField
                label="ZIP+4 (Optional)"
                name="zipPlus4"
                value={formData.zipPlus4}
                onChange={handleChange}
                disabled={verifiedFields.zipCode}
              />

              <div className="space-y-4">
                <motion.button
                  type="button"
                  onClick={validateAddress}
                  disabled={
                    isValidating || Object.values(verifiedFields).every(Boolean)
                  }
                  className={`w-full font-bold py-3 rounded-full transition duration-300 flex items-center justify-center
      ${
        Object.values(verifiedFields).every(Boolean)
          ? "bg-green-500 cursor-not-allowed opacity-50"
          : "bg-[#936DAD] hover:bg-[#8363A7] disabled:opacity-50"
      } text-white`}
                >
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating Address...
                    </>
                  ) : Object.values(verifiedFields).every(Boolean) ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Address Verified
                    </>
                  ) : (
                    "Verify Address"
                  )}
                </motion.button>

                {showShippingOptions && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <ShippingOptions
                      destinationZip={formData.zipCode}
                      itemCount={totalItemCount}
                      onSelectRate={setSelectedShippingRate}
                      selectedRate={selectedShippingRate}
                    />
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !Object.values(verifiedFields).every(Boolean) ||
                    !selectedShippingRate
                  }
                  className={`w-full font-bold py-3 rounded-full transition duration-300 flex items-center justify-center
        ${
          Object.values(verifiedFields).every(Boolean) && selectedShippingRate
            ? "bg-[#926cad] hover:bg-[#926c]"
            : "bg-gray-400 cursor-not-allowed"
        } text-white disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Payment ($
                      {calculateTotal(subTotal, selectedShippingRate).toFixed(
                        2
                      )}
                      )
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>

      <AddressErrorPopup
        isOpen={isErrorPopupOpen}
        onClose={() => setIsErrorPopupOpen(false)}
        error={currentError}
      />
    </div>
  );
};

export default ShippingForm;
