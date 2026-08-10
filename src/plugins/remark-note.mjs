function spanNode(className, children, attributes = []) {
  return {
    type: "mdxJsxTextElement",
    name: "span",
    attributes: [
      {
        type: "mdxJsxAttribute",
        name: "class",
        value: className,
      },
      ...attributes,
    ],
    children,
  };
}

function tableContent(table) {
  return spanNode("note-table", table.children.map((row, rowIndex) =>
    spanNode("note-table-row", row.children.map((cell) =>
      spanNode("note-table-cell", cell.children, [
        {
          type: "mdxJsxAttribute",
          name: "role",
          value: rowIndex === 0 ? "columnheader" : "cell",
        },
      ]),
    ), [
      {
        type: "mdxJsxAttribute",
        name: "role",
        value: "row",
      },
    ]),
  ), [
    {
      type: "mdxJsxAttribute",
      name: "role",
      value: "table",
    },
  ]);
}

function popupContent(content) {
  return content.map((child) => {
    if (child.type === "paragraph") {
      return spanNode("note-paragraph", child.children);
    }

    if (child.type === "table") {
      return tableContent(child);
    }

    return child;
  });
}

function noteNode(display, content, popupId, language) {
  return {
    type: "mdxJsxTextElement",
    name: "Note",
    attributes: [{
      type: "mdxJsxAttribute",
      name: "popupId",
      value: popupId,
    }],
    children: [
      spanNode("note-trigger", [{ type: "text", value: display }]),
      spanNode("note-popup", popupContent(content), [
        {
          type: "mdxJsxAttribute",
          name: "id",
          value: popupId,
        },
        {
          type: "mdxJsxAttribute",
          name: "role",
          value: "tooltip",
        },
        {
          type: "mdxJsxAttribute",
          name: "lang",
          value: language,
        },
      ]),
    ],
  };
}

export default function remarkNote() {
  return (tree, file) => {
    const definitions = new Map();
    let noteIndex = 0;

    function collectDefinitions(node, language = "en") {
      const currentLanguage =
        node.type === "containerDirective" &&
        ["original", "translation"].includes(node.name)
          ? node.attributes?.lang ||
            (node.name === "translation" ? "zh-CN" : "en")
          : language;

      if (node.type === "footnoteDefinition") {
        const [identifier, display] = node.identifier.split("|", 2);
        definitions.set(identifier.toLowerCase(), {
          content: node.children,
          display,
          language: currentLanguage,
        });
        return;
      }

      node.children?.forEach((child) => collectDefinitions(child, currentLanguage));
    }
    collectDefinitions(tree);

    // GFM normally renders these definitions as a document-level footnote list.
    // Remove them so notes remain inline and local to their Note component.
    function removeDefinitions(node) {
      if (!node.children) return;
      node.children = node.children.filter((child) => {
        if (child.type === "footnoteDefinition") return false;
        removeDefinitions(child);
        return true;
      });
    }
    removeDefinitions(tree);

    function getNote(identifier, display, node) {
      const definition = definitions.get(identifier.toLowerCase());
      if (!definition) {
        file.fail(`Unknown note reference: [^${identifier}]`, node);
      }
      return noteNode(
        display || definition.display || identifier,
        definition.content,
        `note-${++noteIndex}`,
        definition.language,
      );
    }

    function replaceReferences(node) {
      if (!node.children) return;

      const children = [];
      for (const child of node.children) {
        if (child.type === "footnoteReference") {
          const [identifier, display] = child.identifier.split("|", 2);
          children.push(getNote(identifier, display || child.label, child));
          continue;
        }

        if (child.type === "text") {
          const reference = /\[\^([^|\]]+)\|([^\]]+)\]/g;
          let start = 0;
          let match;

          while ((match = reference.exec(child.value)) !== null) {
            if (match.index > start) {
              children.push({
                type: "text",
                value: child.value.slice(start, match.index),
              });
            }
            children.push(getNote(match[1], match[2], child));
            start = match.index + match[0].length;
          }

          if (start > 0) {
            if (start < child.value.length) {
              children.push({ type: "text", value: child.value.slice(start) });
            }
            continue;
          }
        }

        replaceReferences(child);
        children.push(child);
      }

      node.children = children;
    }
    replaceReferences(tree);

  };
}
