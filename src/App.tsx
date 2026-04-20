// EatUnity - Customer Food Ordering App
import { useState,useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { CartProvider, useCart } from "./contexts/CartContext";
import { Toast } from "./components/customer/Toast";
import { SplashScreen } from "./components/onboarding/SplashScreen";
import { OnboardingScreens } from "./components/onboarding/OnboardingScreens";
import { LoginScreen } from "./components/auth/LoginScreen";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { OTPVerification } from "./components/auth/OTPVerification";
import { ResetPassword } from "./components/auth/ResetPassword";
import { ChangePassword } from "./components/auth/ChangePassword";
import { CustomerHome } from "./components/customer/CustomerHome";
import { BottomNavigation } from "./components/customer/BottomNavigation";
import { CategoryDetail } from "./components/customer/CategoryDetail";
import { DishDetail } from "./components/customer/DishDetail";
import { DeleteAccount } from "./components/auth/DeleteAccount";
import { Cart } from "./components/customer/Cart";
import { EmptyCart } from "./components/customer/EmptyCart";
import { Checkout } from "./components/customer/Checkout";
import { OrderConfirmation } from "./components/customer/OrderConfirmation";
import { PaymentSuccess } from "./components/customer/PaymentSuccess";
import { PaymentFailed } from "./components/customer/PaymentFailed";
import { PaymentProcessing } from "./components/customer/PaymentProcessing";
import { PaymentTimeout } from "./components/customer/PaymentTimeout";
import { CODConfirmation } from "./components/customer/CODConfirmation";
import { OrderTracking } from "./components/customer/OrderTracking";
import { Orders } from "./components/customer/Orders";
import { NoOrders } from "./components/customer/NoOrders";
import { OrderCancellation } from "./components/customer/OrderCancellation";
import { RefundStatus } from "./components/customer/RefundStatus";
import { Wallet } from "./components/customer/Wallet";
import { Profile } from "./components/customer/Profile";
import { EditProfile } from "./components/customer/EditProfile";
import { MyAddresses } from "./components/customer/MyAddresses";
import { AddAddress } from "./components/customer/AddAddress";
import { FavoriteDishes } from "./components/customer/FavoriteDishes";
import { PaymentMethods } from "./components/customer/PaymentMethods";
import { Settings } from "./components/customer/Settings";
import { HelpSupport } from "./components/customer/HelpSupport";
import { GlobalSearch } from "./components/customer/GlobalSearch";
import { Notifications } from "./components/customer/Notifications";
import { ReviewsRatings } from "./components/customer/ReviewsRatings";
import { WriteReview } from "./components/customer/WriteReview";
import { NoInternet } from "./components/customer/NoInternet";
import { ApplyCoupon } from "./components/customer/ApplyCoupon";
import { OffersList } from "./components/customer/OffersList";
import { DeliveryInstructions } from "./components/customer/DeliveryInstructions";
import { ScheduleDelivery } from "./components/customer/ScheduleDelivery";
import { SubscriptionPlans } from "./components/customer/SubscriptionPlans";
import { SubscriptionTypeDetail } from "./components/customer/SubscriptionTypeDetail";
import { SubscriptionDuration } from "./components/customer/SubscriptionDuration";
import { UserDetailsForm } from "./components/customer/UserDetailsForm";
import { PlanPreview } from "./components/customer/PlanPreview";
import { TomorrowSpecials } from "./components/customer/TomorrowSpecials";
import { ChefDetails } from "./components/customer/ChefDetails";
import { LoadingScreen } from "./components/customer/LoadingScreen";
import { SkeletonLoader } from "./components/customer/SkeletonLoader";

// Screen types for navigation
type Screen =
  | "splash"
  | "onboarding"
  | "login"
  | "forgotPassword"
  | "otpVerification"
  | "resetPassword"
  | "changePassword"
  | "customerHome"
  | "categoryDetail"
  | "dishDetail"
  | "cart"
  | "emptyCart"
  | "checkout"
  | "orderConfirmation"
  | "paymentSuccess"
  | "paymentFailed"
  | "paymentProcessing"
  | "paymentTimeout"
  | "codConfirmation"
  | "orderTracking"
  | "orders"
  | "noOrders"
  | "orderCancellation"
  | "refundStatus"
  | "wallet"
  | "profile"
  | "editProfile"
  | "myAddresses"
  | "addAddress"
  | "favoriteDishes"
  | "paymentMethods"
  | "settings"
  | "helpSupport"
  | "globalSearch"
  | "notifications"
  | "reviewsRatings"
  | "writeReview"
  | "noInternet"
  | "applyCoupon"
  | "offersList"
  | "deliveryInstructions"
  | "scheduleDelivery"
  | "subscriptionPlans"
  | "subscriptionTypeDetail"
  | "subscriptionDuration"
  | "userDetailsForm"
  | "planPreview"
  | "tomorrowSpecials"
  | "chefDetails"
  | "deleteAccount"

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}

