import { fixLinks } from "@/lib/content";

export function Prose({ html }: { html: string }) {
  return <div className="prose-cmc" dangerouslySetInnerHTML={{ __html: fixLinks(html) }} />;
}
