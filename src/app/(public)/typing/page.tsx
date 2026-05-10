import TypingSelectionLayer from "@/components/typing/TypingSelectionLayer";

export const metadata = {
  title: "Typing Practice | National Genius Institute",
  description: "Select your practice module and improve your typing speed.",
};

export default function TypingPage() {
  return (
    <div className="pt-20">
      <TypingSelectionLayer />
    </div>
  );
}
