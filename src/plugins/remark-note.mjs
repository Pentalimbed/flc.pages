import { visit } from "unist-util-visit";

export default function remarkNote() {
  return (tree, file) => {
    visit(tree, "textDirective", (node) => {
      if (node.name !== "note") return;

      const note = node.attributes?.note;
      if (!note) {
        file.fail("The note directive requires a note attribute.", node);
      }

      node.type = "mdxJsxTextElement";
      node.name = "Note";
      node.attributes = [
        {
          type: "mdxJsxAttribute",
          name: "note",
          value: note,
        },
      ];
    });
  };
}
