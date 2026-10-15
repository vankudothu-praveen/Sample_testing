#include "validation/StudentValidator.hpp"
#include "exceptions/Exceptions.hpp"

#include <algorithm>
#include <cctype>
#include <regex>
#include <string>

namespace studentrecords {
namespace {
bool validName(std::string_view value) {
    if (value.empty() || value.size() > 80) return false;
    bool hasLetter = false;
    for (const unsigned char ch : value) {
        if (std::isalpha(ch)) { hasLetter = true; continue; }
        if (ch == ' ' || ch == '-' || ch == '\'' || ch == '.') continue;
        return false;
    }
    return hasLetter;
}
}

void StudentValidator::validateStudentId(std::string_view id) {
    static const std::regex pattern(R"(^[A-Za-z0-9]+([_-][A-Za-z0-9]+)*$)");
    if (id.empty() || id.size() > 32 || !std::regex_match(id.begin(), id.end(), pattern))
        throw ValidationException("Student ID must be 1-32 characters: letters, numbers, '_' or '-' separators");
}

void StudentValidator::validateEmail(std::string_view email) {
    static const std::regex pattern(R"(^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$)");
    if (email.size() > 254 || !std::regex_match(email.begin(), email.end(), pattern))
        throw ValidationException("Email address is invalid");
}

void StudentValidator::validate(const Student& student) {
    validateStudentId(student.studentId());
    if (!validName(student.firstName())) throw ValidationException("First name is invalid (use letters and limited punctuation)");
    if (!validName(student.lastName())) throw ValidationException("Last name is invalid (use letters and limited punctuation)");
    validateEmail(student.email());
    if (student.course().empty() || student.course().size() > 120)
        throw ValidationException("Course must contain 1-120 characters");
    if (student.yearOfStudy() < 1 || student.yearOfStudy() > 8)
        throw ValidationException("Year of study must be between 1 and 8");
    switch (student.status()) {
        case EnrollmentStatus::Active: case EnrollmentStatus::Inactive:
        case EnrollmentStatus::Suspended: case EnrollmentStatus::Graduated: return;
    }
    throw ValidationException("Enrollment status is invalid");
}

} // namespace studentrecords
