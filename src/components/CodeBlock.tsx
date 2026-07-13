import { useMemo } from "react";
import { highlight } from "../highlight";

interface Props {
  code: string;
  language: string;
}

/** Syntax-highlighted, read-only code block (highlighted HTML is trusted: it
 *  is produced by highlight.js from the user's own snippet content). */
export default function CodeBlock({ code, language }: Props) {
  const html = useMemo(() => highlight(code, language), [code, language]);
  return (
    <pre className="codeblock" aria-label={`Code snippet in ${language}`}>
      <code
        className="hljs"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </pre>
  );
}
