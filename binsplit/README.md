# Binary split

[jmdejong.github.io/mapgen/binsplit/](https://jmdejong.github.io/mapgen/binsplit/)

This algorithm works by splitting the room in 2 halves (either on the x or y axis), and building a wall in between.
These halves are then recursively split with the same algorithm until some size limit is reached.
Then, there is a hole made in the separating wall such that both ends of the hole are open (not one of the walls of the recursive split).
Now there is a procedural map where all places are always connected.

For making it look better you can make more holes in the wall (I found that a random number between 1 and 3 inclusive looks good).
This way there is more than one route between two rooms.

Another improvements is to make the walls more than one tile wide.

There is a lot of aestetic improvement to be gained if you tweak the code that chooses whether to split any further, on which axit to split, or where the split will be.
If you allow the room size to get very small you will get a lot of 1-wide corridors.

# Advantages

- Worst case time complexity of O(number of tiles in map).
- Quite easy to make
- Does not need any arrays or other datastructures except the map itself (which can be good on small systems)
- can give a nice indoors feeling for rooms

