import { visit } from "unist-util-visit";

export default function remarkTranslationPair() {
  return (tree) => {
    visit(tree, "containerDirective", (node) => {
      if (node.name !== "translation-pair") return;

      node.type = "mdxJsxFlowElement";
      node.name = "TrBox";
      node.attributes = [];
      node.children = node.children.map((child) => {
        if (
          child.type !== "containerDirective" ||
          !["original", "translation"].includes(child.name)
        ) {
          return child;
        }

        return {
          type: "mdxJsxFlowElement",
          name: "div",
          attributes: [
            {
              type: "mdxJsxAttribute",
              name: "slot",
              value: child.name,
            },
          ],
          children: child.children,
        };
      });
    });
  };
}
