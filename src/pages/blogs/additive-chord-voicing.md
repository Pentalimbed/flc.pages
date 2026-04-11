---
layout: "@layouts/blogs-layout.astro"
title: "Anchor Structures Finder"
date: 2024-12-04T20:59:32Z
---

# Anchor Structures and Adorning Notes

Originally proposed by Damian J. Blättler as a method for analysing the Parisian modernist repertoire of composers like Ravel and Debussy, **anchor structures** are defined as

> the vertical-domain component of a novel chord that allows for its participation in tonal progression.

To put it simply, while the Parisian modernist composers have used a plethora of wacky unheard-of chords and voicings, certain passages exhibit sonorities that feel almost tonal. It seems as if they are siblings of chords with traditional tonal functions, signified by the **anchor structures** within the voicing, and enhanced by additional **adorning tones** that colour the harmony. Blättler outlined some observations about which anchor structures and adorning tones are permissible to preserve the tonal resemblance. They are as follows:

1. <span style="color:darkolivegreen">**First-order anchor structures**</span> are two-note patterns, including 5ths, minor and major 7ths.
2. <span style="color:steelblue">**Second-order anchor structures**</span> are three-note patterns, including
    - consonant triads in inversion,
    - seventh chords in inversion with the omission of either the chordal third or fifth,
    - the diminished triad and its inversions.
3. When there are multiple anchor structures in the voicing, the general tendency is that
    - Structures closer to the bass is more prevalent than those above.
    - Two-note structures trump over second-order structures.
4. <span style="color:firebrick">**Minor 2nd and minor 9th**</span> etc. may introduce too much roughness that counters against hearing a sonorous composite chord.
    - An exception is the minor 9th above the bass of a chord with a two-note anchor structure.
5. <span style="color:firebrick">**Consecutive whole steps**</span> may blur the distinction between chords and scales.
6. No adjacent tones are more than an octave apart.
7. Ultimately, it all depends on the context.

I believe these are the gist of Blättler's idea. For more detailed and nuanced description with examples, please refer to the original paper.

# The Tool

I spent one night creating this simple web tool that can help analyse any chord voicing within 3 octaves, and identify anchor structures as well as potential pitfalls.

For simplicity, the bass note is fixed to C. You can add/remove toppings by clicking on the vertical keyboard, and all identified structures will be shown on the right side, in the same row as the root note of the structure.

<span style="color:darkolivegreen">First-order structures</span> are green, <span style="color:steelblue">second-order structures</span> are blue, while <span style="color:firebrick">potential rule violations</span> are coloured red. Hover above them will show you every note in the structure, as well as the chord they stand in for.

I didn't add an exception for bass-9th structures, nor did I enforce rule 6. So please use your own judgment, cheers.

## References

- Blättler, Damian J. 2017. “A Voicing-Based Model for Additive Harmony.” Music Theory Online 23(3): 1–28.
- Blättler, Damian J. 2013. “A Voicing-Centered Approach to Additive Harmony in Music in France, 1889-1940.” PhD diss., Yale University.
