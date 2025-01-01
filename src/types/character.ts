import { Character as BaseCharacter } from "@ai16z/eliza";

export interface DNA {
    core_traits: {
        empathy: number;
        intelligence: number;
        creativity: number;
        adaptability: number;
        learning_rate: number;
    };
    mutation_points: string[];
}

export interface ReproductionSettings {
    enabled: boolean;
    mutation_rate: number;
    inheritance_traits: string[];
    evolution_rules: {
        success_metrics: string[];
        mutation_types: string[];
    };
}

export interface ExtendedSettings {
    secrets?: { [key: string]: string };
    voice?: {
        model?: string;
        url?: string;
    };
    model?: string;
    embeddingModel?: string;
    reproduction?: ReproductionSettings;
}

export interface ExtendedCharacter extends BaseCharacter {
    dna?: DNA;
    settings: ExtendedSettings;
} 