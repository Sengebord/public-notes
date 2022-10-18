---
link: https://levelup.gitconnected.com/the-ultimate-guide-to-sets-in-python-c7556402726c
received: '2022-10-18T20:54:13.600157+00:00'
tags:
- python
- sets
title: The Ultimate Guide To Sets In Python
---
https://levelup.gitconnected.com/the-ultimate-guide-to-sets-in-python-c7556402726c #sets
___
## Python
# The Ultimate Guide To Sets In Python
## Everything you need to know.
[Jacob Ferus](https://medium.com/@dreamferus)using Midjourney.
The set class is one of the key data structures in Python. It is an unordered
# Initialization
There are two ways to create a set object in Python: using
set(iterable) or putting elements, separated by a comma, inside curly braces
{ ... } . The exception is if the curly braces are empty, i.e.
{} , then a dictionary will be created and not an empty set. For an empty set, use
set(). Note that the order of elements doesn’t matter and duplicates will be removed.
What elements can be included in a set? The answer is only objects of an
**immutable* **type. These include types such as float, int, string, bool, etc. This is in contrast to **mutable **types such as lists, dictionaries and sets themselves. If you want to learn more about the different types of variables in Python I recommend reading this [article](https://medium.com/@dreamferus/you-need-to-understand-variables-and-references-in-python-a-guide-51f0d480c083). Thus, the following will cause an error:
But what of the times when you need to store, for example, unique sequences in a set? I will talk more about that in the last section of this article.
# *Note on immutability
Immutability is only a constraint for built-in types. Practically, the object only needs to be
*hashable* to be inserted in a set or be a key in a dictionary. By default, custom classes have a hash based on their id and equality is defined by their id. This means that two objects that are equal in terms of their attributes are not equal when checked for equality unless they are the same object or if a custom
__eq__ operator has been defined.
If a custom
__eq__ operator is defined they are not hashable anymore
*unless* a custom
__hash__ operator is defined. Here it is important that if two objects are equal their hashes also have to be equal. Otherwise, there will be problems when adding the object to a dictionary or set, since both the hash value and equality are tested for when checking for existence in dictionary keys and sets.
The only instance where it makes sense to have a mutable object in a set or as a dictionary key is if it does not have an equality operator that is based on its mutable attributes. If you do have an equality operator and corresponding hash function based on the object attributes, then if you first add it to a set and then change it, the hash value used to save it in the set will be different from the current hash value. This is bad practice.
# Adding elements
There are multiple ways to add elements to a set. To
*mutate *a set you add single elements using
.add() and iterables using
.update() or equivalently
|=:
By mutate, I mean to change the original object. You can also add elements that won’t modify the original set. This can be done using
union() or equivalently using
| :
A clear difference in behavior between using
.update() and
.union() can be shown in the following example:
Finally, you can also concatenate two sets using destructuring:
This will function like a
union() , but I would recommend
union() instead of it.
Note, I used
.update() in the above examples, but you can also use
|= . This means that
a |= b (
.update() ) is
**NOT **the same thing as
a = a | b(
.union()) as the first mutates the object in
awhile the second assigns a new value to
a.
# Deleting elements
Just like adding elements, there are equivalent operations for
*removing *elements. I will show you the corresponding deletion operator for the previously shown addition operators below:
.add()is
.remove()
.update()is
.difference_update()or
-=
.union()is
.difference()or
-
Examples:
Once again, be aware of the difference between
a -= b (mutating) and
a = a — b (not mutating).
There are also a few other useful deletion methods:
.clear()will remove all elements in the list.
- While
.remove()only removes an element
ifit exists (otherwise throws an error),
.discard()will simply do nothing if the element does not exist.
.pop()will remove and return a random element from the set.
# Other modifying operations
One of the powers of sets in Python is the multitude of built-in operations that exist for them. You’ve seen adding and removing elements, but you can also perform the following:
## Intersection
The
* intersection* between two sets is the set of elements that are included in both sets. The operators for it are:
- Non-mutating:
.intersection()or
&, i.e.
a.intersection(b)or
a & b
- Mutating:
.intersection_updateor
&=
Example:
## Symmetric difference or disjunctive union
The opposite of intersection, i.e. all elements that are only part of
*one* of the sets but not both is called *symmetric difference* or *disjunctive union*. The operators for it are:
- Non-mutating:
.symmetric_difference()or
^, i.e.
a.symmmetric_difference(b)or
a ^ b
- Mutating:
.symmetric_difference_update()or
^=
Example:
# Comparison methods
I’ve shown you how to modify sets, but what sets are mostly used for is examining what elements are inside them or not
**fast,**
## Check for existence in set
This is likely the operation you will perform the most with sets. This is done by using the
in-operator for checking the existence of an element or
not in for the non-existence of an element. As opposed to finding an element in a list, the time complexity is constant, O(1). That is, even as you add more and more elements the operations will still be just as fast.
## Check if one set is a subset of another
A set is a
*subset* of another set if all elements in the first set exist in the second set. For instance (A, B, C) is a subset of (A, B, C, D). In Python, this can be checked with
.issubset or
<= . To check if one set is a
*proper subset* of another, i.e. it is a subset and they are not equal, you can use
< . But note that you can also use
>=, > .
## Check if the sets share no elements
If the sets share no elements they are called
*disjoint*, and in Python, this can be calculated with
.isdisjoint() .
# Set comprehension
Just like with lists and dictionaries you can use
*comprehension. *This is done by adding the comprehension-expression inside curly braces and returning a single mutable element in each loop:
{ <element> for ... in ... }. Examples:
# Storing more complex types
Imagine you are walking around from node to node in a graph in separate iterations. For example, say you walked the graph two times and achieved the paths:
A -> B -> D
D -> C -> E -> B
Afterward, you would like to quickly look up if you’ve walked a certain path and because of its lookup speed, the set is a natural choice. Now, how can this be done when lists cannot be inserted because they are mutable? Fortunately, the
**tuple **class **, **which essentially is an immutable version of a list, can be used in these circumstances. Let’s see an example.
First, I’ll generate a graph with a dictionary. Each key will represent a node and the values will list all possible destinations from the node.
This will generate the following graph:
In case you are wondering how I generated the graph, it was done using
graphviz and the following code:
Now I will perform so-called
*random walks* of lengths 1–10 and then store the resulting paths in a set as tuples. Let’s see how many unique paths we can generate in 100 walks:
Out of 100 random walks, 83 were different.
Now, what if we don’t care about the order of nodes, but simply want to store what nodes were visited? Then it would make sense to use a set, but once again, sets are mutable. Instead, we can use the
**frozenset **class, an immutable set. Let’s add a new loop to do this:
# Summary
Sets are useful due to the speed of certain operations and can effectivize your code considerably. Additionally, in Python there are many succinct and helpful methods to simplify your code. Thanks for reading.
If you’re interested in reading more articles about Python, check out my reading list below:
If you’d like to get a Medium membership you can use my
[referral link](https://medium.com/@dreamferus/membership) if you wish. Have a nice day.