function element(name, children) {
  return {
    type: "mdxJsxTextElement",
    name,
    attributes: [],
    children,
  };
}

function ruby(base, reading) {
  return element("ruby", [
        { type: "text", value: base },
        element("rp", [{ type: "text", value: "(" }]),
        element("rt", [{ type: "text", value: reading }]),
        element("rp", [{ type: "text", value: ")" }]),
      ]);
}

const RUBY = /\[([^\]\n]+)\]\^\(([^)\n]+)\)/g;

export default function remarkRuby() {
  return (tree) => {
    function replaceRuby(node) {
      if (!node.children) return;

      const children = [];
      for (const child of node.children) {
        if (child.type !== "text") {
          replaceRuby(child);
          children.push(child);
          continue;
        }

        let start = 0;
        for (const match of child.value.matchAll(RUBY)) {
          if (match.index > start) {
            children.push({ type: "text", value: child.value.slice(start, match.index) });
          }
          children.push(ruby(match[1], match[2]));
          start = match.index + match[0].length;
        }

        if (start === 0) {
          children.push(child);
        } else if (start < child.value.length) {
          children.push({ type: "text", value: child.value.slice(start) });
        }
      }

      node.children = children;
    }

    replaceRuby(tree);
  };
}
