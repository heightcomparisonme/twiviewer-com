/**
 * Moon Elements and Zodiac Mapping
 * 
 * Maps zodiac signs to their elements and plant parts according to moon calendar theory
 */

export type ElementType = "fire" | "earth" | "air" | "water";
export type PlantPart = "fruit" | "root" | "flower" | "leaf";

export interface MoonElement {
  type: ElementType;
  plantPart: PlantPart;
  zodiacSigns: string[];
}

/**
 * Zodiac to Element mapping
 * Based on traditional moon calendar wisdom
 */
const ZODIAC_ELEMENTS: Record<string, MoonElement> = {
  // Fire Element - Fruit Days (Widder, Löwe, Schütze)
  "Widder": { type: "fire", plantPart: "fruit", zodiacSigns: ["Widder", "Löwe", "Schütze"] },
  "Löwe": { type: "fire", plantPart: "fruit", zodiacSigns: ["Widder", "Löwe", "Schütze"] },
  "Schütze": { type: "fire", plantPart: "fruit", zodiacSigns: ["Widder", "Löwe", "Schütze"] },
  
  // Earth Element - Root Days (Stier, Jungfrau, Steinbock)
  "Stier": { type: "earth", plantPart: "root", zodiacSigns: ["Stier", "Jungfrau", "Steinbock"] },
  "Jungfrau": { type: "earth", plantPart: "root", zodiacSigns: ["Stier", "Jungfrau", "Steinbock"] },
  "Steinbock": { type: "earth", plantPart: "root", zodiacSigns: ["Stier", "Jungfrau", "Steinbock"] },
  
  // Air Element - Flower Days (Zwillinge, Waage, Wassermann)
  "Zwillinge": { type: "air", plantPart: "flower", zodiacSigns: ["Zwillinge", "Waage", "Wassermann"] },
  "Waage": { type: "air", plantPart: "flower", zodiacSigns: ["Zwillinge", "Waage", "Wassermann"] },
  "Wassermann": { type: "air", plantPart: "flower", zodiacSigns: ["Zwillinge", "Waage", "Wassermann"] },
  
  // Water Element - Leaf Days (Krebs, Skorpion, Fische)
  "Krebs": { type: "water", plantPart: "leaf", zodiacSigns: ["Krebs", "Skorpion", "Fische"] },
  "Skorpion": { type: "water", plantPart: "leaf", zodiacSigns: ["Krebs", "Skorpion", "Fische"] },
  "Fische": { type: "water", plantPart: "leaf", zodiacSigns: ["Krebs", "Skorpion", "Fische"] },
};

/**
 * Get element information for a zodiac sign
 */
export function getElementForZodiac(zodiacName: string): MoonElement | null {
  return ZODIAC_ELEMENTS[zodiacName] || null;
}

/**
 * Get recommended food types for an element
 */
export function getRecommendedFoods(element: ElementType): {
  vegetables: string[];
  fruits: string[];
  grains: string[];
  proteins: string[];
} {
  const foodRecommendations = {
    fire: {
      vegetables: ["Tomaten", "Paprika", "Zucchini", "Aubergine", "Kürbis"],
      fruits: ["Äpfel", "Birnen", "Pflaumen", "Beeren", "Trauben"],
      grains: ["Weizen", "Dinkel", "Hafer"],
      proteins: ["Nüsse", "Samen", "Hülsenfrüchte"]
    },
    earth: {
      vegetables: ["Karotten", "Rote Bete", "Kartoffeln", "Sellerie", "Radieschen", "Zwiebeln"],
      fruits: ["Erdbeeren", "Rhabarber"],
      grains: ["Vollkorn", "Roggen", "Gerste"],
      proteins: ["Linsen", "Kichererbsen", "Erdnüsse"]
    },
    air: {
      vegetables: ["Blumenkohl", "Brokkoli", "Artischocken"],
      fruits: ["Zitrusfrüchte", "Ananas", "Mango"],
      grains: ["Reis", "Hirse", "Quinoa"],
      proteins: ["Tofu", "Tempeh", "Nüsse"]
    },
    water: {
      vegetables: ["Spinat", "Salat", "Mangold", "Kohl", "Grünkohl"],
      fruits: ["Melonen", "Gurken", "Birnen"],
      grains: ["Hafer", "Buchweizen"],
      proteins: ["Fisch", "Meeresfrüchte", "Algen"]
    }
  };

  return foodRecommendations[element];
}
