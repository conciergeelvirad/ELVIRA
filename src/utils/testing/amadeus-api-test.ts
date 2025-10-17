/**
 * Amadeus API Test Utility
 *
 * Quick test to verify Amadeus API credentials and service functionality
 */

import {
  searchActivities,
  getActivityById,
  clearTokenCache,
} from "../../services/amadeusActivities.service";

/**
 * Test Amadeus API connection and credentials
 *
 * @example
 * // In browser console:
 * import { testAmadeusConnection } from '@/utils/testAmadeusApi';
 * testAmadeusConnection();
 */
export async function testAmadeusConnection() {
  console.log("🧪 Testing Amadeus API Connection...\n");

  try {
    // Test location: Madrid, Spain
    const testLocation = {
      latitude: 40.416775,
      longitude: -3.70379,
      radius: 5,
    };

    console.log("📍 Test Location:", testLocation);
    console.log("⏳ Searching for activities...\n");

    const activities = await searchActivities(testLocation);

    console.log(`✅ SUCCESS! Found ${activities.length} activities\n`);

    if (activities.length > 0) {
      console.log("📋 Sample Activities:");
      activities.slice(0, 5).forEach((activity, index) => {
        console.log(`\n${index + 1}. ${activity.name}`);
        if (activity.rating) {
          console.log(`   ⭐ Rating: ${activity.rating}/5`);
        }
        if (activity.price) {
          console.log(
            `   💰 Price: ${activity.price.amount} ${activity.price.currencyCode}`
          );
        }
        if (activity.shortDescription) {
          console.log(
            `   📝 ${activity.shortDescription.substring(0, 100)}...`
          );
        }
      });

      console.log("\n✅ Amadeus API is working correctly!");
      console.log("🎉 Ready to integrate into Tour Agencies tab!");

      return {
        success: true,
        count: activities.length,
        sample: activities.slice(0, 5),
      };
    } else {
      console.log("⚠️ No activities found for this location");
      console.log("ℹ️ This might be normal for test data");

      return {
        success: true,
        count: 0,
        sample: [],
      };
    }
  } catch (error) {
    console.error("❌ ERROR:", error);
    console.error("\n🔧 Troubleshooting:");
    console.error("1. Verify credentials in Supabase Edge Functions > Secrets");
    console.error("2. Check secret key is exactly: TEST.API.AMADEUS_API");
    console.error(
      '3. Verify JSON format: {"clientId": "...", "clientSecret": "..."}'
    );
    console.error(
      "4. Check Amadeus API status: https://developers.amadeus.com/status"
    );

    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Test getting a specific activity by ID
 * (You'll need a valid activity ID from a search result)
 */
export async function testGetActivityById(activityId: string) {
  console.log(`🧪 Testing getActivityById with ID: ${activityId}\n`);

  try {
    console.log("⏳ Fetching activity details...\n");

    const activity = await getActivityById(activityId);

    if (activity) {
      console.log("✅ SUCCESS! Activity found:\n");
      console.log(`Name: ${activity.name}`);
      console.log(`Description: ${activity.description}`);
      console.log(`Rating: ${activity.rating || "N/A"}/5`);
      console.log(
        `Price: ${activity.price?.amount || "N/A"} ${
          activity.price?.currencyCode || ""
        }`
      );
      console.log(`Duration: ${activity.minimumDuration || "N/A"}`);
      console.log(`Booking: ${activity.bookingLink || "N/A"}`);

      return { success: true, activity };
    } else {
      console.log("⚠️ Activity not found");
      return { success: false, error: "Activity not found" };
    }
  } catch (error) {
    console.error("❌ ERROR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Test token caching functionality
 */
export async function testTokenCaching() {
  console.log("🧪 Testing Token Caching...\n");

  try {
    // Clear any existing token
    clearTokenCache();
    console.log("1️⃣ Cleared token cache");

    // First request - should get new token
    console.log("2️⃣ Making first request (should get new token)...");
    const start1 = Date.now();
    await searchActivities({
      latitude: 40.416775,
      longitude: -3.70379,
      radius: 1,
    });
    const time1 = Date.now() - start1;
    console.log(`   ⏱️ First request: ${time1}ms`);

    // Second request - should use cached token
    console.log("3️⃣ Making second request (should use cached token)...");
    const start2 = Date.now();
    await searchActivities({
      latitude: 40.416775,
      longitude: -3.70379,
      radius: 1,
    });
    const time2 = Date.now() - start2;
    console.log(`   ⏱️ Second request: ${time2}ms`);

    if (time2 < time1) {
      console.log("\n✅ Token caching is working! Second request was faster.");
    } else {
      console.log("\nℹ️ Results inconclusive, but both requests succeeded.");
    }

    return { success: true, firstRequest: time1, secondRequest: time2 };
  } catch (error) {
    console.error("❌ ERROR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * Quick test with your hotel's location
 */
export async function testWithHotelLocation(
  hotelLat: number,
  hotelLng: number,
  radiusKm: number = 10
) {
  console.log("🧪 Testing with Hotel Location...\n");
  console.log(`📍 Hotel: (${hotelLat}, ${hotelLng})`);
  console.log(`📏 Radius: ${radiusKm}km\n`);

  try {
    console.log("⏳ Searching for activities near hotel...\n");

    const activities = await searchActivities({
      latitude: hotelLat,
      longitude: hotelLng,
      radius: radiusKm,
    });

    console.log(`✅ Found ${activities.length} activities near your hotel!\n`);

    if (activities.length > 0) {
      console.log("🎯 Top Rated Activities:");
      const topRated = activities
        .filter((a) => a.rating)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 5);

      topRated.forEach((activity, index) => {
        console.log(`\n${index + 1}. ${activity.name}`);
        console.log(`   ⭐ ${activity.rating}/5`);
        if (activity.price) {
          console.log(
            `   💰 ${activity.price.amount} ${activity.price.currencyCode}`
          );
        }
      });
    }

    return { success: true, count: activities.length, activities };
  } catch (error) {
    console.error("❌ ERROR:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
