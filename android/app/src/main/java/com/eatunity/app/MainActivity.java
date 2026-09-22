package com.eatunity.app;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;

import com.android.installreferrer.api.InstallReferrerClient;
import com.android.installreferrer.api.InstallReferrerStateListener;
import com.android.installreferrer.api.ReferrerDetails;
import com.getcapacitor.BridgeActivity;
import com.ionicframework.capacitor.Checkout;

import org.json.JSONObject;

public class MainActivity extends BridgeActivity {

    private static final String TAG = "EatUnityReferral";

    private static final String PREF_NAME =
            "EatUnityReferralPrefs";

    private static final String KEY_INSTALL_REFERRER =
            "install_referrer";

    @Override
    public void onCreate(Bundle savedInstanceState) {

        // Existing Razorpay / Checkout plugin
        registerPlugin(Checkout.class);

        super.onCreate(savedInstanceState);

        // Read Google Play Install Referrer
        readInstallReferrer();
    }

    @Override
    public void onResume() {
        super.onResume();

        // Give WebView / React time to initialize
        new Handler().postDelayed(() -> {
            sendSavedReferralToWeb();
        }, 1500);
    }

    private void readInstallReferrer() {

        InstallReferrerClient referrerClient =
                InstallReferrerClient.newBuilder(this).build();

        referrerClient.startConnection(
                new InstallReferrerStateListener() {

                    @Override
                    public void onInstallReferrerSetupFinished(
                            int responseCode) {

                        if (responseCode ==
                                InstallReferrerClient.InstallReferrerResponse.OK) {

                            try {

                                ReferrerDetails response =
                                        referrerClient.getInstallReferrer();

                                String installReferrer =
                                        response.getInstallReferrer();

                                Log.d(
                                        TAG,
                                        "Install Referrer: "
                                                + installReferrer
                                );

                                if (installReferrer != null
                                        && !installReferrer
                                        .trim()
                                        .isEmpty()) {

                                    saveInstallReferrer(
                                            installReferrer
                                    );
                                }

                            } catch (Exception e) {

                                Log.e(
                                        TAG,
                                        "Error reading Install Referrer",
                                        e
                                );

                            } finally {

                                referrerClient.endConnection();
                            }

                        } else {

                            Log.d(
                                    TAG,
                                    "Install Referrer unavailable. "
                                            + "Response code: "
                                            + responseCode
                            );

                            referrerClient.endConnection();
                        }
                    }

                    @Override
                    public void onInstallReferrerServiceDisconnected() {

                        Log.d(
                                TAG,
                                "Install Referrer service disconnected"
                        );
                    }
                }
        );
    }

    private void saveInstallReferrer(
            String installReferrer) {

        try {

            SharedPreferences preferences =
                    getSharedPreferences(
                            PREF_NAME,
                            MODE_PRIVATE
                    );

            preferences.edit()
                    .putString(
                            KEY_INSTALL_REFERRER,
                            installReferrer
                    )
                    .apply();

            Log.d(
                    TAG,
                    "Referral saved locally: "
                            + installReferrer
            );

            // Try sending immediately
            sendSavedReferralToWeb();

        } catch (Exception e) {

            Log.e(
                    TAG,
                    "Error saving Install Referrer",
                    e
            );
        }
    }

    private void sendSavedReferralToWeb() {

        try {

            SharedPreferences preferences =
                    getSharedPreferences(
                            PREF_NAME,
                            MODE_PRIVATE
                    );

            String installReferrer =
                    preferences.getString(
                            KEY_INSTALL_REFERRER,
                            null
                    );

            if (installReferrer == null
                    || installReferrer.trim().isEmpty()) {

                return;
            }

            if (getBridge() == null
                    || getBridge().getWebView() == null) {

                Log.d(
                        TAG,
                        "WebView not ready yet"
                );

                return;
            }

            JSONObject data = new JSONObject();

            data.put(
                    "referrer",
                    installReferrer
            );

            String jsonData = data.toString();

            String javascript =
                    "window.dispatchEvent(" +
                    "new CustomEvent(" +
                    "'eatunityReferral'," +
                    "{ detail: " +
                    jsonData +
                    " }" +
                    ")" +
                    ");";

            getBridge()
                    .getWebView()
                    .post(() -> {

                        getBridge()
                                .getWebView()
                                .evaluateJavascript(
                                        javascript,
                                        null
                                );

                        Log.d(
                                TAG,
                                "Referral sent to WebView: "
                                        + installReferrer
                        );
                    });

        } catch (Exception e) {

            Log.e(
                    TAG,
                    "Error sending referral to web",
                    e
            );
        }
    }
}