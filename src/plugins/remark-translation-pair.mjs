import { visit } from "unist-util-visit";

export default function remarkTranslationPair() {
  return (tree) => {
    visit(tree, "containerDirective", (node) => {
      if (node.name !== "translation-pair") return;

      node.type = "mdxJsxFlowElement";
      node.name = "TrBox";
      const languages = {
        original: "en",
        translation: "zh-CN",
      };
      node.attributes = [];
      node.children = node.children.map((child) => {
        if (
          child.type !== "containerDirective" ||
          !["original", "translation"].includes(child.name)
        ) {
          return child;
        }

        const language = child.attributes?.lang || languages[child.name];
        node.attributes.push({
          type: "mdxJsxAttribute",
          name: `${child.name}Lang`,
          value: language,
        });

        return {
          type: "mdxJsxFlowElement",
          name: "div",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "slot",
              value: child.name,
            },
            {
              type: "mdxJsxAttribute",
              name: "lang",
              value: language,
            },
          ],
          children: child.children,
        };
      });
    });
  };
}
