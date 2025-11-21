---
layout: page
title: Pathology Levels
permalink: /pathology/
---

[Pathology](https://pathology.thinky.gg/) is a Sokoban variation that adds blocks that cannot be pushed from some directions, walls that can be destroyed by blocks ('holes') and changes the win condition to only require that the player reaches a specific tile.

An interesting topic in Pathology is of the longest levels of a given level size. There has been a lasting community effort to find these, [detailed here](https://github.com/sspenst/thinky.gg/wiki/Longest-Pathology-Puzzles-By-Size) (although not frequently updated), producing some monstrously lengthy small levels.

This page showcases results from an exhaustive search of 5x5 holeless levels. All discussion below is assuming no holes are allowed too.

<iframe 
  src="{{ '/pages/pathology/pathology.html' | relative_url }}" 
  width="800" 
  height="700" 
  style="border:none;">
</iframe>

We define a solution to be unique if it is not a subset of another solution (independant on what levels allow that solution), up to rotations and reflections. For 5x5 holeless, there are 56599 unique solutions, with the longest being 69 steps long. The game above has 56599 levels - one level per unique solution (but not guaranteeing that each level has only one solution).

Levels were constructed via exhaustive backwards breadth-first search while ensuring the construction path is an optimal solution. Solutions weren't tracked during generation as the original goal was only to find and verify the longest level. Initially, a tree of all optimal paths through all generated levels was constructed, before pairwise checking for subsets and storing the maximal solutions (and a corresponding level). A particular implementation detail is that during generation, levels were compared (see below) against only levels with fewer steps taken - comparing against same-step levels in addition results in the tree of paths being incomplete, unless tracked during generation.

To reduce the state space of the search, levels were discarded if they had been 'seen before', thus providing no new information about the space; the goal of the search is to find the longest optimal solution, which is certainly obtained if all possible routes are explored where the new level doesn't have a shorter solution (e.g. when traversing backwards, one may loop directly back to the exit, resulting in a trivially solution). A simple verification step is to use a standard foward running solver and check that the fastest solution is what it should be, but this is extremely costly. Instead, each new level is checked for an existing 'subset'. A subset of a level X is defined to be any level Y such that all possible backwards steps (recursively) from Y result in levels which have an optimal solution that is also a solution on the levels created by the same steps from X, and a level cannot be a subset if there are valid backward steps that don't exist on both X and Y (two levels may have the same solutions currently, but a different arrangement of blocks that allow diverging states later). A subset, if seen, also has an optimal solution that is strictly shorter, as the search is step-wise breadth-first.

For a simplified version of Pathology where all blocks can be pushed in any direction, (only most?) subsets are given by a direct subset on the 'playable space' (non-wall tiles) of each level - if the playable space of level Y is contained in the playable space of level X, and all blocks, goals and the player are in the same place, then X is a subset of Y, and Y is discarded. When restricted blocks are introduced, the above still applies, but each block checks for a subset of pushable sides rather than exact equality (block A is a subset of block B if B has at least the same sides pushable as A).