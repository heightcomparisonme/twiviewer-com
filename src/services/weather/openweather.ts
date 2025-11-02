/**
 * OpenWeather API Service
 *
 * Provides functions to fetch weather data from OpenWeatherMap API
 * https://openweathermap.org/api
 *
 * Free tier: 1,000 calls/day, 60 calls/minute
 *
 * Required environment variable:
 * - OPENWEATHER_API_KEY: Your OpenWeather API key
 */

import type {
  CurrentWeatherResponse,
  WeatherData,
  ForecastResponse,
  SimpleForecast,
} from "@/types/weather";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

/**
 * Check if API key is configured
 */
export function isWeatherApiConfigured(): boolean {
  return !!API_KEY;
}

/**
 * Fetch current weather by coordinates
 *
 * @param lat - Latitude
 * @param lon - Longitude
 * @param units - Temperature units (metric, imperial, standard)
 * @returns Current weather data
 */
export async function getCurrentWeatherByCoords(
  lat: number,
  lon: number,
  units: "metric" | "imperial" | "standard" = "metric"
): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error("OpenWeather API key not configured");
  }

  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `OpenWeather API error: ${response.status}`
      );
    }

    const data: CurrentWeatherResponse = await response.json();
    return transformCurrentWeather(data);
  } catch (error) {
    console.error("Error fetching weather by coordinates:", error);
    throw error;
  }
}

/**
 * Fetch current weather by city name
 *
 * @param city - City name
 * @param countryCode - Optional ISO 3166 country code (e.g., "US", "DE")
 * @param units - Temperature units (metric, imperial, standard)
 * @returns Current weather data
 */
export async function getCurrentWeatherByCity(
  city: string,
  countryCode?: string,
  units: "metric" | "imperial" | "standard" = "metric"
): Promise<WeatherData> {
  if (!API_KEY) {
    throw new Error("OpenWeather API key not configured");
  }

  const query = countryCode ? `${city},${countryCode}` : city;
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(query)}&units=${units}&appid=${API_KEY}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 600 }, // Cache for 10 minutes
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `OpenWeather API error: ${response.status}`
      );
    }

    const data: CurrentWeatherResponse = await response.json();
    return transformCurrentWeather(data);
  } catch (error) {
    console.error("Error fetching weather by city:", error);
    throw error;
  }
}

/**
 * Fetch 5-day weather forecast by coordinates
 *
 * @param lat - Latitude
 * @param lon - Longitude
 * @param units - Temperature units (metric, imperial, standard)
 * @returns Array of simplified forecast data
 */
export async function getForecastByCoords(
  lat: number,
  lon: number,
  units: "metric" | "imperial" | "standard" = "metric"
): Promise<SimpleForecast[]> {
  if (!API_KEY) {
    throw new Error("OpenWeather API key not configured");
  }

  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${API_KEY}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `OpenWeather API error: ${response.status}`
      );
    }

    const data: ForecastResponse = await response.json();
    return transformForecast(data);
  } catch (error) {
    console.error("Error fetching forecast by coordinates:", error);
    throw error;
  }
}

/**
 * Fetch 5-day weather forecast by city name
 *
 * @param city - City name
 * @param countryCode - Optional ISO 3166 country code (e.g., "US", "DE")
 * @param units - Temperature units (metric, imperial, standard)
 * @returns Array of simplified forecast data
 */
export async function getForecastByCity(
  city: string,
  countryCode?: string,
  units: "metric" | "imperial" | "standard" = "metric"
): Promise<SimpleForecast[]> {
  if (!API_KEY) {
    throw new Error("OpenWeather API key not configured");
  }

  const query = countryCode ? `${city},${countryCode}` : city;
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(query)}&units=${units}&appid=${API_KEY}`;

  try {
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.message || `OpenWeather API error: ${response.status}`
      );
    }

    const data: ForecastResponse = await response.json();
    return transformForecast(data);
  } catch (error) {
    console.error("Error fetching forecast by city:", error);
    throw error;
  }
}

/**
 * Transform raw API response to simplified WeatherData
 */
function transformCurrentWeather(data: CurrentWeatherResponse): WeatherData {
  return {
    location: data.name,
    country: data.sys.country,
    temperature: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind.speed,
    windDirection: data.wind.deg,
    cloudiness: data.clouds.all,
    visibility: data.visibility,
    condition: data.weather[0]?.main || "Unknown",
    description: data.weather[0]?.description || "",
    icon: data.weather[0]?.icon || "01d",
    sunrise: new Date(data.sys.sunrise * 1000),
    sunset: new Date(data.sys.sunset * 1000),
    timestamp: new Date(data.dt * 1000),
  };
}

/**
 * Transform forecast response to simplified daily forecasts
 * Groups 3-hour forecasts by day and takes midday values
 */
function transformForecast(data: ForecastResponse): SimpleForecast[] {
  // Group forecast items by day
  const dailyForecasts = new Map<string, SimpleForecast>();

  data.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toISOString().split("T")[0]; // YYYY-MM-DD
    const hour = date.getHours();

    // Only use midday forecasts (12:00) for better accuracy
    if (hour === 12 || !dailyForecasts.has(dateKey)) {
      const existing = dailyForecasts.get(dateKey);

      // Update if this is closer to midday than existing entry
      if (!existing || Math.abs(hour - 12) < Math.abs(new Date(existing.date).getHours() - 12)) {
        dailyForecasts.set(dateKey, {
          date: date,
          temperature: Math.round(item.main.temp),
          tempMin: Math.round(item.main.temp_min),
          tempMax: Math.round(item.main.temp_max),
          condition: item.weather[0]?.main || "Unknown",
          description: item.weather[0]?.description || "",
          icon: item.weather[0]?.icon || "01d",
          humidity: item.main.humidity,
          windSpeed: item.wind.speed,
          precipitation: item.pop * 100, // Convert to percentage
        });
      }
    }
  });

  // Convert map to array and sort by date
  return Array.from(dailyForecasts.values()).sort(
    (a, b) => a.date.getTime() - b.date.getTime()
  );
}

/**
 * Get weather data based on user's preferences
 * Falls back to coordinates if city is not provided
 *
 * @param userLocation - User's location string (city name)
 * @param userRegion - User's region/country code
 * @param coords - Fallback coordinates
 * @returns Current weather data
 */
export async function getWeatherForUser(
  userLocation?: string | null,
  userRegion?: string | null,
  coords?: { lat: number; lon: number }
): Promise<WeatherData> {
  if (userLocation) {
    try {
      return await getCurrentWeatherByCity(userLocation, userRegion || undefined);
    } catch (error) {
      console.error("Failed to fetch weather by city, trying coordinates:", error);
    }
  }

  if (coords) {
    return await getCurrentWeatherByCoords(coords.lat, coords.lon);
  }

  throw new Error("No location information provided");
}
