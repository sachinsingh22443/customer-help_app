// EatUnity - Customer Food Ordering App
import { useState,useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { CartProvider, useCart } from "./contexts/CartContext";
import { SettingsProvider } from "./contexts/SettingsContext";
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
import { AllChefs } from "./components/customer/AllChefs";
import { LoadingScreen } from "./components/customer/LoadingScreen";
import { SkeletonLoader } from "./components/customer/SkeletonLoader";
import { Network } from "@capacitor/network";
import MySubscriptions from "./components/customer/MySubscriptions";
import MySpecialHistory from "./components/customer/MySpecialHistory";

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
  | "mySubscriptions"
  | "userDetailsForm"
  | "planPreview"
  | "tomorrowSpecials"
  | "chefDetails"
  | "allChefs"
  | "deleteAccount"
  | "mySpecialHistory"

export default function App() {
  return (
    <SettingsProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </SettingsProvider>
  );
}

function AppContent() {
  const { toastMessage } = useCart();
  const [screenHistory, setScreenHistory] =
  useState<Screen[]>(["splash"]);

  const currentScreen =
  screenHistory[screenHistory.length - 1];

  // =========================================================
// GLOBAL NAVIGATION HISTORY
// =========================================================

const navigateTo = (screen: Screen) => {
  setScreenHistory((prev) => [
    ...prev,
    screen,
  ]);
};

// =========================================================
// REPLACE CURRENT SCREEN
// Use for login/auth/network redirects
// =========================================================

const replaceScreen = (screen: Screen) => {
  setScreenHistory([screen]);
};

// =========================================================
// GO BACK
// =========================================================

const goBack = () => {
  setScreenHistory((prev) => {

    if (prev.length <= 1) {
      return prev;
    }

    return prev.slice(
      0,
      prev.length - 1
    );
  });
};

// =========================================================
// GO HOME
// Use only when user explicitly needs Home
// =========================================================

const goHome = () => {
  setScreenHistory([
    "customerHome",
  ]);
};

// =========================================================
// NORMAL NAVIGATION
// =========================================================

const setCurrentScreen = (screen: Screen) => {
  setScreenHistory((prev) => [
    ...prev,
    screen,
  ]);
};


  const [activeTab, setActiveTab] = useState<"home" | "orders" | "profile" | "specials">("home");
  const [selectedCategory, setSelectedCategory] = useState<"healthy" | "protein" | "tiffin" | "diet">("healthy");
  const [selectedDish, setSelectedDish] = useState<any>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(undefined);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedDuration, setSelectedDuration] = useState<string>("");
  const [userDetails, setUserDetails] = useState<any>(null);
  const [selectedChefId, setSelectedChefId] = useState<string>("");
  const [forgotPasswordOtp, setForgotPasswordOtp] = useState("");
  const [forgotPasswordValue, setForgotPasswordValue] = useState<string>("");
  const [orderAmount, setOrderAmount] = useState(0);
  const [cartData, setCartData] = useState<any[]>([]);
  const [selectedSpecial, setSelectedSpecial] = useState<any>(null);
  const [directCheckoutItem, setDirectCheckoutItem] = useState<any>(null);
  // 🔥 ADD THIS STATE (IMPORTANT)
  const [currentOrder, setCurrentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [splashDone, setSplashDone] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  setCartData(cart);
}, []);


useEffect(() => {
  console.log("CURRENT SCREEN:", currentScreen);
  console.log("SELECTED DISH:", selectedDish);
}, [currentScreen, selectedDish]);



