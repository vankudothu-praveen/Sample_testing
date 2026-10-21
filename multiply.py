def multiply_numbers(first, second):
    """Return the product of two numbers."""
    return first * second


def main():
    first = float(input("Enter the first number: "))
    second = float(input("Enter the second number: "))
    print(f"Product: {multiply_numbers(first, second)}")


if __name__ == "__main__":
    main()
