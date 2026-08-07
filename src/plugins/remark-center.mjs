import { visit } from "unist-util-visit";

export default function remarkCenter() {
  return (tree) => {
    visit(tree, "containerDirective", (node) => {
      if (node.name !== "center") return;

      node.type = "mdxJsxFlowElement";
      node.name = "div";
      node.attributes = [
        {
          type: "mdxJsxAttribute",
          name: "class",
          value: "text-center [&>table]:w-fit [&>table]:mx-auto",
        },
      ];
    });
  };
}
