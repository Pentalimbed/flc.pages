// initialize note names
const sharp = "\u{266f}";
const flat = "\u{266d}";
let note_names = ["C", `C${sharp}/D${flat}`, "D", `D${sharp}/E${flat}`, "E", "F", `F${sharp}/G${flat}`, "G", `G${sharp}/A${flat}`, "A", `A${sharp}/B${flat}`, "B"];
let note_is_white = [true, false, true, false, true, true, false, true, false, true, false, true];

const n_notes = 37;
let note_selected = Array(n_notes).fill(false);
note_selected[0] = true;

// analysis
// list of chord classes:
// 0 - fifth
// 1 - m7 interval
// 2 - maj7 interval
// 3 - maj triad
// 4 - min triad
// 5 - diminished triad/7th
// 6 - dominant 7th
// 7 - dominant/minor 7th
// 8 - minor/half-dim 7th
// 9 - half-dim 7th
// 10 - maj 7th
// 11 - minor 2nd
// 12 - consequtive maj 2nd
const chord_class_texts = ["P5", "m7", "\u{0394}", "M", "m", "o", "7", "-/7", "-/\u{00F8}", "\u{00F8}", "\u{0394}", "m2", "M2"];

class AnchorPattern {
    constructor(chord_class, orderless, match_offsets, root_offset, desc) {
        this.chord_class = chord_class;
        this.orderless = orderless;
        this.match_offsets = match_offsets;
        this.root_offset = root_offset;
        this.desc = desc;
    }
}
const anchor_patterns = [
    new AnchorPattern(0, true, [7], 0, "root-position consonant triads"),
    new AnchorPattern(1, false, [10], 0, "augmented-sixth chords \& all root-position seventh chords save for major-seventh chords"),
    new AnchorPattern(2, true, [11], 0, "root-position major-seventh chords"),

    new AnchorPattern(3, true, [3, 8], 8, "first-inversion major triad"),
    new AnchorPattern(3, true, [5, 9], 5, "second-inversion major triad"),
    new AnchorPattern(4, true, [4, 9], 9, "first-inversion minor triad"),
    new AnchorPattern(4, true, [5, 8], 5, "second-inversion minor triad"),
    new AnchorPattern(5, true, [3, 6], 0, "diminished triads/seventh chords"),
    new AnchorPattern(5, true, [3, 9], 9, "diminished triads/seventh chords"),
    new AnchorPattern(5, true, [6, 9], 6, "diminished triads/seventh chords"),
    new AnchorPattern(6, true, [6, 8], 8, "first-inversion domiant 7th"),
    new AnchorPattern(7, true, [3, 5], 5, "second-inversion domiant/minor 7th"),
    new AnchorPattern(6, true, [2, 6], 2, "third-inversion domiant 7th"),
    new AnchorPattern(7, true, [2, 9], 2, "third-inversion domiant/minor 7th"),
    new AnchorPattern(8, true, [7, 9], 9, "first-inversion minor/half-dimished 7th"),
    new AnchorPattern(9, true, [4, 6], 6, "second-inversion half-dimished 7th"),
    new AnchorPattern(8, true, [2, 5], 2, "third-inversion minor/half-dimished 7th"),
    new AnchorPattern(9, true, [2, 8], 2, "third-inversion half-dimished 7th"),
    new AnchorPattern(10, false, [8, 19], 8, "first-inversion major 7th"),
    new AnchorPattern(10, false, [5, 16], 5, "second-inversion major 7th"),

    new AnchorPattern(11, true, [1], 0, "warning: ro-interval 1"),
    new AnchorPattern(12, false, [2, 4], 0, "warning: consequtive major 2nds"),
];

function safeCheck(idx) {
    if (idx >= n_notes)
        return false;
    return note_selected[idx];
}

