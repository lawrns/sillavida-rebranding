/**
 * Vida Score Data
 * 
 * This file contains the Vida Score data for the SillaVida product catalog.
 * It extends the existing chair data with detailed Vida Scores that evaluate
 * each chair on wellness categories like comfort, posture, productivity, and durability.
 */

import { Chair, chairs } from './chairs';
import { 
  VidaScore, 
  ComfortScore, 
  PostureScore, 
  ProductivityScore, 
  DurabilityScore,
  ProductWithVidaScore,
  calculateOverallVidaScore
} from '../types/vida-score';

/**
 * Calculate a comfort score based on chair properties
 * 
 * @param chair The chair to calculate the score for
 * @returns A comfort score object
 */
function calculateComfortScore(chair: Chair): ComfortScore {
  // Base scores on chair features and benefit categories
  const hasMeshOrBreathable = chair.features.some(f => 
    f.toLowerCase().includes('malla') || 
    f.toLowerCase().includes('transpirable') ||
    f.toLowerCase().includes('mesh')
  );
  
  const hasQualityCushioning = chair.features.some(f => 
    f.toLowerCase().includes('memory foam') || 
    f.toLowerCase().includes('espuma') ||
    f.toLowerCase().includes('acolchado')
  );
  
  const hasAdjustableArmrests = chair.features.some(f => 
    f.toLowerCase().includes('reposabrazos') && 
    (f.toLowerCase().includes('ajustable') || f.toLowerCase().includes('4d'))
  );

  // Calculate subcategory scores (1-10)
  const cushioning = hasQualityCushioning ? 8 : 6;
  const breathability = hasMeshOrBreathable ? 9 : 5;
  const initialComfort = chair.category === 'gaming' ? 7 : 8;
  const pressureDistribution = hasQualityCushioning ? 8 : 6;
  const armrestComfort = hasAdjustableArmrests ? 9 : 6;

  // Calculate overall comfort score (average of subcategories)
  const overall = Math.round((cushioning + breathability + initialComfort + pressureDistribution + armrestComfort) / 5);

  return {
    overall,
    cushioning,
    breathability,
    initialComfort,
    pressureDistribution,
    armrestComfort
  };
}

/**
 * Calculate a posture score based on chair properties
 * 
 * @param chair The chair to calculate the score for
 * @returns A posture score object
 */
function calculatePostureScore(chair: Chair): PostureScore {
  // Base scores on chair features and benefit categories
  const hasLumbarSupport = chair.features.some(f => 
    f.toLowerCase().includes('lumbar') || 
    f.toLowerCase().includes('soporte')
  );
  
  const hasHeadrest = chair.features.some(f => 
    f.toLowerCase().includes('reposacabezas') || 
    f.toLowerCase().includes('headrest')
  );
  
  const hasAdjustability = chair.features.some(f => 
    f.toLowerCase().includes('ajustable') || 
    f.toLowerCase().includes('reclinable')
  );

  // Calculate subcategory scores (1-10)
  const lumbarSupport = hasLumbarSupport ? 9 : 5;
  const spinalAlignment = hasLumbarSupport ? 8 : 6;
  const adjustability = hasAdjustability ? 8 : 6;
  const postureCorrection = chair.lifeCategory === 'Vida Saludable' ? 9 : 7;
  const headNeckSupport = hasHeadrest ? 9 : 5;

  // Calculate overall posture score (average of subcategories)
  const overall = Math.round((lumbarSupport + spinalAlignment + adjustability + postureCorrection + headNeckSupport) / 5);

  return {
    overall,
    lumbarSupport,
    spinalAlignment,
    adjustability,
    postureCorrection,
    headNeckSupport
  };
}

/**
 * Calculate a productivity score based on chair properties
 * 
 * @param chair The chair to calculate the score for
 * @returns A productivity score object
 */
function calculateProductivityScore(chair: Chair): ProductivityScore {
  // Base scores on chair features and benefit categories
  const hasErgonomicDesign = chair.features.some(f => 
    f.toLowerCase().includes('ergon') || 
    chair.name.toLowerCase().includes('ergo')
  );
  
  const hasAdjustability = chair.features.some(f => 
    f.toLowerCase().includes('ajustable') || 
    f.toLowerCase().includes('altura')
  );
  
  const hasSwivel = chair.features.some(f => 
    f.toLowerCase().includes('giratoria') || 
    f.toLowerCase().includes('swivel')
  );

  // Calculate subcategory scores (1-10)
  const movementSupport = chair.category === 'gaming' ? 8 : 7;
  const taskAdaptability = hasAdjustability ? 8 : 6;
  const distractionReduction = hasErgonomicDesign ? 8 : 6;
  const mobility = hasSwivel ? 9 : 7;
  const workspaceIntegration = chair.lifeCategory === 'Vida Productiva' ? 9 : 7;

  // Calculate overall productivity score (average of subcategories)
  const overall = Math.round((movementSupport + taskAdaptability + distractionReduction + mobility + workspaceIntegration) / 5);

  return {
    overall,
    movementSupport,
    taskAdaptability,
    distractionReduction,
    mobility,
    workspaceIntegration
  };
}

/**
 * Calculate a durability score based on chair properties
 * 
 * @param chair The chair to calculate the score for
 * @returns A durability score object
 */
