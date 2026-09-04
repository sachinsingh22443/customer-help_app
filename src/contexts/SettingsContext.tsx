import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Language = "English" | "Hindi";

export interface AppSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  orderUpdates: boolean;
  subscriptionUpdates: boolean;
  deliveryUpdates: boolean;
  walletUpdates: boolean;
  specialOffers: boolean;
  darkMode: boolean;
  language: Language;
}

const SETTINGS_KEY = "settings";

const DEFAULT_SETTINGS: AppSettings = {
  pushNotifications: true,
  emailNotifications: true,
  orderUpdates: true,
  subscriptionUpdates: true,
  deliveryUpdates: true,
  walletUpdates: true,
  specialOffers: false,
  darkMode: false,
  language: "English",
};

interface SettingsContextValue {
  settings: AppSettings;
  language: Language;
  isDarkMode: boolean;

  setLanguage: (language: Language) => void;
  setDarkMode: (enabled: boolean) => void;

  updateSetting: <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => void;

  resetSettings: () => void;
}

const SettingsContext = createContext<
  SettingsContextValue | undefined
>(undefined);

function getInitialSettings(): AppSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);

    if (!saved) {
      return { ...DEFAULT_SETTINGS };
    }

    const parsed = JSON.parse(saved);

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function SettingsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [settings, setSettings] =
    useState<AppSettings>(getInitialSettings);

  // =========================================================
  // SAVE SETTINGS
  // =========================================================

  useEffect(() => {
    try {
      localStorage.setItem(
        SETTINGS_KEY,
        JSON.stringify(settings)
      );

      // Notify other components inside the app
      window.dispatchEvent(
        new CustomEvent("eatunity-settings-changed", {
          detail: settings,
        })
      );
    } catch (error) {
      console.error(
        "Failed to save EatUnity settings:",
        error
      );
    }
  }, [settings]);

  // =========================================================
  // APPLY DARK MODE GLOBALLY
  // =========================================================

  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.darkMode
    );

    document.documentElement.setAttribute(
      "data-theme",
      settings.darkMode ? "dark" : "light"
    );
  }, [settings.darkMode]);

  // =========================================================
  // SYNC SETTINGS WHEN ANOTHER TAB CHANGES THEM
  // =========================================================

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (
        event.key !== SETTINGS_KEY ||
        !event.newValue
      ) {
        return;
      }

      try {
        const next = JSON.parse(event.newValue);

        setSettings({
          ...DEFAULT_SETTINGS,
          ...next,
        });
      } catch {
        console.error(
          "Invalid EatUnity settings data"
        );
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );
    };
  }, []);

  // =========================================================
  // LANGUAGE
  // =========================================================

  const setLanguage = (language: Language) => {
    setSettings((previous) => ({
      ...previous,
      language,
    }));
  };

  // =========================================================
  // DARK MODE
  // =========================================================

  const setDarkMode = (enabled: boolean) => {
    setSettings((previous) => ({
      ...previous,
      darkMode: enabled,
    }));
  };

  // =========================================================
  // UPDATE ANY SETTING
  // =========================================================

  const updateSetting = <
    K extends keyof AppSettings
  >(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  // =========================================================
  // RESET SETTINGS
  // =========================================================

  const resetSettings = () => {
    setSettings({
      ...DEFAULT_SETTINGS,
    });
  };

  // =========================================================
  // CONTEXT VALUE
  // =========================================================

  const value = useMemo(
    () => ({
      settings,
      language: settings.language,
      isDarkMode: settings.darkMode,
      setLanguage,
      setDarkMode,
      updateSetting,
      resetSettings,
    }),
    [settings]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// =========================================================
// USE SETTINGS HOOK
// =========================================================

export function useSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error(
      "useSettings must be used inside SettingsProvider"
    );
  }

  return context;
}