useEffect(() => {
  const checkAuth = async () => {

    let token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (!token) {
  const onboardingCompleted =
    localStorage.getItem("onboarding_completed");

  if (onboardingCompleted === "true") {
    setCurrentScreen("login");
  } else {
    setCurrentScreen("onboarding");
  }

  setLoading(false);
  setAuthReady(true);
  return;
}

    const verify = async (accessToken: string) => {
      return fetch(
        "https://chef-backend-qh12.onrender.com/auth/verify-token",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    };

    try {

      let res = await verify(token);

if (res.ok) {
  // Access token valid
  setCurrentScreen("customerHome");
  setAuthReady(true);

} else if (res.status === 401 && refreshToken) {

  // =====================================================
  // ACCESS TOKEN EXPIRED
  // USE REFRESH TOKEN
  // =====================================================

  const refreshRes = await fetch(
    "https://chef-backend-qh12.onrender.com/auth/refresh",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    }
  );

  // Refresh token invalid / expired
  if (!refreshRes.ok) {
    throw new Error("Refresh Failed");
  }

  const refreshData = await refreshRes.json();

  // Save new access token
  localStorage.setItem(
    "token",
    refreshData.access_token
  );

  // Save rotated refresh token if backend sends one
  if (refreshData.refresh_token) {
    localStorage.setItem(
      "refresh_token",
      refreshData.refresh_token
    );
  }

  // Update current token
  token = refreshData.access_token;

  // Verify new access token
  res = await verify(token);

  if (res.ok) {
    setCurrentScreen("customerHome");
    setAuthReady(true);
  } else {
    throw new Error("Verify Failed");
  }

} else {

  // Token invalid and no refresh token
  throw new Error("Unauthorized");

}

    } catch (err) {

      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");

      const status = await Network.getStatus();

      if (!status.connected) {
        setCurrentScreen("noInternet");
      } else {
        setCurrentScreen("login");
      }

    }

    setLoading(false);

  };

  checkAuth();

}, []);



