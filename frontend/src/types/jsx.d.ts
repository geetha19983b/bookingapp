// Type declarations for JSX files (temporary until full migration to TypeScript)
declare module '*.jsx' {
  const component: React.ComponentType<any>;
  export default component;
}
