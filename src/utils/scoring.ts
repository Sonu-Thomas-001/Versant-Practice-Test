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
    if (!sec || sec.maxScore === 0) return 0;
    return sec.score / sec.maxScore;
  };

  const getNorm = (s: string) => norm(s) || 0;

  // High weight = 3, Medium = 2, Low = 1
  // Speaking: A (3), B (2), C (2)
  const speakingRaw = (getNorm('A') * 3 + getNorm('B') * 2 + getNorm('C') * 2) / 7;
  // Listening: A (2), C (3), E (2)
  const listeningRaw = (getNorm('A') * 2 + getNorm('C') * 3 + getNorm('E') * 2) / 7;
  // Reading: B (2), D (3), F (3)
  const readingRaw = (getNorm('B') * 2 + getNorm('D') * 3 + getNorm('F') * 3) / 8;
  // Writing: D (2), E (3), F (3)
  const writingRaw = (getNorm('D') * 2 + getNorm('E') * 3 + getNorm('F') * 3) / 8;

  // Map raw percentage (0-1) to GSE scale (10-90)
  const mapToGse = (raw: number) => {
    // Basic linear map: 0->10, 1->90
    return Math.round(10 + (raw * 80));
  };

  const speaking = mapToGse(speakingRaw);
  const listening = mapToGse(listeningRaw);
  const reading = mapToGse(readingRaw);
  const writing = mapToGse(writingRaw);

  const overallGse = Math.round((speaking + listening + reading + writing) / 4);

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
