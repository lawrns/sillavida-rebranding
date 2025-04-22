# Vida Score Product Comparison Tool Specification

## Overview
The "Vida Score" is a wellness-focused product comparison tool that helps customers evaluate and compare ergonomic chairs based on how they enhance different aspects of life. Unlike traditional feature comparison tools that focus on technical specifications, the "Vida Score" rates products on wellness categories that align with the "investing in yourself" theme of the SillaVida brand.

## Wellness Categories
The "Vida Score" evaluates products on four wellness categories:

### 1. Comfort Diario (Daily Comfort)
This category evaluates how comfortable the chair is for everyday use, focusing on immediate physical comfort and the overall sitting experience.

**Rating Criteria:**
- **Cushioning Quality**: The quality and comfort of the seat and backrest cushioning
- **Material Breathability**: How well the chair materials allow air circulation to prevent heat buildup
- **Initial Comfort**: How comfortable the chair feels when first sitting down
- **Pressure Distribution**: How well the chair distributes body weight to prevent pressure points
- **Armrest Comfort**: The comfort and adjustability of the armrests

**Scoring Scale:**
- 1-2: Basic comfort with minimal cushioning and few comfort features
- 3-4: Adequate comfort for short periods with standard cushioning
- 5-6: Good comfort for medium durations with quality materials
- 7-8: Very comfortable for long periods with premium cushioning and materials
- 9-10: Exceptional all-day comfort with advanced ergonomic design and premium materials

### 2. Salud Postural (Postural Health)
This category evaluates how well the chair supports proper posture and spinal alignment, focusing on long-term physical health benefits.

**Rating Criteria:**
- **Lumbar Support**: The quality and adjustability of lumbar support
- **Spinal Alignment**: How well the chair promotes proper spinal alignment
- **Adjustability**: The range and ease of adjustments to accommodate different body types
- **Posture Correction**: Features that actively encourage proper posture
- **Head/Neck Support**: The quality and adjustability of headrest support

**Scoring Scale:**
- 1-2: Basic design with minimal posture support
- 3-4: Standard ergonomic features with limited adjustability
- 5-6: Good ergonomic design with adequate adjustability
- 7-8: Advanced ergonomic features with multiple adjustment points
- 9-10: Comprehensive ergonomic design with fully customizable support

### 3. Productividad (Productivity)
This category evaluates how the chair enhances work efficiency and focus, emphasizing features that reduce distractions and support various work activities.

**Rating Criteria:**
- **Movement Support**: How well the chair supports natural movement and position changes
- **Task Adaptability**: How well the chair adapts to different tasks and work styles
- **Distraction Reduction**: Features that minimize physical distractions (discomfort, noise, etc.)
- **Mobility**: Ease of movement around the workspace
- **Workspace Integration**: How well the chair integrates with standard desk setups

**Scoring Scale:**
- 1-2: Basic functionality with minimal features supporting productivity
- 3-4: Standard design that adequately supports basic work tasks
- 5-6: Good design with features that enhance focus and efficiency
- 7-8: Advanced features that actively support various work styles
- 9-10: Comprehensive design that maximizes productivity across all work scenarios

### 4. Durabilidad (Durability)
This category evaluates the chair's build quality, longevity, and value over time, focusing on the long-term investment aspect.

**Rating Criteria:**
- **Material Quality**: The durability and quality of the materials used
- **Construction Robustness**: The strength and quality of the chair's construction
- **Mechanism Reliability**: The reliability and durability of adjustment mechanisms
- **Wear Resistance**: How well the chair maintains its appearance and functionality over time
- **Warranty Coverage**: The length and comprehensiveness of the warranty

**Scoring Scale:**
- 1-2: Basic construction with standard materials and short warranty
- 3-4: Adequate construction with standard durability and warranty
- 5-6: Good quality materials and construction with standard warranty
- 7-8: High-quality materials and construction with extended warranty
- 9-10: Premium materials and construction with comprehensive long-term warranty

## Overall Vida Score
The overall "Vida Score" is calculated as a weighted average of the four category scores, with the option for users to customize the weights based on their priorities.

**Default Weights:**
- Comfort Diario: 25%
- Salud Postural: 30%
- Productividad: 25%
- Durabilidad: 20%

**Calculation Formula:**
```
Vida Score = (Comfort Score × Comfort Weight) + (Posture Score × Posture Weight) + (Productivity Score × Productivity Weight) + (Durability Score × Durability Weight)
```

## User Interface Components

### 1. Product Comparison View
- Side-by-side comparison of multiple products
- Visual representation of scores using radar charts
- Ability to filter and sort products based on category scores
- Detailed breakdown of scores for each category

### 2. Individual Product Score Card
- Comprehensive breakdown of the product's scores across all categories
- Visual representation of scores using radar charts and bar graphs
- Comparison to category averages
- Detailed explanation of strengths and weaknesses

### 3. Personalized Recommendation Tool
- User input for priority weighting of categories
- Customized product recommendations based on user priorities
- "Best match" calculation based on weighted scores

### 4. Filtering and Sorting Options
- Filter products by minimum category scores
- Sort products by overall score or category scores
- Filter by price range, brand, or other attributes

## Visual Design Guidelines

### Color Coding
- Comfort Diario: Terracotta (#C87D55) - Warm and inviting
- Salud Postural: Sage (#7D9D8C) - Calming and balanced
- Productividad: Teal (#14B8A6) - Energetic and focused
- Durabilidad: Navy (#1E3A8A) - Solid and dependable

### Score Visualization
- Radar charts for comparing across categories
- Circular gauges for individual category scores
- Progress bars for detailed criteria scores
- Color-coded indicators for score ranges

## Implementation Considerations

### Data Structure
```typescript
interface VidaScore {
  comfort: {
    overall: number;
    cushioning: number;
    breathability: number;
    initialComfort: number;
    pressureDistribution: number;
    armrestComfort: number;
  };
  posture: {
    overall: number;
    lumbarSupport: number;
    spinalAlignment: number;
    adjustability: number;
    postureCorrection: number;
    headNeckSupport: number;
  };
  productivity: {
    overall: number;
    movementSupport: number;
    taskAdaptability: number;
    distractionReduction: number;
    mobility: number;
    workspaceIntegration: number;
  };
  durability: {
    overall: number;
    materialQuality: number;
    constructionRobustness: number;
    mechanismReliability: number;
    wearResistance: number;
    warrantyValue: number;
  };
  overallScore: number;
}
```

### Integration Points
- Product data from static data sources (chairs.ts)
- Product data from Shopify API
- User preference storage in local storage
- Potential for user reviews to influence scores

## Accessibility Considerations
- Color contrast compliance for all score visualizations
- Screen reader support for all score information
- Keyboard navigation for all comparison features
- Text alternatives for all visual score representations

## Mobile Responsiveness
- Simplified comparison view for small screens
- Swipeable product cards for mobile comparison
- Collapsible detailed score sections
- Touch-friendly controls for adjusting priority weights

## Future Enhancements
- User reviews integration to influence scores
- Personalized score history based on user preferences
- AR visualization of chairs with score overlays
- Integration with customer health data for personalized recommendations
