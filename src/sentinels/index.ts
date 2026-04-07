// Each sentinel is a unique symbol
export const FUNCTION_MUST_BE_DEFINED: unique symbol = Symbol('FUNCTION_MUST_BE_DEFINED');
export const STRING_MUST_BE_DEFINED: unique symbol = Symbol('STRING_MUST_BE_DEFINED');
export const NUMBER_MUST_BE_DEFINED: unique symbol = Symbol('NUMBER_MUST_BE_DEFINED');
export const OBJECT_MUST_BE_DEFINED: unique symbol = Symbol('OBJECT_MUST_BE_DEFINED');
export const BOOLEAN_MUST_BE_DEFINED: unique symbol = Symbol('BOOLEAN_MUST_BE_DEFINED');
export const ANIMATION_MUST_BE_DEFINED: unique symbol = Symbol('ANIMATION_MUST_BE_DEFINED');

// Type exports for use in base components
export type FunctionMustBeDefined = typeof FUNCTION_MUST_BE_DEFINED;
export type StringMustBeDefined = typeof STRING_MUST_BE_DEFINED;
export type NumberMustBeDefined = typeof NUMBER_MUST_BE_DEFINED;
export type ObjectMustBeDefined = typeof OBJECT_MUST_BE_DEFINED;
export type BooleanMustBeDefined = typeof BOOLEAN_MUST_BE_DEFINED;
export type AnimationMustBeDefined = typeof ANIMATION_MUST_BE_DEFINED;

// Union type for any sentinel
export type AnySentinel =
  | FunctionMustBeDefined
  | StringMustBeDefined
  | NumberMustBeDefined
  | ObjectMustBeDefined
  | BooleanMustBeDefined
  | AnimationMustBeDefined;

// Set of all sentinels for runtime checking
export const ALL_SENTINELS = new Set<symbol>([
  FUNCTION_MUST_BE_DEFINED,
  STRING_MUST_BE_DEFINED,
  NUMBER_MUST_BE_DEFINED,
  OBJECT_MUST_BE_DEFINED,
  BOOLEAN_MUST_BE_DEFINED,
  ANIMATION_MUST_BE_DEFINED,
]);

// Check if a value is a sentinel
export function isSentinel(value: unknown): value is AnySentinel {
  return typeof value === 'symbol' && ALL_SENTINELS.has(value);
}

// Get a human-readable name for a sentinel
export function getSentinelName(sentinel: AnySentinel): string {
  return sentinel.description ?? 'UNKNOWN_SENTINEL';
}

// Get guidance text for each sentinel type
export function getSentinelGuidance(sentinel: AnySentinel): string {
  switch (sentinel) {
    case FUNCTION_MUST_BE_DEFINED:
      return 'Provide a function: (ctx: KevlarContext) => { ... }';
    case STRING_MUST_BE_DEFINED:
      return 'Provide a string value';
    case NUMBER_MUST_BE_DEFINED:
      return 'Provide a number value';
    case OBJECT_MUST_BE_DEFINED:
      return 'Provide an object: { ... }';
    case BOOLEAN_MUST_BE_DEFINED:
      return 'Provide true or false';
    case ANIMATION_MUST_BE_DEFINED:
      return 'Provide an AnimationConfig or a function returning one';
    default:
      return 'Provide a value';
  }
}
