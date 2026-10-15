# Student Records Manager

A cross-platform C++20 console application for creating, viewing, listing, updating, and deleting student records. Records are held in memory and are cleared when the process exits; persistent storage is not part of this initial scope.

## Features

- Student ID, first/last name, email, course, year of study, and enrollment status
- ID and email uniqueness checks
- Input validation and clear error reporting
- Hash-map storage with an email secondary index; deterministic student listing
- Layered domain, validation, repository, service, and console UI design
- RAII ownership and GoogleTest unit tests

Enrollment statuses: `Active`, `Inactive`, `Suspended`, and `Graduated`. Years of study must be 1–8. IDs allow alphanumeric characters plus `_` and `-` separators.

## Requirements and build

- CMake 3.20+
- A C++20 compiler
- Network access for the default FetchContent dependency setup (spdlog and GoogleTest)

```sh
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build --parallel
ctest --test-dir build --output-on-failure
./build/student_records_app
```

On Windows, run `build\\Release\\student_records_app.exe` for a multi-configuration generator.

To use installed spdlog and GoogleTest rather than fetching them, configure with `-DSTUDENT_RECORDS_FETCH_DEPENDENCIES=OFF` and provide their CMake packages. To omit tests, use `-DSTUDENT_RECORDS_BUILD_TESTS=OFF`.
