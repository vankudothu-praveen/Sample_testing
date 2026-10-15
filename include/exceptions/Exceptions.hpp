#pragma once

#include <stdexcept>

namespace studentrecords {

class ValidationException : public std::invalid_argument {
public:
    using std::invalid_argument::invalid_argument;
};

class DuplicateStudentException : public std::runtime_error {
public:
    using std::runtime_error::runtime_error;
};

class StudentNotFoundException : public std::runtime_error {
public:
    using std::runtime_error::runtime_error;
};

} // namespace studentrecords