function matchPattern(bass, pattern) {
    var orderless = pattern.orderless;

    var highlight_indicies = [bass]
    var root_idx = bass;

    for (const offset of pattern.match_offsets) {
        var pass = false;
        new_idx = bass + offset;
        while (new_idx < n_notes) {
            if (note_selected[new_idx]) {
                highlight_indicies.push(new_idx);
                if (!root_idx && offset == pattern.root_offset)
                    root_idx = new_idx;
                pass = true;
            }

            if (orderless) {
                new_idx += 12;
            }
            else {
                break;
            }
        }
        if (!pass)
            return;
    }
    if (!root_idx)
        root_idx = bass;

    return [highlight_indicies, root_idx];
}

function updateAnalysis() {
    for (var i = 0; i < n_notes; i++) {
        var anchor_container = document.getElementById(`anchors-${i}`);
        anchor_container.textContent = '';
    }

    for (var i = 0; i < n_notes; i++) {
        if (!note_selected[i])
            continue;

        for (const pattern of anchor_patterns) {
            var result = matchPattern(i, pattern);
            if (!result)
                continue;

            var [highlights, root_idx] = result;

            var tooltip_text = document.createElement("span");
            tooltip_text.className = "tooltip";
            tooltip_text.textContent = pattern.desc;

            var anchor_symbol = document.createElement("div");
            anchor_symbol.textContent = chord_class_texts[pattern.chord_class];
            anchor_symbol.classList.add("anchor-symbol");
            if (pattern.chord_class <= 2)
                anchor_symbol.classList.add("first-order");
            else if (pattern.chord_class <= 10)
                anchor_symbol.classList.add("second-order");
            else if (pattern.chord_class <= 12)
                anchor_symbol.classList.add("non-chord");
            anchor_symbol.setAttribute("highlights", highlights);
            anchor_symbol.onmouseover = function (links) {
                return function (event) {
                    var highlight_type = this.classList.contains('non-chord') ? "piano-key-warning" : "piano-key-highlight";
                    for (const idx of links) {
                        var button = document.getElementById(`button-${idx}`);
                        button.classList.add(highlight_type);
                    };
                }
            }(highlights);
            anchor_symbol.onmouseout = function (links) {
                return function (event) {
                    var highlight_type = this.classList.contains('non-chord') ? "piano-key-warning" : "piano-key-highlight";
                    for (const idx of links) {
                        var button = document.getElementById(`button-${idx}`);
                        button.classList.remove(highlight_type);
                    }
                }
            }(highlights);
            anchor_symbol.appendChild(tooltip_text);

            var anchor_container = document.getElementById(`anchors-${root_idx}`);
            anchor_container.appendChild(anchor_symbol);
        }
    }
}

// draw the stuff
let keyboard = document.getElementById("keyboard");

for (var i = 0; i < n_notes; i++) {
    var button = document.createElement("button");
    button.id = `button-${i}`;
    button.setAttribute("idx", i);

    var octave_id = i % 12;
    button.classList.add("piano-key", note_is_white[octave_id] ? "white-key" : "black-key")
    button.textContent = note_names[octave_id];

    if (note_selected[i])
        button.classList.add("selected-key");
    if (i > 0) {
        button.onclick = function (event) {
            var idx = this.getAttribute("idx");
            note_selected[idx] = !note_selected[idx];

            var this_row = document.getElementById(`key-row-${idx}`);
            if (note_selected[idx])
                this_row.classList.add("key-row-selected");
            else
                this_row.classList.remove("key-row-selected");

            updateAnalysis();
        };
    }

    var anchor_container = document.createElement("div");
    anchor_container.id = `anchors-${i}`;
    anchor_container.style = "display: flex; flex-direction: row; width: 50%; gap: 5px;";

    var row = document.createElement("div");
    row.id = `key-row-${i}`;
    row.className = "key-row";
    row.appendChild(button);
    row.appendChild(anchor_container);
    if (i == 0)
        row.classList.add("key-row-selected");

    keyboard.appendChild(row);
}