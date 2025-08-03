import Prism from "prismjs";
import "./code-theme.css";
import { useEffect } from "react";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

interface Props {
  code: string;
  lang: string;
}

export const CodeView = ({ code, lang }: Props) => {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);
  return (
    <pre className={"p-2 bg-transparent border-none rounded-none m-0 text-xs"}>
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
};