function AppContent() {
  const { toastMessage } = useCart();
  const [currentScreen, setCurrentScreen] = useState<Screen>("splash");
  const [activeTab, setActiveTab] = useState<"home" | "orders" | "profile" | "specials">("home");
  const [selectedCategory, setSelectedCategory] = useState<"healthy" | "protein" | "tiffin" | "diet">("healthy");
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedChefId, setSelectedChefId] = useState<string>("");
  const [forgotPasswordMethod, setForgotPasswordMethod] = useState<"phone" | "email">("phone");
  const [forgotPasswordValue, setForgotPasswordValue] = useState<string>("");
  const [orderAmount, setOrderAmount] = useState(0);
  const [cartData, setCartData] = useState<any[]>([]);
  const [selectedSpecial, setSelectedSpecial] = useState<any>(null);
  // 🔥 ADD THIS STATE (IMPORTANT)
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  setCartData(cart);
}, []);





useEffect(() => {
  const checkAuth = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCurrentScreen("login");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`https://chef-backend-1.onrender.com/auth/verify-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setCurrentScreen("customerHome");
      } else {
        localStorage.removeItem("token");
        setCurrentScreen("login");
      }
    } catch {
      localStorage.removeItem("token");
      setCurrentScreen("login");
    }

    setLoading(false);
  };

  checkAuth();
}, []);

  const handleSplashComplete = () => {
    setCurrentScreen("onboarding");
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen("login");
  };

  const handleLogin = () => {
    setCurrentScreen("customerHome");
  };

  const handleForgotPassword = () => {
    setCurrentScreen("forgotPassword");
  };

  const handleForgotPasswordContinue = (method: "phone" | "email", value: string) => {
    setForgotPasswordMethod(method);
    setForgotPasswordValue(value);
    setCurrentScreen("otpVerification");
  };

  const handleOTPVerified = () => {
    setCurrentScreen("resetPassword");
  };

  const handlePasswordReset = () => {
    setCurrentScreen("login");
  };

  const handleNavigateToSubscription = () => {
  setCurrentScreen("subscriptionPlans");  // ✅ direct allow
};

  const handleSelectPlan = (plan: any) => {
  console.log("SELECTED PLAN:", plan); // 🔥 DEBUG

  setSelectedPlan(plan);
  setCurrentScreen("subscriptionTypeDetail");
};

  const handleSelectDuration = (durationId: string) => {
    setSelectedDuration(durationId);
    setCurrentScreen("userDetailsForm");
  };

  const handleUserDetailsSubmit = (details: any) => {
    setUserDetails(details);
    setCurrentScreen("planPreview");
  };

  const handlePlanConfirm = () => {
    setCurrentScreen("orderConfirmation");
  };

  const handleOrderConfirmationContinue = () => {
    setCurrentScreen("paymentSuccess");
  };

  const handleNavigateToTomorrowSpecials = () => {
    setCurrentScreen("tomorrowSpecials");
  };

  const handleNavigateToChefSpecials = (chefId: string) => {
  setSelectedChefId(chefId);
  setCurrentScreen("tomorrowSpecials");
};

const handleNavigateToSpecialDetail = (special: any) => {
  setSelectedDish(null); 
  setSelectedSpecial(special);
  setCurrentScreen("dishDetail"); // reuse or new page
};
  const handleNavigateToChefDetails = (chefId: string) => {
    setSelectedChefId(chefId);
    setCurrentScreen("chefDetails");
  };

  const handleNavigateToDishDetail = (dish: any) => {
  console.log("SELECTED DISH:", dish);
  setSelectedSpecial(null);
  setSelectedDish(dish);
  setSelectedMenu({
  id: dish.id,
  chef_id: dish.chef_id,
  name: dish.name,
});        // 🔥 FULL OBJECT SAVE
  setCurrentScreen("dishDetail");
};

  const handleNavigateToCart = () => {
    setCurrentScreen("cart");
  };

  const handleNavigateToCheckout = () => {
    setCurrentScreen("checkout");
  };

  const handlePlaceOrder = () => {
    setCurrentScreen("orderConfirmation");
  };

  const handleNavigateToOrderTracking = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentScreen("orderTracking");
  };

  const handleNavigateToGlobalSearch = () => {
    setCurrentScreen("globalSearch");
  };

  const handleNavigateToNotifications = () => {
    setCurrentScreen("notifications");
  };

  const handleNavigateToReviews = (dish: any) => {
  setSelectedDish(dish);
  setCurrentScreen("reviewsRatings");
  };
  const handleNavigateToWriteReview = () => {
    setCurrentScreen("writeReview");
  };

  const handleSubmitReview = () => {
    setCurrentScreen("reviewsRatings");
  };

  const handleBackToCustomerHome = () => {
    setCurrentScreen("customerHome");
  };

  const handleNavigateToCategory = (category: "healthy" | "protein" | "tiffin" | "diet") => {
    setSelectedCategory(category);
    setCurrentScreen("categoryDetail");
  };

  const handleAddToCart = (itemId: string, quantity?: number) => {
    console.log("Added to cart:", itemId, quantity);
  };

  const handleCheckout = () => {
    setCurrentScreen("checkout");
  };

  const handlePaymentFailed = () => {
    setCurrentScreen("paymentFailed");
  };

  const handleRetryPayment = () => {
    setCurrentScreen("checkout");
  };

  const handleRetryConnection = () => {
    window.location.reload();
  };

  const handleTabChange = (tab: "home" | "orders" | "profile" | "specials") => {
    setActiveTab(tab);
    if (tab === "home") {
      setCurrentScreen("customerHome");
    } else if (tab === "orders") {
      setCurrentScreen("orders");
    } else if (tab === "profile") {
      setCurrentScreen("profile");
    } else if (tab === "specials") {
      setCurrentScreen("tomorrowSpecials");
    }
  };

  const showBottomNav = [
    "customerHome",
    "categoryDetail",
    "dishDetail",
    "orders",
    "profile",
    "tomorrowSpecials",
  ].includes(currentScreen);

  return (
    <div className="max-w-[390px] mx-auto min-h-screen bg-[#FFF8F0] relative overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        {currentScreen === "splash" && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}

        {currentScreen === "onboarding" && (
          <OnboardingScreens key="onboarding" onComplete={handleOnboardingComplete} />
        )}

        {currentScreen === "login" && (
          <LoginScreen key="login" onLogin={handleLogin} onForgotPassword={handleForgotPassword} />
        )}

        {currentScreen === "forgotPassword" && (
          <ForgotPassword
  onBack={() => setCurrentScreen("login")}
  onContinue={(method, value) => {
    setForgotPasswordMethod(method);  // 🔥 ADD THIS
    setForgotPasswordValue(value);
    setCurrentScreen("otpVerification");
  }}
/>
        )}

        {currentScreen === "otpVerification" && (
          <OTPVerification
  key="otpVerification"
  method={forgotPasswordMethod}
  value={forgotPasswordValue}
  onBack={() => setCurrentScreen("forgotPassword")}
  onVerify={(otp) => {
    console.log("OTP:", otp); // optional
    handleOTPVerified();
  }}
/>
        )}

        {currentScreen === "resetPassword" && (
  <ResetPassword
    key="resetPassword"
    onBack={() => setCurrentScreen("otpVerification")}
    phone={forgotPasswordValue}   // 🔥 MAIN FIX
    onResetSuccess={() => setCurrentScreen("login")}
  />
)}

        {currentScreen === "changePassword" && (
          <ChangePassword
  key="changePassword"
  onBack={() => setCurrentScreen("profile")}
  onPasswordChanged={() => setCurrentScreen("login")} // 🔥 ADD THIS
/>
        )}

        {currentScreen === "deleteAccount" && (
     <DeleteAccount
    onBack={() => setCurrentScreen("profile")}
    onDeleted={() => setCurrentScreen("login")}
  />
)}

        {currentScreen === "customerHome" && (
          <CustomerHome
        key="customerHome"
       onNavigateToSubscription={handleNavigateToSubscription}
       onNavigateToTomorrowSpecials={handleNavigateToTomorrowSpecials}
       onNavigateToChefDetails={handleNavigateToChefDetails}
       onNavigateToCategory={handleNavigateToCategory}
       onNavigateToCart={handleNavigateToCart}
       onNavigateToSearch={handleNavigateToGlobalSearch}
       onNavigateToNotifications={handleNavigateToNotifications}
       onNavigateToSpecialDetail={handleNavigateToSpecialDetail} // 🔥 ADD THIS
       />
        )}

        {currentScreen === "globalSearch" && (
          <GlobalSearch
            key="globalSearch"
            onBack={() => {
           if (selectedSpecial) {
           setCurrentScreen("tomorrowSpecials");
          } else {
           setCurrentScreen("categoryDetail");
          }
         
        }}
            onSelectDish={handleNavigateToDishDetail}
            onSelectChef={handleNavigateToChefDetails}
          />
        )}

        {currentScreen === "notifications" && (
          <Notifications
            key="notifications"
            onBack={() => setCurrentScreen("customerHome")}
          />
        )}

        {currentScreen === "categoryDetail" && (
          <CategoryDetail
            key="categoryDetail"
            category={selectedCategory}
            onBack={handleBackToCustomerHome}
            onAddToCart={handleAddToCart}
            onNavigateToDish={handleNavigateToDishDetail}
          />
        )}

       {currentScreen === "dishDetail" && (selectedDish || selectedSpecial) && (
  <DishDetail
    dish={selectedSpecial || selectedDish}   // 🔥 FIX
    onBack={handleBackToCustomerHome}
    onAddToCart={handleAddToCart}
    onNavigateToChef={handleNavigateToChefDetails}
  />
)}

        {currentScreen === "reviewsRatings" && (
          <ReviewsRatings
            key="reviewsRatings"
            dish={selectedDish}
            onBack={() => setCurrentScreen("dishDetail")}
            onWriteReview={handleNavigateToWriteReview}
          />
        )}

        {currentScreen === "writeReview" && (
          <WriteReview
            key="writeReview"
            dishId={selectedDish?.id}
            dishName="Paneer Butter Masala"
            onBack={() => setCurrentScreen("reviewsRatings")}
            onSubmit={handleSubmitReview}
          />
        )}

        {currentScreen === "cart" && (
        <Cart
        key="cart"
        onBack={handleBackToCustomerHome}
        onCheckout={handleNavigateToCheckout}
        setCartData={setCartData} // 🔥 ADD THIS
        />
        )}

        {currentScreen === "emptyCart" && (
          <EmptyCart
            key="emptyCart"
            onBack={handleBackToCustomerHome}
          />
        )}

       
  {currentScreen === "checkout" && (
  <Checkout
    key="checkout"
    cartData={cartData}
    onBack={() => setCurrentScreen("cart")}
    onProcessing={() => setCurrentScreen("paymentProcessing")}

    onSuccess={(order) => {

  // ✅ ORDER SAVE
  setCurrentOrder(order);

  // 🔥🔥 MAIN FIX
  setCartData([]);                 // 👉 UI empty
  localStorage.removeItem("cart"); // 👉 storage empty

  // ✅ NAVIGATION
  if (order.is_cod) {
    setCurrentScreen("codConfirmation");
  } else {
    setCurrentScreen("paymentSuccess");
  }
}}

    onFailed={() => setCurrentScreen("paymentFailed")}
    onAddAddress={() => setCurrentScreen("addAddress")}
  />
)}

        {currentScreen === "orderConfirmation" && currentOrder && (
  <OrderConfirmation
    key="orderConfirmation"
    order={currentOrder} // 🔥 FIX
    onContinue={handleBackToCustomerHome}
    onTrackOrder={(id) => {
      setSelectedOrderId(id);
      setCurrentScreen("orderTracking");
    }}
  />
)}

        {currentScreen === "paymentSuccess" && (
  <PaymentSuccess
    key="paymentSuccess"
    order={currentOrder}
    onBackToHome={handleBackToCustomerHome}
    onViewOrders={() => setCurrentScreen("orders")}
  />
)}



        {currentScreen === "paymentFailed" && (
  <PaymentFailed
    key="paymentFailed"
    order={currentOrder}
    onRetry={(order) => {
      setCurrentScreen("paymentProcessing");
    }}
    onBackToHome={handleBackToCustomerHome}
  />
)}

        {currentScreen === "paymentProcessing" && (
  <PaymentProcessing
    key="paymentProcessing"
    order={currentOrder}
    onBackToHome={handleBackToCustomerHome}
  />
)}

        {currentScreen === "paymentTimeout" && (
  <PaymentTimeout
    key="paymentTimeout"
    order={currentOrder}
    onRetry={(order) => {
      setCurrentScreen("paymentProcessing");
    }}
    onBackToHome={handleBackToCustomerHome}
  />
)}

        {currentScreen === "codConfirmation" && (
  <CODConfirmation
    key="codConfirmation"
    order={currentOrder}
    onConfirm={(order) => {
      setSelectedOrderId(order.id);
      setCurrentScreen("orderConfirmation");
    }}
    onBack={() => setCurrentScreen("checkout")}
    onBackToHome={handleBackToCustomerHome}
  />
)}

        {currentScreen === "orderTracking" && (
          <OrderTracking
            key="orderTracking"
            orderId={selectedOrderId}
            onBack={handleBackToCustomerHome}
          />
        )}

        {currentScreen === "orders" && (
          <Orders key="orders" onNavigateToTracking={handleNavigateToOrderTracking} />
        )}

        {currentScreen === "noOrders" && (
  <NoOrders
    key="noOrders"
    onBrowse={handleBackToCustomerHome}
  />
)}

        {currentScreen === "orderCancellation" && currentOrder && (
  <OrderCancellation
    key="orderCancellation"
    order={currentOrder} // 🔥 FIX
    onBack={() => setCurrentScreen("orders")}
    onSuccess={() => setCurrentScreen("orders")}
  />
)}

        {currentScreen === "refundStatus" && currentOrder && (
  <RefundStatus
    key="refundStatus"
    order={currentOrder} // 🔥 FIX
    onBack={() => setCurrentScreen("orders")}
  />
)}

        {currentScreen === "wallet" && (
          <Wallet key="wallet" onBack={handleBackToCustomerHome} />
        )}

        {currentScreen === "profile" && (
          <Profile 
            key="profile"
            onNavigateToEditProfile={() => setCurrentScreen("editProfile")}
            onNavigateToAddresses={() => setCurrentScreen("myAddresses")}
            onNavigateToFavorites={() => setCurrentScreen("favoriteDishes")}
            onNavigateToPayments={() => setCurrentScreen("paymentMethods")}
            onNavigateToSettings={() => setCurrentScreen("settings")}
            onNavigateToHelp={() => setCurrentScreen("helpSupport")}
            onNavigateToDeleteAccount={() => setCurrentScreen("deleteAccount")}
            onNavigateToChangePassword={() => setCurrentScreen("changePassword")}
            onLogout={() => setCurrentScreen("login")}
          />
        )}

        {currentScreen === "editProfile" && (
          <EditProfile 
            key="editProfile"
            onBack={() => setCurrentScreen("profile")}
            onSave={() => setCurrentScreen("profile")}
          />
        )}

        {currentScreen === "myAddresses" && (
          <MyAddresses 
            key="myAddresses"
            onBack={() => setCurrentScreen("profile")}
            onAddAddress={() => {
              setSelectedAddressId(undefined);
              setCurrentScreen("addAddress");
            }}
            onEditAddress={(id) => {
              setSelectedAddressId(id);
              setCurrentScreen("addAddress");
            }}
          />
        )}

        {currentScreen === "addAddress" && (
          <AddAddress 
            key="addAddress"
            addressId={selectedAddressId}
            onBack={() => setCurrentScreen("checkout")}
            onSave={() => {
            setCurrentScreen("checkout");
            }}
          />
        )}

        {currentScreen === "favoriteDishes" && (
          <FavoriteDishes 
            key="favoriteDishes"
            onBack={() => setCurrentScreen("profile")}
            onViewDish={handleNavigateToDishDetail}
          />
        )}

        {currentScreen === "paymentMethods" && (
          <PaymentMethods 
          onBack={() => setCurrentScreen("profile")}
          onAddCard={() => console.log("Add card")}
  
          onSelect={(method) => {
          localStorage.setItem("payment_method", method);
          setCurrentScreen("checkout");
          }}
          />
        )}

        {currentScreen === "settings" && (
          <Settings 
            key="settings"
            onBack={() => setCurrentScreen("profile")}
          />
        )}

        {currentScreen === "helpSupport" && (
          <HelpSupport 
            key="helpSupport"
            onBack={() => setCurrentScreen("profile")}
          />
        )}

        {currentScreen === "noInternet" && (
          <NoInternet
            key="noInternet"
            onRetry={handleRetryConnection}
          />
        )}

        {currentScreen === "applyCoupon" && (
          <ApplyCoupon
            key="applyCoupon"
            onBack={handleBackToCustomerHome}
          />
        )}

        {currentScreen === "offersList" && (
          <OffersList
            key="offersList"
            onBack={handleBackToCustomerHome}
          />
        )}

        {currentScreen === "deliveryInstructions" && (
          <DeliveryInstructions
            key="deliveryInstructions"
            onBack={handleBackToCustomerHome}
          />
        )}

        {currentScreen === "scheduleDelivery" && (
          <ScheduleDelivery
            key="scheduleDelivery"
            onBack={handleBackToCustomerHome}
          />
        )}

        {currentScreen === "subscriptionPlans" && (
          <SubscriptionPlans
            key="subscriptionPlans"
            onSelectPlan={handleSelectPlan}
            onBack={handleBackToCustomerHome}
          />
        )}

        {currentScreen === "subscriptionTypeDetail" && (
          <SubscriptionTypeDetail
  key="subscriptionTypeDetail"
  selectedPlan={selectedPlan}
  onBack={() => setCurrentScreen("subscriptionPlans")}
  onSelectDuration={() => {
  setCurrentScreen("subscriptionDuration");
}}
/>
        )}

        {currentScreen === "subscriptionDuration" && (
          <SubscriptionDuration
  key="subscriptionDuration"
  selectedPlan={selectedPlan}
  onBack={() => setCurrentScreen("subscriptionTypeDetail")}
/>
        )}

        {currentScreen === "userDetailsForm" && (
          <UserDetailsForm
            key="userDetailsForm"
            onSubmit={handleUserDetailsSubmit}
            onBack={() => setCurrentScreen("subscriptionDuration")}
          />
        )}

        {currentScreen === "planPreview" && (
          <PlanPreview
            key="planPreview"
            userDetails={userDetails}
            selectedPlan={selectedPlan}
            selectedDuration={selectedDuration}
            onConfirm={handlePlanConfirm}
            onBack={() => setCurrentScreen("userDetailsForm")}
          />
        )}

        {currentScreen === "tomorrowSpecials" && (
          <TomorrowSpecials
         onBack={handleBackToCustomerHome}
        onNavigateToChefDetails={handleNavigateToChefDetails}
       onNavigateToSpecialDetail={handleNavigateToSpecialDetail}
       selectedChefId={selectedChefId}   // 🔥 IMPORTANT
       />
        )}

        {currentScreen === "chefDetails" && (
          <ChefDetails
            key="chefDetails"
            chefId={selectedChefId}
          onBack={handleBackToCustomerHome}
        onNavigateToDish={handleNavigateToDishDetail}
          />
        )}
      </AnimatePresence>
      {showBottomNav && (
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      )}
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}