function calculateDurabilityScore(chair: Chair): DurabilityScore {
  // Base scores on chair features, price, and benefit categories
  const isPremium = chair.price > 5000;
  const isHighEnd = chair.price > 4000;
  
  const hasQualityMaterials = chair.features.some(f => 
    f.toLowerCase().includes('premium') || 
    f.toLowerCase().includes('alta') ||
    isPremium
  );

  // Calculate subcategory scores (1-10)
  const materialQuality = hasQualityMaterials ? 9 : (isHighEnd ? 8 : 7);
  const constructionRobustness = isPremium ? 9 : (isHighEnd ? 8 : 7);
  const mechanismReliability = isPremium ? 9 : (isHighEnd ? 8 : 7);
  const wearResistance = hasQualityMaterials ? 9 : 7;
  const warrantyValue = isPremium ? 9 : 7;

  // Calculate overall durability score (average of subcategories)
  const overall = Math.round((materialQuality + constructionRobustness + mechanismReliability + wearResistance + warrantyValue) / 5);

  return {
    overall,
    materialQuality,
    constructionRobustness,
    mechanismReliability,
    wearResistance,
    warrantyValue
  };
}

/**
 * Calculate a complete Vida Score for a chair
 * 
 * @param chair The chair to calculate the score for
 * @returns A complete Vida Score object
 */
function calculateVidaScore(chair: Chair): VidaScore {
  const comfort = calculateComfortScore(chair);
  const posture = calculatePostureScore(chair);
  const productivity = calculateProductivityScore(chair);
  const durability = calculateDurabilityScore(chair);
  
  const overallScore = calculateOverallVidaScore(
    comfort.overall,
    posture.overall,
    productivity.overall,
    durability.overall
  );

  return {
    comfort,
    posture,
    productivity,
    durability,
    overallScore
  };
}

/**
 * Convert a Chair to a ProductWithVidaScore
 * 
 * @param chair The chair to convert
 * @returns A ProductWithVidaScore object
 */
function chairToProductWithVidaScore(chair: Chair): ProductWithVidaScore {
  return {
    id: chair.id,
    title: chair.name,
    handle: chair.id.toLowerCase(),
    imageUrl: chair.image,
    price: chair.price,
    vidaScore: calculateVidaScore(chair)
  };
}

/**
 * Array of all chairs with Vida Scores
 */
export const chairsWithVidaScores: ProductWithVidaScore[] = chairs.map(chairToProductWithVidaScore);

/**
 * Get a chair with Vida Score by ID
 * 
 * @param id The chair ID
 * @returns The chair with Vida Score, or undefined if not found
 */
export function getChairWithVidaScore(id: string): ProductWithVidaScore | undefined {
  return chairsWithVidaScores.find(chair => chair.id === id);
}

/**
 * Get chairs with Vida Scores filtered by minimum category scores
 * 
 * @param minComfort Minimum comfort score (1-10)
 * @param minPosture Minimum posture score (1-10)
 * @param minProductivity Minimum productivity score (1-10)
 * @param minDurability Minimum durability score (1-10)
 * @returns Filtered array of chairs with Vida Scores
 */
export function getChairsWithVidaScoresByMinimumScores(
  minComfort: number = 0,
  minPosture: number = 0,
  minProductivity: number = 0,
  minDurability: number = 0
): ProductWithVidaScore[] {
  return chairsWithVidaScores.filter(chair => 
    chair.vidaScore.comfort.overall >= minComfort &&
    chair.vidaScore.posture.overall >= minPosture &&
    chair.vidaScore.productivity.overall >= minProductivity &&
    chair.vidaScore.durability.overall >= minDurability
  );
}

/**
 * Get the chair with the highest score in a specific category
 * 
 * @param category The category to check ('comfort', 'posture', 'productivity', 'durability', or 'overall')
 * @returns The chair with the highest score in the specified category
 */
export function getChairWithHighestScore(
  category: 'comfort' | 'posture' | 'productivity' | 'durability' | 'overall' = 'overall'
): ProductWithVidaScore {
  return chairsWithVidaScores.reduce((highest, current) => {
    const currentScore = category === 'overall' 
      ? current.vidaScore.overallScore 
      : current.vidaScore[category].overall;
    
    const highestScore = category === 'overall' 
      ? highest.vidaScore.overallScore 
      : highest.vidaScore[category].overall;
    
    return currentScore > highestScore ? current : highest;
  }, chairsWithVidaScores[0]);
}

/**
 * Get the best chair for a user based on their priorities
 * 
 * @param comfortWeight Weight for comfort (0-1)
 * @param postureWeight Weight for posture (0-1)
 * @param productivityWeight Weight for productivity (0-1)
 * @param durabilityWeight Weight for durability (0-1)
 * @returns The best chair based on the specified weights
 */
export function getBestChairForUser(
  comfortWeight: number = 0.25,
  postureWeight: number = 0.30,
  productivityWeight: number = 0.25,
  durabilityWeight: number = 0.20
): ProductWithVidaScore {
  // Normalize weights to ensure they sum to 1
  const totalWeight = comfortWeight + postureWeight + productivityWeight + durabilityWeight;
  const normalizedComfortWeight = comfortWeight / totalWeight;
  const normalizedPostureWeight = postureWeight / totalWeight;
  const normalizedProductivityWeight = productivityWeight / totalWeight;
  const normalizedDurabilityWeight = durabilityWeight / totalWeight;

  // Calculate weighted scores for each chair
  const chairsWithWeightedScores = chairsWithVidaScores.map(chair => {
    const weightedScore = calculateOverallVidaScore(
      chair.vidaScore.comfort.overall,
      chair.vidaScore.posture.overall,
      chair.vidaScore.productivity.overall,
      chair.vidaScore.durability.overall,
      {
        comfort: normalizedComfortWeight,
        posture: normalizedPostureWeight,
        productivity: normalizedProductivityWeight,
        durability: normalizedDurabilityWeight
      }
    );
    
    return {
      chair,
      weightedScore
    };
  });

  // Find the chair with the highest weighted score
  const bestChair = chairsWithWeightedScores.reduce(
    (best, current) => current.weightedScore > best.weightedScore ? current : best,
    chairsWithWeightedScores[0]
  );

  return bestChair.chair;
}
