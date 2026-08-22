import { motion } from "motion/react";

import {
  Star,
  MapPin,
  Clock,
  Award,
  Heart,
  ChevronLeft,
  Plus,
  ShoppingBag,
} from "lucide-react";

import { ImageWithFallback } from "../figma/ImageWithFallback";

import { useEffect, useState } from "react";

import axios from "axios";

// =========================================================
// PROPS
// =========================================================

interface ChefDetailsProps {
  chefId?: string;

  onBack: () => void;

  onNavigateToDish?: (dish: any) => void;
}

// =========================================================
// MEAL TYPE
// =========================================================

type MealType =
  | "breakfast"
  | "lunch"
  | "dinner";

// =========================================================
// MENU ITEM
// =========================================================

interface MenuItem {
  id: string;

  name: string;

  description?: string;

  price: number;

  image_urls?: string[];

  is_available?: boolean;

  food_type?: string;

  calories?: number;

  protein?: number;

  carbs?: number;

  fats?: number;

  ingredients?: string[];

  prep_time?: number;

  // =======================================================
  // NORMAL MENU
  // =======================================================

  menu_date?: string;

  meal_type?: MealType;

  // =======================================================
  // OPTIONAL STOCK
  // =======================================================

  remaining?: number;

  quantity?: number;
}

// =========================================================
// DAY MENU
// =========================================================

interface DayMenu {
  date: string;

  day_name: string;

  day_number: number;

  meals: {
    meal_type: MealType;

    menu: MenuItem | null;

    source?: string;

    can_order?: boolean;

    cutoff_time?: string;

    cutoff_passed?: boolean;
  }[];
}

// =========================================================
// CHEF
// =========================================================

interface Chef {
  id?: string;

  name?: string;

  profile_image?: string;

  specialties?: string;

  location?: string;

  bio?: string;

  rating?: number;

  total_reviews?: number;

  experience?: number;
}

// =========================================================
// API
// =========================================================

const API_BASE =
  "https://chef-backend-qh12.onrender.com";

// =========================================================
// MEAL CONFIG
// =========================================================

const MEAL_CONFIG: Record<
  MealType,
  {
    label: string;
    emoji: string;
    cutoff: string;
  }
> = {
  // =======================================================
  // BREAKFAST
  // =======================================================

  breakfast: {
    label: "Breakfast",
    emoji: "🌅",
    cutoff: "9:00 AM",
  },

  // =======================================================
  // LUNCH
  // =======================================================

  lunch: {
    label: "Lunch",
    emoji: "☀️",
    cutoff: "1:00 PM",
  },

  // =======================================================
  // DINNER
  // =======================================================

  dinner: {
    label: "Dinner",
    emoji: "🌙",
    cutoff: "8:00 PM",
  },
};

// =========================================================
// FORMAT DATE
// =========================================================

function formatDate(
  dateString: string
) {
  if (!dateString) {
    return "";
  }

  const date =
    new Date(
      `${dateString}T00:00:00`
    );

  return date.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
}

// =========================================================
// GET DAY NAME
// =========================================================

function getDayName(
  dateString: string
) {
  if (!dateString) {
    return "";
  }

  const date =
    new Date(
      `${dateString}T00:00:00`
    );

  return date.toLocaleDateString(
    "en-IN",
    {
      weekday: "long",
    }
  );
}

// =========================================================
// GET SHORT DAY NAME
// =========================================================

function getShortDayName(
  dateString: string
) {
  if (!dateString) {
    return "";
  }

  const date =
    new Date(
      `${dateString}T00:00:00`
    );

  return date.toLocaleDateString(
    "en-IN",
    {
      weekday: "short",
    }
  );
}

// =========================================================
// TODAY STRING
// =========================================================

function getTodayString() {
  const today =
    new Date();

  return `${today.getFullYear()}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${String(
    today.getDate()
  ).padStart(2, "0")}`;
}

// =========================================================
// IS TODAY
// =========================================================

function isToday(
  dateString: string
) {
  if (!dateString) {
    return false;
  }

  return (
    dateString ===
    getTodayString()
  );
}

// =========================================================
// CUTOFF DATE TIME
// =========================================================

