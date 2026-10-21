def add_numbers(a, b):
    """Return the sum of two numbers."""
    return a + b


if __name__ == "__main__":
    first = float(input("Enter the first number: "))
    second = float(input("Enter the second number: "))
    print("Sum:", add_numbers(first, second))
