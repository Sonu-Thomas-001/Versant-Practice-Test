// Versant scoring and mapping utilities

export interface SkillScores {
  overall: number;
  overallGse: number;
  speaking: number;
  listening: number;
  reading: number;
  writing: number;
  cefr: string;
}

// Convert section weights to 4 core skills
export function calculateDerivedScores(sectionScores: Record<string, { score: number, maxScore: number }>): SkillScores {
  // Normalize each section score to percentage (0 - 1)
  const norm = (s: string) => {
    const sec = sectionScores[s];
    if (!sec || sec.maxScore === 0) return null;
    return sec.score / sec.maxScore;
  };

  const calculateWeightedCategory = (weights: { [key: string]: number }) => {
    let totalScore = 0;
    let totalWeight = 0;
    
    for (const [section, weight] of Object.entries(weights)) {
      const n = norm(section);
      if (n !== null) {
        totalScore += n * weight;
        totalWeight += weight;
      }
    }
    
    if (totalWeight === 0) return null;
    return totalScore / totalWeight;
  };

  // High weight = 3, Medium = 2, Low = 1
  // Speaking: A (3), B (2), C (2)
  const speakingRaw = calculateWeightedCategory({ A: 3, B: 2, C: 2 });
  const listeningRaw = calculateWeightedCategory({ A: 2, C: 3, E: 2 });
  const readingRaw = calculateWeightedCategory({ B: 2, D: 3, F: 3 });
  const writingRaw = calculateWeightedCategory({ D: 2, E: 3, F: 3 });

  // Map raw percentage (0-1) to GSE scale (10-90)
  const mapToGse = (raw: number | null) => {
    if (raw === null) return null;
    return Math.round(10 + (raw * 80));
  };

  const speaking = mapToGse(speakingRaw) ?? 0;
  const listening = mapToGse(listeningRaw) ?? 0;
  const reading = mapToGse(readingRaw) ?? 0;
  const writing = mapToGse(writingRaw) ?? 0;

  const validScores = [mapToGse(speakingRaw), mapToGse(listeningRaw), mapToGse(readingRaw), mapToGse(writingRaw)].filter(s => s !== null) as number[];
  const overallGse = validScores.length > 0 ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 10;

  return {
    overall: overallGse, // Versant often uses 20-80 scale, but GSE is 10-90. We'll stick to GSE (10-90)
    overallGse,
    speaking,
    listening,
    reading,
    writing,
    cefr: getCefrBand(overallGse)
  };
}

export function getCefrBand(gseScore: number): string {
  if (gseScore < 20) return '< A1';
  if (gseScore < 30) return 'A1';
  if (gseScore < 40) return 'A2';
  if (gseScore < 50) return 'B1';
  if (gseScore < 60) return 'B2';
  if (gseScore < 70) return 'B2+ / C1';
  if (gseScore < 80) return 'C1';
  return 'C1+ / C2';
}

export function getSkillDescription(skill: string, gseScore: number): { summary: string, tip: string } {
  // Simple deterministic tips
  if (gseScore < 40) {
    return {
      summary: `Your ${skill} skills are at a beginner level. You require significant practice with basic vocabulary and grammar.`,
      tip: `Focus on fundamental vocabulary and simple sentence structures. Practice daily with flashcards.`
    };
  } else if (gseScore < 60) {
    return {
      summary: `You have intermediate ${skill} abilities. You can handle familiar topics but may struggle with complex themes.`,
      tip: `Try consuming native media (podcasts, news articles) related to your field to expose yourself to varied sentence patterns.`
    };
  } else if (gseScore < 80) {
    return {
      summary: `You display advanced ${skill} proficiency. You understand extended discourse and express ideas fluidly.`,
      tip: `Focus on idiomatic expressions and reducing occasional hesitations to reach near-native fluency.`
    };
  } else {
    return {
      summary: `You demonstrate mastery in ${skill}, comparable to an educated native speaker.`,
      tip: `Maintain your level by engaging in complex debates, reading academic texts, and practicing nuanced discussions.`
    };
  }
}
