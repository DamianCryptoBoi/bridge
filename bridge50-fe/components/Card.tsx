export function Card({ children }: { children: JSX.Element | JSX.Element[] }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
        padding: "1rem",
        margin: "0",
        overflow: "auto",
      }}
    >
      {children}
    </div>
  );
}
