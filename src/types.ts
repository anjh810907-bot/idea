export interface MascotConfig {
  id: string;
  name: string;
  animal: string;
  emoji: string;
  cheerPhrase: string;
  avatarBg: string;
}

export interface FeatureRuleItem {
  id: string;
  title: string;
  placeholder: string;
  options?: string[];
  defaultValue?: string;
  value?: string;
}

export interface FeatureConfig {
  id: string;
  name: string;
  category: 'core' | 'game' | 'utility' | 'social';
  description: string;
  iconName: string;
  suggestedQuestions: {
    key: string;
    question: string;
    type: 'select' | 'text' | 'number';
    options?: string[];
    placeholder?: string;
    defaultValue: string;
  }[];
}

export interface AppBlueprint {
  // Step 1
  ideaText: string;
  selectedIdeaChip: string;
  
  // Step 2
  purposes: string[];
  customPurpose: string;
  
  // Step 3
  targetUsers: string[];
  customTargetUser: string;
  
  // Step 4
  features: string[];
  
  // Step 5: feature details keyed by featureId
  featureDetails: Record<string, Record<string, string>>;
  
  // Step 6
  screens: string[];
  customScreens: string[];
  aiScreenSuggestions: string[];
  screenFlowNotes: string;
  
  // Step 7
  designStyle: string;
  themeColor: string;
  mascot: MascotConfig | null;
  customDesignNotes: string;
  
  // Step 8
  specialIdea: string;
  selectedSpecialIdeaChip: string;
  
  // Step 9
  appName: string;
  appSlogan: string;
  aiNameSuggestions: Array<{ name: string; slogan: string; reason: string }>;
  
  // Step 10 & Result
  targetAiTool: 'v0' | 'bolt' | 'lovable' | 'claude' | 'general';
  generatedPrompt: string;
  isCustomizedPrompt: boolean;
  promptGeneratedAt?: string;
}

export interface RevisionRequest {
  problemDescription: string;
  category: 'ui' | 'bug' | 'feature' | 'speed';
  specificRequest: string;
}

export interface StepMeta {
  number: number;
  title: string;
  subtitle: string;
  icon: string;
}
