#pragma once

#include "domain/Student.hpp"
#include <string_view>

namespace studentrecords {

class StudentValidator {
public:
    static void validate(const Student& student);
    static void validateStudentId(std::string_view id);
    static void validateEmail(std::string_view email);
};

} // namespace studentrecords
