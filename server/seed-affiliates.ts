/**
 * Seed Affiliate Brands Database
 * Populates the database with 25 exact luxury, streetwear, and jewelry brands
 */

import { getDb } from "./db";
import { castings } from "@/drizzle/schema";

export const AFFILIATE_BRANDS = [
  // Luxury (11 brands)
  {
    brandName: "SSENSE",
    productCategory: "Luxury Fashion",
    briefDescription: "High-end multi-brand luxury retailer",
    fullBrief:
      "Model luxury fashion collections for SSENSE's exclusive campaigns. Showcase designer pieces in cinematic settings.",
    brandGuidelines: "Sophisticated, editorial, high-fashion aesthetic",
    requiredAttributes: ["Height: 5'8+", "Professional portfolio", "Flexible schedule"],
    compensation: "$500-$2000",
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },
  {
    brandName: "Farfetch",
    productCategory: "Luxury Fashion",
    briefDescription: "Global luxury fashion marketplace",
    fullBrief:
      "Feature in Farfetch's brand collaborations and designer showcases. Model luxury pieces across multiple collections.",
    brandGuidelines: "Editorial, high-fashion, contemporary luxury",
    requiredAttributes: ["Professional experience", "Diverse style", "Portfolio required"],
    compensation: "$600-$2500",
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },
  {
    brandName: "Nordstrom",
    productCategory: "Department Store",
    briefDescription: "Premium department store",
    fullBrief:
      "Model for Nordstrom's seasonal campaigns and in-store promotions. Showcase diverse fashion styles.",
    brandGuidelines: "Accessible luxury, diverse representation, approachable",
    requiredAttributes: ["Flexible availability", "Diverse look", "Social media presence"],
    compensation: "$400-$1500",
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },
  {
    brandName: "Saks Fifth Avenue",
    productCategory: "Luxury Retail",
    briefDescription: "Iconic luxury department store",
    fullBrief:
      "Feature in Saks' exclusive luxury campaigns. Model high-end designer collections and accessories.",
    brandGuidelines: "Sophisticated, elegant, timeless luxury",
    requiredAttributes: ["Professional portfolio", "Height 5'7+", "Luxury experience"],
    compensation: "$700-$3000",
    applicationDeadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },
  {
    brandName: "Neiman Marcus",
    productCategory: "Luxury Retail",
    briefDescription: "Luxury fashion and lifestyle retailer",
    fullBrief:
      "Model for Neiman Marcus luxury collections and seasonal campaigns. Showcase premium fashion.",
    brandGuidelines: "Luxurious, sophisticated, aspirational",
    requiredAttributes: ["Professional experience", "Diverse style", "Portfolio"],
    compensation: "$500-$2000",
    applicationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },
  {
    brandName: "Macy's",
    productCategory: "Department Store",
    briefDescription: "Major department store",
    fullBrief:
      "Feature in Macy's fashion campaigns and brand collaborations. Model diverse fashion styles.",
    brandGuidelines: "Accessible, diverse, contemporary",
    requiredAttributes: ["Flexible schedule", "Social media active", "Diverse look"],
    compensation: "$300-$1200",
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },
  {
    brandName: "LTK",
    productCategory: "Influencer Platform",
    briefDescription: "Creator-focused shopping platform",
    fullBrief:
      "Collaborate with LTK creators and model fashion pieces. Showcase styling and fashion influence.",
    brandGuidelines: "Influencer-friendly, relatable, trendy",
    requiredAttributes: ["Social media presence", "Influencer experience", "Engaged audience"],
    compensation: "$250-$1000",
    applicationDeadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },
  {
    brandName: "ShopStyle Collective",
    productCategory: "Fashion Marketplace",
    briefDescription: "Style and shopping community",
    fullBrief:
      "Model fashion pieces and collaborate with ShopStyle stylists. Showcase diverse styling options.",
    brandGuidelines: "Trendy, accessible, diverse styles",
    requiredAttributes: ["Style portfolio", "Fashion knowledge", "Flexible"],
    compensation: "$200-$800",
    applicationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },
  {
    brandName: "MR PORTER",
    productCategory: "Luxury Menswear",
    briefDescription: "Premium menswear marketplace",
    fullBrief:
      "Model luxury menswear collections. Showcase designer pieces in editorial settings.",
    brandGuidelines: "Sophisticated menswear, editorial, high-fashion",
    requiredAttributes: ["Male models preferred", "Professional portfolio", "Height 6'+"],
    compensation: "$600-$2500",
    applicationDeadline: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },
  {
    brandName: "Cettire",
    productCategory: "Luxury Fashion",
    briefDescription: "Global luxury fashion platform",
    fullBrief:
      "Feature in Cettire's luxury campaigns. Model designer collections from around the world.",
    brandGuidelines: "Editorial, international luxury, contemporary",
    requiredAttributes: ["Professional experience", "Portfolio", "Flexible schedule"],
    compensation: "$550-$2200",
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },
  {
    brandName: "End Clothing",
    productCategory: "Luxury Streetwear",
    briefDescription: "Premium streetwear and fashion",
    fullBrief:
      "Model luxury streetwear and designer collaborations. Showcase urban luxury aesthetic.",
    brandGuidelines: "Urban luxury, contemporary, editorial",
    requiredAttributes: ["Streetwear style", "Portfolio", "Social media active"],
    compensation: "$400-$1800",
    applicationDeadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
    category: "luxury",
  },

  // Streetwear (6 brands)
  {
    brandName: "Fashion Nova",
    productCategory: "Streetwear & Casual",
    briefDescription: "Trendy streetwear and casual fashion",
    fullBrief:
      "Model Fashion Nova's latest collections. Showcase bold, trendy streetwear styles.",
    brandGuidelines: "Bold, trendy, social media-friendly, diverse",
    requiredAttributes: ["Social media presence", "Diverse look", "Flexible"],
    compensation: "$300-$1200",
    applicationDeadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    category: "streetwear",
  },
  {
    brandName: "BoohooMAN",
    productCategory: "Menswear Streetwear",
    briefDescription: "Urban menswear and streetwear",
    fullBrief:
      "Model BoohooMAN's streetwear collections. Showcase urban style and fashion trends.",
    brandGuidelines: "Urban, trendy, contemporary menswear",
    requiredAttributes: ["Male models", "Streetwear style", "Social media active"],
    compensation: "$250-$1000",
    applicationDeadline: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    category: "streetwear",
  },
  {
    brandName: "StockX",
    productCategory: "Sneakers & Collectibles",
    briefDescription: "Sneaker and streetwear marketplace",
    fullBrief:
      "Feature in StockX campaigns showcasing rare sneakers and collectible streetwear.",
    brandGuidelines: "Sneaker culture, urban, authentic",
    requiredAttributes: ["Sneaker knowledge", "Urban style", "Authentic presence"],
    compensation: "$350-$1400",
    applicationDeadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
    category: "streetwear",
  },
  {
    brandName: "Stadium Goods",
    productCategory: "Sneakers & Streetwear",
    briefDescription: "Premium sneaker and streetwear retailer",
    fullBrief:
      "Model rare sneakers and limited-edition streetwear. Showcase sneaker culture.",
    brandGuidelines: "Sneaker-focused, urban, authentic, editorial",
    requiredAttributes: ["Sneaker passion", "Urban style", "Portfolio"],
    compensation: "$400-$1600",
    applicationDeadline: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
    category: "streetwear",
  },
  {
    brandName: "True Religion",
    productCategory: "Denim & Casual",
    briefDescription: "Premium denim and casual wear",
    fullBrief:
      "Model True Religion's denim collections. Showcase classic and contemporary styles.",
    brandGuidelines: "Casual, contemporary, accessible luxury",
    requiredAttributes: ["Flexible schedule", "Diverse look", "Social media active"],
    compensation: "$300-$1100",
    applicationDeadline: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    category: "streetwear",
  },
  {
    brandName: "PacSun",
    productCategory: "Streetwear & Casual",
    briefDescription: "Youth-focused streetwear retailer",
    fullBrief:
      "Feature in PacSun's campaigns. Model trendy streetwear and casual collections.",
    brandGuidelines: "Youthful, trendy, social media-friendly",
    requiredAttributes: ["Age 18-30", "Social media presence", "Trendy style"],
    compensation: "$200-$800",
    applicationDeadline: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
    category: "streetwear",
  },

  // Jewelry (8 brands)
  {
    brandName: "The GLD Shop",
    productCategory: "Gold Jewelry",
    briefDescription: "Premium gold jewelry and chains",
    fullBrief:
      "Model luxury gold jewelry pieces. Showcase statement chains and accessories.",
    brandGuidelines: "Luxury, bold, statement pieces, editorial",
    requiredAttributes: ["Professional portfolio", "Jewelry styling", "Flexible"],
    compensation: "$400-$1500",
    applicationDeadline: new Date(Date.now() + 29 * 24 * 60 * 60 * 1000),
    category: "jewelry",
  },
  {
    brandName: "Frost NYC",
    productCategory: "Diamond & Gold Jewelry",
    briefDescription: "High-end diamond and gold jewelry",
    fullBrief:
      "Feature in Frost NYC's luxury jewelry campaigns. Model diamond pieces and statement jewelry.",
    brandGuidelines: "Luxury, sophisticated, editorial, high-fashion",
    requiredAttributes: ["Professional experience", "Portfolio", "Luxury aesthetic"],
    compensation: "$500-$2000",
    applicationDeadline: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
    category: "jewelry",
  },
  {
    brandName: "Jaxxon",
    productCategory: "Fashion Jewelry",
    briefDescription: "Trendy fashion jewelry and accessories",
    fullBrief:
      "Model Jaxxon's fashion jewelry collections. Showcase trendy, accessible luxury pieces.",
    brandGuidelines: "Trendy, accessible, contemporary, diverse",
    requiredAttributes: ["Social media active", "Diverse look", "Flexible"],
    compensation: "$250-$1000",
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    category: "jewelry",
  },
  {
    brandName: "King Ice",
    productCategory: "Hip-Hop Jewelry",
    briefDescription: "Urban hip-hop inspired jewelry",
    fullBrief:
      "Feature in King Ice campaigns. Model statement chains and hip-hop inspired pieces.",
    brandGuidelines: "Urban, hip-hop culture, bold, authentic",
    requiredAttributes: ["Hip-hop style", "Urban presence", "Social media active"],
    compensation: "$300-$1200",
    applicationDeadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    category: "jewelry",
  },
  {
    brandName: "Cernucci",
    productCategory: "Luxury Jewelry",
    briefDescription: "Premium luxury jewelry brand",
    fullBrief:
      "Model Cernucci's luxury jewelry collections. Showcase high-end pieces in editorial settings.",
    brandGuidelines: "Luxury, sophisticated, editorial, timeless",
    requiredAttributes: ["Professional portfolio", "Luxury experience", "Flexible"],
    compensation: "$450-$1800",
    applicationDeadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    category: "jewelry",
  },
  {
    brandName: "Gold Presidents",
    productCategory: "Gold Jewelry",
    briefDescription: "Premium gold chain and jewelry",
    fullBrief:
      "Feature in Gold Presidents campaigns. Model luxury gold pieces and chains.",
    brandGuidelines: "Luxury, bold, statement, editorial",
    requiredAttributes: ["Portfolio", "Jewelry styling", "Professional"],
    compensation: "$350-$1400",
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    category: "jewelry",
  },
  {
    brandName: "Helloice",
    productCategory: "Fashion Jewelry",
    briefDescription: "Trendy ice jewelry and accessories",
    fullBrief:
      "Model Helloice's trendy jewelry collections. Showcase accessible luxury pieces.",
    brandGuidelines: "Trendy, accessible, contemporary, diverse",
    requiredAttributes: ["Social media presence", "Trendy style", "Flexible"],
    compensation: "$200-$900",
    applicationDeadline: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    category: "jewelry",
  },
  {
    brandName: "Guess",
    productCategory: "Fashion & Accessories",
    briefDescription: "Global fashion and jewelry brand",
    fullBrief:
      "Feature in Guess campaigns. Model fashion pieces, jewelry, and accessories.",
    brandGuidelines: "Contemporary, accessible luxury, diverse",
    requiredAttributes: ["Professional experience", "Diverse look", "Portfolio"],
    compensation: "$400-$1600",
    applicationDeadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
    category: "jewelry",
  },
];

/**
 * Seed the database with affiliate brands
 */
export async function seedAffiliateBrands() {
  try {
    const db = await getDb();
    if (!db) {
      console.error("Database not available for seeding");
      return;
    }

    console.log("🌱 Seeding affiliate brands...");

    for (const brand of AFFILIATE_BRANDS) {
      await db.insert(castings).values({
        brandName: brand.brandName,
        productCategory: brand.productCategory,
        briefDescription: brand.briefDescription,
        fullBrief: brand.fullBrief,
        brandGuidelines: brand.brandGuidelines,
        requiredAttributes: brand.requiredAttributes,
        compensation: brand.compensation,
        applicationDeadline: brand.applicationDeadline,
        status: "open",
      });

      console.log(`✅ Seeded: ${brand.brandName}`);
    }

    console.log("🎉 All 25 affiliate brands seeded successfully!");
  } catch (error) {
    console.error("Error seeding affiliate brands:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seedAffiliateBrands().catch(console.error);
}
