---
layout: page
title: Pathology Levels
permalink: /pathology/
---

[Pathology](https://pathology.thinky.gg/) is a Sokoban variation that adds blocks that cannot be pushed from some directions and changes the win condition to only require that the player reaches a specific tile.

An interesting topic in Pathology is of the longest levels of a given level size. There has been a lasting community effort to find these, [detailed here](https://github.com/sspenst/thinky.gg/wiki/Longest-Pathology-Puzzles-By-Size) (although not frequently updated), producing some monstrously lengthy small levels.

This page showcases results from an exhaustive search of 5x5 levels without holes.

<iframe 
  src="{{ '/pages/pathology/pathology.html' | relative_url }}" 
  width="800" 
  height="700" 
  style="border:none;">
</iframe>

For the initial search, a level is kept if there are no existing subsets of the level*. However, for any level, there may be many variations that have no meaningful change to the solution, so in this instance we work with solution paths rather than level layouts.

A solution is defined to be unique if it is not a subset of another solution, up to rotations and reflections. For 5x5 holeless, there are 56599 unique solutions, with the longest being 69 steps long. The game above has 56599 levels; one level per unique solution (but does not guarantee that each level has only one solution).


*the specifics are complicated and difficult to explain.