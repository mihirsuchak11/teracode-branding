import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { AskChatAnim } from "@/components/sections/AskChatAnim";
import { statement } from "@/content/home";

/* The headline is two-tone: the problem dim, the answer bright. */
const [problem, answer] = statement.title.split(/(?<=review it\.)\s/);

export function Statement() {
  return (
    <section className="relative">
      <div className="px-6 pt-28 md:px-10 md:pt-36">
        <ChromaticLines
          as="h2"
          className="text-h2-statement max-w-[620px]"
          segments={[
            { text: `${problem} `, className: "text-fg-faint" },
            { text: answer, className: "text-fg" },
          ]}
        />
      </div>

      {/* Looping chat demo on the live particle-grid wave (the original's
          "Ask Chat Anim" over ParticleGridThreeJSV2). */}
      <div className="relative flex justify-center px-6 pt-[50px]">
        <AskChatAnim />
      </div>
    </section>
  );
}