function getCutoffDateTime(
  dateString: string,
  mealType: MealType
) {
  const cutoffMap: Record<
    MealType,
    string
  > = {
    breakfast:
      "09:00:00",

    lunch:
      "13:00:00",

    dinner:
      "20:00:00",
  };

  return new Date(
    `${dateString}T${cutoffMap[mealType]}`
  );
}

// =========================================================
// CHECK CUTOFF
// =========================================================

function hasCutoffPassed(
  dateString: string,
  mealType: MealType
) {
  if (!dateString) {
    return false;
  }

  const cutoff =
    getCutoffDateTime(
      dateString,
      mealType
    );

  return (
    new Date() >= cutoff
  );
}

// =========================================================
// COMPONENT
// =========================================================

export function ChefDetails({
  chefId,
  onBack,
  onNavigateToDish,
}: ChefDetailsProps) {

  // =======================================================
  // CHEF
  // =======================================================

  const [
    chef,
    setChef,
  ] =
    useState<Chef | null>(
      null
    );

  // =======================================================
  // 7 DAY MENU
  // =======================================================

  const [
    menuDays,
    setMenuDays,
  ] =
    useState<DayMenu[]>(
      []
    );

  // =======================================================
  // SELECTED DAY
  // =======================================================

  const [
    selectedDay,
    setSelectedDay,
  ] =
    useState(0);

  // =======================================================
  // LOADING
  // =======================================================

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    menuLoading,
    setMenuLoading,
  ] =
    useState(true);

  // =======================================================
  // ERROR
  // =======================================================

  const [
    error,
    setError,
  ] =
    useState("");

  // =======================================================
  // FAVORITE
  // =======================================================

  const [
    isFavorite,
    setIsFavorite,
  ] =
    useState(false);

  /*
  =========================================================
  FETCH CHEF + 7 DAY MENU
  =========================================================
  */

  useEffect(() => {

    const fetchChefData =
      async () => {

        try {

          setLoading(true);

          setError("");

          /*
          ---------------------------------------------------
          REAL CHEF ID
          ---------------------------------------------------
          */

          const finalChefId =
            chefId ||
            localStorage.getItem(
              "selectedChefId"
            ) ||
            localStorage.getItem(
              "userId"
            );

          if (!finalChefId) {

            console.error(
              "❌ No chefId found"
            );

            setError(
              "Chef information not found"
            );

            setLoading(false);

            setMenuLoading(false);

            return;
          }

          console.log(
            "🔥 Fetching chef:",
            finalChefId
          );

          const token =
            localStorage.getItem(
              "token"
            );

          /*
          =====================================================
          1. GET CHEF DETAILS
          =====================================================
          */

          const chefResponse =
            await axios.get(
              `${API_BASE}/menu/chef/${finalChefId}`,
              {
                headers: token
                  ? {
                      Authorization:
                        `Bearer ${token}`,
                    }
                  : undefined,
              }
            );

          console.log(
            "✅ Chef response:",
            chefResponse.data
          );

          setChef(
            chefResponse.data?.chef ||
            null
          );

          /*
          =====================================================
          2. GET CUSTOMER 7-DAY MENU
          
          IMPORTANT:
          Customer ko sirf current 7-day menu milega.
          =====================================================
          */

          setMenuLoading(true);

          const cycleResponse =
            await axios.get(
              `${API_BASE}/menu/chef/${finalChefId}/7-days`
            );

          console.log(
            "🔥 CUSTOMER 7 DAY MENU:",
            cycleResponse.data
          );

          /*
          -----------------------------------------------------
          EXPECTED BACKEND RESPONSE

          {
            success: true,
            chef_id: "...",
            start_date: "...",
            end_date: "...",
            days: [...]
          }
          -----------------------------------------------------
          */

          const backendDays =
            Array.isArray(
              cycleResponse.data?.days
            )
              ? cycleResponse.data.days
              : [];

          /*
          =====================================================
          NORMALIZE EXACTLY 7 DAYS
          =====================================================
          */

          const normalizedDays:
            DayMenu[] =
            backendDays
              .slice(0, 7)
              .map(
                (
                  day: any,
                  index: number
                ) => {

                  const targetDate =
                    day?.date ||
                    day?.menu_date ||
                    day?.target_date ||
                    "";

                  const rawMeals =
                    Array.isArray(
                      day?.meals
                    )
                      ? day.meals
                      : [];

                  /*
                  =================================================
                  ALWAYS CREATE:

                  BREAKFAST
                  LUNCH
                  DINNER
                  =================================================
                  */

                  const meals:
                    DayMenu["meals"] =
                    (
                      [
                        "breakfast",
                        "lunch",
                        "dinner",
                      ] as MealType[]
                    ).map(
                      (
                        mealType
                      ) => {

                        /*
                        -------------------------------------------
                        FIND BACKEND MEAL
                        -------------------------------------------
                        */

                        const foundMeal =
                          rawMeals.find(
                            (
                              meal: any
                            ) =>
                              String(
                                meal?.meal_type ||
                                ""
                              ).toLowerCase() ===
                              mealType
                          );

                        /*
                        -------------------------------------------
                        MENU
                        -------------------------------------------
                        */

                        const menu =
                          foundMeal?.menu ||
                          foundMeal?.item ||
                          null;

                        /*
                        -------------------------------------------
                        CUTOFF TIME
                        -------------------------------------------
                        */

                        const cutoffTime =
                          foundMeal?.cutoff_time ||
                          MEAL_CONFIG[
                            mealType
                          ].cutoff;

                        /*
                        -------------------------------------------
                        FRONTEND CUTOFF FALLBACK
                        -------------------------------------------
                        */

                        const frontendCutoffPassed =
                          targetDate
                            ? hasCutoffPassed(
                                targetDate,
                                mealType
                              )
                            : false;

                        /*
                        -------------------------------------------
                        BACKEND CUTOFF PRIORITY
                        -------------------------------------------
                        */

                        const cutoffPassed =
                          foundMeal?.cutoff_passed ??
                          frontendCutoffPassed;

                        /*
                        -------------------------------------------
                        CAN ORDER
                        -------------------------------------------
                        */

                        const canOrder =
                          foundMeal?.can_order !==
                          undefined
                            ? Boolean(
                                foundMeal.can_order
                              )
                            : Boolean(
                                menu &&
                                !cutoffPassed
                              );

                        /*
                        -------------------------------------------
                        RETURN MEAL
                        -------------------------------------------
                        */

                        return {

                          meal_type:
                            mealType,

                          menu,

                          source:
                            foundMeal?.source ||
                            "cycle",

                          can_order:
                            canOrder,

                          cutoff_time:
                            cutoffTime,

                          cutoff_passed:
                            cutoffPassed,
                        };
                      }
                    );

                  /*
                  =================================================
                  RETURN DAY
                  =================================================
                  */

                  return {

                    date:
                      targetDate,

                    day_name:
                      day?.day_name ||
                      (
                        targetDate
                          ? getDayName(
                              targetDate
                            )
                          : `Day ${
                              index + 1
                            }`
                      ),

                    day_number:
                      day?.day_number ||
                      index + 1,

                    meals,
                  };
                }
              );

          /*
          =====================================================
          SET EXACTLY 7 DAYS
          =====================================================
          */

          setMenuDays(
            normalizedDays.slice(0, 7)
          );

          /*
          =====================================================
          AUTO SELECT FIRST DAY

          Backend ka first day = Today
          =====================================================
          */

          setSelectedDay(0);

        } catch (
          err: any
        ) {

          console.error(
            "❌ Error fetching chef:",
            err?.response?.data ||
            err?.message ||
            err
          );

          setError(
            err?.response?.data
              ?.detail ||
            "Unable to load chef details"
          );

        } finally {

          setLoading(false);

          setMenuLoading(false);
        }
      };

    fetchChefData();

  }, [chefId]);

  /*
  =========================================================
  LOADING UI
  =========================================================
  */

  if (loading) {

    return (

      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-[#FF7A30]/20 border-t-[#FF7A30] rounded-full animate-spin mx-auto mb-4" />

          <p className="text-gray-600">
            Loading chef...
          </p>

        </div>

      </div>
    );
  }

  /*
  =========================================================
  ERROR UI
  =========================================================
  */

  if (!chef) {

    return (

      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center px-6">

        <div className="text-center">

          <div className="text-5xl mb-4">
            👨‍🍳
          </div>

          <h2 className="text-xl font-semibold text-gray-800">
            Chef not found
          </h2>

          <p className="text-gray-500 mt-2">
            {error ||
              "Unable to load chef details"}
          </p>

          <button
            onClick={onBack}
            className="mt-5 bg-[#FF7A30] text-white px-5 py-2.5 rounded-xl"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  /*
  =========================================================
  CURRENT DAY
  =========================================================
  */

  const currentDay =
    menuDays[selectedDay];

  /*
  =========================================================
  HANDLE DISH
  =========================================================
  */

  const handleDishClick = (
    meal: any
  ) => {

    // =====================================================
    // NO MENU
    // =====================================================

    if (!meal?.menu) {
      return;
    }

    // =====================================================
    // NO DATE
    // =====================================================

    if (!currentDay?.date) {

      console.error(
        "❌ Menu date not available"
      );

      return;
    }

    // =====================================================
    // TODAY
    // =====================================================

    const todayString =
      getTodayString();

    const menuDate =
      currentDay.date;

    // =====================================================
    // PAST DATE
    // =====================================================

    if (
      menuDate <
      todayString
    ) {

      console.log(
        "🔒 Past menu cannot be ordered"
      );

      return;
    }

    // =====================================================
    // FUTURE DATE
    // =====================================================

    if (
      menuDate >
      todayString
    ) {

      console.log(
        "📅 Upcoming meal cannot be ordered yet"
      );

      return;
    }

    // =====================================================
    // TODAY + CUTOFF
    // =====================================================

    if (
      menuDate ===
        todayString &&
      meal.cutoff_passed
    ) {

      console.log(
        "🔒 Meal cutoff passed"
      );

      return;
    }

    // =====================================================
    // BACKEND ORDER STATUS
    // =====================================================

    if (
      meal.can_order === false
    ) {

      console.log(
        "🔒 Ordering is currently closed"
      );

      return;
    }

    // =====================================================
    // COMPLETE DISH OBJECT
    // =====================================================

    const dish = {

      ...meal.menu,

      // ===================================================
      // TYPE
      // ===================================================

      type:
        "menu",

      // ===================================================
      // MENU DATE
      // IMPORTANT FOR CART
      // ===================================================

      menu_date:
        menuDate,

      date:
        menuDate,

      // ===================================================
      // MEAL TYPE
      // IMPORTANT FOR CART
      // ===================================================

      meal_type:
        meal.meal_type,

      // ===================================================
      // CHEF ID
      // ===================================================

      chef_id:
        chefId ||
        localStorage.getItem(
          "selectedChefId"
        ),

      // ===================================================
      // CHEF
      // ===================================================

      chef:
        chef,

      chef_name:
        chef?.name,

      // ===================================================
      // SOURCE
      // ===================================================

      source:
        meal.source ||
        "cycle",

      // ===================================================
      // CUTOFF
      // ===================================================

      cutoff_time:
        meal.cutoff_time ||
        MEAL_CONFIG[
          meal.meal_type
        ].cutoff,

      cutoff_passed:
        meal.cutoff_passed,

      // ===================================================
      // ORDER STATUS
      // ===================================================

      can_order:
        meal.can_order,
    };

    console.log(
      "🍽️ Opening menu dish:",
      dish
    );

    // =====================================================
    // OPEN DISH DETAIL
    // =====================================================

    onNavigateToDish?.(
      dish
    );
  };
  /*
  =========================================================
  RENDER
  =========================================================
  */

  return (
  <div className="min-h-screen bg-[#FFF8F0] pb-24">

    {/* ===================================================
        HEADER
    =================================================== */}

    <div className="relative">

      <div className="h-64 bg-gradient-to-br from-[#FF7A30] via-[#5F2EEA] to-[#0FAD6E] relative overflow-hidden">

        <div className="absolute inset-0 opacity-30">

          <ImageWithFallback
            src={
              chef.profile_image ||
              "/fallback.jpg"
            }
            alt={
              chef.name ||
              "Chef"
            }
            className="w-full h-full object-cover"
          />

        </div>

        {/* BACK */}

        <button
          onClick={onBack}
          className="absolute top-12 left-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* FAVORITE */}

        <motion.button
          onClick={() =>
            setIsFavorite(
              !isFavorite
            )
          }
          whileTap={{
            scale: 0.9,
          }}
          className="absolute top-12 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center z-10"
        >
          <Heart
            className={`w-5 h-5 ${
              isFavorite
                ? "fill-red-500 text-red-500"
                : "text-white"
            }`}
          />
        </motion.button>

      </div>

      {/* =================================================
          CHEF INFO
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="mx-6 -mt-16 bg-white rounded-2xl p-6 shadow relative z-10"
      >

        <div className="flex gap-4">

          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">

            <ImageWithFallback
              src={
                chef.profile_image ||
                "/fallback.jpg"
              }
              alt={
                chef.name ||
                "Chef"
              }
              className="w-full h-full object-cover"
            />

          </div>

          <div className="flex-1">

            <div className="flex items-center gap-2">

              <h2 className="font-semibold text-lg">
                {chef.name ||
                  "Home Chef"}
              </h2>

              <Award className="w-4 h-4 text-[#FF7A30]" />

            </div>

            <p className="text-sm text-gray-500">
              {chef.specialties ||
                "Home Chef"}
            </p>

            <div className="flex items-center gap-2 mt-1 text-sm">

              <MapPin className="w-4 h-4 text-[#FF7A30]" />

              <span>
                {chef.location ||
                  "Location unavailable"}
              </span>

            </div>

            {/* RATING */}

            <div className="flex items-center gap-3 mt-2">

              {chef.rating !==
                undefined && (

                <div className="flex items-center gap-1">

                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />

                  <span className="text-sm font-medium">
                    {Number(
                      chef.rating
                    ).toFixed(1)}
                  </span>

                </div>
              )}

              {chef.total_reviews !==
                undefined && (

                <span className="text-xs text-gray-400">
                  {chef.total_reviews}{" "}
                  reviews
                </span>
              )}

            </div>

          </div>

        </div>

      </motion.div>

    </div>

    {/* ===================================================
        ABOUT
    =================================================== */}

    <div className="px-6 mt-6">

      <h3 className="font-semibold text-lg">
        About
      </h3>

      <p className="text-sm text-gray-600 mt-2 leading-6">
        {chef.bio ||
          "No bio available"}
      </p>

    </div>

    {/* ===================================================
        7 DAY MENU
    =================================================== */}

    <div className="px-6 mt-7">

      <div className="flex items-center justify-between mb-4">

        <div>

          <h3 className="font-semibold text-lg">
            This Week's Menu
          </h3>

          <p className="text-xs text-gray-500 mt-1">
            Breakfast, lunch & dinner
          </p>

        </div>

        <ShoppingBag className="w-5 h-5 text-[#FF7A30]" />

      </div>

      {/* =================================================
          DAY SELECTOR
      ================================================= */}

      {menuLoading ? (

        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">

          <div className="w-9 h-9 border-4 border-[#FF7A30]/20 border-t-[#FF7A30] rounded-full animate-spin mx-auto mb-3" />

          <p className="text-sm text-gray-500">
            Loading weekly menu...
          </p>

        </div>

      ) : menuDays.length === 0 ? (

        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">

          <div className="text-4xl mb-3">
            🍽️
          </div>

          <p className="font-medium text-gray-700">
            No menu available
          </p>

          <p className="text-sm text-gray-500 mt-1">
            This chef has not configured the menu yet.
          </p>

        </div>

      ) : (

        <>

          {/* =================================================
              DAY TABS
          ================================================= */}

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">

            {menuDays
              .slice(0, 7)
              .map(
                (day, index) => {

                  const today =
                    isToday(day.date);

                  const todayString =
                    getTodayString();

                  const isPast =
                    day.date <
                    todayString;

                  const isFuture =
                    day.date >
                    todayString;

                  return (

                    <button
                      key={`${day.date}-${index}`}
                      onClick={() =>
                        setSelectedDay(index)
                      }
                      className={`min-w-[82px] px-3 py-3 rounded-2xl border transition-all ${
                        selectedDay === index
                          ? "bg-[#FF7A30] text-white border-[#FF7A30] shadow-md"
                          : "bg-white text-gray-700 border-gray-100"
                      }`}
                    >

                      <div className="text-xs font-medium">

                        {today
                          ? "Today"
                          : isPast
                          ? "Past"
                          : isFuture
                          ? "Upcoming"
                          : getShortDayName(
                              day.date
                            )}

                      </div>

                      <div className="text-lg font-bold mt-1">

                        {new Date(
                          `${day.date}T00:00:00`
                        ).getDate()}

                      </div>

                      <div className="text-[10px] opacity-80 mt-0.5">

                        {new Date(
                          `${day.date}T00:00:00`
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                          }
                        )}

                      </div>

                    </button>
                  );
                }
              )}

          </div>

          {/* =================================================
              SELECTED DATE
          ================================================= */}

          {currentDay && (

            <motion.div
              key={currentDay.date}
              initial={{
                opacity: 0,
                y: 10,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-4"
            >

              {/* DATE HEADER */}

              <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">

                <div className="flex items-center justify-between">

                  <div>

                    <h4 className="font-semibold text-gray-800">

                      {isToday(
                        currentDay.date
                      )
                        ? "Today's Menu"
                        : currentDay.date <
                          getTodayString()
                        ? "Past Menu"
                        : "Upcoming Menu"}

                    </h4>

                    <p className="text-xs text-gray-500 mt-1">

                      {formatDate(
                        currentDay.date
                      )}

                    </p>

                  </div>

                  <div
                    className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                      isToday(
                        currentDay.date
                      )
                        ? "bg-green-50 text-green-600"
                        : currentDay.date <
                          getTodayString()
                        ? "bg-red-50 text-red-500"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >

                    {isToday(
                      currentDay.date
                    )
                      ? "Today"
                      : currentDay.date <
                        getTodayString()
                      ? "Closed"
                      : "Upcoming"}

                  </div>

                </div>

              </div>

              {/* =================================================
                  MEALS
              ================================================= */}

              <div className="space-y-4">

                {(
                  [
                    "breakfast",
                    "lunch",
                    "dinner",
                  ] as MealType[]
                ).map(
                  (mealType) => {

                    /*
                    -------------------------------------------------
                    Find meal safely.
                    Even if backend does not return a meal,
                    frontend will still show its section.
                    -------------------------------------------------
                    */

                    const meal =
                      currentDay.meals.find(
                        (item) =>
                          item.meal_type ===
                          mealType
                      ) || {
                        meal_type:
                          mealType,
                        menu: null,
                        can_order:
                          false,
                        cutoff_time:
                          MEAL_CONFIG[
                            mealType
                          ].cutoff,
                        cutoff_passed:
                          false,
                      };

                    const config =
                      MEAL_CONFIG[
                        mealType
                      ];

                    const menu =
                      meal.menu;

                    const today =
                      isToday(
                        currentDay.date
                      );

                    const past =
                      currentDay.date <
                      getTodayString();

                    const future =
                      currentDay.date >
                      getTodayString();

                    const cutoffPassed =
                      Boolean(
                        meal.cutoff_passed
                      );

                    /*
                    =================================================
                    ORDER LOGIC

                    TODAY:
                      before cutoff = Add
                      after cutoff  = Closed

                    FUTURE:
                      Upcoming

                    PAST:
                      Closed
                    =================================================
                    */

                    const canOrder =
                      Boolean(
                        menu &&
                        today &&
                        !cutoffPassed &&
                        meal.can_order !== false &&
                        menu.is_available !== false
                      );

                    const status =
                      past
                        ? "past"
                        : future
                        ? "upcoming"
                        : canOrder
                        ? "available"
                        : "closed";

                    return (

                      <motion.div
                        key={
                          `${currentDay.date}-${mealType}`
                        }
                        whileHover={{
                          y: -2,
                        }}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
                      >

                        {/* MEAL HEADER */}

                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">

                          <div className="flex items-center gap-2">

                            <span className="text-xl">
                              {
                                config.emoji
                              }
                            </span>

                            <div>

                              <h4 className="font-semibold text-gray-800">
                                {
                                  config.label
                                }
                              </h4>

                              <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">

                                <Clock className="w-3 h-3" />

                                <span>
                                  Order by{" "}
                                  {meal.cutoff_time ||
                                    config.cutoff}
                                </span>

                              </div>

                            </div>

                          </div>

                          {/* STATUS */}

                          {status ===
                            "available" ? (

                            <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-600 font-medium">
                              Available
                            </span>

                          ) : status ===
                            "upcoming" ? (

                            <span className="text-[10px] px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                              Upcoming
                            </span>

                          ) : (

                            <span className="text-[10px] px-2 py-1 rounded-full bg-red-50 text-red-500 font-medium">
                              Closed
                            </span>

                          )}

                        </div>

                        {/* =================================================
                            NO MENU
                        ================================================= */}

                        {!menu ? (

                          <div className="p-5 text-center">

                            <div className="text-3xl mb-2">
                              🍽️
                            </div>

                            <p className="text-sm font-medium text-gray-600">

                              No{" "}
                              {
                                config.label
                              }{" "}
                              menu

                            </p>

                            <p className="text-xs text-gray-400 mt-1">

                              Chef hasn't added this meal.

                            </p>

                          </div>

                        ) : (

                          <div className="flex p-3 gap-3">

                            {/* IMAGE */}

                            <div className="w-28 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">

                              <ImageWithFallback
                                src={
                                  menu.image_urls?.[0] ||
                                  "/fallback.jpg"
                                }
                                alt={
                                  menu.name
                                }
                                className="w-full h-full object-cover"
                              />

                            </div>

                            {/* DETAILS */}

                            <div className="flex-1 min-w-0">

                              <h5 className="font-semibold text-gray-800 truncate">
                                {
                                  menu.name
                                }
                              </h5>

                              {menu.description && (

                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                  {
                                    menu.description
                                  }
                                </p>

                              )}

                              {/* NUTRITION */}

                              <div className="flex gap-2 mt-2 flex-wrap">

                                {menu.calories !==
                                  undefined && (

                                  <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-1 rounded-full">

                                    {
                                      menu.calories
                                    }{" "}
                                    kcal

                                  </span>
                                )}

                                {menu.protein !==
                                  undefined && (

                                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-full">

                                    P{" "}
                                    {
                                      menu.protein
                                    }
                                    g

                                  </span>
                                )}

                              </div>

                              {/* PRICE + ADD */}

                              <div className="flex items-center justify-between mt-3">

                                <span className="text-[#FF7A30] font-bold">

                                  ₹
                                  {
                                    menu.price
                                  }

                                </span>

                                <button
                                  disabled={
                                    !canOrder
                                  }
                                  onClick={() =>
                                    handleDishClick(
                                      meal
                                    )
                                  }
                                  className={`flex items-center gap-1 px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                                    canOrder
                                      ? "bg-[#FF7A30] text-white active:scale-95"
                                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                  }`}
                                >

                                  {canOrder ? (

                                    <>
                                      <Plus className="w-3.5 h-3.5" />
                                      Add
                                    </>

                                  ) : status ===
                                    "upcoming" ? (

                                    "Upcoming"

                                  ) : (

                                    "Closed"

                                  )}

                                </button>

                              </div>

                            </div>

                          </div>

                        )}

                      </motion.div>

                    );
                  }
                )}

              </div>

            </motion.div>

          )}

        </>

      )}

    </div>

    {/* ===================================================
        WEEK INFO
    =================================================== */}

    {menuDays.length > 0 && (

      <div className="px-6 mt-6">

        <div className="bg-gradient-to-r from-[#FFF3EA] to-[#F1ECFF] rounded-2xl p-4">

          <div className="flex items-start gap-3">

            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center">
              🍱
            </div>

            <div>

              <h4 className="font-semibold text-sm text-gray-800">
                Fresh meals every day
              </h4>

              <p className="text-xs text-gray-500 mt-1 leading-5">
                Browse this chef's weekly
                meal plan and order your
                preferred breakfast, lunch
                or dinner before the cutoff
                time.
              </p>

            </div>

          </div>

        </div>

      </div>

    )}

  </div>
);
}