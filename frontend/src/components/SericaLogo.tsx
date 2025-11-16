export default function SericaLogo({ size = 100 }: { size?: number }) {
  return (
    <img
      src="/Serica_logo.png"
      alt="SERICA Logo"
      style={{
        width: size,
        height: size,
        objectFit: "contain",
      }}
    />
  );
}
