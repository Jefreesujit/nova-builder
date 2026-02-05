export default function SitesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sites don't need any layout wrapper - they're full-page renders
  return <>{children}</>;
}
