def subtract_numbers(a, b):
    """Return the difference between two numbers (a - b)."""
    return a - b


if __name__ == "__main__":
    first = float(input("Enter the first number: "))
    second = float(input("Enter the second number: "))
    print("Difference:", subtract_numbers(first, second))