useEffect(() => {
  let listener: any;

  const setupNetwork = async () => {
    const status = await Network.getStatus();
    setIsOnline(status.connected);

    listener = await Network.addListener(
      "networkStatusChange",
      (status) => {
        setIsOnline(status.connected);

        if (!status.connected) {
          setCurrentScreen("noInternet");
        }
      }
    );
  };

  setupNetwork();

  return () => {
    if (listener) {
      listener.remove();
    }
  };
}, []);

  const handleSplashComplete = () => {
  setSplashDone(true);
};

  const handleOnboardingComplete = () => {
  localStorage.setItem(
    "onboarding_completed",
    "true"
  );

  setCurrentScreen("login");
};

  const handleLogin = () => {
    setCurrentScreen("customerHome");
  };

  const handleForgotPassword = () => {
    setCurrentScreen("forgotPassword");
  };

  

  

  const handlePasswordReset = () => {
    setCurrentScreen("login");
  };

  const handleNavigateToSubscription = () => {
  setCurrentScreen("subscriptionPlans");  // ✅ direct allow
};

  const handleSelectPlan = (plan: any) => {
  // console.log("SELECTED PLAN:", plan); // 🔥 DEBUG

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
  const specialDish = {
    ...special,

    // Force Tomorrow Special
    type: "special",

    // Stock
    quantity: Number(
      special.remaining ?? special.quantity ?? 0
    ),

    remaining: Number(
      special.remaining ?? special.quantity ?? 0
    ),
  };

  console.log("OPENING TOMORROW SPECIAL:", specialDish);

  

  // Clear old normal dish
  setSelectedDish(null);
  setSelectedSpecial(null);

  // Save special as selected dish
  setSelectedDish(specialDish);

  setCurrentScreen("dishDetail");
};

  const handleNavigateToChefDetails = (chefId: string) => {
    setSelectedChefId(chefId);
    setCurrentScreen("chefDetails");
  };

  const handleNavigateToDishDetail = (dish: any) => {
  // console.log("SELECTED DISH:", dish);
  setSelectedSpecial(null);
  setSelectedDish(dish);
//   setSelectedMenu({
//   id: dish.id,
//   chef_id: dish.chef_id,
//   name: dish.name,
// });        // 🔥 FULL OBJECT SAVE
  setCurrentScreen("dishDetail");
};

  const handleNavigateToCart = () => {
    setCurrentScreen("cart");
  };

  const handleNavigateToCheckout = () => {
  // Cart se checkout ja rahe hain,
  // isliye purana Order Now direct item hatao.
  setDirectCheckoutItem(null);

  setCurrentScreen("checkout");
};


  const handleOrderNow = (item: any) => {
  setDirectCheckoutItem({
    ...item,
    type: item.type === "special" ? "special" : "menu",
    quantity: item.quantity || 1,
    menu_date: item.menu_date,
    meal_type: item.meal_type,
  });

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
    // console.log("Added to cart:", itemId, quantity);
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

  const handleRetryConnection = async () => {
  const status = await Network.getStatus();

  if (status.connected) {
    const token = localStorage.getItem("token");

    if (token) {
      setCurrentScreen("customerHome");
    } else {
      setCurrentScreen("login");
    }
  }
};

  const handleTabChange = (
  tab: "home" | "orders" | "profile" | "specials"
) => {
  setActiveTab(tab);

  let targetScreen: Screen;

  if (tab === "home") {
    targetScreen = "customerHome";
  } else if (tab === "orders") {
    targetScreen = "orders";
  } else if (tab === "profile") {
    targetScreen = "profile";
  } else {
    targetScreen = "tomorrowSpecials";
  }

  // Bottom navigation is a root navigation action.
  // Clear previous detail screens.
  setScreenHistory([targetScreen]);
};

  const showBottomNav = [
    "customerHome",
    "categoryDetail",
    "orders",
    "profile",
    "tomorrowSpecials",
  ].includes(currentScreen);
  
  if (!splashDone) {
  return (
    <SplashScreen
      onComplete={handleSplashComplete}
    />
  );
}

if (!authReady) {
  return <LoadingScreen />;
}

if (!isOnline) {
  return (
    <NoInternet
      onRetry={handleRetryConnection}
    />
  );
}

  return (
    <div className="max-w-[390px] mx-auto min-h-screen bg-[#FFF8F0] relative  shadow-2xl">
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
  onContinue={(phone) => {
    setForgotPasswordValue(phone);
    setCurrentScreen("otpVerification");
  }}
/>
        )}

        {currentScreen === "otpVerification" && (
  <OTPVerification
    value={forgotPasswordValue}
    onBack={() => setCurrentScreen("forgotPassword")}
    onSuccess={(phone, otp) => {
      setForgotPasswordValue(phone);
      setForgotPasswordOtp(otp);
      setCurrentScreen("resetPassword");
    }}
  />
)}

        {currentScreen === "resetPassword" && (
  <ResetPassword
  key="resetPassword"
  onBack={() => setCurrentScreen("otpVerification")}
  phone={forgotPasswordValue}
  otp={forgotPasswordOtp}
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
       onNavigateToAllChefs={() => {
     setCurrentScreen("allChefs");
      }}

       />
        )}

        {currentScreen === "globalSearch" && (
          <GlobalSearch
            key="globalSearch"
            onBack={goBack}
            onSelectDish={handleNavigateToDishDetail}
            onSelectChef={handleNavigateToChefDetails}
          />
        )}

        {currentScreen === "notifications" && (
          <Notifications
         key="notifications"
          onBack={goBack}
        />
        )}

        {currentScreen === "categoryDetail" && (
          <CategoryDetail
  key="categoryDetail"
  category={selectedCategory}
  onBack={goBack}
  onAddToCart={handleAddToCart}
  onNavigateToDish={handleNavigateToDishDetail}
/>
        )}

  {currentScreen === "dishDetail" && selectedDish && (
  <DishDetail
    key={`dish-detail-${selectedDish.id}-${selectedDish.type}`}
    dish={selectedDish}
    onBack={goBack}
    onAddToCart={handleAddToCart}
    onNavigateToChef={handleNavigateToChefDetails}
    onOrderNow={handleOrderNow}
  />
)}

        {currentScreen === "reviewsRatings" && (
          <ReviewsRatings
  key="reviewsRatings"
  dish={selectedDish}
  onBack={goBack}
  onWriteReview={handleNavigateToWriteReview}
/>
        )}

        {currentScreen === "writeReview" && (
          <WriteReview
  key="writeReview"
  dishId={selectedDish?.id}
  dishName="Paneer Butter Masala"
  onBack={goBack}
  onSubmit={handleSubmitReview}
/>
        )}

        {currentScreen === "cart" && (
        <Cart
  key="cart"
  onBack={goBack}
  onCheckout={handleNavigateToCheckout}
  setCartData={setCartData}
/>
        )}

        {currentScreen === "emptyCart" && (
          <EmptyCart
  key="emptyCart"
  onBack={goBack}
/>
        )}

       
  {currentScreen === "checkout" && (
  <Checkout
  key="checkout"
  cartData={cartData}
  directItem={directCheckoutItem}
  onBack={goBack}
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
    setCurrentOrder(order);
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
  onBack={goBack}
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
            onNavigateToSubscriptions={() =>
            setCurrentScreen("mySubscriptions")
             }
            onNavigateToSpecialHistory={() =>
                 setCurrentScreen("mySpecialHistory")
            }
            onNavigateToPayments={() => setCurrentScreen("paymentMethods")}
            onNavigateToSettings={() => setCurrentScreen("settings")}
            onNavigateToHelp={() => setCurrentScreen("helpSupport")}
            onNavigateToDeleteAccount={() => setCurrentScreen("deleteAccount")}
            onNavigateToChangePassword={() => setCurrentScreen("changePassword")}
            onLogout={() => {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.clear();
  setCurrentScreen("login");
}}
          />
        )}


   {currentScreen === "mySpecialHistory" && (
  <MySpecialHistory
  onBack={goBack}
/>
)}

        {currentScreen === "editProfile" && (
          <EditProfile
  key="editProfile"
  onBack={goBack}
  onSave={() => goBack()}
/>
        )}

        {currentScreen === "myAddresses" && (
          <MyAddresses 
            key="myAddresses"
            onBack={goBack}
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
  onBack={goBack}
  onSave={() => goBack()}
/>
        )}

        {currentScreen === "favoriteDishes" && (
          <FavoriteDishes
          key="favoriteDishes"
          onBack={goBack}
          />
        )}

        {currentScreen === "paymentMethods" && (
          <PaymentMethods 
          onBack={goBack}
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
  onBack={goBack}
/>
        )}

        {currentScreen === "helpSupport" && (
          <HelpSupport
  key="helpSupport"
  onBack={goBack}
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
            onBack={goBack}
          />
        )}

        {currentScreen === "subscriptionTypeDetail" && (
          <SubscriptionTypeDetail
  key="subscriptionTypeDetail"
  selectedPlan={selectedPlan}
  onBack={goBack}
  onSelectDuration={() => {
  setCurrentScreen("subscriptionDuration");
}}
/>
        )}

        {currentScreen === "subscriptionDuration" && (
  <SubscriptionDuration
  key="subscriptionDuration"
  selectedPlan={selectedPlan}
  onBack={goBack}
  onViewSubscriptions={() =>
    setCurrentScreen("mySubscriptions")
  }
  onGoHome={() =>
    setCurrentScreen("customerHome")
  }
/>
        )}


  {currentScreen === "mySubscriptions" && (
  <MySubscriptions
    onBack={handleBackToCustomerHome}
    onViewDish={handleNavigateToDishDetail}
  />
)}

        {currentScreen === "userDetailsForm" && (
          <UserDetailsForm
            key="userDetailsForm"
            onSubmit={handleUserDetailsSubmit}
            onBack={goBack}
          />
        )}

        {currentScreen === "planPreview" && (
          <PlanPreview
            key="planPreview"
            userDetails={userDetails}
            selectedPlan={selectedPlan}
            selectedDuration={selectedDuration}
            onConfirm={handlePlanConfirm}
           onBack={goBack}
          />
        )}

        {currentScreen === "tomorrowSpecials" && (
          <TomorrowSpecials
  onBack={goBack}
  onNavigateToChefDetails={
    handleNavigateToChefDetails
  }
  onNavigateToSpecialDetail={
    handleNavigateToSpecialDetail
  }
  selectedChefId={selectedChefId}
/>
        )}

        {currentScreen === "chefDetails" && (
       <ChefDetails
    key="chefDetails"
    chefId={selectedChefId}
    onBack={goBack}
    onNavigateToDish={handleNavigateToDishDetail}
  />
)}

        {currentScreen === "allChefs" && (
  <AllChefs
  key="allChefs"
  onBack={goBack}
  onNavigateToChefDetails={
    handleNavigateToChefDetails
  }
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