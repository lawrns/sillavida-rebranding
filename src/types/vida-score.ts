/**
 * Vida Score Type Definitions
 * 
 * This file contains the TypeScript interfaces for the Vida Score product comparison tool.
 * The Vida Score is a wellness-focused rating system that evaluates ergonomic chairs
 * based on how they enhance different aspects of life.
 */

/**
 * Comfort category score and subcategories
 */
export interface ComfortScore {
  /** Overall score for the comfort category (1-10) */
  overall: number;
  /** Quality and comfort of the seat and backrest cushioning (1-10) */
  cushioning: number;
  /** How well the chair materials allow air circulation (1-10) */
  breathability: number;
  /** How comfortable the chair feels when first sitting down (1-10) */
  initialComfort: number;
  /** How well the chair distributes body weight (1-10) */
  pressureDistribution: number;
  /** The comfort and adjustability of the armrests (1-10) */
  armrestComfort: number;
}

/**
 * Posture category score and subcategories
 */
export interface PostureScore {
  /** Overall score for the posture category (1-10) */
  overall: number;
  /** The quality and adjustability of lumbar support (1-10) */
  lumbarSupport: number;
  /** How well the chair promotes proper spinal alignment (1-10) */
  spinalAlignment: number;
  /** The range and ease of adjustments (1-10) */
  adjustability: number;
  /** Features that actively encourage proper posture (1-10) */
  postureCorrection: number;
  /** The quality and adjustability of headrest support (1-10) */
  headNeckSupport: number;
}

/**
 * Productivity category score and subcategories
 */
export interface ProductivityScore {
  /** Overall score for the productivity category (1-10) */
  overall: number;
  /** How well the chair supports natural movement (1-10) */
  movementSupport: number;
  /** How well the chair adapts to different tasks (1-10) */
  taskAdaptability: number;
  /** Features that minimize physical distractions (1-10) */
  distractionReduction: number;
  /** Ease of movement around the workspace (1-10) */
  mobility: number;
  /** How well the chair integrates with standard desk setups (1-10) */
  workspaceIntegration: number;
}

/**
 * Durability category score and subcategories
 */
export interface DurabilityScore {
  /** Overall score for the durability category (1-10) */
  overall: number;
  /** The durability and quality of the materials used (1-10) */
  materialQuality: number;
  /** The strength and quality of the chair's construction (1-10) */
  constructionRobustness: number;
  /** The reliability and durability of adjustment mechanisms (1-10) */
  mechanismReliability: number;
  /** How well the chair maintains its appearance and functionality over time (1-10) */
  wearResistance: number;
  /** The length and comprehensiveness of the warranty (1-10) */
  warrantyValue: number;
}

/**
 * Complete Vida Score with all categories and overall score
 */
export interface VidaScore {
  /** Comfort category scores */
  comfort: ComfortScore;
  /** Posture category scores */
  posture: PostureScore;
  /** Productivity category scores */
  productivity: ProductivityScore;
  /** Durability category scores */
  durability: DurabilityScore;
  /** Overall weighted score (1-10) */
  overallScore: number;
}

/**
 * User preference weights for calculating personalized Vida Scores
 */
export interface VidaScoreWeights {
  /** Weight for the comfort category (0-1) */
  comfort: number;
  /** Weight for the posture category (0-1) */
  posture: number;
  /** Weight for the productivity category (0-1) */
  productivity: number;
  /** Weight for the durability category (0-1) */
  durability: number;
}

/**
 * Default weights for calculating Vida Scores
 */
export const DEFAULT_VIDA_SCORE_WEIGHTS: VidaScoreWeights = {
  comfort: 0.25,
  posture: 0.30,
  productivity: 0.25,
  durability: 0.20
};

/**
 * Product with Vida Score information
 */
export interface ProductWithVidaScore {
  /** Product ID */
  id: string;
  /** Product title */
  title: string;
  /** Product handle/slug */
  handle: string;
  /** Product image URL */
  imageUrl: string;
  /** Product price */
  price: number;
  /** Vida Score data */
  vidaScore: VidaScore;
}

/**
 * Calculate the overall Vida Score based on category scores and weights
 * 
 * @param comfort Comfort category score (1-10)
 * @param posture Posture category score (1-10)
 * @param productivity Productivity category score (1-10)
 * @param durability Durability category score (1-10)
 * @param weights Optional custom weights (must sum to 1)
 * @returns Overall Vida Score (1-10)
 */
export function calculateOverallVidaScore(
  comfort: number,
  posture: number,
  productivity: number,
  durability: number,
  weights: VidaScoreWeights = DEFAULT_VIDA_SCORE_WEIGHTS
): number {
  // Validate weights sum to 1
  const weightSum = weights.comfort + weights.posture + weights.productivity + weights.durability;
  if (Math.abs(weightSum - 1) > 0.001) {
    console.warn(`Vida Score weights do not sum to 1 (sum: ${weightSum}). Using default weights.`);
    weights = DEFAULT_VIDA_SCORE_WEIGHTS;
  }

  // Calculate weighted score
  return (
    comfort * weights.comfort +
    posture * weights.posture +
    productivity * weights.productivity +
    durability * weights.durability
  );
}

/**
 * Get a descriptive rating label based on a score
 * 
 * @param score Score value (1-10)
 * @returns Rating label
 */
export function getScoreRatingLabel(score: number): string {
  if (score >= 9) return "Excepcional";
  if (score >= 7) return "Excelente";
  if (score >= 5) return "Bueno";
  if (score >= 3) return "Adecuado";
  return "Básico";
}

/**
 * Color codes for each Vida Score category
 */
export const VIDA_SCORE_COLORS = {
  comfort: "#C87D55", // Terracotta
  posture: "#7D9D8C", // Sage
  productivity: "#14B8A6", // Teal
  durability: "#1E3A8A", // Navy
};
