import unittest
import random


# There does exist better solutions like Radix Sort, which have below the n log n time complexity due to not being comparision sort algorithms.
# I felt it was kind of overkill, but i found that certain variations of radix sort should in theory should sort negative numbers, and have a space complexity of 1.
# I opted for a solution that is easier to read, but also has a quite good performance.


def largestProductOfThreeValInArr(arr):
    # .sort in Python has TimeComplexity O(n log n)
    arr.sort()
    # Space Complexity should be 1, since i do not store any other value than the return of the function.
    return max(arr[0] * arr[1] * arr[-1],
               arr[-1] * arr[-2] * arr[-3])

# i borrowed the general implementation from GeeksForGeeks to test against.


def dumbImplementation(arr):
    maxVal = -float('inf')
    n = len(arr)
    for x in range(0, n - 2):
        for y in range(x + 1, n - 1):
            for z in range(y + 1, n):
                maxVal = max(arr[x]*arr[y]*arr[z], maxVal)
    return maxVal


# Running tests to see that it is true for 100 cases
testCases = [[random.randint(-100, 100)
              for x in range(100)] for x in range(100)]


class ProductTester(unittest.TestCase):
    def test_volume(self):
        for test in testCases:
            self.assertEqual(largestProductOfThreeValInArr(
                test), dumbImplementation(test))
